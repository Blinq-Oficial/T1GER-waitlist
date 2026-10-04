import { describe, expect, it } from 'vitest';
import { DEFAULT_BRAIN_STATE } from './brainService';
import { appliedLessonIds, focusRemaining, mentorError, hasMentorConsent, mentorConsentVersion } from './webProgress';

describe('Web companion capabilities', () => {
  it('remembers only an explicit adult choice for the current AI provider notice', () => {
    expect(hasMentorConsent({ adultConfirmed: true, providerConsentVersion: mentorConsentVersion })).toBe(true);
    for (const value of [undefined, null, {}, { adultConfirmed: 'true', providerConsentVersion: mentorConsentVersion },
      { adultConfirmed: false, providerConsentVersion: mentorConsentVersion }, { adultConfirmed: true, providerConsentVersion: 'old' }]) {
      expect(hasMentorConsent(value)).toBe(false);
    }
  });
  it('merges the mission and history sources without counting revisits twice', () => {
    const brain = { ...DEFAULT_BRAIN_STATE, missionHistory: [{ missionId: 'field-learn-money-01', completed: true, score: 100, competency: 'investing' as const, difficulty: 'easy' as const, timestamp: 1 }] };
    expect([...appliedLessonIds(brain, [{ id: 'field-learn-money-01', lessonId: 'learn-money-01', status: 'completed' }, { id: 'field-learn-money-03', lessonId: 'learn-money-03', status: 'completed' }, { id: 'field-learn-money-02', lessonId: 'learn-money-02', status: 'ready' }])]).toEqual(['learn-money-01', 'learn-money-03']);
  });
  it('uses the wall clock after a suspended tab, and keeps paused time unchanged', () => {
    expect(focusRemaining(150000, 25, 149010)).toBe(1);
    expect(focusRemaining(150000, 25, 160000)).toBe(0);
    expect(focusRemaining(null, 25, 160000)).toBe(25);
  });
  it('makes quota failure explicit instead of fabricating an AI reply', () => {
    expect(mentorError({ code: 'functions/resource-exhausted' })).toContain('limit');
    expect(mentorError({ code: 'functions/unavailable' })).toContain('try again');
  });
});
