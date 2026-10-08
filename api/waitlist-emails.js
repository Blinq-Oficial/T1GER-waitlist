import { timingSafeEqual } from 'node:crypto';
import { deliverWaitlistEmail } from './_waitlist-core.js';

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  const expected=process.env.WAITLIST_CRON_SECRET, supplied=req.headers?.authorization;
  const a=Buffer.from(typeof supplied==='string'?supplied:''), b=Buffer.from(`Bearer ${expected || ''}`);
  if(!expected || a.length!==b.length || !timingSafeEqual(a,b)) return res.status(401).json({error:'Unauthorized'});
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'});
  if(process.env.T1GER_WAITLIST_V2!=='true')return res.status(503).json({error:'Delivery queue not enabled'});
  let accepted=0;
  try {for(let i=0;i<10;i++){if(!await deliverWaitlistEmail())break;accepted++;}return res.status(200).json({accepted});}
  catch {console.error('waitlist_email_worker_failed');return res.status(503).json({error:'Delivery worker unavailable'});}
}
