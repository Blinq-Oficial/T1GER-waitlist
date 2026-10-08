import { createHash, randomBytes, createHmac, timingSafeEqual } from 'node:crypto';
import { getAuth } from 'firebase-admin/auth';
import { FieldPath, FieldValue } from 'firebase-admin/firestore';
import { HttpsError, onCall, onRequest } from 'firebase-functions/v2/https';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { error as logError } from 'firebase-functions/logger';
import { db } from './admin.js';
import { chooseEmail, emailLocalTime, learningEmail, normalizeEmailPreferences, isLearningEmailEvent, learningEmailProduct, type EmailKind } from './emailPolicy.js';

const hash = (value: string) => createHash('sha256').update(value).digest('hex');
const defaults = { enabled:false, reminders:false, weekly:false, milestones:false, language:'en', timeZone:'UTC', hour:18 };
export const emailProgramReady = () => process.env.T1GER_EMAIL_READY === 'true' && Boolean(process.env.T1GER_EMAIL_OPERATOR?.trim() && process.env.T1GER_EMAIL_FROM?.trim() && process.env.T1GER_EMAIL_REPLY_TO?.trim());
const millis = (value: any) => typeof value?.toMillis === 'function' ? value.toMillis() : value?.seconds ? value.seconds * 1000 : typeof value === 'number' ? value : new Date(value || '').getTime() || 0;

export const learningEmailPreferences = onCall({region:'us-central1',maxInstances:2}, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated','Sign in to manage your emails.');
  const ref = db.doc(`emailPreferences/${request.auth.uid}`);
  if (request.data?.action === 'save') {
    let prefs; try { prefs=normalizeEmailPreferences(request.data.preferences); } catch { throw new HttpsError('invalid-argument','Check your email settings and time zone.'); }
    const account=await getAuth().getUser(request.auth.uid);
    if (prefs.enabled && !account.emailVerified) throw new HttpsError('failed-precondition','Verify your email before enabling learning reminders.');
    const token=randomBytes(32).toString('base64url');
    await db.runTransaction(async tx => {
      const saved=await tx.get(ref), current=saved.data();
      // A bounce/complaint cannot be cleared by switching the UI back on.
      if (prefs.enabled && current?.suppressed) throw new HttpsError('failed-precondition','Email delivery is paused. Contact support.');
      tx.set(ref,{...prefs, uid:request.auth!.uid, consentVersion:'learning-email-v1', updatedAt:FieldValue.serverTimestamp(),
        ...(!current?.unsubscribeToken ? { unsubscribeToken:token, createdAt:Date.now() } : {}),
        ...(prefs.enabled && !current?.enabled ? { activatedAt:Date.now() } : {}),
      },{merge:true});
      if (!current?.unsubscribeToken) tx.create(db.doc(`emailTokens/${hash(token)}`),{uid:request.auth!.uid});
    });
  } else if (request.data?.action !== 'get') throw new HttpsError('invalid-argument','Unknown action.');
  const snapshot=await ref.get(), data:Record<string,any>=snapshot.data() || defaults;
  return { preferences:Object.fromEntries(Object.keys(defaults).map(key=>[key,data[key] ?? (defaults as any)[key]])), configured:snapshot.exists, ready:emailProgramReady(), suppressed:data.suppressed === true };
});

async function factsFor(uid:string, profile:any, delivery:any, now:Date) {
  const local=emailLocalTime(now,delivery.timeZone);
  const refs=['money','ai','psychology-v1'].flatMap(track=>[1,2,3,4,5].map(order=>db.doc(`missions/${uid}_field-learn-${track}-0${order}`)));
  const missions=await db.getAll(...refs);
  const web=missions.filter(item=>item.exists).map(item=>item.data()!).filter(item=>item.userId===uid);
  const applied=web.filter(item=>['completed','verified'].includes(item.status));
  const completionDays=applied.map(item=>({time:millis(item.completedAt)})).filter(item=>item.time>0 && item.time<=now.getTime()).map(item=>emailLocalTime(new Date(item.time),delivery.timeZone));
  const cards=Object.values(profile.brainState?.fsrsCards || {}) as any[];
  const lastReview=Math.max(0,...cards.map(card=>millis(card.last_review)));
  const lastActivity=Math.max(millis(profile.lastMissionDate),lastReview,Number(delivery.activatedAt)||0);
  return { due:cards.filter(card=>millis(card.due)>0 && millis(card.due)<=now.getTime()).length,
    pending:web.some(item=>item.status==='ready' && millis(item.createdAt)<now.getTime()-86400000),
    appliedToday:completionDays.some(item=>item.day===local.day), weeklyApply:completionDays.filter(item=>item.week===local.week).length,
    lastActivity, milestone:Math.floor(applied.length/5)*5,
    welcomeSent:delivery.welcomeSent === true, returnSent:delivery.returnActivity === lastActivity };
}

