import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, BookOpen, Brain, Compass, LogOut, Moon, Sparkles, Sun, Target, UserRound, Flame, Zap } from 'lucide-react';
import { configured } from './firebase';
import { brainOf, changeTrack, explainError, isComplete, leave, resetPassword, signIn, signInGoogle, signUp, useLearner, type Mission } from './state';
import LegalPage, { legalDraft, legalContactEmail } from './Legal';
import { applyTheme, initializeTheme, type Theme } from './theme';
import { getInteractiveTrack } from './product/interactiveCurriculum';
import type { InteractiveTrack } from './product/interactiveCurriculumTypes';
import { buildMasterySnapshot } from './product/masteryService';
import Onboarding from './Onboarding';
import { getJourneyNodes } from './product/learningJourney';
import type { SavedLearningArtifact } from './product/interactiveCurriculumTypes';
import { getApplyDesign } from './product/applyMissionDesign';
import { appHref, appRoute } from './basePath';
import Learn from './LearningHome';
import { Tiger, DomainIcon } from './Visual';
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
  const [email, setEmail] = useState(() => { try { return sessionStorage.getItem('t1ger_signup_email') || ''; } catch { return ''; } });
  const [consent, setConsent] = useState(false);
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
    <div className="auth-story"><div className="auth-story-head"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><ThemeToggle theme={theme} onToggle={onToggleTheme}/></div><div className="auth-story-body"><Tiger/><p className="eyebrow">CURIOSITY, WITH DIRECTION</p><h1>Learn it.<br/><em>Apply it.</em><br/>Master it.</h1><p>One useful idea, a real decision, and a reason to remember it.</p><div className="story-line"><span>01 — LEARN</span><span>02 — APPLY</span><span>03 — MASTER</span></div></div></div>
    <div className="auth-panel"><div className="auth-form"><div className="auth-mode-switch" aria-label="Account access"><button type="button" aria-pressed={mode === 'signup'} onClick={() => switchMode('signup')}>Create account</button><button type="button" aria-pressed={mode === 'signin'} onClick={() => switchMode('signin')}>Sign in</button></div><p className="eyebrow">{mode === 'reset' ? 'ACCOUNT RECOVERY' : 'YOUR LEARNING PATH STARTS HERE'}</p><h2>{mode === 'signin' ? 'Welcome back.' : mode === 'reset' ? 'Reset your password.' : 'Start with a useful idea.'}</h2><p className="muted auth-description">{mode === 'reset' ? 'Enter your account email and we’ll send reset instructions.' : mode === 'signin' ? 'Your learning is waiting where you left it.' : 'Choose Investing, AI, or Psychology. Start your first lesson free and keep your progress across devices.'}</p>
      <p className="auth-legal auth-legal-intro">Before continuing, read our <a href={appHref('/privacy')}>Privacy notice</a> and <a href={appHref('/terms')}>Terms of use</a>.{legalDraft && <> These notices are drafts for product review.</>}</p>
      {!configured ? <div className="notice">{import.meta.env.DEV ? <>Firebase is not configured. Add the values in <code>.env.local</code> from the existing T1GER project.</> : <>Account access is temporarily unavailable. Please try again later. <a href="/">Return to T1GER</a>.</>}</div> : <>
        {mode !== 'reset' && <label className="auth-consent"><input type="checkbox" checked={consent} onChange={event => setConsent(event.target.checked)}/><span>{mode === 'signin' && 'For Google sign-in: '}I’m at least 15 and have read the <a href={appHref('/terms')}>Terms</a> and <a href={appHref('/privacy')}>Privacy notice</a>.</span></label>}
        {mode !== 'reset' && <><button className="button google" onClick={async () => { setBusy(true); setError(''); try { await signInGoogle(); } catch (cause) { setError(explainError(cause, 'Google sign in failed.')); } finally { setBusy(false); } }} disabled={busy || !consent}>Continue with Google</button><div className="divider">or use email</div></>}
        <form onSubmit={submit} className="form-stack"><div className="auth-field"><label htmlFor="auth-email">Email</label><input id="auth-email" name="email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></div>{mode !== 'reset' && <div className="auth-field"><label htmlFor="auth-password">Password</label><div className="password-control"><input id="auth-password" name="password" type={showPassword ? 'text' : 'password'} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={mode === 'signup' ? 6 : undefined} aria-describedby={mode === 'signup' ? 'password-help' : undefined} required value={password} onChange={e => setPassword(e.target.value)} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></div>{mode === 'signup' && <small className="field-help" id="password-help">Use at least 6 characters.</small>}</div>}<button className="button primary" disabled={busy || (mode === 'signup' && !consent) || (mode === 'reset' && resetSent)}>{busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : mode === 'reset' ? 'Send reset link' : 'Create account'} <ArrowRight size={18}/></button></form>
        {mode === 'signin' && <div className="auth-utility"><button type="button" onClick={() => switchMode('reset')}>Forgot password?</button></div>}
        {mode === 'reset' && resetSent && <p className="auth-success" role="status">If an account exists for that address, reset instructions are on their way. Check your inbox and spam folder.</p>}
        {error && <p className="error" role="alert">{error}{error.includes('already has an account') && <button type="button" className="text-link" onClick={() => switchMode('signin')}>Sign in with this email</button>}</p>}
        {mode === 'reset' && <p className="switch"><button type="button" onClick={() => switchMode('signin')}>Back to sign in</button></p>}
      </>}
    </div></div>
  </div>;
}

