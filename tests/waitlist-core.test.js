import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import Stripe from 'stripe';
import stripeWebhook from '../api/stripe-webhook.js';
import {
  getPosition,
  getSupabaseAnonKey,
  getSupabaseUrl,
  handleWaitlistSignup,
  isRateLimited,
  normalizeSignup,
} from '../api/_waitlist-core.js';

function createResponse() {
  return {
    headers: {},
    statusCode: 0,
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

test('normalizes signup input without trusting referral or honeypot fields', () => {
  assert.deepEqual(
    normalizeSignup({ email: '  Person@Example.COM ', referredBy: 'T1GER-42', website: '' }),
    { email: 'person@example.com', referredBy: 'T1GER-42', website: '' },
  );
  assert.equal(normalizeSignup({ referredBy: '<script>' }).referredBy, '');
});

test('returns only a real positive position', () => {
  assert.equal(getPosition({ position: 12, id: 99 }, 200), 12);
  assert.equal(getPosition({ id: 42 }, 200), 42);
  assert.equal(getPosition({ id: 'not-a-position' }, 200), 200);
  assert.equal(getPosition({}, 0), null);
});

test('fails closed on a mismatched Supabase project instead of falling back to production', () => {
  const previousUrl = process.env.SUPABASE_URL;
  const previousKey = process.env.SUPABASE_ANON_KEY;
  const previousRef = process.env.SUPABASE_PROJECT_REF;

  process.env.SUPABASE_PROJECT_REF = 't1ger-project';
  process.env.SUPABASE_URL = 'https://stale-project.supabase.co';
  process.env.SUPABASE_ANON_KEY = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9',
    Buffer.from(JSON.stringify({ ref: 'stale-project', role: 'anon' })).toString('base64url'),
    'signature',
  ].join('.');

  assert.equal(getSupabaseUrl(), '');
  process.env.SUPABASE_URL = 'https://t1ger-project.supabase.co';
  assert.equal(getSupabaseAnonKey(), '');

  if (previousUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = previousUrl;
  if (previousKey === undefined) delete process.env.SUPABASE_ANON_KEY;
  else process.env.SUPABASE_ANON_KEY = previousKey;
  if (previousRef === undefined) delete process.env.SUPABASE_PROJECT_REF;
  else process.env.SUPABASE_PROJECT_REF = previousRef;
});

test('rate limits the eleventh attempt within the window', () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    assert.equal(isRateLimited(key, 1_000), false);
  }
  assert.equal(isRateLimited(key, 1_000), true);
  assert.equal(isRateLimited(key, 1_000 + 10 * 60 * 1_000), false);
});