async function dispatch(ref:FirebaseFirestore.DocumentReference) {
  const saved=(await ref.get()).data(); if(!saved) return;
  const prefRef=db.doc(`emailPreferences/${saved.uid}`);
  const [pref,profile,account]=await Promise.all([prefRef.get(),db.doc(`users/${saved.uid}`).get(),getAuth().getUser(saved.uid).catch(()=>null)]);
  const prefs=pref.data();
  if(!prefs || !profile.exists || !account?.emailVerified || !account.email || !prefs.enabled || prefs.suppressed || profile.data()?.onboardingComplete!==true){await ref.set({state:'suppressed'},{merge:true});return;}
  const now=new Date(), facts=await factsFor(saved.uid,profile.data(),prefs,now), desired=chooseEmail(prefs as any,facts,prefs,now);
  if(!desired || desired.kind!==saved.kind || desired.occasion!==saved.occasion){await ref.set({state:'suppressed'},{merge:true});return;}
  const local=emailLocalTime(now,prefs.timeZone), budgetRef=db.doc(`operations/email-${now.toISOString().slice(0,10)}`);
  const claimed=await db.runTransaction(async tx=>{
    const [job,current,budget]=await Promise.all([tx.get(ref),tx.get(prefRef),tx.get(budgetRef)]), data=job.data(), p=current.data();
    if(!data || ['accepted','delivered','suppressed','failed','ambiguous'].includes(data.state) || Number(data.leaseUntil)>Date.now() || !p?.enabled || p.suppressed || Number(p.lockUntil)>Date.now() || p.lastDay===local.day || (p.week===local.week && Number(p.weekCount)>=3))return false;
    const limit=Math.min(10000,Math.max(1,Number(process.env.T1GER_EMAIL_DAILY_LIMIT)||20));
    if(Number(budget.data()?.reserved || 0)>=limit)return false;
    tx.set(ref,{state:'sending',attempts:(Number(data.attempts)||0)+1, firstAttemptAt:data.firstAttemptAt||Date.now(),leaseUntil:Date.now()+120000},{merge:true});
    tx.set(prefRef,{lockUntil:Date.now()+120000},{merge:true});
    tx.set(budgetRef,{reserved:(Number(budget.data()?.reserved)||0)+1},{merge:true}); return true;
  });
  if(!claimed)return;
  // Provider idempotency lasts 24h. Never automatically repeat an ambiguous send after that window.
  const job=(await ref.get()).data()!;
  if(Date.now()-job.firstAttemptAt>23*3600000){await ref.set({state:'ambiguous',leaseUntil:0},{merge:true});await prefRef.set({lockUntil:0},{merge:true});logError('learning_email_ambiguous');return;}
  const unsubscribe=`https://us-central1-t1ger-69d6a.cloudfunctions.net/emailUnsubscribe?t=${encodeURIComponent(prefs.unsubscribeToken)}`;
  const content=learningEmail(saved.kind as EmailKind,prefs.language,saved.kind==='milestone'?facts.milestone:facts.weeklyApply,unsubscribe,process.env.T1GER_EMAIL_OPERATOR!);
  try {
    const latest=(await prefRef.get()).data();
    if(!latest?.enabled || latest.suppressed){await ref.set({state:'suppressed',leaseUntil:0},{merge:true});return;}
    const response=await fetch('https://api.resend.com/emails',{method:'POST',signal:AbortSignal.timeout(15000),headers:{Authorization:`Bearer ${process.env.T1GER_RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`learning-${ref.id}`},body:JSON.stringify({from:process.env.T1GER_EMAIL_FROM,to:[account.email],reply_to:process.env.T1GER_EMAIL_REPLY_TO,...content,tags:[{name:"product",value:learningEmailProduct}],headers:{'List-Unsubscribe':`<${unsubscribe}>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}})});
    if(!response.ok){
      await response.body?.cancel();
      const transient=response.status===429 || response.status>=500;
      await ref.set({state:transient && job.attempts<5?'pending':'failed', leaseUntil:0,nextAttemptAt:Date.now()+Math.min(3600000,60000*2**job.attempts),status:response.status},{merge:true});
      if(!transient || job.attempts>=5)logError('learning_email_failed',{status:response.status});
      return;
    }
    const result=await response.json() as {id?:string}; if(!result.id)throw new Error('missing_id');
    await db.runTransaction(async tx=>{
      const current=await tx.get(prefRef), p=current.data()!;
      tx.set(ref,{state:'accepted',providerId:result.id,acceptedAt:Date.now(),leaseUntil:0},{merge:true});
      tx.set(prefRef,{lastDay:local.day,week:local.week,weekCount:p.week===local.week?(Number(p.weekCount)||0)+1:1,lockUntil:0,
        ...(saved.kind==='welcome'?{welcomeSent:true}:{}),...(saved.kind==='return'?{returnActivity:facts.lastActivity}:{}),...(saved.kind==='milestone'?{lastMilestone:facts.milestone}:{}),
      },{merge:true});
    });
  } catch {
    await ref.set({state:'pending',leaseUntil:0,nextAttemptAt:Date.now()+300000},{merge:true});
    logError('learning_email_transport_failed');
  } finally {await prefRef.set({lockUntil:0},{merge:true});}
}

