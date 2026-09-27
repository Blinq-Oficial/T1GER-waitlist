import { lazy, Suspense, useEffect, useState, type FormEvent } from 'react';
import { ArrowRight, BookOpen, Brain, Compass, LogOut, Menu, Sparkles, Target, UserRound, X } from 'lucide-react';
import { configured } from './firebase';
import { brainOf, changeTrack, finishOnboarding, explainError, isComplete, leave, signIn, signInGoogle, signUp, useLearner, type Mission } from './state';
import { getInteractiveTrack } from './product/interactiveCurriculum';
import type { InteractiveTrack } from './product/interactiveCurriculumTypes';
import { buildMasterySnapshot } from './product/masteryService';
import { getJourneyNodes } from './product/learningJourney';
import { getApplyDesign } from './product/applyMissionDesign';
import type { TrackType } from './product/missionBank';
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
const route = () => window.location.pathname.split('/').filter(Boolean);

function AuthScreen() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try { await (mode === 'signin' ? signIn(email, password) : signUp(email, password)); }
    catch (cause) { setError(explainError(cause, 'Sign in failed. Please try again.')); }
    finally { setBusy(false); }
  }
  return <div className="auth-layout">
    <div className="auth-story"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><div className="auth-story-body"><p className="eyebrow">CURIOSITY, WITH DIRECTION</p><h1>Learn it.<br/><em>Apply it.</em><br/>Master it.</h1><p>Useful ideas become lasting capability when you put them to work.</p><div className="story-line"><span>01 — LEARN</span><span>02 — APPLY</span><span>03 — MASTER</span></div></div></div>
    <div className="auth-panel"><div className="auth-form"><p className="eyebrow">YOUR LEARNING PATH STARTS HERE</p><h2>{mode === 'signin' ? 'Welcome back.' : 'Make curiosity count.'}</h2><p className="muted">One T1GER account. Your progress follows you.</p>
      {!configured ? <div className="notice">Firebase is not configured. Add the values in <code>.env.local</code> from the existing T1GER project.</div> : <>
        <button className="button google" onClick={async () => { setBusy(true); try { await signInGoogle(); } catch (cause) { setError(explainError(cause, 'Google sign in failed.')); } finally { setBusy(false); } }} disabled={busy}>Continue with Google</button>
        <div className="divider">or use email</div>
        <form onSubmit={submit} className="form-stack"><label>Email <input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><label>Password <input type="password" autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} minLength={6} required value={password} onChange={e => setPassword(e.target.value)} /></label><button className="button primary" disabled={busy}>{busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'} <ArrowRight size={18}/></button></form>
        {error && <p className="error" role="alert">{error}</p>}
        <p className="switch">{mode === 'signin' ? 'New to T1GER?' : 'Already have an account?'} <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></p>
      </>}
    </div></div>
  </div>;
}

function Onboarding({ user, onDone }: { user: NonNullable<ReturnType<typeof useLearner>['user']>; onDone: () => void }) {
  const [name, setName] = useState(user.displayName || '');
  const [track, setTrack] = useState<TrackType>('investing');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  return <main className="onboard"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><div className="onboard-body"><p className="eyebrow">SET YOUR DIRECTION</p><h1>What are you curious about?</h1><p className="muted">Choose a starting path. You can switch later.</p><div className="path-options">{paths.map(item => <button key={item.id} className={`path-option ${track === item.legacyTrackId ? 'selected' : ''}`} onClick={() => setTrack(item.legacyTrackId)}><strong>{item.title.en}</strong><span>{item.promise.en}</span></button>)}</div><form onSubmit={async e => { e.preventDefault(); setBusy(true); setError(''); try { await finishOnboarding(user, name.trim(), track); onDone(); } catch (cause) { setError(explainError(cause, 'Could not save your path.')); } finally { setBusy(false); } }} className="form-stack"><label>What should we call you? <input required maxLength={100} value={name} onChange={e => setName(e.target.value)}/></label><button disabled={busy} className="button primary">{busy ? 'Saving…' : 'Start learning'} <ArrowRight size={18}/></button></form>{error && <p className="error" role="alert">{error}</p>}</div></main>;
}

