import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, type User } from 'firebase/auth';
import { collection, doc, getDoc, getDocs, onSnapshot, query, runTransaction, setDoc, where, limit } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useEffect, useState } from 'react';
import { behaviorEvent } from '../../../src/lib/behaviorAnalytics';
import { reportOperationalIssue } from './operationalTelemetry';
import { auth, db, functions } from './firebase';
import { DEFAULT_BRAIN_STATE, processMissionResult, processMissionReview, type BrainState } from './product/brainService';
import type { TrackType } from './product/missionBank';
import { FIELD_MISSION_CATALOG } from './product/fieldMissionCatalog';
import type { AtomicLesson, SavedLearningArtifact } from './product/interactiveCurriculumTypes';

export interface Profile {
  uid: string;
  email: string;
  displayName?: string;
  primaryTrack?: TrackType;
  onboardingComplete?: boolean;
  interests?: TrackType[];
  dailyTime?: number;
  initialPathwayId?: string;
  learningArtifacts?: SavedLearningArtifact[];
  xp?: number;
  level?: number;
  streak?: number;
  lastVerifiedMissionDay?: string;
  timeZone?: string;
  isPro?: boolean;
  coins?: number;
  unlockedAccessories?: string[];
  equippedAccessories?: string[];
  verifiedXP?: number;
  weeklyXP?: number;
  currentWeekId?: string;
  leagueTier?: string;
  photoURL?: string;
  unlockedAchievements?: string[];
  notificationPreferences?: Record<string, boolean>;
  weeklyReportOptIn?: boolean;
  brainState?: BrainState;
}

export interface Mission {
  id: string;
  lessonId: string;
  title?: string;
  description?: string;
  supportPayload?: string;
  instructions?: string[];
  artifact?: SavedLearningArtifact;
  learningScore?: number;
  status: 'ready' | 'pending_review' | 'needs_revision' | 'verified' | 'completed';
  completionMode?: string;
  completedAt?: number | { seconds: number };
  submission?: { proofText?: string; createdAt?: number };
}

import { isComplete } from './product/webProgress';
export { isComplete } from './product/webProgress';
export const brainOf = (profile: Profile | null): BrainState => ({ ...DEFAULT_BRAIN_STATE, ...profile?.brainState, missionHistory: profile?.brainState?.missionHistory || [], fsrsCards: profile?.brainState?.fsrsCards || {} });

export function explainError(cause: unknown, fallback: string): string {
  const code = typeof cause === 'object' && cause && 'code' in cause ? String(cause.code) : '';
  if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found'].includes(code)) return 'Email or password not recognized.';
  if (code === 'auth/email-already-in-use') return 'This email already has an account. Sign in instead.';
  if (code === 'auth/invalid-email') return 'Enter a valid email address.';
  if (code === 'auth/weak-password') return 'Use a password with at least 6 characters.';
  if (code === 'auth/popup-closed-by-user') return 'The sign-in window was closed.';
  if (code === 'auth/popup-blocked') return 'Your browser blocked the Google sign-in window. Allow popups for T1GER or sign in with email.';
  if (code === 'auth/unauthorized-domain') return 'This web domain is not enabled for T1GER sign-in.';
  if (code === 'auth/too-many-requests') return 'Too many attempts. Try again later.';
  if (code.includes('network') || code.endsWith('/unavailable')) return 'Connection lost. Check your network and retry.';
  if (code === 'functions/failed-precondition') return 'Complete the previous lesson’s Apply step before continuing.';
  if (code.endsWith('/permission-denied')) return 'This account cannot save that step. Sign in again and retry.';
  return fallback;
}

function previewState(): { profile: Profile; missions: Mission[] } {
  const fixture = new URLSearchParams(window.location.search).get('fixture');
  let brainState = DEFAULT_BRAIN_STATE;
  if (fixture === 'review') {
    const learned = processMissionResult(DEFAULT_BRAIN_STATE, 'learn-money-01', true, 100);
    const applied = processMissionResult(learned, 'field-learn-money-01', true, 100);
    brainState = { ...applied, fsrsCards: { ...applied.fsrsCards, 'learn-money-01': { ...applied.fsrsCards['learn-money-01'], due: new Date(Date.now() - 1000) } } };
  }
  if (fixture === 'apply') {
    const learned = processMissionResult(DEFAULT_BRAIN_STATE, 'learn-money-01', true, 100);
    brainState = processMissionResult(learned, 'field-learn-money-01', true, 100);
  }
  return {
    profile: { uid: 'preview', email: 'preview@t1ger.app', displayName: 'Preview learner', onboardingComplete: fixture !== 'onboarding', brainState },
    missions: fixture === 'apply' ? [
      { id: 'field-learn-money-02', lessonId: 'learn-money-02', status: 'ready', title: 'Execute: Time is the multiplier', supportPayload: 'My rule: contribute $250 monthly for 10 years and review once a year.' },
      { id: 'field-learn-money-01', lessonId: 'learn-money-01', status: 'completed', title: 'Cash loses too', supportPayload: 'Keep my emergency buffer accessible. Review the money I will not need for four years separately.' },
    ] : [],
  };
}

