// T1GER Waitlist Core Utilities - Restored and verified working state.
import { createHash, createHmac } from 'node:crypto';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const referralPattern = /^[A-Za-z0-9_-]{1,80}$/;
const rateLimitWindowMs = 10 * 60 * 1000;
const rateLimitMax = 10;
const signupAttempts = new Map();

function jsonResponse(res, status, body) {
  res.setHeader?.('Cache-Control', 'no-store');
  res.setHeader?.('X-Content-Type-Options', 'nosniff');
  return res.status(status).json(body);
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getExpectedSupabaseProjectRef() {
  return cleanString(process.env.SUPABASE_PROJECT_REF);
}

function getProjectRefFromKey(key) {
  try {
    const payload = key.split('.')[1];
    if (!payload) return '';
    return cleanString(JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')).ref);
  } catch {
    return '';
  }
}

export function getSupabaseUrl() {
  const rawUrl = cleanString(process.env.SUPABASE_URL);
  if (!rawUrl) return '';

  try {
    const parsedUrl = new URL(rawUrl);
    const projectRef = parsedUrl.hostname.split('.')[0];
    if (parsedUrl.protocol !== 'https:' || !parsedUrl.hostname.endsWith('.supabase.co') ||
        parsedUrl.port || parsedUrl.username || parsedUrl.password ||
        (getExpectedSupabaseProjectRef() && projectRef !== getExpectedSupabaseProjectRef())) {
      return '';
    }
    return parsedUrl.origin;
  } catch {
    return '';
  }
}

export function getSupabaseAnonKey() {
  const rawKey = cleanString(process.env.SUPABASE_ANON_KEY);
  const url = getSupabaseUrl();
  if (!rawKey || !url) return '';
  const keyRef = getProjectRefFromKey(rawKey);
  return !keyRef || keyRef === new URL(url).hostname.split('.')[0] ? rawKey : '';
}

export function getSupabaseSecretKey() {
  const key = cleanString(process.env.SUPABASE_SECRET_KEY);
  return key.startsWith('sb_secret_') ? key : '';
}

function normalizeBody(body = {}) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }

  return body && typeof body === 'object' ? body : {};
}

export function normalizeSignup(body = {}) {
  const data = normalizeBody(body);
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const rawReferral = typeof data.referredBy === 'string' ? data.referredBy.trim() : '';

  return {
    email,
    referredBy: referralPattern.test(rawReferral) ? rawReferral : '',
    website: cleanString(data.website).slice(0, 200),
  };
}

function getClientIp(req) {
  const forwarded = req.headers?.['x-forwarded-for'];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return cleanString(value).split(',')[0] || cleanString(req.socket?.remoteAddress);
}

export function isRateLimited(key, now = Date.now()) {
  for (const [id, value] of signupAttempts) if (now - value.startedAt >= rateLimitWindowMs) signupAttempts.delete(id);
  if (!signupAttempts.has(key) && signupAttempts.size >= 10000) return true;
  const current = signupAttempts.get(key);
  if (!current || now - current.startedAt >= rateLimitWindowMs) {
    signupAttempts.set(key, { count: 1, startedAt: now });
    return false;
  }

  current.count += 1;
  return current.count > rateLimitMax;
}

async function supabaseRequest(path, options = {}) {
  const supabaseUrl = getSupabaseUrl();
  const supabaseSecretKey = getSupabaseSecretKey();
  let response;

  try {
    response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
      ...options,
      signal: AbortSignal.timeout(8000),
      headers: {
        apikey: supabaseSecretKey,
        ...options.headers,
      },
    });
  } catch (error) {
    const supabaseError = new Error('SUPABASE_FETCH_FAILED');
    supabaseError.step = path.split('?')[0];
    supabaseError.cause = error;
    throw supabaseError;
  }

  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text.slice(0, 500) };
    }
  }

  return { response, data };
}

function publicErrorDetails(error) {
  if (error?.message === 'SUPABASE_FETCH_FAILED') {
    return {
      code: error.message,
      step: error.step || 'unknown',
    };
  }

  return {
    code: 'WAITLIST_UNEXPECTED_ERROR',
  };
}

