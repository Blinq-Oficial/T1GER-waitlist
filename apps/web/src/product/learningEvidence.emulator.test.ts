import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { initializeApp, deleteApp, type FirebaseApp } from 'firebase/app';
import { connectAuthEmulator, createUserWithEmailAndPassword, getAuth, type Auth } from 'firebase/auth';
import { connectFirestoreEmulator, doc, getDoc, getFirestore, setDoc, type Firestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions, httpsCallable } from 'firebase/functions';
import { DEFAULT_BRAIN_STATE, processMissionResult } from './brainService';
import { GOLD_CONCEPT_ID, GOLD_LESSON_ID, addLearningEvent, newGoldDraft } from './learningEngine';

const handles = vi.hoisted(() => ({ auth: null as Auth | null, db: null as Firestore | null }));
vi.mock('../firebase', () => ({ get auth() { return handles.auth; }, get db() { return handles.db; }, functions: null }));

// Explicit opt-in: all SDKs connect only to the named disposable demo emulator.
describe.skipIf(process.env.T1GER_EMULATOR_TEST !== '1')('Gold evidence emulator', () => {
  let app: FirebaseApp, uid: string;
  let service: typeof import('./learningEvidence');
  beforeAll(async () => {
    app = initializeApp({ projectId: 'demo-t1ger-web', apiKey: 'local-gold-evidence', authDomain: 'demo-t1ger-web.firebaseapp.com' }, `gold-evidence-${Date.now()}`);
    handles.auth = getAuth(app); connectAuthEmulator(handles.auth, 'http://127.0.0.1:9099', { disableWarnings: true });
    handles.db = getFirestore(app); connectFirestoreEmulator(handles.db, '127.0.0.1', 8080);
    const functions = getFunctions(app); connectFunctionsEmulator(functions, '127.0.0.1', 5001);
    const result = await createUserWithEmailAndPassword(handles.auth, `gold-evidence-${Date.now()}@example.invalid`, 'Local-test-only-2026');
    uid = result.user.uid;
    await setDoc(doc(handles.db, 'users', uid), { uid, email: result.user.email, niche: 'investing', onboardingComplete: true, xp: 0, coins: 0, streak: 0, level: 1 });
    for (const lessonId of ['learn-money-01', GOLD_LESSON_ID]) {
      await setDoc(doc(handles.db, 'missions', `${uid}_field-${lessonId}`), { userId: uid, missionId: `field-${lessonId}`, lessonId, status: 'ready' });
      await httpsCallable(functions, 'completeWebApplyMission')({ lessonId, missionId: `field-${lessonId}`, reflection: 'Disposable illustrative learning rule, generated only for the local contract test.', timeZone: 'America/New_York' });
    }
    const brain = processMissionResult(DEFAULT_BRAIN_STATE, GOLD_LESSON_ID, true, 75);
    await setDoc(doc(handles.db, 'users', uid), { brainState: JSON.parse(JSON.stringify(brain)) }, { merge: true });
    service = await import('./learningEvidence');
  }, 30000);
  afterAll(async () => { if (app) await deleteApp(app); });

  it('resumes a cloud checkpoint with errors and inputs intact', async () => {
    const draft = { ...addLearningEvent(newGoldDraft(), { name: 'interaction_attempt', interactionId: 'worked', correct: false }), step: 4 };
    draft.inputs.startAge = 30; draft.inputs.monthly = 255;
    await service.saveGoldDraft(uid, draft);
    expect(await service.loadGoldDraft(uid)).toEqual(draft);
    await service.saveGoldDraft(uid, draft);
    const profile = (await getDoc(doc(handles.db!, 'users', uid))).data()!;
    expect(profile.learningConcepts[GOLD_CONCEPT_ID].events).toHaveLength(2);
  });

  it('stores one retrieval and updates FSRS once even when the same response is retried', async () => {
    const ref = doc(handles.db!, 'users', uid);
    const before = (await getDoc(ref)).data()!;
    const draft = addLearningEvent(newGoldDraft(), { name: 'retrieval_result', interactionId: 'growth-on-growth', correct: true, rating: 80, assessment: 'objective' });
    const event = draft.events[1];
    const finished = { ...draft, step: 9, finished: true };
    await service.recordGoldReview(uid, 80, event, finished);
    const once = (await getDoc(ref)).data()!;
    await service.recordGoldReview(uid, 80, event, finished);
    const twice = (await getDoc(ref)).data()!;
    expect(once.brainState.fsrsCards[GOLD_LESSON_ID].reps).toBe(before.brainState.fsrsCards[GOLD_LESSON_ID].reps + 1);
    expect(twice.brainState).toEqual(once.brainState);
    expect(twice.learningConcepts[GOLD_CONCEPT_ID].events.filter((item: { id: string }) => item.id === event.id)).toHaveLength(1);
    expect(twice.xp).toBe(before.xp);
    expect(twice.streak).toBe(before.streak);
    expect(twice.brainState.missionHistory).toEqual(before.brainState.missionHistory);
  });
});
