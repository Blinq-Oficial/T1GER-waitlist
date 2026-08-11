import test from 'node:test';
import assert from 'node:assert/strict';
import { getPosition, handleWaitlistSignup, isRateLimited, normalizeSignup } from '../api/_waitlist-core.js';

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

test('rate limits the eleventh attempt within the window', () => {
  const key = `test-${Date.now()}-${Math.random()}`;
  for (let attempt = 0; attempt < 10; attempt += 1) {
    assert.equal(isRateLimited(key, 1_000), false);
  }
  assert.equal(isRateLimited(key, 1_000), true);
  assert.equal(isRateLimited(key, 1_000 + 10 * 60 * 1_000), false);
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