export function useLearner(preview = false) {
  const [fixture] = useState(() => preview ? previewState() : null);
  const [user, setUser] = useState<User | null>(preview ? ({ uid: 'preview', email: 'preview@t1ger.app', displayName: 'Preview learner' } as User) : null);
  const [profile, setProfile] = useState<Profile | null>(fixture?.profile || null);
  const [missions, setMissions] = useState<Mission[]>(fixture?.missions || []);
  const [loading, setLoading] = useState(!preview && Boolean(auth));
  const [error, setError] = useState(preview && new URLSearchParams(window.location.search).get('fixture') === 'error' ? 'Your learning state is temporarily unavailable.' : '');

  useEffect(() => {
    if (preview || !auth || !db) return;
    let stopProfile: (() => void) | undefined;
    let stopMissions: (() => void) | undefined;
    const stopAuth = onAuthStateChanged(auth, nextUser => {
      stopProfile?.(); stopMissions?.();
      setUser(nextUser); setProfile(null); setMissions([]); setError('');
      if (!nextUser) { setLoading(false); return; }
      setLoading(true);
      stopProfile = onSnapshot(doc(db!, 'users', nextUser.uid), snap => {
        setProfile(snap.exists() ? snap.data() as Profile : null);
        setLoading(false);
      }, cause => { reportOperationalIssue('profile_load', cause); setError('Could not load your learning state. Check your connection and retry.'); setLoading(false); });
      stopMissions = onSnapshot(query(collection(db!, 'missions'), where('userId', '==', nextUser.uid), where('lessonId','in',['money','ai','psychology-v1'].flatMap(track => [1,2,3,4,5].map(order => `learn-${track}-0${order}`))), limit(30)), snap => {
        setMissions(snap.docs.map(item => ({ ...item.data(), id: item.data().missionId || item.id }) as Mission));
      }, cause => { reportOperationalIssue('missions_load', cause); setError('Your Apply history is temporarily unavailable.'); });
    });
    return () => { stopAuth(); stopProfile?.(); stopMissions?.(); };
  }, [preview]);
  return { user, profile, missions, loading, error, setError, setProfile };
}

export async function signIn(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  await signInWithEmailAndPassword(auth, email, password);
}
export async function signUp(email: string, password: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  await createUserWithEmailAndPassword(auth, email, password);
}
export async function signInGoogle() {
  if (!auth) throw new Error('Firebase is not configured.');
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
}
export async function resetPassword(email: string) {
  if (!auth) throw new Error('Firebase is not configured.');
  await sendPasswordResetEmail(auth, email.trim());
}
export async function leave() { if (auth) await signOut(auth); }

export async function finishOnboarding(user: User, name: string, track: TrackType, preferences: { interests: TrackType[]; dailyTime: number } = { interests: [track], dailyTime: 10 }) {
  if (!db) throw new Error('Firebase is not configured.');
  const ref = doc(db, 'users', user.uid);
  const existing = await getDoc(ref);
  const setup = { displayName: name, niche: track, primaryTrack: track, interests: preferences.interests,
    dailyTime: preferences.dailyTime, learningStyle: 'interactive', onboardingComplete: true,
    initialPathwayId: track === 'ai' ? 'tech-ai' : track === 'mindset' ? 'psych-biases' : 'biz-capital' };
  if (existing.exists()) {
    await runTransaction(db, async transaction => {
      const current = await transaction.get(ref);
      const data = current.data() as Profile;
      transaction.update(ref, { ...setup, brainState: JSON.parse(JSON.stringify({ ...brainOf(data), currentTrackId: track })) });
    });
  } else {
    await setDoc(ref, { uid: user.uid, email: user.email, ...setup, level: 1, xp: 0, streak: 0, coins: 0,
      brainState: JSON.parse(JSON.stringify({ ...DEFAULT_BRAIN_STATE, currentTrackId: track })) });
  }
}

export async function changeTrack(uid: string, track: TrackType) {
  if (!db) throw new Error('Firebase is not configured.');
  const ref = doc(db, 'users', uid);
  await runTransaction(db, async transaction => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) throw new Error('Account unavailable.');
    transaction.update(ref, { primaryTrack: track, brainState: JSON.parse(JSON.stringify({ ...brainOf(snap.data() as Profile), currentTrackId: track })) });
  });
}