export const sendLearningEmails=onSchedule({region:'us-central1',schedule:'every 15 minutes',maxInstances:1,timeoutSeconds:540,secrets:['T1GER_RESEND_API_KEY']},async()=>{
  if(!emailProgramReady())return;
  // Bounded pages across invocations; no scan of every account when nobody opts in.
  const cursorRef=db.doc('operations/email-scan'), cursor=(await cursorRef.get()).data()?.cursor;
  let q=db.collection('emailPreferences').where('enabled','==',true).orderBy(FieldPath.documentId()).limit(100);
  if(cursor)q=q.startAfter(cursor);
  const page=await q.get();
  for(const preference of page.docs){
    const data=preference.data(), profile=(await db.doc(`users/${preference.id}`).get()).data();
    if(!profile?.onboardingComplete || data.suppressed)continue;
    const facts=await factsFor(preference.id,profile,data,new Date()), candidate=chooseEmail(data as any,facts,data,new Date());
    if(!candidate)continue;
    const id=hash(`${preference.id}:${candidate.kind}:${candidate.occasion}`), ref=db.doc(`emailOutbox/${id}`);
    try {await ref.create({uid:preference.id,...candidate,state:'pending',createdAt:Date.now(),nextAttemptAt:0});}catch(e:any){if(e.code!==6 && e.code!=='already-exists')throw e;}
    await dispatch(ref);
  }
  await cursorRef.set({cursor:page.size===100?page.docs[page.size-1].id:null});
  const pending=await db.collection('emailOutbox').where('state','==','pending').limit(20).get();
  for(const job of pending.docs)if(Number(job.data().nextAttemptAt)<=Date.now())await dispatch(job.ref);
  // Recover worker crashes, with the same provider idempotency key.
  const abandoned=await db.collection('emailOutbox').where('state','==','sending').limit(20).get();
  for(const job of abandoned.docs)if(Number(job.data().leaseUntil)<=Date.now())await dispatch(job.ref);
});

export const retryWaitlistEmails=onSchedule({region:'us-central1',schedule:'every 15 minutes',maxInstances:1,secrets:['WAITLIST_CRON_SECRET']},async()=>{
  try {
    const response=await fetch('https://t1ger.app/api/waitlist-emails',{method:'POST',headers:{Authorization:`Bearer ${process.env.WAITLIST_CRON_SECRET}`},signal:AbortSignal.timeout(90000)});
    await response.body?.cancel();
    if(!response.ok)logError('waitlist_email_worker_failed',{status:response.status});
  } catch {logError('waitlist_email_worker_failed');}
});

