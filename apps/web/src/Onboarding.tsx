import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Clock, RotateCcw, Target } from 'lucide-react';
import type { User } from 'firebase/auth';
import { appHref } from './basePath';
import { explainError, finishOnboarding, type Profile } from './state';
import { getInteractiveTrack } from './product/interactiveCurriculum';
import { Tiger, TigerPortrait } from './Visual';
import { behaviorEvent } from '../../../src/lib/behaviorAnalytics';
import DomainArtwork from './DomainArtwork';
import { loadOnboardingDraft, onboardingKey, type Interest, type SetupStep, type OnboardingDraft } from './onboardingDraft';

export const interests = [
  { id: 'investing', label: 'Money & investing', description: 'Understand money. Make deliberate decisions.', path: 'smart-money' },
  { id: 'ai', label: 'AI & everyday work', description: 'Better prompts. Useful workflows. Your judgment.', path: 'ai-automation' },
  { id: 'mindset', label: 'Psychology & thinking', description: 'Notice bias. Think clearly. Remember more.', path: 'mindset-stoic' },
] as const;
const steps: SetupStep[] = ['interests', 'rhythm', 'ready'];

export default function Onboarding({ user, profile, preview, themeAction, onDone, onExit, onCreateAccount, initialDraft }: {
  user: User | null; profile: Profile | null; preview: boolean; themeAction: ReactNode;
  onDone: (lessonId: string) => void; onExit?: () => void; onCreateAccount?: (draft: OnboardingDraft) => void; initialDraft?: OnboardingDraft;
}) {
  const key = onboardingKey(user?.uid);
  const [draft, setDraft] = useState(() => {
    const primary = interests.find(item => item.id === profile?.primaryTrack)?.id || 'investing';
    return initialDraft || loadOnboardingDraft(user?.uid, { interests: profile?.primaryTrack ? [primary] : [], primary, dailyTime: [5,10,15].includes(profile?.dailyTime || 0) ? profile!.dailyTime! : 10, step: 'interests' });
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const index = steps.indexOf(draft.step);
  const primary = interests.find(item => item.id === draft.primary) || interests[0];
  const track = getInteractiveTrack(primary.path), first = track.lessons[0];
  useEffect(() => { try { localStorage.setItem(key, JSON.stringify(draft)); } catch { /* Continue without browser storage. */ } }, [draft, key]);
  useEffect(() => { titleRef.current?.focus(); window.scrollTo(0, 0); }, [draft.step]);
  useEffect(() => { if (!preview) behaviorEvent('onboarding_step_viewed', { step: draft.step, screen: user ? 'account' : 'guest' }); }, [draft.step, preview, user]);
  function go(step: SetupStep) {
    if (!preview && steps.indexOf(step) > index) behaviorEvent('onboarding_step_completed', { step: draft.step, screen: user ? 'account' : 'guest' });
    setError(''); setDraft(current => ({ ...current, step }));
  }
  function choose(primary: Interest) { setDraft(current => ({ ...current, interests: [primary], primary })); }
  async function start() {
    if (!user) { onCreateAccount?.(draft); return; }
    setBusy(true); setError('');
    try {
      if (!preview) await finishOnboarding(user, user.displayName?.trim() || 'T1GER learner', primary.id, { interests: draft.interests, dailyTime: draft.dailyTime });
      try { localStorage.removeItem(key); if (!preview) localStorage.removeItem(onboardingKey()); } catch { /* Saved profile is sufficient. */ }
      if (!preview) behaviorEvent('onboarding_completed');
      onDone(first.id);
    } catch (cause) { setError(explainError(cause, 'Your setup could not be saved. Your choices are still here; try again.')); }
    finally { setBusy(false); }
  }
  const heading = draft.step === 'interests' ? 'What would you like to explore?' : draft.step === 'rhythm' ? 'How much time feels right?' : 'Your first useful idea.';
  return <main className="onboard experience-onboard setup-v2">
    <header className="onboard-head"><a className="brand" href="/"><span>T1GER</span></a>{themeAction}</header>
    <div className="setup-navigation"><button className="icon-button" disabled={busy || (index === 0 && !onExit)} aria-label={index ? 'Previous setup step' : 'Back to welcome'} onClick={() => index ? go(steps[index - 1]) : onExit?.()}><ArrowLeft size={22}/></button><div className="setup-progress"><progress aria-label="Learning setup progress" value={index + 1} max={3}/><span>Step {index + 1} of 3 <span>{['Your curiosity', 'Your rhythm', 'Your first lesson'][index]}</span></span></div></div>
    <section className="onboard-body" key={draft.step}>
      <div className="onboard-guide">{draft.step === 'ready' ? <Tiger animation="welcome"/> : <TigerPortrait animated/>}<p>{draft.step === 'interests' ? "One path to start. Plenty to discover." : draft.step === 'rhythm' ? "Small steps count. Choose your pace." : "You've got a good place to start."}</p></div>
      <h1 ref={titleRef} tabIndex={-1}>{heading}</h1>
      <p className="muted">{draft.step === 'interests' ? 'Choose your starting point. You can explore every path later.' : draft.step === 'rhythm' ? 'A daily intention, not a deadline. Change it whenever you like.' : 'A short lesson, then something you can put to use.'}</p>
      {draft.step === 'interests' && <fieldset className="setup-paths"><legend className="sr-only">Your starting path</legend>{interests.map(item => <label key={item.id} className={`setup-path ${draft.primary === item.id && draft.interests.length ? 'selected' : ''}`}><input type="radio" name="starting-path" value={item.id} checked={draft.interests.length > 0 && draft.primary === item.id} onChange={() => choose(item.id)}/><DomainArtwork domain={item.path}/><span className="setup-path-copy"><strong>{item.label}</strong><span>{item.description}</span></span><span className="setup-selection" aria-hidden="true">{draft.interests.length > 0 && draft.primary === item.id && <Check size={16}/>}</span></label>)}</fieldset>}
      {draft.step === 'rhythm' && <fieldset className="setup-rhythms"><legend className="sr-only">Your daily intention</legend>{[5, 10, 15].map((minutes, i) => <label key={minutes} className={`setup-rhythm ${draft.dailyTime === minutes ? 'selected' : ''}`}><input type="radio" name="daily-intention" value={minutes} checked={draft.dailyTime === minutes} onChange={() => setDraft(current => ({ ...current, dailyTime: minutes }))}/><span className="pace-bars" aria-hidden="true">{[0,1,2].map(bar => <i key={bar} className={bar <= i ? 'filled' : ''}/>)}</span><span><strong>{['A small start', 'A steady rhythm', 'A little deeper'][i]}</strong><small>{['One useful idea', 'Learn and put it to work', 'More room to explore'][i]}</small></span><span className="pace-time">{minutes}<small>min / day</small></span><span className="setup-selection" aria-hidden="true">{draft.dailyTime === minutes && <Check size={16}/>}</span></label>)}</fieldset>}
      {draft.step === 'ready' && <article className="setup-lesson"><div className="setup-lesson-art"><DomainArtwork domain={primary.path}/><span>{primary.label}</span></div><div className="setup-lesson-copy"><span className="setup-duration"><Clock size={15}/>About 4 minutes · Lesson 1 of {track.lessons.length}</span><h2>{first.title.en}</h2><p>{first.objective.en}</p><div className="setup-learning-loop"><span><BookOpen size={19}/>Explore</span><span><Target size={19}/>Apply</span><span><RotateCcw size={19}/>Recall</span></div></div></article>}
      {error && <p className="error" role="alert">{error}</p>}
      {preview && <p className="preview-note">Design preview · Account progress is not saved.</p>}
    </section>
    <footer className="setup-actions"><div><p>{draft.step === 'ready' ? user ? `${draft.dailyTime} minutes a day. One useful step at a time.` : 'Your choices are ready. Create a free account to keep your progress.' : 'You can change your choices later.'}</p><button className="button primary large" disabled={busy || (draft.step === 'interests' && !draft.interests.length)} onClick={() => draft.step === 'ready' ? void start() : go(steps[index + 1])}>{busy ? 'Saving your path…' : draft.step === 'ready' ? user ? 'Start first lesson' : 'Create account & start' : 'Continue'}<ArrowRight size={19}/></button></div><nav><a href={appHref('/privacy')}>Privacy</a><span>·</span><a href={appHref('/terms')}>Terms</a></nav></footer>
  </main>;
}
