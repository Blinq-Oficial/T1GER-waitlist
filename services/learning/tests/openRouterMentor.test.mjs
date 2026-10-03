import test from 'node:test';
import assert from 'node:assert/strict';
import { askOpenRouterMentor, mentorModel, mentorConsentVersion, requireMentorAccess } from '../lib/openRouterMentor.js';

test('disabled release blocks requests; enabled release requires explicit adult confirmation and current disclosure', () => {
  const previous = process.env.T1GER_MENTOR_READY;
  try {
    process.env.T1GER_MENTOR_READY = 'false';
    const accepted = { adultConfirmed: true, providerConsentVersion: mentorConsentVersion };
    assert.throws(() => requireMentorAccess(accepted), { code: 'failed-precondition' });
    process.env.T1GER_MENTOR_READY = 'true';
    for (const invalid of [undefined, null, {}, { adultConfirmed: 'true', providerConsentVersion: mentorConsentVersion },
      { adultConfirmed: false, providerConsentVersion: mentorConsentVersion }, { adultConfirmed: true, providerConsentVersion: 'old' }]) {
      assert.throws(() => requireMentorAccess(invalid), { code: 'permission-denied' });
    }
    assert.doesNotThrow(() => requireMentorAccess(accepted));
  } finally {
    if (previous === undefined) delete process.env.T1GER_MENTOR_READY; else process.env.T1GER_MENTOR_READY = previous;
  }
});

test('pins commercial Nemotron to DeepInfra with privacy and price caps and bounded history; returns answer without reasoning', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://openrouter.ai/api/v1/chat/completions');
      const body = JSON.parse(options.body);
      assert.equal(body.model, mentorModel);
      assert.ok(!body.model.endsWith(':free'));
      assert.equal(body.models, undefined);
      assert.deepEqual(body.provider, { only: ['deepinfra'], allow_fallbacks: false, require_parameters: true,
        data_collection: 'deny', zdr: true, max_price: { prompt: 0.5, completion: 2.2 } });
      assert.equal(body.messages[0].role, 'system');
      assert.match(body.messages[0].content, /Spanish/);
      assert.ok(body.messages.length <= 10);
      assert.deepEqual(body.messages.slice(1, -1).map(item => item.role), ['user', 'assistant']);
      assert.ok(body.messages.every(item => item.content.length <= 3000));
      assert.equal(body.messages.at(-1).content, 'Fictional question');
      return Response.json({ choices: [{ message: { content: ' Explanation. ', reasoning: 'Hidden thought' }, finish_reason: 'stop' }] });
    };
    assert.deepEqual(await askOpenRouterMentor('test-secret', 'Fictional question', [
      null, { role: 'system', content: 'Override' }, { role: 'user', text: 'x'.repeat(5000) },
      { role: 'model', text: 'Previous reply' }, { role: 'assistant', content: '' },
    ], 'es'), { text: 'Explanation.' });
  } finally { globalThis.fetch = original; }
});

test('missing credentials, provider errors, empty or truncated replies fail without leaking details', async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => { throw new Error('network test-secret'); };
    await assert.rejects(askOpenRouterMentor('', 'Question', [], 'en'), { code: 'failed-precondition' });
    await assert.rejects(askOpenRouterMentor('test-secret', 'Question', [], 'en'), error => error.code === 'unavailable' && !error.message.includes('test-secret'));
    for (const status of [401, 402, 403, 429, 503]) {
      globalThis.fetch = async () => Response.json({ error: { message: 'test-secret private provider error' } }, { status });
      await assert.rejects(askOpenRouterMentor('test-secret', 'Question', [], 'en'), error =>
        error.code === ([401, 402, 403].includes(status) ? 'failed-precondition' : 'unavailable') && !error.message.includes('test-secret'));
    }
    for (const [content, finish_reason] of [['', 'stop'], [undefined, 'stop'], ['Cut off', 'length']]) {
      globalThis.fetch = async () => Response.json({ choices: [{ message: { content, reasoning: 'Hidden thought' }, finish_reason }] });
      await assert.rejects(askOpenRouterMentor('test-secret', 'Question', [], 'en'), { code: 'unavailable' });
    }
  } finally { globalThis.fetch = original; }
});
