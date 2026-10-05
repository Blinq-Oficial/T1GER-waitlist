import { describe, expect, it } from 'vitest';
import { analyticsChoice, replayAllowed, safeAnalyticsUrl } from '../../../../src/lib/behaviorAnalytics';

describe('analytics privacy boundaries', () => {
  it('strips tokens and unknown or personal paths from events', () => {
    expect(safeAnalyticsUrl('https://t1ger.app/app/coach?email=private@example.com#token')).toBe('https://t1ger.app/app/coach');
    expect(safeAnalyticsUrl('https://t1ger.app/app/profile/person-123')).toBe('https://t1ger.app/other');
    expect(safeAnalyticsUrl('https://t1ger.app/app/lesson/learn-money-02?token=secret')).toBe('https://t1ger.app/app/lesson/learn-money-02');
  });
  it('never replays private work, account forms or URLs containing parameters', () => {
    expect(replayAllowed('https://t1ger.app/app/learn')).toBe(true);
    for (const route of ['coach', 'profile', 'lesson/learn-money-02', 'apply', 'master', 'progress', 'library', 'settings', 'community', 'learn?token=private', 'learn#private', 'unknown']) {
      expect(replayAllowed('https://t1ger.app/app/' + route)).toBe(false);
    }
    expect(replayAllowed('https://t1ger.app/')).toBe(false);
    expect(replayAllowed('https://t1ger.app/app/')).toBe(false);
  });
  it('defaults to no optional collection when browser storage is unavailable', () => {
    expect(analyticsChoice()).toEqual({ events: false, replay: false });
  });
});
