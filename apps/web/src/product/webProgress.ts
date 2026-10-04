import type { BrainState } from './brainService';
import type { Mission } from '../state';
export const isComplete = (mission?: Pick<Mission, 'status'>) => mission?.status === 'verified' || mission?.status === 'completed';

/** Mission documents and brain history are both durable completion sources. */
export function appliedLessonIds(brain: BrainState, missions: Mission[]): Set<string> {
  const ids = brain.missionHistory.filter(item => item.completed && item.missionId.startsWith('field-learn-')).map(item => item.missionId.slice(6));
  missions.filter(isComplete).forEach(item => { if (item.lessonId?.startsWith('learn-')) ids.push(item.lessonId); });
  return new Set(ids);
}

export function focusRemaining(deadline: number | null, pausedSeconds: number, now = Date.now()): number {
  return deadline === null ? pausedSeconds : Math.max(0, Math.ceil((deadline - now) / 1000));
}

export const mentorConsentVersion = 'openrouter-modelrun-v1';
export function hasMentorConsent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false;
  const consent = value as { adultConfirmed?: unknown; providerConsentVersion?: unknown };
  return consent.adultConfirmed === true && consent.providerConsentVersion === mentorConsentVersion;
}

export function mentorError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String(error.code) : '';
  if (code.endsWith('/resource-exhausted')) return 'You have reached today’s mentor limit. Your lessons are still available.';
  if (code.endsWith('/unauthenticated')) return 'Sign in again to talk with your mentor.';
  if (code.endsWith('/permission-denied')) return 'The AI mentor is for adults. Confirm you are 18 or older and review the provider notice before sending.';
  if (code.endsWith('/failed-precondition')) return 'The AI mentor is awaiting a service configuration update. Your question is kept here and your lessons are available.';
  return 'Could not reach your mentor. Your question is kept below; try again.';
}