export const emailUnsubscribe=onRequest({region:'us-central1',maxInstances:2},async(req,res)=>{
  res.set('Cache-Control','no-store');res.set('Referrer-Policy','no-referrer');res.set('X-Content-Type-Options','nosniff');
  const token=typeof req.query.t==='string'?req.query.t:'';
  if(!['GET','POST'].includes(req.method)||!/^[A-Za-z0-9_-]{43}$/.test(token)){res.status(400).send('Invalid unsubscribe link.');return;}
  const saved=await db.doc(`emailTokens/${hash(token)}`).get();
  if(!saved.exists){res.status(400).send('Invalid unsubscribe link.');return;}
  if(req.method==='GET'){res.type('html').send('<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>T1GER email preferences</title><body style="font-family:Arial;padding:32px;max-width:520px;margin:auto"><h1>T1GER</h1><p>Stop optional learning emails. Your account and progress remain available.</p><form method="post"><button style="padding:16px">Unsubscribe from learning emails</button></form></body></html>');return;}
  await db.doc(`emailPreferences/${saved.data()!.uid}`).set({enabled:false,unsubscribedAt:Date.now()},{merge:true});
  res.status(200).send('You have unsubscribed from T1GER learning emails.');
});

export function verifyEmailWebhook(raw:Buffer,headers:Record<string,any>,secret:string,now=Date.now()){
  const id=headers['svix-id'], timestamp=headers['svix-timestamp'], signatures=headers['svix-signature'];
  if(typeof id!=='string'||typeof timestamp!=='string'||typeof signatures!=='string'||Math.abs(now/1000-Number(timestamp))>300||!/^\d+$/.test(timestamp)||!secret.startsWith('whsec_'))return false;
  const expected=createHmac('sha256',Buffer.from(secret.slice(6),'base64')).update(`${id}.${timestamp}.`).update(raw).digest();
  return signatures.split(' ').some(value=>{const [version,encoded]=value.split(','); const candidate=Buffer.from(encoded||'','base64');return version==='v1'&&candidate.length===expected.length&&timingSafeEqual(candidate,expected);});
}
export const learningEmailWebhook=onRequest({region:'us-central1',maxInstances:2,secrets:['T1GER_RESEND_WEBHOOK_SECRET']},async(req,res)=>{
  if(req.method!=='POST'||req.rawBody.length>100000||!verifyEmailWebhook(req.rawBody,req.headers,process.env.T1GER_RESEND_WEBHOOK_SECRET||'')){res.status(400).send('Invalid webhook.');return;}
  const event=req.body;
  if(!['email.delivered','email.bounced','email.complained'].includes(event?.type)){res.sendStatus(200);return;}
  // Shared Resend accounts can emit events for other products. Never persist
  // those events or make the provider retry them against T1GER's outbox.
  if(!isLearningEmailEvent(event.data)){res.sendStatus(200);return;}
  const id=event.data?.email_id;
  if(typeof id!=='string'||id.length>100){res.sendStatus(400);return;}
  const jobs=await db.collection('emailOutbox').where('providerId','==',id).limit(1).get();
  if(jobs.empty){res.sendStatus(503);return;}
  const ref=jobs.docs[0].ref, dedup=db.doc(`emailWebhookEvents/${hash(String(req.headers['svix-id']))}`);
  await db.runTransaction(async tx=>{
    const [seen,job]=await Promise.all([tx.get(dedup),tx.get(ref)]);if(seen.exists)return;
    const suppress=event.type==='email.complained'||event.type==='email.bounced';
    tx.create(dedup,{type:event.type,createdAt:Date.now()});
    if(suppress||!['email.bounced','email.complained'].includes(job.data()?.delivery))tx.set(ref,{delivery:event.type,deliveryAt:Date.now(),...(event.type==='email.delivered'?{state:'delivered'}:{})},{merge:true});
    if(suppress)tx.set(db.doc(`emailPreferences/${job.data()!.uid}`),{enabled:false,suppressed:true,suppressionReason:event.type},{merge:true});
  });res.sendStatus(200);
});
