import { Timestamp, FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { db } from './admin.js';
import { purchaseCosmetic, equipCosmetic } from './cosmeticPolicy.js';
import { askOpenRouterMentor, mentorConsentVersion, requireMentorAccess } from './openRouterMentor.js';
import { acquireMentor } from './mentorAdmission.js';
import { error as logError } from 'firebase-functions/logger';

export const updateWebCosmetic = onCall({ region:'us-central1', maxInstances:2 }, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated','Sign in first.');
  const id = String(request.data?.id || '');
  const action = request.data?.action;
  if (!['purchase','equip'].includes(action)) throw new HttpsError('invalid-argument','Unknown action.');
  return db.runTransaction(async transaction => {
    const ref=db.doc(`users/${request.auth!.uid}`), snapshot=await transaction.get(ref);
    const current=snapshot.data();
    if (!current || current.onboardingComplete!==true) throw new HttpsError('failed-precondition','Finish onboarding first.');
    const owned=Array.isArray(current.unlockedAccessories)?current.unlockedAccessories:[];
    try {
      if (action==='purchase') {
        const result=purchaseCosmetic(Number(current.coins)||0,owned,id);
        if (!result.alreadyOwned) transaction.update(ref,{coins:result.coins,unlockedAccessories:result.unlockedAccessories,updatedAt:FieldValue.serverTimestamp()});
        return result;
      }
      const equippedAccessories=equipCosmetic(owned,Array.isArray(current.equippedAccessories)?current.equippedAccessories:[],id);
      transaction.update(ref,{equippedAccessories,updatedAt:FieldValue.serverTimestamp()});
      return { equippedAccessories };
    } catch (error) { throw new HttpsError('failed-precondition',error instanceof Error?error.message:'Cosmetic unavailable.'); }
  });
});
async function consumeDailyQuota(uid: string, feature: string, maximum: number) {
  const day = new Date().toISOString().slice(0, 10);
  const reference = db.doc(`users/${uid}/serverUsage/${feature}-${day}`);
  await db.runTransaction(async transaction => {
    const snapshot = await transaction.get(reference);
    const count = Number(snapshot.data()?.count) || 0;
    if (count >= maximum) throw new HttpsError('resource-exhausted', 'Daily limit reached. Try again tomorrow.');
    transaction.set(reference, { count: count + 1, updatedAt: FieldValue.serverTimestamp(),
      ...(feature === 'mentor' ? { adultConfirmed: true, providerConsentVersion: mentorConsentVersion } : {}),
    });
  });
}


export const askT1gerMentor = onCall({ region: 'us-central1', secrets: ['OPENROUTER_API_KEY'], timeoutSeconds: 60, maxInstances: 2 }, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in to talk with your mentor.');
  requireMentorAccess(request.data);
  const message = String(request.data?.message || '').trim();
  if (!message || message.length > 3000) throw new HttpsError('invalid-argument', 'Use 1–3000 characters.');
  const profile = (await db.doc(`users/${request.auth.uid}`).get()).data();
  const release = await acquireMentor(request.auth.uid, profile?.isPro === true ? 50 : 10, mentorConsentVersion);
  let failed = true;
  try {
    const reply = await askOpenRouterMentor(process.env.OPENROUTER_API_KEY || '', message, request.data?.history, request.data?.language === 'es' ? 'es' : 'en');
    failed = false;
    return reply;
  } finally {
    await release(failed).catch(() => logError('mentor_lease_release_failed'));
  }
});


export const interactWithSquadActivity = onCall({ region: 'us-central1', maxInstances: 2 }, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in first.');
  const uid = request.auth.uid;
  const circleId = String(request.data?.circleId || '');
  const activityId = String(request.data?.activityId || '');
  if (!circleId || !activityId || circleId.includes('/') || activityId.includes('/')) throw new HttpsError('invalid-argument', 'Invalid activity.');
  const circle = await db.doc(`circles/${circleId}`).get();
  if (!circle.data()?.members?.includes(uid)) throw new HttpsError('permission-denied', 'Join this squad first.');
  await consumeDailyQuota(uid, 'social', 200);
  const activityRef = db.doc(`circles/${circleId}/activities/${activityId}`);
  if (request.data?.action === 'comment') {
    const body = String(request.data?.body || '').trim();
    if (!body || body.length > 280) throw new HttpsError('invalid-argument', 'Comments must contain 1–280 characters.');
    const profile = await db.doc(`users_public/${uid}`).get();
    await db.runTransaction(async transaction => {
      if (!(await transaction.get(activityRef)).exists) throw new HttpsError('not-found', 'Activity removed.');
      transaction.create(activityRef.collection('comments').doc(), { userId: uid, userName: profile.data()?.displayName || 'T1GER', body, createdAt: Timestamp.now() });
      transaction.update(activityRef, { commentCount: FieldValue.increment(1) });
    });
  } else {
    const type = String(request.data?.type || '');
    const add = request.data?.add;
    if (!['fire', 'tiger', 'respect'].includes(type) || typeof add !== 'boolean') throw new HttpsError('invalid-argument', 'Invalid reaction.');
    const reactionRef = activityRef.collection('reactions').doc(`${uid}_${type}`);
    await db.runTransaction(async transaction => {
      const [activity, existing] = await Promise.all([transaction.get(activityRef), transaction.get(reactionRef)]);
      if (!activity.exists) throw new HttpsError('not-found', 'Activity removed.');
      if (add === existing.exists) return;
      const data = activity.data()!;
      const counts = { fire: 0, tiger: 0, respect: 0, ...data.reactionCounts };
      counts[type] = Math.max(0, Number(counts[type]) + (add ? 1 : -1));
      const mine = new Set<string>(data.reactedBy?.[uid] || []);
      add ? mine.add(type) : mine.delete(type);
      if (add) transaction.create(reactionRef, { userId: uid, type, createdAt: Timestamp.now() });
      else transaction.delete(reactionRef);
      transaction.update(activityRef, { reactionCounts: counts, [`reactedBy.${uid}`]: [...mine] });
    });
  }
  return { ok: true };
});
