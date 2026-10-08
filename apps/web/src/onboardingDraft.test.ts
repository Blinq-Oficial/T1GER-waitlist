import { expect, it, vi } from 'vitest';
import { emptyOnboarding, parseOnboardingDraft, loadOnboardingDraft, onboardingKey } from './onboardingDraft';

it('resumes the chosen path, migrates older choices and rejects malformed browser drafts', () => {
  expect(parseOnboardingDraft(JSON.stringify({ interests: ['ai', 'investing'], primary: 'ai', dailyTime: 5, step: 'ready' })))
    .toEqual({ interests: ['ai'], primary: 'ai', dailyTime: 5, step: 'ready' });
  expect(parseOnboardingDraft(JSON.stringify({ interests: ['mindset'], primary: 'unknown', dailyTime: -4, step: 'primary' })))
    .toEqual({ interests: ['mindset'], primary: 'mindset', dailyTime: 10, step: 'interests' });
  for (const raw of ['invalid', 'null', '{}', '{"interests":[],"step":"ready"}', '{"interests":["unknown"],"step":"ready"}', '{"interests":[["ai"]],"step":"ready"}']) {
    expect(parseOnboardingDraft(raw)).toEqual(emptyOnboarding);
  }
});

it('hands guest choices to a new account, gives its own draft priority and survives unavailable storage', () => {
  const guest = { interests: ['ai'], primary: 'ai', dailyTime: 5, step: 'ready' };
  const account = { interests: ['mindset'], primary: 'mindset', dailyTime: 15, step: 'rhythm' };
  const values = new Map([[onboardingKey(), JSON.stringify(guest)]]);
  vi.stubGlobal('localStorage', { getItem: (key: string) => values.get(key) || null });
  try {
    expect(loadOnboardingDraft('new-account')).toEqual(guest);
    values.set(onboardingKey('existing-account'), JSON.stringify(account));
    expect(loadOnboardingDraft('existing-account')).toEqual(account);
    vi.stubGlobal('localStorage', { getItem: () => { throw new Error('Storage unavailable'); } });
    expect(loadOnboardingDraft('new-account')).toEqual(emptyOnboarding);
  } finally { vi.unstubAllGlobals(); }
});
