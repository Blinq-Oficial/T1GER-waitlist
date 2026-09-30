import { initializeApp } from 'firebase-admin/app';
import { Timestamp, getFirestore } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { FIELD_MISSION_CATALOG } from './fieldMissionCatalog.js';

initializeApp();
const db = getFirestore();

const rewardSnapshot = (current: FirebaseFirestore.DocumentData) => ({
  xp: Number(current.xp) || 0, verifiedXP: Number(current.verifiedXP) || 0,
  weeklyXP: Number(current.weeklyXP) || 0, coins: Number(current.coins) || 0,
  level: Number(current.level) || 1, streak: Number(current.streak) || 0,
});

const getDayKey = (date: Date, requestedTimeZone?: string) => {
  let timeZone = 'UTC';
  if (requestedTimeZone && requestedTimeZone.length <= 80) {
    try {
      new Intl.DateTimeFormat('en-US', { timeZone: requestedTimeZone }).format(date);
      timeZone = requestedTimeZone;
    } catch {
      // Invalid client time zones safely fall back to UTC.
    }
  }
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) => parts.find(part => part.type === type)?.value || '';
  return `${value('year')}-${value('month')}-${value('day')}`;
};


export const completeWebApplyMission = onCall({ region: 'us-central1', maxInstances: 2 }, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in to save your progress.');
  const uid = request.auth.uid;
  const { lessonId, missionId, reflection = '' } = request.data || {};
  const blueprint = typeof lessonId === 'string' ? FIELD_MISSION_CATALOG[lessonId] : undefined;
  const webLesson = typeof lessonId === 'string' && /^learn-(money|ai|psychology-v1)-0[1-5]$/.test(lessonId);
  if (!blueprint || !webLesson || missionId !== `field-${lessonId}` || typeof reflection !== 'string' || reflection.length > 500 || reflection.trim().length < 20) {
    throw new HttpsError('invalid-argument', 'Unknown mission or invalid reflection.');
  }
  const userRef = db.doc(`users/${uid}`);
  const rewardRef = userRef.collection('rewardEvents').doc(missionId);
  const submissionId = `${uid}_${missionId}`;
  const missionRef = db.doc(`missions/${submissionId}`);
  return db.runTransaction(async transaction => {
    const [user, reward, saved] = await Promise.all([transaction.get(userRef), transaction.get(rewardRef), transaction.get(missionRef)]);
    const current = user.data();
    if (!current || current.onboardingComplete !== true) throw new HttpsError('failed-precondition', 'Finish onboarding first.');
    if (reward.exists) return { status: 'COMPLETED', submissionId, rewardXP: 0, alreadyRewarded: true,
      completedAt: (saved.data()?.completedAt || saved.data()?.verifiedAt || reward.data()?.createdAt)?.toMillis() || 0,
      completionMode: saved.data()?.status === 'completed' ? 'self_reported' : 'verified', ...rewardSnapshot(current) };
    const order = Number(lessonId.slice(-2));
    for (let index = 1; index < order; index++) {
      const previous = `${lessonId.slice(0, -2)}${String(index).padStart(2, '0')}`;
      if (!(await transaction.get(userRef.collection('rewardEvents').doc(`field-${previous}`))).exists) {
        throw new HttpsError('failed-precondition', 'Complete the previous Apply mission first.');
      }
    }
    const now = Timestamp.now();
    const timeZone = String(current.timeZone || request.data?.timeZone || 'UTC');
    const today = getDayKey(now.toDate(), timeZone);
    const yesterday = new Date(Date.parse(`${today}T12:00:00Z`) - 86_400_000).toISOString().slice(0, 10);
    const previousDay = current.lastVerifiedMissionDay;
    const streak = previousDay === today ? Math.max(1, Number(current.streak) || 1) : previousDay === yesterday ? Math.max(0, Number(current.streak) || 0) + 1 : 1;
    const rewardXP = blueprint.lessonXP + 50;
    const xp = Math.max(0, Number(current.xp) || 0) + rewardXP;
    const coins = Math.max(0, Number(current.coins) || 0) + Math.floor(rewardXP / 2);
    const completedMissionCount = Math.max(0, Number(current.completedMissionCount) || 0) + 1;
    const level = Math.max(Number(current.level) || 1, Math.min(Math.floor(xp / 200) + 1, completedMissionCount + (Number(current.verifiedMissionCount) || 0) + 1));
    const locale = request.data?.language === 'es' ? 0 : 1;
    const submission = { id: submissionId, userId: uid, missionId, lessonId, evidenceKind: 'text', proofText: reflection.trim(), reflection: reflection.trim(), verified: false, verificationTier: 'self_reported', createdAt: now.toMillis(), cloudSynced: true, verificationMessage: '' };
    transaction.update(userRef, { xp, coins, level, streak, completedMissionCount, timeZone, lastVerifiedMissionDay: today, lastMissionDate: now, missionCompletedToday: true, tigerStatus: 'thriving', updatedAt: now });
    // Personal streak is social context, not competitive XP. Do not touch league fields.
    transaction.set(db.doc(`users_public/${uid}`), { uid, streak, lastMissionDate: now, missionCompletedToday: true, tigerStatus: 'thriving' }, { merge: true });
    transaction.create(rewardRef, { missionId, lessonId, rewardXP, completionMode: 'self_reported', createdAt: now });
    transaction.set(missionRef, { userId: uid, missionId, lessonId, title: blueprint.description[locale], description: blueprint.description[locale], instructions: blueprint.steps.map(step => step[locale]), trackId: lessonId.split('-')[1], status: 'completed', completionMode: 'self_reported', lessonXp: blueprint.lessonXP, executionXp: 50, submission, completedAt: now, updatedAt: now });
    transaction.set(db.doc(`submissions/${submissionId}`), { ...submission, createdAt: now, completedAt: now });
    return { status: 'COMPLETED', submissionId, rewardXP, alreadyRewarded: false, completionMode: 'self_reported', completedAt: now.toMillis(), ...rewardSnapshot(current), xp, coins, level, streak };
  });
});