function Discover({ active, select }: { active: InteractiveTrack; select: (track: InteractiveTrack) => Promise<void> }) {
  const [busy, setBusy] = useState(''); const [error, setError] = useState('');
  return <div className="page"><div className="page-top"><p className="eyebrow">DISCOVER</p><h1>Follow a better question.</h1><p className="muted">Three ways to see the world differently. Choose a path; keep the progress you already made.</p></div><div className="discover-list">{paths.map(track => <article key={track.id} className="discover-item"><DomainIcon domain={track.id}/><div><p className="eyebrow">{`${track.lessons.length} LESSONS · INTERACTIVE PATH`}</p><h2>{track.title.en}</h2><p>{track.promise.en}</p><span>{track.outcome.en}</span></div>{<button className={active.id === track.id ? 'button subtle' : 'button primary'} disabled={!!busy || active.id === track.id} onClick={async () => { setBusy(track.id); setError(''); try { await select(track); } catch (cause) { setError(explainError(cause, 'Could not switch paths.')); } finally { setBusy(''); } }}>{active.id === track.id ? 'Current path' : busy === track.id ? 'Switching…' : 'Choose path'}{active.id !== track.id && <ArrowRight size={17}/>}</button>}</article>)}</div>{error && <p role="alert" className="error">{error}</p>}</div>;
}

function Apply({ missions, artifacts = [], openLesson, go }: { missions: Mission[]; artifacts?: SavedLearningArtifact[]; openLesson: (id: string) => void; go: (path: string) => void }) {
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
    </section> : <section className="apply-empty"><Tiger/><p className="eyebrow">NOTHING PENDING</p><h2>Your next idea is waiting.</h2><p>Finish a lesson to make a rule, test it, and put it to use.</p><button className="button primary" onClick={() => go('/learn')}>Find your next lesson <ArrowRight size={17}/></button></section>}
    {pending.length > 1 && <section className="apply-more"><div className="section-heading"><div><p className="eyebrow">ALSO READY</p><h2>Other applications.</h2></div></div>{pending.slice(1).map(m => <div className="apply-more-row" key={m.id}><strong>{getApplyDesign(m.lessonId, 'en')?.title || m.title}</strong><button className="text-link" onClick={() => openLesson(m.lessonId)}>Continue <ArrowRight size={16}/></button></div>)}</section>}
    <section className="apply-completed"><div className="section-heading"><div><p className="eyebrow">ALREADY APPLIED</p><h2>Decisions made.</h2></div><span>{completed.length} completed</span></div>{completed.length ? <div className="apply-completed-list">{completed.slice(0, 6).map(m => <div key={m.id}><span>✓</span><strong>{paths.flatMap(path => path.lessons).find(lesson => lesson.id === m.lessonId)?.title.en || m.title || m.lessonId}</strong><small>Applied</small>{(artifacts.find(item => item.lessonId === m.lessonId)?.summary || m.supportPayload) && <p className="completed-rule">{artifacts.find(item => item.lessonId === m.lessonId)?.summary || m.supportPayload}</p>}</div>)}</div> : <p className="apply-completed-empty">Completed applications will appear here.</p>}</section>
  </div>;
}