test('creates a signup without exposing waitlist ownership or position', async () => {
  const previousFetch = global.fetch;
  const previousResendKey = process.env.RESEND_API_KEY;
  const previousUrl = process.env.SUPABASE_URL;
  const previousSecretKey = process.env.SUPABASE_SECRET_KEY;
  const previousRef = process.env.SUPABASE_PROJECT_REF;
  const calls = [];

  process.env.SUPABASE_URL = 'https://t1ger-project.supabase.co';
  process.env.SUPABASE_PROJECT_REF = 't1ger-project';
  process.env.SUPABASE_SECRET_KEY = 'sb_secret_test';
  delete process.env.RESEND_API_KEY;
  global.fetch = async (url, options = {}) => {
    assert.match(url, /^https:\/\/t1ger-project\.supabase\.co\/rest\/v1\//);
    assert.equal(options.headers.apikey, 'sb_secret_test');
    assert.equal(options.headers.Authorization, undefined);
    calls.push(options.method || 'GET');

    if (calls.length === 1) {
      return new Response('[]', { status: 200 });
    }

    if (calls.length === 2) {
      return new Response(JSON.stringify([{ id: 37, email: 'new@example.com' }]), { status: 201 });
    }

    return new Response(JSON.stringify([{ id: 37 }]), {
      status: 206,
      headers: { 'content-range': '0-0/37' },
    });
  };

  const response = createResponse();
  await handleWaitlistSignup(
    {
      method: 'POST',
      body: { email: 'new@example.com' },
      headers: { 'x-forwarded-for': `test-signup-${Date.now()}` },
    },
    response,
  );

  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body,{success:true,message:'Check your email for your mobile waitlist details. Web is available now.'});
  assert.deepEqual(calls, ['GET', 'POST', 'GET']);

  global.fetch = previousFetch;
  if (previousResendKey === undefined) delete process.env.RESEND_API_KEY;
  else process.env.RESEND_API_KEY = previousResendKey;
  if (previousUrl === undefined) delete process.env.SUPABASE_URL;
  else process.env.SUPABASE_URL = previousUrl;
  if (previousSecretKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
  else process.env.SUPABASE_SECRET_KEY = previousSecretKey;
  if (previousRef === undefined) delete process.env.SUPABASE_PROJECT_REF;
  else process.env.SUPABASE_PROJECT_REF = previousRef;
});

test('does not query Supabase without a server-only secret key', async () => {
  const previousUrl = process.env.SUPABASE_URL;
  const previousSecretKey = process.env.SUPABASE_SECRET_KEY;
  const previousRef = process.env.SUPABASE_PROJECT_REF;
  const previousFetch = global.fetch;
  let calls = 0;
  process.env.SUPABASE_URL = 'https://t1ger-project.supabase.co';
  process.env.SUPABASE_PROJECT_REF = 't1ger-project';
  delete process.env.SUPABASE_SECRET_KEY;
  global.fetch = async () => { calls += 1; throw new Error('Unexpected external call'); };

  try {
    const response = createResponse();
    await handleWaitlistSignup({
      method: 'POST',
      body: { email: 'new@example.com' },
      headers: { 'x-forwarded-for': `test-missing-secret-${Date.now()}` },
    }, response);
    assert.equal(response.statusCode, 500);
    assert.equal(calls, 0);
  } finally {
    global.fetch = previousFetch;
    if (previousUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previousUrl;
    if (previousSecretKey === undefined) delete process.env.SUPABASE_SECRET_KEY;
    else process.env.SUPABASE_SECRET_KEY = previousSecretKey;
    if (previousRef === undefined) delete process.env.SUPABASE_PROJECT_REF;
    else process.env.SUPABASE_PROJECT_REF = previousRef;
  }
});

test('rejects invalid requests before making an external call', async () => {
  const invalidEmail = createResponse();
  await handleWaitlistSignup({ method: 'POST', body: { email: 'bad' }, headers: {} }, invalidEmail);
  assert.equal(invalidEmail.statusCode, 400);
  assert.deepEqual(invalidEmail.body, { error: 'Enter a valid email address.' });

  const wrongMethod = createResponse();
  await handleWaitlistSignup({ method: 'GET', headers: {} }, wrongMethod);
  assert.equal(wrongMethod.statusCode, 405);
});

test('preview cannot fulfill an unsigned demo payment', async () => {
  const previousEnv = process.env.VERCEL_ENV;
  const previousFetch = global.fetch;
  let externalCalls = 0;
  process.env.VERCEL_ENV = 'preview';
  global.fetch = async () => { externalCalls += 1; throw new Error('Unexpected external call'); };

  try {
    const request = Readable.from([JSON.stringify({ is_demo: true, email: 'test@example.com', amountTotal: 500 })]);
    request.method = 'POST';
    request.headers = {};
    const response = createResponse();
    await stripeWebhook(request, response);
    assert.equal(response.statusCode, 400);
    assert.equal(externalCalls, 0);
  } finally {
    global.fetch = previousFetch;
    if (previousEnv === undefined) delete process.env.VERCEL_ENV;
    else process.env.VERCEL_ENV = previousEnv;
  }
});

test('signed Stripe events still pass verification before fulfillment', async () => {
  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const previousFetch = global.fetch;
  const secret = 'whsec_waitlist_test';
  const stripe = new Stripe('sk_test_webhook_verification_only');
  const payload = JSON.stringify({
    id: 'evt_test_other_link',
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_test_other_link', payment_link: 'plink_other', payment_status: 'paid', amount_total: 500, currency: 'usd', customer_details: { email: 'test@example.com' } } },
  });
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  global.fetch = async () => { throw new Error('Unexpected fulfillment'); };

  try {
    const request = Readable.from([payload]);
    request.method = 'POST';
    request.headers = { 'stripe-signature': stripe.webhooks.generateTestHeaderString({ payload, secret }) };
    const response = createResponse();
    await stripeWebhook(request, response);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { received: true });
  } finally {
    global.fetch = previousFetch;
    if (previousSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
    else process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
  }
});

test('signed paid checkout reaches purchase recording', async () => {
  const previousSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const previousToken = process.env.EARLY_ACCESS_DB_TOKEN;
  const previousUrl = process.env.SUPABASE_URL;
  const previousAnonKey = process.env.SUPABASE_ANON_KEY;
  const previousRef = process.env.SUPABASE_PROJECT_REF;
  const previousFetch = global.fetch;
  const secret = 'whsec_waitlist_test';
  const stripe = new Stripe('sk_test_webhook_verification_only');
  const calls = [];
  const payload = JSON.stringify({
    id: 'evt_test_founder',
    type: 'checkout.session.completed',
    data: { object: { id: 'cs_test_founder', payment_link: 'plink_1TsRU5LEjuVoYn3flCJsRb80', payment_status: 'paid', amount_total: 500, currency: 'usd', customer_details: { email: 'founder@example.com' } } },
  });
  process.env.STRIPE_WEBHOOK_SECRET = secret;
  process.env.EARLY_ACCESS_DB_TOKEN = 'test-token';
  process.env.SUPABASE_URL = 'https://t1ger-project.supabase.co';
  process.env.SUPABASE_PROJECT_REF = 't1ger-project';
  process.env.SUPABASE_ANON_KEY = 'test-anon-key';
  global.fetch = async (url, options) => {
    calls.push({ url, body: JSON.parse(options.body) });
    return new Response(JSON.stringify({ should_send_email: false, waitlist_position: 7 }), { status: 200 });
  };

  try {
    const request = Readable.from([payload]);
    request.method = 'POST';
    request.headers = { 'stripe-signature': stripe.webhooks.generateTestHeaderString({ payload, secret }) };
    const response = createResponse();
    await stripeWebhook(request, response);
    assert.equal(response.statusCode, 200);
    assert.equal(response.body.waitlist_position, 7);
    assert.equal(calls.length, 1);
    assert.match(calls[0].url, /\/rpc\/record_early_access_purchase$/);
    assert.equal(calls[0].body.p_checkout_session_id, 'cs_test_founder');
    assert.equal(calls[0].body.p_email, 'founder@example.com');
  } finally {
    global.fetch = previousFetch;
    if (previousSecret === undefined) delete process.env.STRIPE_WEBHOOK_SECRET;
    else process.env.STRIPE_WEBHOOK_SECRET = previousSecret;
    if (previousToken === undefined) delete process.env.EARLY_ACCESS_DB_TOKEN;
    else process.env.EARLY_ACCESS_DB_TOKEN = previousToken;
    if (previousUrl === undefined) delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL = previousUrl;
    if (previousAnonKey === undefined) delete process.env.SUPABASE_ANON_KEY;
    else process.env.SUPABASE_ANON_KEY = previousAnonKey;
    if (previousRef === undefined) delete process.env.SUPABASE_PROJECT_REF;
    else process.env.SUPABASE_PROJECT_REF = previousRef;
  }
});
