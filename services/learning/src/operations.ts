import { randomUUID } from 'node:crypto';
import { FieldValue } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { error as logError, info } from 'firebase-functions/logger';
import { db } from './admin.js';

export const reportWebIssue=onCall({region:'us-central1',maxInstances:2},async request=>{
  if(!request.auth)throw new HttpsError('unauthenticated','Sign in first.');
  const feature=request.data?.feature,code=request.data?.code;
  if(!['render','profile_load','missions_load','apply_save','review_save','mentor'].includes(feature)||!['failed','unavailable','permission-denied','resource-exhausted'].includes(code))throw new HttpsError('invalid-argument','Unknown diagnostic.');
  const day=new Date().toISOString().slice(0,10), ref=db.doc(`users/${request.auth.uid}/serverUsage/diagnostics-${day}`);
  const accepted=await db.runTransaction(async tx=>{const saved=await tx.get(ref),count=Number(saved.data()?.count)||0;if(count>=10)return false;tx.set(ref,{count:count+1,updatedAt:FieldValue.serverTimestamp()});return true;});
  if(accepted)logError('web_operational_failure',{feature,code});
  return {accepted};
});

export const createSupportRequest=onCall({region:'us-central1',maxInstances:2},async request=>{
  if(!request.auth)throw new HttpsError('unauthenticated','Sign in first.');
  const category=request.data?.category, message=typeof request.data?.message==='string'?request.data.message.trim():'';
  const id=request.data?.requestId;
  if(!['support','privacy_export','privacy_delete','content_correction'].includes(category)||message.length<10||message.length>1500||typeof id!=='string'||!/^[a-f0-9-]{36}$/.test(id))throw new HttpsError('invalid-argument','Use 10–1500 characters.');
  const uid=request.auth.uid,ref=db.doc(`supportRequests/${uid}_${id}`),quota=db.doc(`users/${uid}/serverUsage/support-${new Date().toISOString().slice(0,10)}`);
  const result=await db.runTransaction(async tx=>{
    const [saved,usage]=await Promise.all([tx.get(ref),tx.get(quota)]);
    if(saved.exists)return {ticket:saved.data()!.ticket};
    const count=Number(usage.data()?.count)||0;if(count>=3)throw new HttpsError('resource-exhausted','Too many requests today. Contact support by email.');
    const ticket=`T1-${randomUUID().slice(0,8).toUpperCase()}`;
    tx.create(ref,{uid,category,message,ticket,status:'open',createdAt:Date.now()});tx.set(quota,{count:count+1});return {ticket};
  });
  info('support_request_created',{category}); return result;
});

// Only an explicit server-issued operator claim can see private support/moderation queues.
export const t1gerOperations=onCall({region:'us-central1',maxInstances:1},async request=>{
  if(request.auth?.token.t1gerOperator!==true)throw new HttpsError('permission-denied','Operator access required.');
  if(request.data?.action==='resolve'){
    const collection=request.data?.collection,id=request.data?.id;
    if(!['supportRequests','reports'].includes(collection)||typeof id!=='string'||id.includes('/')||id.length>200)throw new HttpsError('invalid-argument','Invalid case.');
    await db.doc(`${collection}/${id}`).update({status:'resolved',resolvedAt:Date.now(),resolvedBy:request.auth.uid});
    return {ok:true};
  }
  if(request.data?.action!=='list')throw new HttpsError('invalid-argument','Unknown action.');
  async function page(collection:string,cursor:unknown){
    let query=db.collection(collection).orderBy('createdAt','desc').limit(50);
    if(cursor){
      if(typeof cursor!=='string'||cursor.includes('/')||cursor.length>200)throw new HttpsError('invalid-argument','Invalid cursor.');
      const last=await db.doc(`${collection}/${cursor}`).get();
      if(!last.exists)throw new HttpsError('invalid-argument','Refresh the queue.');
      query=query.startAfter(last);
    }
    return query.get();
  }
  const [support,reports]=await Promise.all([page('supportRequests',request.data?.supportCursor),page('reports',request.data?.reportsCursor)]);
  const serialize=(snapshot:FirebaseFirestore.QuerySnapshot)=>snapshot.docs.map(item=>({id:item.id,...item.data()}));
  const day=new Date().toISOString().slice(0,10);
  const [mentor,email]=await Promise.all([db.doc(`operations/mentor-${day}`).get(),db.doc(`operations/email-${day}`).get()]);
  return {support:serialize(support),reports:serialize(reports),nextSupport:support.size===50?support.docs[49].id:null,nextReports:reports.size===50?reports.docs[49].id:null,mentor:mentor.data()||{},email:email.data()||{}};
});