function Learn({ track, brain, missions, dueCount, openLesson, go }: { track: InteractiveTrack; brain: ReturnType<typeof brainOf>; missions: Mission[]; dueCount: number; openLesson: (id: string) => void; go: (path: string) => void }) {
  const completedApplyIds = missions.filter(isComplete).map(m => m.id);
  const nodes = getJourneyNodes(track, brain, completedApplyIds);
  const next = nodes.find(node => node.state !== 'completed');
  const completed = nodes.filter(node => node.state === 'completed').length;
  const nextLesson = next?.lesson || null;
  return <div className="page learn-page"><div className="page-top"><p className="eyebrow">YOUR LEARNING PATH</p><h1>Keep your momentum.</h1><p className="muted">One useful idea at a time.</p></div>
    <div className="learn-grid"><aside className="path-context"><div className="context-label">CURRENT PATH <span>0{paths.indexOf(track) + 1} / 03</span></div><h2>{track.title.en}</h2><p>{track.promise.en}</p><div className="path-progress"><div><strong>{completed} of {track.lessons.length}</strong><span>lessons applied</span></div><progress value={completed} max={track.lessons.length} /></div><button className="text-link" onClick={() => go('/discover')}>Explore paths <ArrowRight size={16}/></button></aside>
      <section className="next-lesson"><div className="lesson-meta"><span>{nextLesson ? `LESSON ${String(nextLesson.order).padStart(2, '0')}` : 'PATH COMPLETE'}</span><span>{nextLesson ? '≈ 4 MIN' : 'KEEP IT FRESH'}</span></div><div className="next-lesson-body"><p className="eyebrow">{nextLesson ? 'UP NEXT' : 'YOU MADE IT THROUGH'}</p><h2>{nextLesson?.title.en || 'A path worth keeping.'}</h2><p>{nextLesson?.objective.en || 'Master will bring ideas back when they are due.'}</p></div>{nextLesson ? <button className="button primary large" onClick={() => next?.state === 'review' ? go('/master') : openLesson(nextLesson.id)}>{next?.state === 'review' ? 'Review then continue' : 'Start lesson'} <ArrowRight size={20}/></button> : <button className="button primary large" onClick={() => go('/master')}>Go to Master <ArrowRight size={20}/></button>}</section>
      <aside className="today-context"><div className="context-label">TODAY</div><h3>Keep what you learn.</h3>{dueCount ? <><p><strong>{dueCount}</strong> concept{dueCount === 1 ? '' : 's'} ready for review.</p><button className="button subtle" onClick={() => go('/master')}>Review now <ArrowRight size={17}/></button></> : <><p>Your memory queue is clear. New reviews appear when they are due.</p><div className="caught-mark">✓ <span>All caught up</span></div></>}</aside></div>
    <section className="path-trail"><div className="section-heading"><div><p className="eyebrow">THE PATH AHEAD</p><h2>Build the full picture.</h2></div><span>{completed}/{track.lessons.length} complete</span></div><ol>{nodes.map((node, index) => <li key={node.lesson.id} className={node.state}><span className="trail-index">{String(index + 1).padStart(2, '0')}</span><div><strong>{node.lesson.title.en}</strong><p>{node.lesson.objective.en}</p></div><span className="trail-state">{node.state === 'completed' ? 'Applied' : node.state === 'locked' ? 'Up next' : node.state === 'review' ? 'Review due' : 'Ready'}</span>{node.state !== 'locked' && <button aria-label={`Open ${node.lesson.title.en}`} onClick={() => node.state === 'review' ? go('/master') : openLesson(node.lesson.id)}><ArrowRight size={18}/></button>}</li>)}</ol></section>
  </div>;
}

function Discover({ active, select }: { active: InteractiveTrack; select: (track: InteractiveTrack) => Promise<void> }) {
  const [busy, setBusy] = useState(''); const [error, setError] = useState('');
  return <div className="page"><div className="page-top"><p className="eyebrow">DISCOVER</p><h1>Follow a better question.</h1><p className="muted">Explore the current T1GER curriculum. Investing is available on web first.</p></div><div className="discover-list">{paths.map((track, i) => <article key={track.id} className="discover-item"><div className="discover-num">0{i+1}</div><div><p className="eyebrow">{track.lessons.length} LESSONS · {track.lessons[0].sources[0].author.toUpperCase()} + MORE</p><h2>{track.title.en}</h2><p>{track.promise.en}</p><span>{track.id === 'smart-money' ? track.outcome.en : 'Web lessons in progress · available in the T1GER mobile app'}</span></div>{track.id === 'smart-money' && <button className={active.id === track.id ? 'button subtle' : 'button primary'} disabled={!!busy || active.id === track.id} onClick={async () => { setBusy(track.id); setError(''); try { await select(track); } catch (cause) { setError(explainError(cause, 'Could not switch paths.')); } finally { setBusy(''); } }}>{active.id === track.id ? 'Current path' : busy === track.id ? 'Switching…' : 'Choose path'}{active.id !== track.id && <ArrowRight size={17}/>}</button>}</article>)}</div>{error && <p role="alert" className="error">{error}</p>}</div>;
}