async function getWaitlistCount() {
  const { response } = await supabaseRequest('waitlist?select=id', {
    headers: {
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });

  if (!response.ok) return 0;

  const contentRange = response.headers.get('content-range');
  if (!contentRange || !contentRange.includes('/')) return 0;

  const count = Number.parseInt(contentRange.split('/')[1], 10);
  return Number.isFinite(count) ? count : 0;
}

export function getPosition(user, totalCount) {
  const storedPosition = Number(user.position ?? user.id);
  if (Number.isSafeInteger(storedPosition) && storedPosition > 0) return storedPosition;
  return Number.isSafeInteger(totalCount) && totalCount > 0 ? totalCount : null;
}

function getRefCode(user, position) {
  if (typeof user.ref_code === 'string' && user.ref_code.trim()) {
    return user.ref_code.trim();
  }

  return `T1GER-${position}`;
}

async function sendWelcomeEmail({ email, position, refCode }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set; waitlist email was skipped.');
    return false;
  }

  const shareUrl = `https://t1ger.app/?ref=${encodeURIComponent(refCode)}`;
  // Preserve the previous sender's key so cutover cannot duplicate a welcome.
  const legacyKey = `t1ger-waitlist-${encodeURIComponent(email)}`;
  const idempotencyKey = legacyKey.length <= 256 ? legacyKey :
    `t1ger-waitlist-${createHash('sha256').update(email).digest('hex')}`;

  const response = await fetch('https://api.resend.com/emails', {
    method:'POST', signal:AbortSignal.timeout(10000),
    headers:{Authorization:`Bearer ${process.env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':idempotencyKey},
    body:JSON.stringify({
      from: process.env.RESEND_FROM || 'T1GER <equipo@t1ger.app>',
      to: [email],
      subject: 'Your T1GER position is secured',
      text: `Welcome to T1GER. Your mobile waitlist position is #${position}. Start learning now: https://t1ger.app/app/\nShare T1GER: ${shareUrl}\nFor help, reply to this email.`,
      reply_to: 'este.t1ger.oficial.app@gmail.com',
      html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #050505; color: #fff; padding: 40px; border: 1px solid #222;">
        <h1 style="color: #FF6B00; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px;">Welcome to T1GER.</h1>
        <p style="font-size: 16px; color: #d1d1d1; line-height: 1.6;">You are on the T1GER iOS and Android waitlist. We will email mobile launch updates. Web is available now — you do not need to wait to start learning.</p>
        <div style="background-color: #111; border: 1px solid rgba(255,107,0,.5); padding: 24px; text-align: center; margin: 30px 0;">
          <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 4px;">Your Position</p>
          <h2 style="margin: 10px 0 0; font-size: 56px; color: #fff; font-weight: 900;">#${position}</h2>
        </div>
        <p style="text-align: center; margin: 32px 0;"><a href="https://t1ger.app/app/" style="background-color: #FF6B00; color: #000; padding: 16px 28px; text-decoration: none; font-weight: 800; border-radius: 8px;">Start learning on Web</a></p>
        <p style="font-size: 16px; color: #d1d1d1; line-height: 1.6;">Create your free Web account with this email. Your mobile waitlist position stays separate. Share T1GER with a friend:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${shareUrl}" style="background-color: #FF6B00; color: #000; padding: 16px 28px; text-decoration: none; font-weight: 800; border-radius: 999px; text-transform: uppercase; letter-spacing: 2px;">Share T1GER</a>
        </p>
        <p style="font-size: 12px; color: #666; text-align: center; text-transform: uppercase; letter-spacing: 3px;">T1GER | Build Discipline</p>
      </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (response.status === 409 && error.name === 'invalid_idempotent_request') {
      throw new Error('WAITLIST_EMAIL_AMBIGUOUS');
    }
    console.error('waitlist_email_provider_failed', {status:response.status});
    return false;
  }

  const result=await response.json();
  return typeof result.id === 'string';
}

export async function deliverWaitlistEmail(email = null) {
  const claim = await supabaseRequest('rpc/claim_waitlist_email', { method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_email:email}) });
  if(!claim.response.ok) throw new Error('WAITLIST_OUTBOX_UNAVAILABLE');
  const job=claim.data?.[0]; if(!job) return false;
  async function holdForReview() {
    const result = await supabaseRequest(`waitlist_email_outbox?id=eq.${encodeURIComponent(job.id)}&status=eq.sending`, {
      method:'PATCH',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({status:'ambiguous',lease_until:null}),
    });
    if (!result.response.ok) throw new Error('WAITLIST_EMAIL_STATE_FAILED');
    console.error('waitlist_email_ambiguous');
    return false;
  }
  // A legacy send could have happened when the row was created. Provider
  // deduplication expires 24 hours after that send, not after our first claim.
  const created = Date.parse(job.created_at);
  if (!Number.isFinite(created) || Date.now() - created >= 23 * 60 * 60 * 1000) return holdForReview();
  let accepted=false;
  try { accepted=await sendWelcomeEmail({email:job.email,position:job.position,refCode:job.ref_code}); }
  catch (error) {
    if (error.message === 'WAITLIST_EMAIL_AMBIGUOUS') return holdForReview();
    console.error('waitlist_email_transport_failed');
  }
  const finished=await supabaseRequest('rpc/finish_waitlist_email',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_id:job.id,p_accepted:accepted})});
  if(!finished.response.ok)console.error('waitlist_email_state_failed');
  return accepted;
}

