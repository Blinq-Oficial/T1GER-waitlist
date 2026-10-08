import { randomUUID } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { HttpsError } from 'firebase-functions/v2/https';
import { warn } from 'firebase-functions/logger';
import { db } from './admin.js';

// Bound provider demand across instances. Each admission reserves both possible calls.
export function admissionDecision(global: Record<string, any>, user: Record<string, any>, now: number, maximum: number) {
  const leases = Object.fromEntries(Object.entries(global.leases || {}).filter(([, value]) => Number(value) > now));
  const daily = Number(process.env.T1GER_MENTOR_DAILY_CALLS) || 600;
  if (Number(global.openUntil) > now) return { reason: 'provider_circuit', leases };
  if (Object.keys(leases).length >= 4) return { reason: 'busy', leases };
  if ((Number(global.reservedCalls) || 0) + 2 > Math.min(10000, Math.max(2, daily))) return { reason: 'global_quota', leases };
  if ((Number(user.count) || 0) >= maximum) return { reason: 'daily_quota', leases };
  if (Number(user.nextAllowedAt) > now) return { reason: 'cooldown', leases };
  return { reason: '', leases };
}

export async function acquireMentor(uid: string, maximum: number, consent: string) {
  const day = new Date().toISOString().slice(0, 10), lease = randomUUID();
  const globalRef = db.doc(`operations/mentor-${day}`), userRef = db.doc(`users/${uid}/serverUsage/mentor-${day}`);
  await db.runTransaction(async transaction => {
    const [global, user] = await Promise.all([transaction.get(globalRef), transaction.get(userRef)]);
    const now = Date.now(), decision = admissionDecision(global.data() || {}, user.data() || {}, now, maximum);
    if (decision.reason) {
      warn('mentor_admission_denied', { reason: decision.reason });
      throw new HttpsError(decision.reason === 'provider_circuit' ? 'unavailable' : 'resource-exhausted',
        decision.reason === 'daily_quota' || decision.reason === 'global_quota' ? 'Today’s mentor capacity is used. Your lessons are still available.' : 'The mentor is busy. Try again in a moment.', { reason:decision.reason });
    }
    transaction.set(globalRef, { leases: { ...decision.leases, [lease]: now + 70_000 }, reservedCalls: (Number(global.data()?.reservedCalls) || 0) + 2, updatedAt: FieldValue.serverTimestamp() }, { mergeFields: ['leases', 'reservedCalls', 'updatedAt'] });
    transaction.set(userRef, { count: (Number(user.data()?.count) || 0) + 1, nextAllowedAt: now + 10_000, adultConfirmed: true, providerConsentVersion: consent, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
  });
  return async (failed: boolean) => {
    await db.runTransaction(async transaction => {
      const snapshot = await transaction.get(globalRef), data = snapshot.data() || {};
      const leases = { ...data.leases }; delete leases[lease];
      const failures = failed ? (Number(data.consecutiveFailures) || 0) + 1 : 0;
      transaction.set(globalRef, { leases, consecutiveFailures: failures, openUntil: failures >= 3 ? Date.now() + 60_000 : 0,
        [failed ? 'failed' : 'succeeded']: (Number(data[failed ? 'failed' : 'succeeded']) || 0) + 1, updatedAt: FieldValue.serverTimestamp() }, { mergeFields: ['leases', 'consecutiveFailures', 'openUntil', failed ? 'failed' : 'succeeded', 'updatedAt'] });
    });
  };
}
