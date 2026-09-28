import { lazy, Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowRight, BookOpen, Brain, Compass, LogOut, Menu, Moon, Sparkles, Sun, Target, UserRound, X } from 'lucide-react';
import { configured } from './firebase';
import { brainOf, changeTrack, finishOnboarding, explainError, isComplete, leave, resetPassword, signIn, signInGoogle, signUp, useLearner, type Mission } from './state';
import LegalPage, { legalDraft } from './Legal';
import { applyTheme, initializeTheme, type Theme } from './theme';
import { getInteractiveTrack } from './product/interactiveCurriculum';
import type { InteractiveTrack } from './product/interactiveCurriculumTypes';
import { buildMasterySnapshot } from './product/masteryService';
import { getJourneyNodes } from './product/learningJourney';
import { getApplyDesign } from './product/applyMissionDesign';
import { appHref, appRoute } from './basePath';
const Lesson = lazy(() => import('./Lesson'));
const Review = lazy(() => import('./Review'));

type Destination = 'learn' | 'discover' | 'apply' | 'master' | 'profile';
const links: { id: Destination; label: string; icon: typeof BookOpen; purpose: string }[] = [
  { id: 'learn', label: 'Learn', icon: BookOpen, purpose: 'Your next lesson' },
  { id: 'discover', label: 'Discover', icon: Compass, purpose: 'Explore paths' },
  { id: 'apply', label: 'Apply', icon: Target, purpose: 'Put ideas to work' },
  { id: 'master', label: 'Master', icon: Brain, purpose: 'Keep it with you' },
  { id: 'profile', label: 'Profile', icon: UserRound, purpose: 'Your account' },
];
const paths = [getInteractiveTrack('smart-money'), getInteractiveTrack('ai-automation'), getInteractiveTrack('mindset-stoic')];
const webLessonIds = new Set(['learn-money-01', 'learn-money-02']);
const trackFor = (id?: string) => id === 'ai' ? paths[1] : id === 'mindset' ? paths[2] : paths[0];
const route = appRoute;

function LoadingCanvas({ label, mode = 'page' }: { label: string; mode?: 'page' | 'lesson' | 'initial' }) {
  return <div className={`loading-canvas ${mode}`} role="status" aria-live="polite"><span className="sr-only">{label}</span>{mode === 'initial' && <div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div>}<div className="skeleton-line short"/><div className="skeleton-line title"/><div className="skeleton-line sub"/><div className="skeleton-panel"><div className="skeleton-line short"/><div className="skeleton-line title"/><div className="skeleton-line sub"/></div></div>;
}

