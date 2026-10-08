import { httpsCallable } from 'firebase/functions';
import { auth, functions } from './firebase';

const sent = new Set<string>();
// Fixed identifiers only. Never send error messages, stack traces, URLs, answers or tokens.
export function reportOperationalIssue(feature:'render'|'profile_load'|'missions_load'|'apply_save'|'review_save'|'mentor',cause?:unknown) {
  if(!functions || !auth?.currentUser || import.meta.env.DEV)return;
  const raw=typeof cause==='object' && cause && 'code' in cause ? String(cause.code).split('/').pop() : '';
  const code=['unavailable','permission-denied','resource-exhausted'].includes(raw || '') ? raw : 'failed';
  const key=`${feature}:${code}`;if(sent.has(key))return;sent.add(key);
  void httpsCallable(functions,'reportWebIssue')({feature,code}).catch(()=>{});
}
