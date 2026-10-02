import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { longestDailyRun } from './rewardPolicy.js';
import { db } from './admin.js';
export const acceptDirectChallenge = onCall({ region: 'us-central1' }, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Sign in to accept a challenge.');
  const challengeId = String(request.data?.challengeId || '');
  if (!challengeId || challengeId.includes('/')) throw new HttpsError('invalid-argument', 'A challenge ID is required.');

  return db.runTransaction(async transaction => {
    const challengeRef = db.doc(`challenges/${challengeId}`);
    const challengeSnapshot = await transaction.get(challengeRef);
    if (!challengeSnapshot.exists) throw new HttpsError('not-found', 'Challenge not found.');
    const challenge = challengeSnapshot.data()!;
    if (challenge.receiverId !== request.auth!.uid) throw new HttpsError('permission-denied', 'Only the challenged player can accept.');
    if (challenge.status !== 'pending') throw new HttpsError('failed-precondition', 'Challenge is no longer pending.');
    if (!Number.isInteger(challenge.stakeCoins) || challenge.stakeCoins < 0 || challenge.stakeCoins > 1000
      || ![3, 7, 14].includes(challenge.durationDays) || !['missions', 'streak'].includes(challenge.metric)
      || challenge.senderScore !== 0 || challenge.receiverScore !== 0
      || challenge.senderId === challenge.receiverId
      || challenge.participantIds?.length !== 2
      || !challenge.participantIds.includes(challenge.senderId) || !challenge.participantIds.includes(challenge.receiverId)) {
      throw new HttpsError('failed-precondition', 'Challenge terms are invalid.');
    }
    const friendRef = db.doc(`friendships/${[challenge.senderId, challenge.receiverId].sort().join('_')}`);
    if ((await transaction.get(friendRef)).data()?.status !== 'accepted') throw new HttpsError('permission-denied', 'Only accepted friends can compete.');

    const senderRef = db.doc(`users/${challenge.senderId}`);
    const receiverRef = db.doc(`users/${challenge.receiverId}`);
    const [senderSnapshot, receiverSnapshot] = await Promise.all([transaction.get(senderRef), transaction.get(receiverRef)]);
    const stake = Math.max(0, Number(challenge.stakeCoins) || 0);
    const senderCoins = Math.max(0, Number(senderSnapshot.data()?.coins) || 0);
    const receiverCoins = Math.max(0, Number(receiverSnapshot.data()?.coins) || 0);
    if (senderCoins < stake || receiverCoins < stake) throw new HttpsError('failed-precondition', 'Both players need enough coins.');

    const startsAt = Timestamp.now();
    const endsAt = Timestamp.fromMillis(startsAt.toMillis() + Math.max(1, Number(challenge.durationDays) || 7) * 86_400_000);
    transaction.update(senderRef, { coins: senderCoins - stake });
    transaction.update(receiverRef, { coins: receiverCoins - stake });
    transaction.update(challengeRef, { status: 'active', startsAt, endsAt, escrowCoins: stake * 2, acceptedAt: startsAt, updatedAt: startsAt });
    return { status: 'active', startsAt: startsAt.toMillis(), endsAt: endsAt.toMillis() };
  });
});

export const countVerifiedChallengeMission = onDocumentCreated({
  document: 'submissions/{submissionId}',
  region: 'us-central1',
  retry: true,
}, async event => {
  const activity = event.data?.data();
  if (!activity?.verified || activity.verificationTier !== 'ai_reviewed_artifact' || !activity.userId || !activity.missionId) return;
  const verifiedAt = activity.verifiedAt?.toMillis?.();
  if (!Number.isFinite(verifiedAt)) return;
  const activeChallenges = await db.collection('challenges').where('participantIds', 'array-contains', activity.userId).where('status', '==', 'active').limit(100).get();
  await Promise.all(activeChallenges.docs.filter(item => item.data().status === 'active').map(async challengeSnapshot => {
    const challengeRef = challengeSnapshot.ref;
    const eventRef = challengeRef.collection('scoreEvents').doc(`${activity.userId}_${activity.missionId}`);
    await db.runTransaction(async transaction => {
      const [freshChallenge, scoreEvent] = await Promise.all([transaction.get(challengeRef), transaction.get(eventRef)]);
      if (!freshChallenge.exists || freshChallenge.data()?.status !== 'active' || scoreEvent.exists) return;
      const challenge = freshChallenge.data()!;
      if (verifiedAt < challenge.startsAt?.toMillis?.() || verifiedAt >= challenge.endsAt?.toMillis?.()) return;
      const side = activity.userId === challenge.senderId ? 'sender' : 'receiver';
      const scoreField = `${side}Score`;
      const day = new Date(verifiedAt).toISOString().slice(0, 10);
      const scores = await transaction.get(challengeRef.collection('scoreEvents').where('userId', '==', activity.userId));
      const days = [...scores.docs.map(score => score.data().day), day];
      transaction.create(eventRef, { userId: activity.userId, missionId: activity.missionId, day, createdAt: FieldValue.serverTimestamp() });
      transaction.update(challengeRef, {
        [scoreField]: challenge.metric === 'streak' ? longestDailyRun(days) : FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });
    });
  }));
});

export const settleExpiredChallenges = onSchedule({ schedule: 'every 60 minutes', region: 'us-central1', timeZone: 'UTC' }, async () => {
  const expired = await db.collection('challenges').where('status', '==', 'active').where('endsAt', '<=', Timestamp.now()).limit(100).get();
  await Promise.all(expired.docs.map(challengeSnapshot => db.runTransaction(async transaction => {
    const fresh = await transaction.get(challengeSnapshot.ref);
    if (!fresh.exists || fresh.data()?.status !== 'active') return;
    const challenge = fresh.data()!;
    // Recompute at settlement so delayed/retried triggers cannot change who gets paid.
    const scoreFor = async (uid: string) => {
      const submissions = await transaction.get(db.collection('submissions').where('userId', '==', uid)
        .where('verifiedAt', '>=', challenge.startsAt).where('verifiedAt', '<', challenge.endsAt));
      const verified = submissions.docs.filter(item => item.data().verified === true && item.data().verificationTier === 'ai_reviewed_artifact');
      return challenge.metric === 'streak'
        ? longestDailyRun(verified.map(item => item.data().verifiedAt.toDate().toISOString().slice(0, 10)))
        : new Set(verified.map(item => item.data().missionId)).size;
    };
    const senderScore = await scoreFor(challenge.senderId);
    const receiverScore = await scoreFor(challenge.receiverId);
    const escrow = Math.max(0, Number(challenge.escrowCoins) || 0);
    if (senderScore === receiverScore) {
      const refund = Math.floor(escrow / 2);
      transaction.update(db.doc(`users/${challenge.senderId}`), { coins: FieldValue.increment(refund) });
      transaction.update(db.doc(`users/${challenge.receiverId}`), { coins: FieldValue.increment(escrow - refund) });
    } else {
      const winnerId = senderScore > receiverScore ? challenge.senderId : challenge.receiverId;
      transaction.update(db.doc(`users/${winnerId}`), { coins: FieldValue.increment(escrow) });
    }
    transaction.update(challengeSnapshot.ref, { status: 'completed', senderScore, receiverScore, winnerId: senderScore === receiverScore ? null : (senderScore > receiverScore ? challenge.senderId : challenge.receiverId), settledAt: FieldValue.serverTimestamp(), updatedAt: FieldValue.serverTimestamp() });
  })));
});

