import { describe, expect, it } from 'vitest';
import { dailyLearningGoals, learningRhythm } from './learningRhythm';
import { DEFAULT_BRAIN_STATE } from './brainService';

describe('Learning rhythm display', () => {
  it('counts daily challenges from saved completions in the learner timezone, excluding pending and future work', () => {
    const now = new Date('2026-10-06T02:00:00Z');
    const record = { missionId: 'learn-money-01', completed: true, score: 100, competency: 'investing' as const, difficulty: 'easy' as const, timestamp: Date.parse('2026-10-05T20:00:00Z') };
    const brain = { ...DEFAULT_BRAIN_STATE, missionHistory: [record, { ...record, missionId: 'field-learn-money-01', timestamp: now.getTime() + 1000 }] };
    const mission = { id: 'field-learn-money-01', lessonId: 'learn-money-01', status: 'ready' as const, completedAt: record.timestamp };
    expect(dailyLearningGoals(brain, [mission], 'America/New_York', now)).toEqual({ learned: true, applied: false, completed: 1 });
    expect(dailyLearningGoals(brain, [{ ...mission, status: 'completed' }], 'America/New_York', now).completed).toBe(2);
    expect(dailyLearningGoals(brain, [], 'UTC', now).completed).toBe(0);
    expect(dailyLearningGoals({ missionHistory: [{ ...record, missionId: 'field-learn-money-01' }] }, [], 'America/New_York', now).applied).toBe(true);
    expect(dailyLearningGoals({ missionHistory: [{ ...record, completed: false }] }, [], 'America/New_York', now).completed).toBe(0);
  });
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
