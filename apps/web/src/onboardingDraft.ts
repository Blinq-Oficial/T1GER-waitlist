export const onboardingKey = (uid = 'guest') => `t1ger_web_onboarding_v1_${uid}`;
export type Interest = 'investing' | 'ai' | 'mindset';
export type SetupStep = 'interests' | 'rhythm' | 'ready';
export interface OnboardingDraft { interests: Interest[]; primary: Interest; dailyTime: number; step: SetupStep }
export const emptyOnboarding: OnboardingDraft = { interests: [], primary: 'investing', dailyTime: 10, step: 'interests' };

/** Browser storage is untrusted and older versions allowed several interests. */
export function parseOnboardingDraft(raw: string | null, fallback = emptyOnboarding): OnboardingDraft {
  try {
    const saved = JSON.parse(raw || 'null');
    if (!saved || !Array.isArray(saved.interests)) return fallback;
    const valid = (id: unknown): id is Interest => typeof id === 'string' && ['investing', 'ai', 'mindset'].includes(id);
    const selected = saved.interests.filter(valid);
    const primary = valid(saved.primary) && selected.includes(saved.primary) ? saved.primary : selected[0];
    if (!primary) return { ...emptyOnboarding };
    return { interests: [primary], primary, dailyTime: [5, 10, 15].includes(saved.dailyTime) ? saved.dailyTime : 10,
      step: ['interests', 'rhythm', 'ready'].includes(saved.step) ? saved.step : 'interests' };
  } catch { return fallback; }
}

export function loadOnboardingDraft(uid?: string, fallback = emptyOnboarding): OnboardingDraft {
  try { return parseOnboardingDraft(localStorage.getItem(onboardingKey(uid)) || (uid ? localStorage.getItem(onboardingKey()) : null), fallback); }
  catch { return fallback; }
}