async function updateBrain(uid: string, updater: (state: BrainState) => BrainState) {
  if (!db) throw new Error('Firebase is not configured.');
  const ref = doc(db, 'users', uid);
  await runTransaction(db, async transaction => {
    const snap = await transaction.get(ref);
    if (!snap.exists()) throw new Error('Account unavailable.');
    const current = brainOf(snap.data() as Profile);
    const next = updater(current);
    if (next !== current) transaction.update(ref, { brainState: JSON.parse(JSON.stringify(next)) });
  });
}

export async function recordCompletion(uid: string, lessonId: string, score: number) {
  await updateBrain(uid, state => {
    const learned = processMissionResult(state, lessonId, true, score);
    return processMissionResult(learned, `field-${lessonId}`, true, 100);
  });
}

export async function recordReview(uid: string, lessonId: string, score: number) {
  await updateBrain(uid, state => processMissionReview(state, lessonId, score));
  behaviorEvent('review_completed', { lesson_id: lessonId });
}

export async function completeApply(uid: string, lessonId: string, reflection: string, score: number) {
  if (!functions || !db || auth?.currentUser?.uid !== uid) throw new Error('Sign in again to continue.');
  const missionId = `field-${lessonId}`;
  const existing = await getDoc(doc(db, 'missions', `${uid}_${missionId}`));
  if (!existing.exists() || !isComplete(existing.data() as Mission)) {
    const complete = httpsCallable(functions, 'completeWebApplyMission');
    await complete({ missionId, lessonId, reflection: reflection.trim(), language: 'en', timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone });
  }
  await recordCompletion(uid, lessonId, score);
  behaviorEvent('apply_completed', { lesson_id: lessonId });
}

export function readArtifact(uid: string, lessonId: string, cloudArtifacts: SavedLearningArtifact[] = []): SavedLearningArtifact | null {
  const cloud = cloudArtifacts.find(item => item.lessonId === lessonId);
  if (cloud) return cloud;
  try {
    const items = JSON.parse(localStorage.getItem(`t1ger_learning_artifacts_v1_${uid}`) || '[]') as SavedLearningArtifact[];
    return items.find(item => item.lessonId === lessonId) || null;
  } catch { return null; }
}

export async function prepareApply(uid: string, lesson: AtomicLesson, artifact: SavedLearningArtifact, learningScore: number) {
  if (!db || auth?.currentUser?.uid !== uid) throw new Error('Sign in again to continue.');
  const key = `t1ger_learning_artifacts_v1_${uid}`;
  const items = (() => { try { return JSON.parse(localStorage.getItem(key) || '[]') as SavedLearningArtifact[]; } catch { return []; } })();
  const blueprint = FIELD_MISSION_CATALOG[lesson.id];
  const missionId = `field-${lesson.id}`;
  const ref = doc(db, 'missions', `${uid}_${missionId}`);
  // Owner queries are permitted even when no mission exists; direct reads of missing missions are not.
  const owned = await getDocs(query(collection(db, 'missions'), where('userId', '==', uid), where('lessonId', '==', lesson.id), where('missionId','==',missionId), limit(1)));
  const existing = owned.docs.find(item => item.id === ref.id);
  if (!existing || !isComplete(existing.data() as Mission)) {
    await setDoc(ref, {
      id: missionId, missionId, userId: uid, lessonId: lesson.id, trackId: lesson.trackId,
      title: lesson.phases[2].title.en, description: lesson.phases[2].widget.instruction.en,
      instructions: [lesson.phases[2].widget.instruction.en], supportTitle: artifact.title,
      supportPayload: artifact.summary, artifact, proofPrompt: blueprint?.prompt[1] || lesson.objective.en,
      proofKinds: blueprint?.kinds || ['text'], status: 'ready', lessonXp: lesson.phases[3].xp,
      executionXp: 50, learningScore, createdAt: Date.now(), updatedAt: Date.now(), autoOpen: false,
    }, { merge: true });
  }
  await runTransaction(db, async transaction => {
    const userRef = doc(db!, 'users', uid);
    const profile = await transaction.get(userRef);
    if (!profile.exists()) throw new Error('Account unavailable.');
    const saved = (profile.data().learningArtifacts || []) as SavedLearningArtifact[];
    transaction.update(userRef, { learningArtifacts: [artifact, ...saved.filter(item => item.lessonId !== lesson.id)].slice(0, 100) });
  });
  behaviorEvent('lesson_completed', { lesson_id: lesson.id });
  try { localStorage.setItem(key, JSON.stringify([artifact, ...items.filter(item => item.lessonId !== lesson.id)].slice(0, 100))); } catch { /* The cloud copy remains authoritative if browser storage is full or unavailable. */ }
}
