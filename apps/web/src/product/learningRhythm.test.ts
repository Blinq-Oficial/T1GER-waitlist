import { describe, expect, it } from 'vitest';
import { learningRhythm } from './learningRhythm';

describe('Learning rhythm display', () => {
  it('uses the reward timezone, counts each day once and does not revive an expired streak', () => {
    const now = new Date('2026-10-06T02:00:00Z'); // Still Oct 5 in Michigan.
    const profile = { streak: 3, timeZone: 'America/New_York', lastVerifiedMissionDay: '2026-10-05' };
    const missions = [1, 2].map(id => ({ id: String(id), lessonId: 'learn-money-01', status: 'completed' as const, completedAt: { seconds: Date.parse('2026-10-05T20:00:00Z') / 1000 } }));
    const current = learningRhythm(profile, missions, now);
    expect(current.today).toBe('2026-10-05');
    expect(current.streak).toBe(3); expect(current.activeDays).toBe(1); expect(current.doneToday).toBe(true);
    const expired = learningRhythm(profile, missions, new Date('2026-10-08T12:00:00Z'));
    expect(expired.streak).toBe(0); expect(expired.previousStreak).toBe(3);
    expect(learningRhythm({ streak: 5, timeZone: 'invalid' }, [], now).streak).toBe(0);
    expect(learningRhythm(profile, [{ id: 'pending', lessonId: 'learn-money-01', status: 'ready', completedAt: Date.now() }], now).activeDays).toBe(1); // Server day is still authoritative.
  });
});
