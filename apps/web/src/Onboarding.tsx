import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, Brain, Check, Coins, Cpu } from 'lucide-react';
import type { User } from 'firebase/auth';
import { appHref } from './basePath';
import { explainError, finishOnboarding, type Profile } from './state';
import { getInteractiveTrack } from './product/interactiveCurriculum';
import type { TrackType } from './product/missionBank';

import { TigerPortrait } from './Visual';
import { behaviorEvent } from '../../../src/lib/behaviorAnalytics';
import DomainArtwork from './DomainArtwork';

export const interests = [
  { id: 'investing', label: 'Investing', description: 'Understand money. Make deliberate decisions.', icon: Coins, path: 'smart-money' },
  { id: 'ai', label: 'AI', description: 'Better prompts. Useful workflows. Human judgment.', icon: Cpu, path: 'ai-automation' },
  { id: 'mindset', label: 'Psychology', description: 'Notice bias. Think clearly. Remember more.', icon: Brain, path: 'mindset-stoic' },
] as const;
type Interest = typeof interests[number]['id'];
type Step = 'interests' | 'primary' | 'rhythm' | 'ready';
interface Draft { interests: Interest[]; primary: Interest; dailyTime: number; step: Step }
const initial: Draft = { interests: [], primary: 'investing', dailyTime: 10, step: 'interests' };