function Apply({ missions, openLesson, go }: { missions: Mission[]; openLesson: (id: string) => void; go: (path: string) => void }) {
  const pending = missions.filter(m => !isComplete(m)); const complete = missions.filter(isComplete);
  return <div className="page"><div className="page-top"><p className="eyebrow">APPLY</p><h1>Make knowledge useful.</h1><p className="muted">A lesson becomes progress when you use it.</p></div><div className="apply-layout"><section><div className="section-heading"><div><p className="eyebrow">READY TO USE</p><h2>Your next action.</h2></div></div>{pending.length ? pending.map(m => <article className="apply-row" key={m.id}><div><span className="eyebrow">FROM {m.lessonId.toUpperCase()}</span><h3>{getApplyDesign(m.lessonId, 'en')?.title || m.title || 'Put your lesson to work'}</h3><p>{m.supportPayload || m.description || (m.status === 'needs_revision' ? 'Your last submission needs another look.' : 'Return to your lesson and complete its real-world step.')}</p></div><button className="button primary" onClick={() => openLesson(m.lessonId)}>Continue <ArrowRight size={18}/></button></article>) : <div className="empty-state"><Target size={28}/><h3>No action waiting.</h3><p>Finish a lesson to turn an idea into a concrete next step.</p><button className="button subtle" onClick={() => go('/learn')}>Go to Learn <ArrowRight size={17}/></button></div>}</section><aside className="apply-history"><p className="eyebrow">ALREADY APPLIED</p><h2>{complete.length}</h2><p>completed action{complete.length === 1 ? '' : 's'}</p>{complete.slice(0,5).map(m => <div key={m.id}><span>✓</span>{paths.flatMap(path => path.lessons).find(lesson => lesson.id === m.lessonId)?.title.en || m.lessonId}</div>)}</aside></div></div>;
}

function ProfilePage({ profile, logout }: { profile: NonNullable<ReturnType<typeof useLearner>['profile']>; logout: () => void }) {
  const brain = brainOf(profile); const completed = new Set(brain.missionHistory.filter(m => m.completed && m.missionId.startsWith('field-learn-')).map(m => m.missionId));
  return <div className="page profile-page"><div className="page-top"><p className="eyebrow">PROFILE</p><h1>Your learning, in motion.</h1></div><div className="profile-grid"><section><div className="avatar">{(profile.displayName || profile.email || 'T').charAt(0).toUpperCase()}</div><h2>{profile.displayName || 'T1GER learner'}</h2><p className="muted">{profile.email}</p><div className="profile-facts"><div><strong>{completed.size}</strong><span>ideas applied</span></div><div><strong>{profile.streak || 0}</strong><span>day streak</span></div><div><strong>{profile.xp || 0}</strong><span>XP</span></div></div></section><aside><div className="settings-row"><span>Current path</span><strong>{trackFor(brain.currentTrackId).title.en}</strong></div><div className="settings-row"><span>Membership</span><strong>{profile.isPro ? 'T1GER Pro' : 'Standard'}</strong></div><div className="settings-row"><span>Account</span><strong>One account across devices</strong></div><button className="button subtle" onClick={logout}><LogOut size={17}/> Sign out</button></aside></div></div>;
}