function ThemeToggle({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return <button type="button" className="theme-toggle" onClick={onToggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>{theme === 'dark' ? <Sun size={18}/> : <Moon size={18}/>}<span>{theme === 'dark' ? 'Light' : 'Dark'}</span></button>;
}

function AuthScreen({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>(() => new URLSearchParams(window.location.search).get('signin') === '1' ? 'signin' : 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      if (mode === 'reset') { await resetPassword(email); setResetSent(true); }
      else await (mode === 'signin' ? signIn(email, password) : signUp(email, password));
    } catch (cause) { setError(explainError(cause, mode === 'reset' ? 'Could not send reset instructions. Try again.' : 'Could not continue. Please try again.')); }
    finally { setBusy(false); }
  }
  function switchMode(next: 'signin' | 'signup' | 'reset') { setMode(next); setPassword(''); setError(''); setResetSent(false); setShowPassword(false); }
  return <div className="auth-layout">
    <div className="auth-story"><div className="auth-story-head"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><ThemeToggle theme={theme} onToggle={onToggleTheme}/></div><div className="auth-story-body"><p className="eyebrow">CURIOSITY, WITH DIRECTION</p><h1>Learn it.<br/><em>Apply it.</em><br/>Master it.</h1><p>One useful idea, a real decision, and a reason to remember it.</p><div className="story-line"><span>01 — LEARN</span><span>02 — APPLY</span><span>03 — MASTER</span></div></div></div>
    <div className="auth-panel"><div className="auth-form"><div className="auth-mode-switch" aria-label="Account access"><button type="button" aria-pressed={mode === 'signup'} onClick={() => switchMode('signup')}>Create account</button><button type="button" aria-pressed={mode === 'signin'} onClick={() => switchMode('signin')}>Sign in</button></div><p className="eyebrow">{mode === 'reset' ? 'ACCOUNT RECOVERY' : 'YOUR LEARNING PATH STARTS HERE'}</p><h2>{mode === 'signin' ? 'Welcome back.' : mode === 'reset' ? 'Reset your password.' : 'Start with a useful idea.'}</h2><p className="muted auth-description">{mode === 'reset' ? 'Enter your account email and we’ll send reset instructions.' : mode === 'signin' ? 'Your learning is waiting where you left it.' : 'Begin with a four-minute Smart Money lesson. Your account keeps what you learn across devices.'}</p>
      <p className="auth-legal auth-legal-intro">Before continuing, read our <a href={appHref('/privacy')}>Privacy notice</a> and <a href={appHref('/terms')}>Terms of use</a>.{legalDraft && <> These notices are drafts for product review.</>}</p>
      {!configured ? <div className="notice">Firebase is not configured. Add the values in <code>.env.local</code> from the existing T1GER project.</div> : <>
        {mode !== 'reset' && <><button className="button google" onClick={async () => { setBusy(true); setError(''); try { await signInGoogle(); } catch (cause) { setError(explainError(cause, 'Google sign in failed.')); } finally { setBusy(false); } }} disabled={busy}>Continue with Google</button><div className="divider">or use email</div></>}
        <form onSubmit={submit} className="form-stack"><div className="auth-field"><label htmlFor="auth-email">Email</label><input id="auth-email" name="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></div>{mode !== 'reset' && <div className="auth-field"><label htmlFor="auth-password">Password</label><div className="password-control"><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={mode === 'signup' ? 6 : undefined} aria-describedby={mode === 'signup' ? 'password-help' : undefined} required value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></div>{mode === 'signup' && <small className="field-help" id="password-help">Use at least 6 characters.</small>}</div>}<button className="button primary" disabled={busy || (mode === 'reset' && resetSent)}>{busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : mode === 'reset' ? 'Send reset link' : 'Create account'} <ArrowRight size={18}/></button></form>
        {mode === 'signin' && <div className="auth-utility"><button type="button" onClick={() => switchMode('reset')}>Forgot password?</button></div>}
        {mode === 'reset' && resetSent && <p className="auth-success" role="status">If an account exists for that address, reset instructions are on their way. Check your inbox and spam folder.</p>}
        {error && <p className="error" role="alert">{error}</p>}
        {mode === 'reset' && <p className="switch"><button type="button" onClick={() => switchMode('signin')}>Back to sign in</button></p>}
      </>}
    </div></div>
  </div>;
}

function Onboarding({ user, onDone, preview = false, theme, onToggleTheme }: { user: NonNullable<ReturnType<typeof useLearner>['user']>; onDone: () => void; preview?: boolean; theme: Theme; onToggleTheme: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <main className="onboard"><div className="onboard-head"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><ThemeToggle theme={theme} onToggle={onToggleTheme}/></div><div className="onboard-body"><p className="eyebrow">YOUR FIRST LESSON</p><h1>Start with one useful decision.</h1><p className="muted">Smart Money &amp; Capital is ready on web. You can explore more paths on mobile later.</p><div className="onboard-lesson"><span>LESSON 01 · ABOUT 4 MINUTES</span><h2>Cash loses too</h2><p>See the difference between money you may need soon and money for a longer goal.</p><ul><li>Make a prediction</li><li>Explore the model</li><li>Save a rule</li></ul></div><button disabled={busy} className="button primary onboard-start" onClick={async () => { setBusy(true); setError(''); try { if (!preview) await finishOnboarding(user, user.displayName?.trim() || 'T1GER learner', 'investing'); onDone(); } catch (cause) { setError(explainError(cause, 'Could not start your path.')); } finally { setBusy(false); } }}>{busy ? 'Preparing…' : 'Start first lesson'} <ArrowRight size={18}/></button>{preview && <p className="preview-note">Design preview · Progress is not saved.</p>}{error && <p className="error" role="alert">{error}</p>}<p className="onboard-footer"><a href={appHref('/privacy')}>Privacy</a> · <a href={appHref('/terms')}>Terms</a></p></div></main>;
}

function Learn({ track, brain, missions, dueCount, openLesson, go }: { track: InteractiveTrack; brain: ReturnType<typeof brainOf>; missions: Mission[]; dueCount: number; openLesson: (id: string) => void; go: (path: string) => void }) {
  const completedApplyIds = missions.filter(isComplete).map(m => m.id);
  const nodes = getJourneyNodes(track, brain, completedApplyIds);
  const next = nodes.find(node => node.state !== 'completed');
  const completed = nodes.filter(node => node.state === 'completed').length;
  const nextLesson = next?.lesson || null;
  const nextOnWeb = nextLesson ? webLessonIds.has(nextLesson.id) : false;
  return <div className="page learn-page"><div className="page-top"><p className="eyebrow">YOUR LEARNING PATH</p><h1>Keep your momentum.</h1><p className="muted">One useful idea at a time.</p></div>
    <div className="learn-grid"><aside className="path-context"><div className="context-label">CURRENT PATH <span>0{paths.indexOf(track) + 1} / 03</span></div><h2>{track.title.en}</h2><p>{track.promise.en}</p><div className="path-progress"><div><strong>{completed} of {track.lessons.length}</strong><span>lessons applied</span></div><progress value={completed} max={track.lessons.length} /></div><button className="text-link" onClick={() => go('/discover')}>Explore paths <ArrowRight size={16}/></button></aside>
      <section className="next-lesson"><div className="lesson-meta"><span>{nextLesson ? `LESSON ${String(nextLesson.order).padStart(2, '0')}` : 'PATH COMPLETE'}</span><span>{!nextOnWeb && nextLesson ? 'ON MOBILE' : nextLesson ? '≈ 4 MIN' : 'KEEP IT FRESH'}</span></div><div className="next-lesson-body"><p className="eyebrow">{!nextOnWeb && nextLesson ? 'CONTINUE ON MOBILE' : nextLesson ? 'UP NEXT' : 'YOU MADE IT THROUGH'}</p><h2>{nextLesson?.title.en || 'A path worth keeping.'}</h2><p>{!nextOnWeb && nextLesson ? 'This lesson is available in the T1GER mobile app. Review your web lessons here while more web lessons are prepared.' : nextLesson?.objective.en || 'Master will bring ideas back when they are due.'}</p></div>{nextLesson && nextOnWeb ? <button className="button primary large" onClick={() => next?.state === 'review' ? go('/master') : openLesson(nextLesson.id)}>{next?.state === 'review' ? 'Review then continue' : 'Start lesson'} <ArrowRight size={20}/></button> : <button className="button primary large" onClick={() => go('/master')}>{nextLesson ? 'Review on web' : 'Go to Master'} <ArrowRight size={20}/></button>}</section>
      <aside className="today-context"><div className="context-label">TODAY</div><h3>Keep what you learn.</h3>{dueCount ? <><p><strong>{dueCount}</strong> concept{dueCount === 1 ? '' : 's'} ready for review.</p><button className="button subtle" onClick={() => go('/master')}>Review now <ArrowRight size={17}/></button></> : <><p>Your memory queue is clear. New reviews appear when they are due.</p><div className="caught-mark">✓ <span>All caught up</span></div></>}</aside></div>
    <section className="path-trail"><div className="section-heading"><div><p className="eyebrow">THE PATH AHEAD</p><h2>Build the full picture.</h2></div><span>{completed}/{track.lessons.length} complete</span></div><ol>{nodes.map((node, index) => <li key={node.lesson.id} className={node.state}><span className="trail-index">{String(index + 1).padStart(2, '0')}</span><div><strong>{node.lesson.title.en}</strong><p>{node.lesson.objective.en}</p></div><span className="trail-state">{!webLessonIds.has(node.lesson.id) ? 'Mobile' : node.state === 'completed' ? 'Applied' : node.state === 'locked' ? 'Up next' : node.state === 'review' ? 'Review due' : 'Ready'}</span>{node.state !== 'locked' && webLessonIds.has(node.lesson.id) && <button aria-label={`Open ${node.lesson.title.en}`} onClick={() => node.state === 'review' ? go('/master') : openLesson(node.lesson.id)}><ArrowRight size={18}/></button>}</li>)}</ol></section>
  </div>;
}

function Discover({ active, select }: { active: InteractiveTrack; select: (track: InteractiveTrack) => Promise<void> }) {
  const [busy, setBusy] = useState(''); const [error, setError] = useState('');
  return <div className="page"><div className="page-top"><p className="eyebrow">DISCOVER</p><h1>Follow a better question.</h1><p className="muted">Explore the current T1GER curriculum. Two Smart Money lessons are ready on web.</p></div><div className="discover-list">{paths.map((track, i) => <article key={track.id} className="discover-item"><div className="discover-num">0{i+1}</div><div><p className="eyebrow">{track.id === 'smart-money' ? `${track.lessons.filter(lesson => webLessonIds.has(lesson.id)).length} ON WEB · ${track.lessons.length} TOTAL` : `MOBILE PATH · ${track.lessons.length} LESSONS`}</p><h2>{track.title.en}</h2><p>{track.promise.en}</p><span>{track.id === 'smart-money' ? track.outcome.en : 'Web lessons in progress · available in the T1GER mobile app'}</span></div>{track.id === 'smart-money' && <button className={active.id === track.id ? 'button subtle' : 'button primary'} disabled={!!busy || active.id === track.id} onClick={async () => { setBusy(track.id); setError(''); try { await select(track); } catch (cause) { setError(explainError(cause, 'Could not switch paths.')); } finally { setBusy(''); } }}>{active.id === track.id ? 'Current path' : busy === track.id ? 'Switching…' : 'Choose path'}{active.id !== track.id && <ArrowRight size={17}/>}</button>}</article>)}</div>{error && <p role="alert" className="error">{error}</p>}</div>;
}

function Apply({ missions, openLesson, go }: { missions: Mission[]; openLesson: (id: string) => void; go: (path: string) => void }) {
  const pending = missions.filter(m => !isComplete(m));
  const completed = missions.filter(isComplete);
  const active = pending[0];
  const design = active ? getApplyDesign(active.lessonId, 'en') : null;
  const sourceTitle = active && paths.flatMap(path => path.lessons).find(lesson => lesson.id === active.lessonId)?.title.en;
  return <div className="page apply-page">
    <div className="page-top"><p className="eyebrow">APPLY / YOUR WORKBENCH</p><h1>Make it useful.</h1><p className="muted">Turn an idea into a decision you can use.</p></div>
    {active ? <section className="apply-feature">
      <div className="apply-feature-main"><p className="eyebrow">READY TO APPLY / {sourceTitle || active.lessonId}</p><h2>{design?.title || active.title || 'Put your lesson to work'}</h2><p>{design?.why || active.description || 'Use what you learned in a concrete decision.'}</p>
        {(design?.steps || active.instructions)?.length ? <ol className="apply-feature-steps">{(design?.steps || active.instructions || []).slice(0, 3).map((step, index) => <li key={index}><span>{String(index + 1).padStart(2, '0')}</span>{step}</li>)}</ol> : null}
        <button className="button primary large" onClick={() => openLesson(active.lessonId)}>Continue Apply <ArrowRight size={18}/></button>
      </div><aside className="apply-rule"><span>YOUR SAVED RULE</span><blockquote>{active.supportPayload || 'Save your lesson tool to bring your rule here.'}</blockquote><small>{sourceTitle || active.lessonId}</small></aside>
    </section> : <section className="apply-empty"><div className="apply-empty-mark"><Target size={32}/></div><p className="eyebrow">NOTHING PENDING</p><h2>Your next idea is waiting.</h2><p>Finish a lesson to make a rule, test it, and put it to use.</p><button className="button primary" onClick={() => go('/learn')}>Find your next lesson <ArrowRight size={17}/></button></section>}
    {pending.length > 1 && <section className="apply-more"><div className="section-heading"><div><p className="eyebrow">ALSO READY</p><h2>Other applications.</h2></div></div>{pending.slice(1).map(m => <div className="apply-more-row" key={m.id}><strong>{getApplyDesign(m.lessonId, 'en')?.title || m.title}</strong><button className="text-link" onClick={() => openLesson(m.lessonId)}>Continue <ArrowRight size={16}/></button></div>)}</section>}
    <section className="apply-completed"><div className="section-heading"><div><p className="eyebrow">ALREADY APPLIED</p><h2>Decisions made.</h2></div><span>{completed.length} completed</span></div>{completed.length ? <div className="apply-completed-list">{completed.slice(0, 6).map(m => <div key={m.id}><span>✓</span><strong>{paths.flatMap(path => path.lessons).find(lesson => lesson.id === m.lessonId)?.title.en || m.title || m.lessonId}</strong><small>Applied</small></div>)}</div> : <p className="apply-completed-empty">Completed applications will appear here.</p>}</section>
  </div>;
}

function ProfilePage({ profile, logout, preview = false }: { profile: NonNullable<ReturnType<typeof useLearner>['profile']>; logout: () => void; preview?: boolean }) {
  const brain = brainOf(profile); const completed = new Set(brain.missionHistory.filter(m => m.completed && m.missionId.startsWith('field-learn-')).map(m => m.missionId));
  return <div className="page profile-page"><div className="page-top"><p className="eyebrow">PROFILE / ACCOUNT</p><h1>Your learning, in motion.</h1></div><div className="profile-grid"><section><div className="avatar">{(profile.displayName || profile.email || 'T').charAt(0).toUpperCase()}</div><h2>{profile.displayName || 'T1GER learner'}</h2><p className="muted">{profile.email}</p><div className="profile-facts"><div><strong>{completed.size}</strong><span>ideas applied</span></div><div><strong>{profile.streak || 0}</strong><span>day streak</span></div><div><strong>{profile.xp || 0}</strong><span>XP</span></div></div></section><aside><div className="settings-row"><span>Current path</span><strong>{trackFor(brain.currentTrackId).title.en}</strong></div><div className="settings-row"><span>Membership</span><strong>{profile.isPro ? 'T1GER Pro' : 'Standard'}</strong></div><div className="settings-row"><span>Account</span><strong>One account across devices</strong></div><div className="profile-legal"><a href={appHref('/privacy')}>Privacy</a><a href={appHref('/terms')}>Terms</a></div>{!preview && <button className="button subtle" onClick={logout}><LogOut size={17}/> Sign out</button>}</aside></div></div>;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(initializeTheme);
  const menuRef = useRef<HTMLElement>(null);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  function toggleTheme() { const next = theme === 'dark' ? 'light' : 'dark'; applyTheme(next); setTheme(next); }
  const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === '1';
  const learner = useLearner(preview); const [parts, setParts] = useState(route); const [menu, setMenu] = useState(false); const [demoOnboarded, setDemoOnboarded] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => { const update = () => setParts(route()); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  useEffect(() => { const yes = () => setOnline(true), no = () => setOnline(false); window.addEventListener('online', yes); window.addEventListener('offline', no); return () => { window.removeEventListener('online', yes); window.removeEventListener('offline', no); }; }, []);
  useEffect(() => {
    if (!menu) return;
    const trigger = menuTriggerRef.current;
    menuRef.current?.querySelector<HTMLButtonElement>('.mobile-close')?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); setMenu(false); return; }
      if (event.key !== 'Tab') return;
      const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]') || []);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); trigger?.focus(); };
  }, [menu]);
  function go(path: string) { const href = appHref(path); window.history.pushState({}, '', preview ? `${href}?preview=1` : href); setParts(route()); setMenu(false); window.scrollTo(0, 0); }
  const destination: Destination = links.some(link => link.id === parts[0]) ? parts[0] as Destination : 'learn';
  if (parts[0] === 'privacy' || parts[0] === 'terms') return <LegalPage kind={parts[0]} themeAction={<ThemeToggle theme={theme} onToggle={toggleTheme}/>}/>;
  if (!configured && !preview) return <AuthScreen theme={theme} onToggleTheme={toggleTheme}/>;
  if (learner.loading) return <LoadingCanvas label="Loading your path" mode="initial"/>;
  if (!learner.user) return <AuthScreen theme={theme} onToggleTheme={toggleTheme}/>;
  if (learner.error) return <div className="loading-screen error-screen"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><p className="eyebrow">CONNECTION INTERRUPTED</p><h1>We couldn't load your path.</h1><p>{learner.error}</p><button className="button primary" onClick={() => window.location.reload()}>Try again <ArrowRight size={17}/></button></div>;
  if (!learner.profile?.onboardingComplete && !demoOnboarded) return <Onboarding user={learner.user} preview={preview} theme={theme} onToggleTheme={toggleTheme} onDone={() => { setDemoOnboarded(true); go('/lesson/learn-money-01'); }}/>;
  if (!learner.profile) return <LoadingCanvas label="Loading your account" mode="initial"/>;
  const brain = brainOf(learner.profile); const track = trackFor(brain.currentTrackId || learner.profile.primaryTrack);
  const snapshot = buildMasterySnapshot(brain);
  const lessonId = parts[0] === 'lesson' ? parts[1] : null;
  const lesson = lessonId && paths.flatMap(path => path.lessons).find(item => item.id === lessonId);
  if (lessonId && !lesson) return <div className="loading-screen"><h1>Lesson unavailable.</h1><p>That lesson is not in the current T1GER curriculum.</p><button className="button primary" onClick={() => go('/learn')}>Back to Learn</button></div>;
  if (lesson) return <Suspense fallback={<LoadingCanvas label="Opening lesson" mode="lesson"/>}><Lesson key={lesson.id} lesson={lesson} uid={learner.user.uid} brain={brain} missions={learner.missions} close={() => go('/learn')} preview={preview}/></Suspense>;
  return <div className="app-shell"><aside id="main-navigation" ref={menuRef} className={`sidebar ${menu ? 'open' : ''}`}><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><button className="mobile-close" aria-label="Close menu" onClick={() => setMenu(false)}><X size={22}/></button><div className="sidebar-middle"><p className="rail-caption">YOUR SPACE</p><nav aria-label="Main navigation">{links.map(link => { const Icon = link.icon; return <a href={appHref(`/${link.id}`)} key={link.id} className={destination === link.id ? 'active' : ''} onClick={e => { e.preventDefault(); go(`/${link.id}`); }} aria-current={destination === link.id ? 'page' : undefined}><Icon size={19}/><span>{link.label}</span></a>; })}</nav></div><div className="sidebar-bottom"><Sparkles size={17}/><span>Learn it. Apply it. Master it.</span></div></aside>
    <div className="workspace" inert={menu}><header className="topbar"><button ref={menuTriggerRef} className="mobile-menu" aria-label="Open menu" aria-controls="main-navigation" aria-expanded={menu} onClick={() => setMenu(true)}><Menu size={22}/></button><span className="topbar-location">{links.find(link => link.id === destination)?.purpose}</span><span className="topbar-spacer"/>{preview && <span className="preview-label">DESIGN PREVIEW</span>}<span className="topbar-path">{track.shortTitle.en}</span><ThemeToggle theme={theme} onToggle={toggleTheme}/><button className="topbar-avatar" onClick={() => go('/profile')} aria-label="Open profile">{(learner.profile.displayName || 'T').charAt(0).toUpperCase()}</button></header>
      {!online && <div className="offline-banner" role="status">You are offline. Reconnect before saving learning progress.</div>}
      <main>{destination === 'learn' ? <Learn track={track} brain={brain} missions={learner.missions} dueCount={snapshot.due.length} openLesson={id => go(`/lesson/${id}`)} go={go}/> : destination === 'discover' ? <Discover active={track} select={async t => { await changeTrack(learner.user!.uid, t.legacyTrackId); go('/learn'); }}/> : destination === 'apply' ? <Apply missions={learner.missions} openLesson={id => go(`/lesson/${id}`)} go={go}/> : destination === 'master' ? <Suspense fallback={<LoadingCanvas label="Loading reviews"/>}><Review uid={learner.user.uid} snapshot={snapshot} onLearn={() => go('/learn')} preview={preview}/></Suspense> : <ProfilePage profile={learner.profile} logout={() => void leave()} preview={preview}/>}</main>
    </div>{menu && <button type="button" tabIndex={-1} className="menu-scrim" aria-label="Close menu" onClick={() => setMenu(false)} />}</div>;
}





