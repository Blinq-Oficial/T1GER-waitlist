// Persistence/retry stress test only. Different accounts run concurrently; each retry follows acceptance.
// This does not measure cloud capacity, simultaneous retries of one account or provider availability.
const assert=require('node:assert/strict'),crypto=require('node:crypto'),fs=require('node:fs');
if(!process.env.FIRESTORE_EMULATOR_HOST || process.env.GCLOUD_PROJECT!=='demo-t1ger-web')throw Error('Disposable demo emulator required.');
const {initializeApp}=require('firebase-admin/app');initializeApp({projectId:'demo-t1ger-web'});
const {getFirestore}=require('firebase-admin/firestore');const {completeWebApplyMission}=require('../lib/index.js');
(async()=>{
 const db=getFirestore(),run='load-'+crypto.randomUUID(),count=1000,concurrency=10,times=[];let position=0;
 for(let offset=0;offset<count;offset+=400){const batch=db.batch();for(let n=offset;n<Math.min(count,offset+400);n++)batch.set(db.doc(`users/${run}-${n}`),{onboardingComplete:true,xp:0,coins:0});await batch.commit();}
 const started=Date.now();
 await Promise.all(Array.from({length:concurrency},async()=>{while(position<count){const n=position++,uid=`${run}-${n}`,before=Date.now(),request={auth:{uid,token:{}},data:{missionId:'field-learn-money-01',lessonId:'learn-money-01',reflection:'Disposable stress test: preserve a separate accessible reserve.',timeZone:'UTC'}};
  const replies=[await completeWebApplyMission.run(request),await completeWebApplyMission.run(request)];
  assert.equal(replies.reduce((total,item)=>total+item.rewardXP,0),170);
  assert.equal((await db.doc(`users/${uid}`).get()).data().xp,170);
  assert.equal((await db.collection(`users/${uid}/rewardEvents`).get()).size,1);
  times.push(Date.now()-before);if(times.length%100===0)console.log('Completed synthetic accounts:',times.length);
 }}));
 times.sort((a,b)=>a-b);const result={scope:'local Firestore persistence, 10 concurrent accounts, sequential retry per account; excludes simultaneous same-account retries and cloud/HTTP/AI/email capacity',accounts:count,completionAttempts:count*2,concurrency,duplicateRewards:0,errors:0,elapsedMs:Date.now()-started,p50Ms:times[499],p95Ms:times[949],p99Ms:times[989],at:new Date().toISOString()};
 console.log(JSON.stringify(result));fs.mkdirSync('.codex/tmp',{recursive:true});fs.writeFileSync('.codex/tmp/launch-load-result.json',JSON.stringify(result,null,2));process.exit(0);
})().catch(e=>{console.error({code:e.code,message:e.message});process.exit(1);});
