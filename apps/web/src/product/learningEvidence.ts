import { doc, getDoc, runTransaction } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { brainOf, type Profile } from '../state';
import { processMissionReview } from './brainService';
import { boundedRecallScore, GOLD_CONCEPT_ID, GOLD_LESSON_ID, mergeEvidence, retainLearningEvents, validGoldDraft, type ConceptEvidence, type GoldDraft, type LearningEvent } from './learningEngine';

function ownerRef(uid: string) {
  if (!db || auth?.currentUser?.uid !== uid) throw new Error('Sign in again to save your learning.');
  return doc(db, 'users', uid);
}
export async function loadGoldDraft(uid: string) {
  const snapshot = await getDoc(ownerRef(uid));
  const draft = snapshot.data()?.learningConcepts?.[GOLD_CONCEPT_ID]?.draft;
  return validGoldDraft(draft) ? draft : null;
}
export async function saveGoldDraft(uid: string, draft: GoldDraft) {
  if (!validGoldDraft(draft)) throw new Error('Invalid learning session.');
  const ref = ownerRef(uid);
  await runTransaction(db!, async transaction => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error('Account unavailable.');
    const concepts = snapshot.data().learningConcepts || {};
    transaction.update(ref, { learningConcepts: { ...concepts, [GOLD_CONCEPT_ID]: mergeEvidence(concepts[GOLD_CONCEPT_ID], draft) } });
  });
}
/** Personal learning evidence is client observed, never competitive proof or an AI grade. */
export async function recordGoldReview(uid: string, score: number, event: LearningEvent, draft?: GoldDraft, signals: LearningEvent[] = []) {
  score = boundedRecallScore(score, event.resultCorrect === true && event.mechanismCorrect === true);
  event = { ...event, rating: score, correct: event.resultCorrect === true && event.mechanismCorrect === true };
  const ref = ownerRef(uid);
  await runTransaction(db!, async transaction => {
    const snapshot = await transaction.get(ref);
    if (!snapshot.exists()) throw new Error('Account unavailable.');
    const profile = snapshot.data() as Profile;
    const concepts = snapshot.data().learningConcepts || {};
    const current = concepts[GOLD_CONCEPT_ID] as ConceptEvidence | undefined;
    if (Array.isArray(current?.events) && current.events.some(item => item.id === event.id)) return; // Retrying a save cannot reschedule twice.
    const merged = draft ? mergeEvidence(current, draft) : current || { version: 2 as const, firstExposedAt: event.at, events: [] };
    const bundle = [...signals.filter(item => item.id !== event.id), event];
    const events = retainLearningEvents([...(Array.isArray(merged.events) ? merged.events : []).filter(item => !bundle.some(signal => signal.id === item.id)), ...bundle]);
    const brain = brainOf(profile);
    if (!brain.missionHistory.some(item => item.missionId === GOLD_LESSON_ID && item.completed)) throw new Error('Complete Apply before scheduling this review.');
    const next = processMissionReview(brain, GOLD_LESSON_ID, score);
    transaction.update(ref, { brainState: JSON.parse(JSON.stringify(next)), learningConcepts: { ...concepts, [GOLD_CONCEPT_ID]: { ...merged, events } } });
  });
}
