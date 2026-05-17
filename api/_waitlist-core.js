import { Resend } from 'resend';

const DEFAULT_SUPABASE_URL = 'https://pzxjwqnxnkxtmwovzsuv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB6eGp3cW54bmt4dG13b3Z6c3V2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4MjQyNDAsImV4cCI6MjA5MzQwMDI0MH0.3aS948dQbncMdO5ihsJPWuxs9Mxq2HZPCZEZIHGlwVc';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function jsonResponse(res, status, body) {
  res.setHeader?.('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

function cleanString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function getSupabaseUrl() {
  const rawUrl = cleanString(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL);
  const candidate = rawUrl || DEFAULT_SUPABASE_URL;
  const withProtocol = /^https?:\/\//i.test(candidate) ? candidate : `https://${candidate}`;

  try {
    return new URL(withProtocol).origin;
  } catch {
    console.error('Invalid Supabase URL configuration.');
    return DEFAULT_SUPABASE_URL;
  }
}

function getSupabaseAnonKey() {
  return cleanString(
    process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      DEFAULT_SUPABASE_ANON_KEY
  );
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

function normalizeSignup(body = {}) {
  const data = normalizeBody(body);
  const email = typeof data.email === 'string' ? data.email.trim().toLowerCase() : '';
  const name = typeof data.name === 'string' ? data.name.trim() : '';
  const referredBy = typeof data.referredBy === 'string' ? data.referredBy.trim() : '';

  return {
    email,
    name: name.slice(0, 120),
    referredBy: referredBy.slice(0, 80),
  };
}

async function supabaseRequest(path, options = {}) {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      ...options.headers,
    },
  });

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

async function getWaitlistCount() {
  const { response } = await supabaseRequest('waitlist?select=id', {
    headers: {
      Prefer: 'count=exact',
      Range: '0-0',
    },
  });

  const contentRange = response.headers.get('content-range');
  if (!contentRange || !contentRange.includes('/')) return 0;

  const count = Number.parseInt(contentRange.split('/')[1], 10);
  return Number.isFinite(count) ? count : 0;
}

function getPosition(user, totalCount) {
  if (typeof user.position === 'number') return user.position;
  if (typeof user.id === 'number') return user.id;
  return totalCount || 800;
}

function getRefCode(user, position) {
  if (typeof user.ref_code === 'string' && user.ref_code.trim()) {
    return user.ref_code.trim();
  }

  return `T1GER-${position}`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function sendWelcomeEmail({ email, name, position, refCode }) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY is not set; waitlist email was skipped.');
    return false;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const shareUrl = `https://t1ger.app/?ref=${encodeURIComponent(refCode)}`;
  const greeting = name ? `, ${escapeHtml(name)}` : '';

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'T1GER <equipo@t1ger.app>',
    to: [email],
    subject: 'Your T1GER position is secured',
    html: `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 620px; margin: 0 auto; background-color: #050505; color: #fff; padding: 40px; border: 1px solid #222;">
        <h1 style="color: #FF6B00; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 20px;">Welcome to T1GER${greeting}.</h1>
        <p style="font-size: 16px; color: #d1d1d1; line-height: 1.6;">You have secured your position on the T1GER waitlist.</p>
        <div style="background-color: #111; border: 1px solid rgba(255,107,0,.5); padding: 24px; text-align: center; margin: 30px 0;">
          <p style="margin: 0; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 4px;">Your Position</p>
          <h2 style="margin: 10px 0 0; font-size: 56px; color: #fff; font-weight: 900;">#${position}</h2>
        </div>
        <p style="font-size: 16px; color: #d1d1d1; line-height: 1.6;">Share your link to climb the waitlist:</p>
        <p style="text-align: center; margin: 32px 0;">
          <a href="${shareUrl}" style="background-color: #FF6B00; color: #000; padding: 16px 28px; text-decoration: none; font-weight: 800; border-radius: 999px; text-transform: uppercase; letter-spacing: 2px;">Share T1GER</a>
        </p>
        <p style="font-size: 12px; color: #666; text-align: center; text-transform: uppercase; letter-spacing: 3px;">T1GER | Build Discipline</p>
      </div>
    `,
  });

  return true;
}

export async function handleWaitlistSignup(req, res) {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { error: 'Method not allowed' });
  }

  if (!getSupabaseUrl() || !getSupabaseAnonKey()) {
    console.error('Missing Supabase configuration.');
    return jsonResponse(res, 500, { error: 'Server configuration error.' });
  }

  const { email, name, referredBy } = normalizeSignup(req.body);

  if (!emailPattern.test(email)) {
    return jsonResponse(res, 400, { error: 'Enter a valid email address.' });
  }

  try {
    const existingResult = await supabaseRequest(
      `waitlist?email=eq.${encodeURIComponent(email)}&select=*`
    );

    if (!existingResult.response.ok) {
      console.error('Supabase lookup error:', existingResult.data);
      return jsonResponse(res, 502, { error: 'Unable to check the waitlist right now.' });
    }

    let user = Array.isArray(existingResult.data) ? existingResult.data[0] : null;
    let alreadyJoined = Boolean(user);

    if (!user) {
      const payload = { email };
      if (name) payload.name = name;
      if (referredBy) payload.referred_by = referredBy;

      const insertResult = await supabaseRequest('waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Prefer: 'return=representation',
        },
        body: JSON.stringify(payload),
      });

      if (!insertResult.response.ok) {
        if (insertResult.data?.code === '23505') {
          alreadyJoined = true;
          const retryResult = await supabaseRequest(
            `waitlist?email=eq.${encodeURIComponent(email)}&select=*`
          );
          user = Array.isArray(retryResult.data) ? retryResult.data[0] : null;
        } else {
          console.error('Supabase insert error:', insertResult.data);
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
    const refCode = getRefCode(user, position);

    let emailSent = false;

    try {
      emailSent = await sendWelcomeEmail({ email, name, position, refCode });
    } catch (emailError) {
      console.error('Resend email error:', emailError);
    }

    return jsonResponse(res, 200, {
      success: true,
      alreadyJoined,
      emailSent,
      position,
      refCode,
      shareUrl: `https://t1ger.app/?ref=${encodeURIComponent(refCode)}`,
    });
  } catch (error) {
    console.error('Waitlist signup error:', error);
    return jsonResponse(res, 500, { error: 'Internal server error. Please try again later.' });
  }
}
