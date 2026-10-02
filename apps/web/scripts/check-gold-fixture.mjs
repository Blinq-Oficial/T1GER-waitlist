// Read-only verification of the disposable UI learner. Never production.
import assert from 'node:assert/strict';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,signInWithEmailAndPassword} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,doc,getDoc} from 'firebase/firestore';
const app=initializeApp({projectId:'demo-t1ger-web',apiKey:'local-fixture',authDomain:'demo-t1ger-web.firebaseapp.com'});
const auth=getAuth(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
const db=getFirestore(app);connectFirestoreEmulator(db,'127.0.0.1',8080);
try {
  const {user}=await signInWithEmailAndPassword(auth,'gold-v2-local@example.invalid','Local-test-only-2026');
  const profile=(await getDoc(doc(db,'users',user.uid))).data();
  const mission=(await getDoc(doc(db,'missions',`${user.uid}_field-learn-money-02`))).data();
  const evidence=profile.learningConcepts['investing.compounding-time'];
  const card=profile.brainState.fsrsCards['learn-money-02'];
  assert.equal(mission.status,'completed');
  const history=profile.brainState.missionHistory.find(item=>item.missionId==='learn-money-02');
  assert.equal(history.score,75);
  assert.equal(profile.xp,350); // prerequisite 170 + Gold 180, never duplicate.
  assert.equal(profile.streak,1);
  assert.ok(profile.learningArtifacts.some(item=>item.lessonId==='learn-money-02'));
  assert.equal(evidence.draft.finished,true);
  assert.equal(evidence.draft.inputs.applyRate,0);
  assert.equal(evidence.draft.inputs.cadence,'quarterly');
  assert.ok(evidence.events.some(event=>event.name==='misconception_detected' && event.misconceptionId==='linear-growth'));
  assert.ok(evidence.events.some(event=>event.name==='transfer_result' && event.correct));
  assert.ok(evidence.events.some(event=>event.name==='retrieval_result'));
  assert.ok(card.reps>=2);
  console.log(JSON.stringify({result:'PASS',xp:profile.xp,streak:profile.streak,practiceScore:history.score,events:evidence.events.length,retrievals:evidence.events.filter(event=>event.name==='retrieval_result').map(event=>({variant:event.interactionId,correct:event.correct,rating:event.rating})),fsrsReps:card.reps,due:card.due}));
} finally { await deleteApp(app); }
