const { test } = require('node:test');
const assert = require('node:assert/strict');
const { admissionDecision } = require('../lib/mentorAdmission.js');
test('shared capacity rejects bursts, exhausted quota and provider outages, expires abandoned leases', () => {
  assert.equal(admissionDecision({}, {}, 100, 10).reason, '');
  assert.equal(admissionDecision({ leases: { a:101,b:101,c:101,d:101 } }, {}, 100, 10).reason, 'busy');
  assert.equal(admissionDecision({ leases: { old:99 } }, {}, 100, 10).reason, '');
  assert.equal(admissionDecision({ reservedCalls:599 }, {}, 100, 10).reason, 'global_quota');
  assert.equal(admissionDecision({ openUntil:101 }, {}, 100, 10).reason, 'provider_circuit');
  assert.equal(admissionDecision({}, { count:10 }, 100, 10).reason, 'daily_quota');
  assert.equal(admissionDecision({}, { nextAllowedAt:101 }, 100, 10).reason, 'cooldown');
});