export default function Onboarding({ user, profile, preview, themeAction, onDone }: {
  user: User; profile: Profile | null; preview: boolean; themeAction: ReactNode; onDone: (lessonId: string) => void;
}) {
  const key = `t1ger_web_onboarding_v1_${user.uid}`;
  const [draft, setDraft] = useState<Draft>(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(key) || 'null') as Draft | null;
      if (stored && Array.isArray(stored.interests) && stored.interests.every(id => interests.some(item => item.id === id)) && ['welcome', 'interests', 'primary', 'loop', 'rhythm', 'ready'].includes(stored.step)) {
        return { ...initial, ...stored, step: ['interests', 'primary', 'rhythm', 'ready'].includes(stored.step) ? stored.step : 'interests', primary: stored.interests.includes(stored.primary) ? stored.primary : stored.interests[0] || 'investing', dailyTime: [5, 10, 15].includes(stored.dailyTime) ? stored.dailyTime : 10 };
      }
    } catch { /* Storage is optional; account save remains authoritative. */ }
    const selected = interests.find(item => item.id === profile?.primaryTrack)?.id;
    return { ...initial, interests: selected ? [selected] : [], primary: selected || 'investing', dailyTime: [5, 10, 15].includes(profile?.dailyTime || 0) ? profile!.dailyTime! : 10 };
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const steps: Step[] = ['interests', ...(draft.interests.length > 1 ? ['primary' as const] : []), 'rhythm', 'ready'];
  const index = Math.max(0, steps.indexOf(draft.step));
  const primary = interests.find(item => item.id === draft.primary) || interests[0];
  const track = getInteractiveTrack(primary.path);
  const first = track.lessons[0];
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(draft)); } catch { /* Continue without a browser draft. */ } }, [draft, key]);
  useEffect(() => { titleRef.current?.focus(); window.scrollTo(0, 0); }, [draft.step]);
  useEffect(() => { if (!preview) behaviorEvent('onboarding_step_viewed', { step: draft.step }); }, [draft.step, preview]);
  function go(step: Step) { if (!preview && steps.indexOf(step) > index) behaviorEvent('onboarding_step_completed', { step: draft.step }); setError(''); setDraft(current => ({ ...current, step })); }
  function toggle(id: Interest) {
    setDraft(current => {
      const selected = current.interests.includes(id) ? current.interests.filter(item => item !== id) : [...current.interests, id];
      return { ...current, interests: selected, primary: selected.includes(current.primary) ? current.primary : selected[0] || 'investing' };
    });
  }
  async function start() {
    setBusy(true); setError('');
    try {
      if (!preview) await finishOnboarding(user, user.displayName?.trim() || 'T1GER learner', primary.id as TrackType, { interests: draft.interests, dailyTime: draft.dailyTime });
      try { localStorage.removeItem(key); } catch { /* The saved profile is sufficient. */ }
      if (!preview) behaviorEvent('onboarding_completed');
      onDone(first.id);
    } catch (cause) { setError(explainError(cause, 'Your setup could not be saved. Your choices are still here; try again.')); }
    finally { setBusy(false); }
  }
  const heading = draft.step === 'interests' ? 'What are you curious about?' : draft.step === 'primary' ? 'Where should we start?' : draft.step === 'rhythm' ? 'A pace that fits your day.' : 'Your first useful idea is ready.';
  return <main className="onboard experience-onboard">
    <header className="onboard-head"><a className="brand" href="/"><span className="brand-mark">1</span><span>T1GER</span></a>{themeAction}</header>
    <div className="onboarding-progress"><span>YOUR START / {String(index + 1).padStart(2, '0')} OF {String(steps.length).padStart(2, '0')}</span><progress aria-label="Learning setup progress" value={index + 1} max={steps.length}/></div>
    <div className="onboard-body"><div className="onboard-guide"><TigerPortrait animated/><p>{draft.step === 'interests' ? "Let’s start with what interests you." : draft.step === 'primary' ? "Which one shall we explore first?" : draft.step === 'rhythm' ? "A pace that fits your day." : "Ready when you are."}</p></div><p className="eyebrow">{draft.step === 'ready' ? primary.label.toUpperCase() : 'CURIOSITY, WITH DIRECTION'}</p><h1 ref={titleRef} tabIndex={-1}>{heading}</h1>
      {draft.step === 'interests' && <><p className="muted">Choose one or more. All three paths are available on Web, and you can switch later.</p><div className="interest-grid">{interests.map(item => { const Icon = item.icon; return <button key={item.id} className={`interest-choice ${draft.interests.includes(item.id) ? 'selected' : ''}`} aria-pressed={draft.interests.includes(item.id)} onClick={() => toggle(item.id)}><DomainArtwork domain={item.path}/><span className="interest-icon"><Icon size={25}/>{draft.interests.includes(item.id) && <Check size={17}/>}</span><strong>{item.label}</strong><span>{item.description}</span></button>; })}</div></>}
      {draft.step === 'primary' && <><p className="muted">This chooses your first lesson, not your only path.</p><div className="primary-choices">{interests.filter(item => draft.interests.includes(item.id)).map(item => <button key={item.id} aria-pressed={draft.primary === item.id} onClick={() => setDraft(current => ({ ...current, primary: item.id }))}><strong>{item.label}</strong><span>{draft.primary === item.id ? <Check size={20}/> : <ArrowRight size={20}/>}</span></button>)}</div></>}
      {draft.step === 'rhythm' && <><p className="muted">Choose a daily intention. You can change it later in Settings.</p><div className="rhythm-choices">{[5, 10, 15].map(minutes => <button key={minutes} aria-pressed={draft.dailyTime === minutes} onClick={() => setDraft(current => ({ ...current, dailyTime: minutes }))}><strong>{minutes}<small> min / day</small></strong><span>{minutes === 5 ? 'One useful idea' : minutes === 10 ? 'Learn and put it to work' : 'A little deeper'}</span>{draft.dailyTime === minutes && <Check size={20}/>}</button>)}</div></>}
      {draft.step === 'ready' && <><p className="muted">Starting with {primary.label}. Your {draft.dailyTime}-minute intention leaves room to learn at your pace.</p><div className="onboard-lesson"><span>LESSON 01 · ABOUT 4 MINUTES · {track.lessons.length} LESSON PATH</span><h2>{first.title.en}</h2><p>{first.objective.en}</p><ul><li>Make a prediction</li><li>Test the idea</li><li>Save something useful</li></ul></div></>}
      <div className="onboarding-actions">{index > 0 && <button className="button subtle" disabled={busy} onClick={() => go(steps[index - 1])}><ArrowLeft size={18}/> Back</button>}<button className="button primary large" disabled={busy || (draft.step === 'interests' && !draft.interests.length)} onClick={() => draft.step === 'ready' ? void start() : go(steps[index + 1])}>{busy ? 'Saving your path…' : draft.step === 'ready' ? 'Start first lesson' : 'Continue'}<ArrowRight size={19}/></button></div>
      {error && <p className="error" role="alert">{error}</p>}{preview && <p className="preview-note">Design preview · Account progress is not saved.</p>}<p className="onboard-footer"><a href={appHref('/privacy')}>Privacy</a> · <a href={appHref('/terms')}>Terms</a> · Learn an idea. Apply it. Recall it later.</p>
    </div>
  </main>;
}
