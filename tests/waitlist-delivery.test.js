import test from 'node:test';
import assert from 'node:assert/strict';
import { handleWaitlistSignup, deliverWaitlistEmail } from '../api/_waitlist-core.js';
import worker from '../api/waitlist-emails.js';
const response=()=>({headers:{},statusCode:0,setHeader(k,v){this.headers[k]=v;},status(v){this.statusCode=v;return this;},json(v){this.body=v;return this;}});
async function isolated(work){
 const keys=['SUPABASE_URL','SUPABASE_PROJECT_REF','SUPABASE_SECRET_KEY','RESEND_API_KEY','T1GER_WAITLIST_V2','WAITLIST_CRON_SECRET'],saved=Object.fromEntries(keys.map(k=>[k,process.env[k]])),fetch=global.fetch;
 Object.assign(process.env,{SUPABASE_URL:'https://queue-test.supabase.co',SUPABASE_PROJECT_REF:'queue-test',SUPABASE_SECRET_KEY:'sb_secret_test',RESEND_API_KEY:'test-only',T1GER_WAITLIST_V2:'true',WAITLIST_CRON_SECRET:'test-worker-only'});
 try{await work();}finally{global.fetch=fetch;for(const k of keys)if(saved[k]===undefined)delete process.env[k];else process.env[k]=saved[k];}
}
test('provider failure is recorded for recovery while signup remains private and successful',()=>isolated(async()=>{
 const calls=[];
 global.fetch=async(url,options={})=>{
   calls.push(url);assert(options.signal,'Every external call needs a timeout');
   if(url.endsWith('/rpc/consume_waitlist_limit')){assert.match(JSON.parse(options.body).p_key,/^[a-f0-9]{64}$/);return Response.json(true);}
   if(url.includes('waitlist?email='))return Response.json([]);
   if(url.endsWith('/waitlist'))return Response.json([{id:123,email:'queue@example.invalid'}]);
   if(url.includes('waitlist?select='))return new Response('[]',{status:206,headers:{'content-range':'0-0/123'}});
   if(url.endsWith('/rpc/claim_waitlist_email'))return Response.json([{id:9,email:'queue@example.invalid',position:123,ref_code:'T1GER-123',created_at:new Date().toISOString()}]);
   if(url==='https://api.resend.com/emails'){assert.equal(options.headers['Idempotency-Key'],'t1ger-waitlist-queue%40example.invalid');return Response.json({error:'overloaded'},{status:503});}
   if(url.endsWith('/rpc/finish_waitlist_email')){assert.deepEqual(JSON.parse(options.body),{p_id:9,p_accepted:false});return Response.json(null);}
   throw Error('Unexpected call');
 };
 const res=response();await handleWaitlistSignup({method:'POST',body:{email:'queue@example.invalid'},headers:{'x-forwarded-for':'synthetic-queue-test'}},res);
 assert.equal(res.statusCode,200);assert.deepEqual(Object.keys(res.body).sort(),['message','success']);assert.equal(calls.length,7);
}));
test('accepted retry uses the same durable job key and records acceptance',()=>isolated(async()=>{
 global.fetch=async(url,options)=>{
  if(url.endsWith('/rpc/claim_waitlist_email'))return Response.json([{id:9,email:'queue@example.invalid',position:123,ref_code:'T1GER-123',created_at:new Date().toISOString()}]);
  if(url==='https://api.resend.com/emails'){assert.equal(options.headers['Idempotency-Key'],'t1ger-waitlist-queue%40example.invalid');return Response.json({id:'provider-test'});}
  assert.deepEqual(JSON.parse(options.body),{p_id:9,p_accepted:true});return Response.json(null);
 };
 assert.equal(await deliverWaitlistEmail(),true);
}));
test('worker rejects anonymous and invalid credentials without accessing the queue',()=>isolated(async()=>{
 global.fetch=async()=>{throw Error('Unauthorized worker used network');};
 for(const authorization of [undefined,'Bearer wrong']){const res=response();await worker({method:'POST',headers:{authorization}},res);assert.equal(res.statusCode,401);}
}));
test('durable limiter failure closes signup before querying an address',()=>isolated(async()=>{
 global.fetch=async url=>{assert(url.endsWith('/rpc/consume_waitlist_limit'));return Response.json(null,{status:503});};
 const res=response();await handleWaitlistSignup({method:'POST',body:{email:'queue@example.invalid'},headers:{'x-forwarded-for':'limiter-unavailable-test'}},res);assert.equal(res.statusCode,503);
}));

test('expired legacy deduplication window is held without sending',()=>isolated(async()=>{
 const calls=[];
 global.fetch=async(url,options)=>{
  calls.push(url);
  if(url.endsWith('/rpc/claim_waitlist_email'))return Response.json([{id:10,created_at:new Date(Date.now()-24*3600000).toISOString()}]);
  assert(url.includes('waitlist_email_outbox?id=eq.10&status=eq.sending'));
  assert.deepEqual(JSON.parse(options.body),{status:'ambiguous',lease_until:null});return new Response(null,{status:204});
 };
 assert.equal(await deliverWaitlistEmail(),false);assert.equal(calls.length,2);
}));
test('legacy payload conflict is held permanently instead of changing the send key',()=>isolated(async()=>{
 global.fetch=async(url,options)=>{
  if(url.endsWith('/rpc/claim_waitlist_email'))return Response.json([{id:11,email:'queue@example.invalid',position:123,ref_code:'T1GER-123',created_at:new Date().toISOString()}]);
  if(url==='https://api.resend.com/emails')return Response.json({name:'invalid_idempotent_request'},{status:409});
  assert(url.includes('waitlist_email_outbox?id=eq.11&status=eq.sending'));
  assert.deepEqual(JSON.parse(options.body),{status:'ambiguous',lease_until:null});return new Response(null,{status:204});
 };
 assert.equal(await deliverWaitlistEmail(),false);
}));
test('concurrent provider request remains retryable with the existing key',()=>isolated(async()=>{
 global.fetch=async(url,options)=>{
  if(url.endsWith('/rpc/claim_waitlist_email'))return Response.json([{id:12,email:'queue@example.invalid',position:123,ref_code:'T1GER-123',created_at:new Date().toISOString()}]);
  if(url==='https://api.resend.com/emails')return Response.json({name:'concurrent_idempotent_requests'},{status:409});
  assert(url.endsWith('/rpc/finish_waitlist_email'));
  assert.deepEqual(JSON.parse(options.body),{p_id:12,p_accepted:false});return Response.json(null);
 };
 assert.equal(await deliverWaitlistEmail(),false);
}));
