// Requires the isolated demo-t1ger-web Auth, Firestore and Functions emulators.
// No credentials or production endpoints are accepted.
import assert from 'node:assert/strict';
import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, doc, setDoc, getDoc, getDocs, collection, query, where, updateDoc } from 'firebase/firestore';
import { getFunctions, connectFunctionsEmulator, httpsCallable } from 'firebase/functions';

const app = initializeApp({ projectId: 'demo-t1ger-web', apiKey: 'local-fixture', authDomain: 'demo-t1ger-web.firebaseapp.com' }, `contract-${Date.now()}`);
const auth = getAuth(app); connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
const db = getFirestore(app); connectFirestoreEmulator(db, '127.0.0.1', 8080);
const functions = getFunctions(app); connectFunctionsEmulator(functions, '127.0.0.1', 5001);
try {
  const email = `contract-${Date.now()}@example.invalid`;
  const { user } = await createUserWithEmailAndPassword(auth, email, 'Local-test-only-2026');
  const profile = doc(db, 'users', user.uid);
  await setDoc(profile, { uid: user.uid, email, niche: 'investing', xp: 0, level: 1, streak: 0, coins: 0, onboardingComplete: true });
  const owned = query(collection(db, 'missions'), where('userId', '==', user.uid));
  assert.equal((await getDocs(owned)).size, 0, 'First mission lookup works with owner rules');
  const id = 'field-learn-money-01';
  const mission = doc(db, 'missions', `${user.uid}_${id}`);
  await setDoc(mission, { missionId: id, userId: user.uid, lessonId: 'learn-money-01', status: 'ready', learningScore: 100 });
  const artifact = { lessonId: 'learn-money-01', trackId: 'smart-money', title: 'Fixture rule', summary: 'Keep fictional emergency cash separate.', values: { cash: 1500, years: 5 }, createdAt: Date.now() };
  await updateDoc(profile, { learningArtifacts: [artifact] });
  await assert.rejects(updateDoc(profile, { xp: 99999 }), /permission-denied|PERMISSION_DENIED/);
  await assert.rejects(getDoc(doc(db, 'users', 'another-owner')), /permission-denied|PERMISSION_DENIED/);
  await assert.rejects(updateDoc(mission, { status: 'completed' }), /permission-denied|PERMISSION_DENIED/);
  const complete = httpsCallable(functions, 'completeWebApplyMission');
  await assert.rejects(complete({ missionId: 'field-learn-money-05', lessonId: 'learn-money-05', language: 'en', reflection: 'Fictional risk plan without completing prerequisites.', timeZone: 'America/New_York' }), { code: 'functions/failed-precondition' });
  const payload = { missionId: id, lessonId: 'learn-money-01', language: 'en', reflection: 'I separated fictional emergency cash and long-term goals.', timeZone: 'America/New_York' };
  await complete(payload);
  const first = (await getDoc(profile)).data();
  assert.ok(first.xp > 0, 'Rewards are issued by the server');
  assert.equal(first.streak, 1);
  assert.equal((await getDoc(mission)).data().status, 'completed');
  assert.equal(first.learningArtifacts[0].summary, artifact.summary, 'Cloud tool survives canonical mission replacement');
  await complete(payload);
  const second = (await getDoc(profile)).data();
  assert.equal(second.xp, first.xp, 'Duplicate completion cannot grant extra XP');
  assert.equal(second.streak, first.streak);
  // Gold Lesson V2 keeps the existing lesson/mission identities and reward contract.
  const goldId = 'field-learn-money-02';
  const goldMission = doc(db, 'missions', `${user.uid}_${goldId}`);
  await setDoc(goldMission, { missionId: goldId, userId: user.uid, lessonId: 'learn-money-02', status: 'ready', learningScore: 100 });
  const goldArtifact = { lessonId: 'learn-money-02', trackId: 'smart-money', title: 'My compounding learning rule', summary: 'Fictional $100 monthly, 20 years, 5% assumption. Compare contributions, timing and uncertain rates.', values: { monthly:100, years:20, rate:5, learningRule:'Compare timing, contributions and assumptions.' }, createdAt:Date.now() };
  const evidence = { version:2, firstExposedAt:Date.now(), events:[{id:'local-gold-prediction',name:'prediction_answer',interactionId:'prediction',at:Date.now(),answer:'equal',assessment:'self_reported'}] };
  await updateDoc(profile, { learningArtifacts:[goldArtifact,artifact], learningConcepts:{'investing.compounding-time':evidence} });
  const goldPayload = {...payload,lessonId:'learn-money-02',missionId:goldId,reflection:goldArtifact.summary};
  await complete(goldPayload);
  const goldSaved = (await getDoc(profile)).data();
  assert.equal(goldSaved.xp,second.xp+180,'Gold uses existing 130 lesson + 50 Apply reward');
  assert.equal(goldSaved.streak,second.streak,'Same-day Gold cannot increment the streak twice');
  assert.equal(goldSaved.learningArtifacts[0].lessonId,'learn-money-02');
  assert.deepEqual(goldSaved.learningConcepts['investing.compounding-time'],evidence,'Concept evidence survives canonical Apply completion');
  await complete(goldPayload);
  assert.equal((await getDoc(profile)).data().xp,goldSaved.xp,'Gold retry cannot grant duplicate XP');
  assert.equal((await getDoc(goldMission)).data().status,'completed');
  await assert.rejects(complete({ ...payload, reflection: 'short' }), { code: 'functions/invalid-argument' });
  await assert.rejects(complete({ ...payload, lessonId: 'learn-mindset-01', missionId: 'field-learn-mindset-01' }), { code: 'functions/invalid-argument' });
  await assert.rejects(complete({ ...payload, lessonId: 'learn-psychology-v1-02', missionId: 'field-learn-psychology-v1-02' }), { code: 'functions/failed-precondition' });
  const psychology = { ...payload, lessonId: 'learn-psychology-v1-01', missionId: 'field-learn-psychology-v1-01' };
  await complete(psychology);
  const psychReward = (await getDoc(profile)).data().xp;
  assert.ok(psychReward > second.xp);
  await complete(psychology);
  assert.equal((await getDoc(profile)).data().xp, psychReward);
  console.log('PASS: owner isolation, server-only rewards, prerequisite gate, idempotent completion, Gold artifact/evidence round trip and original XP/streak contract. Local emulators only.');
} finally { await deleteApp(app); }
