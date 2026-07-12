import Stripe from 'stripe';
import { Resend } from 'resend';

const stripe = new Stripe('sk_test_webhook_verification_only');
const EARLY_ACCESS_PAYMENT_LINK_ID = 'plink_1TsRU5LEjuVoYn3flCJsRb80';
const MINIMUM_ACCESS_AMOUNT = 500;

export const config = {
  api: {
    bodyParser: false,
  },
};

function jsonResponse(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

function cleanEmail(value) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function getPaymentLinkId(session) {
  return typeof session.payment_link === 'string'
    ? session.payment_link
    : session.payment_link?.id;
}

async function callPurchaseRpc(functionName, body) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !process.env.EARLY_ACCESS_DB_TOKEN) {
    throw new Error('Missing Early Adopter database configuration.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/rpc/${functionName}`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      p_token: process.env.EARLY_ACCESS_DB_TOKEN,
      ...body,
    }),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;
  if (!response.ok) {
    console.error('Early Adopter database RPC failed:', response.status, data?.code);
    throw new Error('Unable to record Early Adopter purchase.');
  }

  return Array.isArray(data) ? data[0] : data;
}

async function sendEarlyAdopterEmail({ email, position, refCode, sessionId }) {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY is not configured.');
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const safeEmail = escapeHtml(email);
  const shareUrl = `https://t1ger.app/?ref=${encodeURIComponent(refCode)}`;
  const { error } = await resend.emails.send(
    {
      from: process.env.RESEND_FROM || 'T1GER <equipo@t1ger.app>',
      to: [email],
      subject: "You're officially a T1GER Early Adopter",
      html: `
        <div style="font-family: Inter, Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #050505; color: #fff; padding: 40px; border-top: 6px solid #FF6B00;">
          <p style="margin: 0 0 12px; color: #CCFF00; font-size: 11px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">Payment confirmed</p>
          <h1 style="margin: 0; color: #fff; font-size: 34px; line-height: 1.05; text-transform: uppercase;">Early Adopter status unlocked.</h1>
          <p style="margin: 20px 0; color: #c9c9c9; font-size: 16px; line-height: 1.6;">${safeEmail}, your $5 access payment is confirmed. You now have priority entry to the T1GER Closed Beta.</p>
          <div style="margin: 28px 0; padding: 24px; background: #111; border: 1px solid rgba(255,107,0,.5);">
            <p style="margin: 0 0 14px; color: #FF6B00; font-size: 12px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">Your founder benefits</p>
            <p style="margin: 8px 0; color: #fff;">Priority Closed Beta access</p>
            <p style="margin: 8px 0; color: #fff;">6 months of T1GER Premium</p>
            <p style="margin: 8px 0; color: #fff;">Permanent Founder badge</p>
            <p style="margin: 8px 0; color: #fff;">Full refund available before global launch</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <p style="margin: 0; color: #888; font-size: 11px; letter-spacing: 3px; text-transform: uppercase;">Your waitlist position</p>
            <p style="margin: 6px 0 22px; color: #fff; font-size: 52px; font-weight: 900;">#${position}</p>
            <a href="${shareUrl}" style="display: inline-block; background: #FF6B00; color: #000; padding: 15px 24px; text-decoration: none; font-weight: 900; text-transform: uppercase; letter-spacing: 1px;">Share your founder link</a>
          </div>
          <p style="margin: 30px 0 0; color: #666; font-size: 11px; line-height: 1.5; text-align: center;">Keep this email as your purchase confirmation. T1GER will contact you at this address when your Closed Beta access is ready.</p>
        </div>
      `,
    },
    { idempotencyKey: `t1ger-early-access-${sessionId}` },
  );

  if (error) {
    console.error('Resend Early Adopter email failed:', error.name);
    throw new Error('Unable to send Early Adopter confirmation.');
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return jsonResponse(res, 405, { error: 'Method not allowed' });
  }

  const signature = req.headers['stripe-signature'];
  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return jsonResponse(res, 400, { error: 'Invalid webhook configuration' });
  }

  let event;
  try {
    const rawBody = await readRawBody(req);
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.warn('Stripe webhook signature rejected:', error?.type || 'invalid_signature');
    return jsonResponse(res, 400, { error: 'Invalid signature' });
  }

  if (!['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type)) {
    return jsonResponse(res, 200, { received: true });
  }

  const session = event.data.object;
  const paymentLinkId = getPaymentLinkId(session);
  const amountTotal = Number(session.amount_total || 0);
  const isPaid = session.payment_status === 'paid' || event.type === 'checkout.session.async_payment_succeeded';
  const email = cleanEmail(session.customer_details?.email || session.customer_email);

  if (paymentLinkId !== EARLY_ACCESS_PAYMENT_LINK_ID || !isPaid || amountTotal < MINIMUM_ACCESS_AMOUNT || !email) {
    console.warn('Stripe Early Adopter event ignored due to invalid purchase details.');
    return jsonResponse(res, 200, { received: true });
  }

  try {
    const purchase = await callPurchaseRpc('record_early_access_purchase', {
      p_stripe_event_id: event.id,
      p_checkout_session_id: session.id,
      p_email: email,
      p_amount_total: amountTotal,
      p_currency: String(session.currency || 'usd').toLowerCase(),
    });

    if (purchase?.should_send_email) {
      await sendEarlyAdopterEmail({
        email,
        position: purchase.waitlist_position,
        refCode: purchase.ref_code,
        sessionId: session.id,
      });

      await callPurchaseRpc('mark_early_access_email_sent', {
        p_checkout_session_id: session.id,
      });
    }

    return jsonResponse(res, 200, { received: true });
  } catch (error) {
    console.error('Stripe Early Adopter fulfillment failed:', error?.message || 'unknown');
    return jsonResponse(res, 500, { error: 'Fulfillment failed' });
  }
}