function ProfilePage({ profile, missions, logout, preview = false }: { missions: Mission[]; profile: NonNullable<ReturnType<typeof useLearner>['profile']>; logout: () => void; preview?: boolean }) {
  const brain = brainOf(profile); const completed = new Set(brain.missionHistory.filter(m => m.completed && m.missionId.startsWith('field-learn-')).map(m => m.missionId));

  const [exportData, setExportData] = useState('');
  function exportLearning() {
    const data = { exportedAt: new Date().toISOString(), scope: 'Web account profile and learning missions. Not a complete service-wide data export.', profile, missions };
    setExportData(JSON.stringify(data, null, 2));
  }
  return <div className="page profile-page"><div className="page-top"><p className="eyebrow">PROFILE / ACCOUNT</p><h1>Your learning, in motion.</h1></div><div className="profile-grid"><section><div className="avatar">{(profile.displayName || profile.email || 'T').charAt(0).toUpperCase()}</div><h2>{profile.displayName || 'T1GER learner'}</h2><p className="muted">{profile.email}</p><div className="profile-facts"><div><strong>{completed.size}</strong><span>ideas applied</span></div><div><strong>{profile.streak || 0}</strong><span>day streak</span></div><div><strong>{profile.xp || 0}</strong><span>XP</span></div></div></section><aside><div className="settings-row"><span>Current path</span><strong>{trackFor(brain.currentTrackId).title.en}</strong></div><div className="settings-row"><span>Daily intention</span><strong>{profile.dailyTime || 10} minutes</strong></div><div className="settings-row"><span>Membership</span><strong>{profile.isPro ? 'T1GER Pro' : 'Standard'}</strong></div><div className="settings-row"><span>Account</span><strong>One account across devices</strong></div><div className="profile-data-actions"><button className="button subtle" onClick={exportLearning}>Export learning data</button>{exportData && <div className="learning-export" role="status"><p>Your Web profile and learning missions are ready. This is not a complete service-wide export.</p><a className="button subtle" download="t1ger-learning-data.json" href={`data:application/json;charset=utf-8,${encodeURIComponent(exportData)}`}>Download JSON</a><details><summary>View or copy the JSON</summary><textarea aria-label="Exported learning data" readOnly value={exportData}/></details></div>}<a className="text-link" href={`mailto:${legalContactEmail}?subject=Account%20data%20or%20deletion%20request`}>Request account data or deletion ↗</a><small>Requests cover your shared Web and mobile account.</small></div><div className="profile-legal"><a href={appHref('/privacy')}>Privacy</a><a href={appHref('/terms')}>Terms</a></div>{!preview && <button className="button subtle" onClick={logout}><LogOut size={17}/> Sign out</button>}</aside></div></div>;
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(initializeTheme);
  function toggleTheme() { const next = theme === 'dark' ? 'light' : 'dark'; applyTheme(next); setTheme(next); }
  const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === '1';
  const learner = useLearner(preview); const [parts, setParts] = useState(route); const [demoOnboarded, setDemoOnboarded] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => { const update = () => setParts(route()); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  useEffect(() => { const yes = () => setOnline(true), no = () => setOnline(false); window.addEventListener('online', yes); window.addEventListener('offline', no); return () => { window.removeEventListener('online', yes); window.removeEventListener('offline', no); }; }, []);
  function go(path: string) { const href = appHref(path); window.history.pushState({}, '', preview ? `${href}?preview=1` : href); setParts(route()); window.scrollTo(0, 0); }
  const destination: Destination = links.some(link => link.id === parts[0]) ? parts[0] as Destination : 'learn';
  if (parts[0] === 'privacy' || parts[0] === 'terms') return <LegalPage kind={parts[0]} themeAction={<ThemeToggle theme={theme} onToggle={toggleTheme}/>}/>;
  if (!configured && !preview) return <AuthScreen theme={theme} onToggleTheme={toggleTheme}/>;
  if (learner.loading) return <LoadingCanvas label="Loading your path" mode="initial"/>;
  if (!learner.user) return <AuthScreen theme={theme} onToggleTheme={toggleTheme}/>;
  if (learner.error) return <div className="loading-screen error-screen"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><p className="eyebrow">CONNECTION INTERRUPTED</p><h1>We couldn't load your path.</h1><p>{learner.error}</p><button className="button primary" onClick={() => window.location.reload()}>Try again <ArrowRight size={17}/></button></div>;
  if (!learner.profile?.onboardingComplete && !demoOnboarded) return <Onboarding user={learner.user} preview={preview} profile={learner.profile} themeAction={<ThemeToggle theme={theme} onToggle={toggleTheme}/>} onDone={id => { setDemoOnboarded(true); go(`/lesson/${id}`); }}/>;
  if (!learner.profile) return <LoadingCanvas label="Loading your account" mode="initial"/>;
  const brain = brainOf(learner.profile); const track = trackFor(brain.currentTrackId || learner.profile.primaryTrack);
  const snapshot = buildMasterySnapshot(brain);
  const lessonId = parts[0] === 'lesson' ? parts[1] : null;
  const lesson = lessonId && paths.flatMap(path => path.lessons).find(item => item.id === lessonId);
  if (lessonId && !lesson) return <div className="loading-screen"><h1>Lesson unavailable.</h1><p>That lesson is not in the current T1GER curriculum.</p><button className="button primary" onClick={() => go('/learn')}>Back to Learn</button></div>;
  if (lesson && !preview) {
    const ownTrack = paths.find(path => path.id === lesson.trackId)!;
    const node = getJourneyNodes(ownTrack, brain, learner.missions.filter(isComplete).map(mission => mission.id)).find(item => item.lesson.id === lesson.id);
    if (node?.state === 'locked' || node?.state === 'review') return <div className="loading-screen"><p className="eyebrow">YOUR PATH, IN ORDER</p><h1>{node.state === 'review' ? 'Refresh the idea first.' : 'Build on the previous idea.'}</h1><p>{node.state === 'review' ? 'A review is due before this next lesson.' : 'Complete the earlier lessons and their Apply steps before opening this one.'}</p><button className="button primary" onClick={() => go(node.state === 'review' ? '/master' : '/learn')}>{node.state === 'review' ? 'Go to Master' : 'Return to Learn'}</button></div>;
  }
  if (lesson) return <Suspense fallback={<LoadingCanvas label="Opening lesson" mode="lesson"/>}><Lesson key={lesson.id} lesson={lesson} uid={learner.user.uid} brain={brain} missions={learner.missions} artifacts={learner.profile.learningArtifacts} close={() => go('/learn')} preview={preview}/></Suspense>;
  return <div className="app-shell"><aside id="main-navigation" className="sidebar"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><div className="sidebar-middle"><p className="rail-caption">YOUR SPACE</p><nav aria-label="Main navigation">{links.map(link => { const Icon = link.icon; return <a href={appHref(`/${link.id}`)} key={link.id} className={destination === link.id ? 'active' : ''} onClick={e => { e.preventDefault(); go(`/${link.id}`); }} aria-current={destination === link.id ? 'page' : undefined}><Icon size={19}/><span>{link.label}</span></a>; })}</nav></div><div className="sidebar-bottom"><Sparkles size={17}/><span>Learn it. Apply it. Master it.</span></div></aside>
    <div className="workspace"><header className="topbar"><span className="topbar-location">{links.find(link => link.id === destination)?.purpose}</span><span className="topbar-spacer"/>{preview && <span className="preview-label">DESIGN PREVIEW</span>}<div className="account-stats"><span title="Day streak"><Flame size={20} aria-hidden="true"/>{learner.profile.streak || 0}<span className="sr-only"> day streak</span></span><span title="Experience points"><Zap size={20} aria-hidden="true"/>{learner.profile.xp || 0} XP</span></div><ThemeToggle theme={theme} onToggle={toggleTheme}/><button className="topbar-avatar" onClick={() => go('/profile')} aria-label="Open profile">{(learner.profile.displayName || 'T').charAt(0).toUpperCase()}</button></header>
      {!online && <div className="offline-banner" role="status">You are offline. Reconnect before saving learning progress.</div>}
      <main>{destination === 'learn' ? <Learn track={track} brain={brain} missions={learner.missions} dailyTime={learner.profile.dailyTime || 10} dueCount={snapshot.due.length} openLesson={id => go(`/lesson/${id}`)} go={go}/> : destination === 'discover' ? <Discover active={track} select={async t => { if (preview) learner.setProfile({ ...learner.profile!, primaryTrack: t.legacyTrackId, brainState: { ...brain, currentTrackId: t.legacyTrackId } }); else await changeTrack(learner.user!.uid, t.legacyTrackId); go('/learn'); }}/> : destination === 'apply' ? <Apply artifacts={learner.profile.learningArtifacts} missions={learner.missions} openLesson={id => go(`/lesson/${id}`)} go={go}/> : destination === 'master' ? <Suspense fallback={<LoadingCanvas label="Loading reviews"/>}><Review uid={learner.user.uid} snapshot={snapshot} onLearn={() => go('/learn')} preview={preview}/></Suspense> : <ProfilePage missions={learner.missions} profile={learner.profile} logout={() => void leave()} preview={preview}/>}</main>
    </div></div>;
}