export async function handleWaitlistSignup(req, res) {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { error: 'Method not allowed' });
  }

  const { email, referredBy, website } = normalizeSignup(req.body);

  if (email.length > 254 || !emailPattern.test(email)) {
    return jsonResponse(res, 400, { error: 'Enter a valid email address.' });
  }

  if (website) {
    return jsonResponse(res, 400, { error: 'Unable to process this signup.' });
  }

  if (!getSupabaseUrl() || !getSupabaseSecretKey()) {
    console.error('Missing Supabase configuration.');
    return jsonResponse(res, 500, { error: 'Server configuration error.' });
  }

  const rateLimitKey = getClientIp(req) || email;
  let limited=isRateLimited(rateLimitKey);
  if (!limited && process.env.T1GER_WAITLIST_V2 === 'true') {
    try {
      const result=await supabaseRequest('rpc/consume_waitlist_limit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({p_key:createHmac('sha256',getSupabaseSecretKey()).update(rateLimitKey).digest('hex')})});
      if(!result.response.ok)return jsonResponse(res,503,{error:'Unable to process signups right now. Try again shortly.'});
      limited=result.data !== true;
    } catch {return jsonResponse(res,503,{error:'Unable to process signups right now. Try again shortly.'});}
  }
  if (limited) {
    res.setHeader?.('Retry-After', '600');
    return jsonResponse(res, 429, { error: 'Too many attempts. Please try again in a few minutes.' });
  }

  try {
    const existingResult = await supabaseRequest(
      `waitlist?email=eq.${encodeURIComponent(email)}&select=*`
    );

    if (!existingResult.response.ok) {
      console.error('waitlist_lookup_failed');
      return jsonResponse(res, 502, { error: 'Unable to check the waitlist right now.' });
    }

    let user = Array.isArray(existingResult.data) ? existingResult.data[0] : null;
    let alreadyJoined = Boolean(user);

    if (!user) {
      const payload = { email };
      if (referredBy) {
        payload.referred_by = referredBy;
      }

      let insertResult = await supabaseRequest('waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!insertResult.response.ok && referredBy && insertResult.data?.code === 'PGRST204') {
        console.warn('waitlist.referred_by is not available; retrying signup without referral metadata.');
        insertResult = await supabaseRequest('waitlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation',
          },
          body: JSON.stringify({ email }),
        });
      }

      if (!insertResult.response.ok) {
        if (insertResult.data?.code === '23505') {
          alreadyJoined = true;
          const retryResult = await supabaseRequest(
            `waitlist?email=eq.${encodeURIComponent(email)}&select=*`
          );
          user = Array.isArray(retryResult.data) ? retryResult.data[0] : null;
        } else {
          console.error('waitlist_insert_failed');
          return jsonResponse(res, 502, { error: 'Unable to join the waitlist right now.' });
        }
      } else {
        user = Array.isArray(insertResult.data) ? insertResult.data[0] : insertResult.data;
      }
    }

    if (!user) {
      return jsonResponse(res, 500, { error: 'Unable to retrieve your waitlist position.' });
    }

    const totalCount = await getWaitlistCount();
    const position = getPosition(user, totalCount);
    if (!position) {
      return jsonResponse(res, 500, { error: 'Unable to retrieve your waitlist position.' });
    }
    const refCode = getRefCode(user, position);


    if (process.env.T1GER_WAITLIST_V2 === 'true') {
      try {await deliverWaitlistEmail(email);} catch {console.error('waitlist_email_outbox_failed');}
    } else if (!alreadyJoined) {
      try {
        await sendWelcomeEmail({ email, position, refCode });
      } catch {
        console.error('waitlist_email_transport_failed');
      }
    }

    return jsonResponse(res, 200, {
      success: true,
      message: 'Check your email for your mobile waitlist details. Web is available now.',
    });
  } catch (error) {
    console.error('waitlist_signup_failed', publicErrorDetails(error));
    return jsonResponse(res, 500, {
      error: 'Internal server error. Please try again later.',
      ...publicErrorDetails(error),
    });
  }
}