export default function App() {
  const preview = import.meta.env.DEV && new URLSearchParams(window.location.search).get('preview') === '1';
  const learner = useLearner(preview); const [parts, setParts] = useState(route); const [menu, setMenu] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => { const update = () => setParts(route()); window.addEventListener('popstate', update); return () => window.removeEventListener('popstate', update); }, []);
  useEffect(() => { const yes = () => setOnline(true), no = () => setOnline(false); window.addEventListener('online', yes); window.addEventListener('offline', no); return () => { window.removeEventListener('online', yes); window.removeEventListener('offline', no); }; }, []);
  function go(path: string) { window.history.pushState({}, '', preview ? `${path}?preview=1` : path); setParts(route()); setMenu(false); window.scrollTo(0, 0); }
  const destination: Destination = links.some(link => link.id === parts[0]) ? parts[0] as Destination : 'learn';
  if (!configured && !preview) return <AuthScreen/>;
  if (learner.loading) return <div className="loading-screen"><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><p>Loading your path…</p></div>;
  if (!learner.user) return <AuthScreen/>;
  if (learner.error) return <div className="loading-screen"><h1>We couldn't load your path.</h1><p>{learner.error}</p><button className="button primary" onClick={() => window.location.reload()}>Retry</button></div>;
  if (!learner.profile?.onboardingComplete) return <Onboarding user={learner.user} onDone={() => go('/learn')}/>;
  const brain = brainOf(learner.profile); const track = trackFor(brain.currentTrackId || learner.profile.primaryTrack);
  const snapshot = buildMasterySnapshot(brain);
  const lessonId = parts[0] === 'lesson' ? parts[1] : null;
  const lesson = lessonId && paths.flatMap(path => path.lessons).find(item => item.id === lessonId);
  if (lessonId && !lesson) return <div className="loading-screen"><h1>Lesson unavailable.</h1><p>That lesson is not in the current T1GER curriculum.</p><button className="button primary" onClick={() => go('/learn')}>Back to Learn</button></div>;
  if (lesson) return <Suspense fallback={<div className="loading-screen">Opening lesson…</div>}><Lesson key={lesson.id} lesson={lesson} uid={learner.user.uid} brain={brain} missions={learner.missions} close={() => go('/learn')} preview={preview}/></Suspense>;
  return <div className="app-shell"><aside className={`sidebar ${menu ? 'open' : ''}`}><div className="brand"><span className="brand-mark">1</span><span>T1GER</span></div><button className="mobile-close" aria-label="Close menu" onClick={() => setMenu(false)}><X size={22}/></button><div className="sidebar-middle"><p className="rail-caption">YOUR SPACE</p><nav aria-label="Main navigation">{links.map(link => { const Icon = link.icon; return <a href={`/${link.id}`} key={link.id} className={destination === link.id ? 'active' : ''} onClick={e => { e.preventDefault(); go(`/${link.id}`); }} aria-current={destination === link.id ? 'page' : undefined}><Icon size={19}/><span>{link.label}</span></a>; })}</nav></div><div className="sidebar-bottom"><Sparkles size={17}/><span>Learn it. Apply it. Master it.</span></div></aside>
    <div className="workspace"><header className="topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setMenu(true)}><Menu size={22}/></button><span className="topbar-location">{links.find(link => link.id === destination)?.purpose}</span><span className="topbar-spacer"/>{preview && <span className="preview-label">DESIGN PREVIEW</span>}<span className="topbar-path">{track.shortTitle.en}</span><button className="topbar-avatar" onClick={() => go('/profile')} aria-label="Open profile">{(learner.profile.displayName || 'T').charAt(0).toUpperCase()}</button></header>
      {!online && <div className="offline-banner" role="status">You are offline. Reconnect before saving learning progress.</div>}
      <main>{destination === 'learn' ? <Learn track={track} brain={brain} missions={learner.missions} dueCount={snapshot.due.length} openLesson={id => go(`/lesson/${id}`)} go={go}/> : destination === 'discover' ? <Discover active={track} select={async t => { await changeTrack(learner.user!.uid, t.legacyTrackId); go('/learn'); }}/> : destination === 'apply' ? <Apply missions={learner.missions} openLesson={id => go(`/lesson/${id}`)} go={go}/> : destination === 'master' ? <Suspense fallback={<div className="loading-screen">Loading reviews…</div>}><Review uid={learner.user.uid} snapshot={snapshot} onLearn={() => go('/learn')}/></Suspense> : <ProfilePage profile={learner.profile} logout={() => void leave()}/>}</main>
    </div>{menu && <button type="button" className="menu-scrim" aria-label="Close menu" onClick={() => setMenu(false)} />}</div>;
}





