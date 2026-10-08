import { useEffect, useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { sendEmailVerification } from 'firebase/auth';
import { auth, functions } from './firebase';

interface Preferences { enabled:boolean; reminders:boolean; weekly:boolean; milestones:boolean; language:'en'|'es'; timeZone:string; hour:number }
const initial:Preferences={enabled:false,reminders:false,weekly:false,milestones:false,language:'en',timeZone:Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',hour:18};
export default function EmailSettings({preview=false}:{preview?:boolean}) {
  const [preferences,setPreferences]=useState(initial),[ready,setReady]=useState(false),[loading,setLoading]=useState(!preview),[busy,setBusy]=useState(false),[status,setStatus]=useState(''),[error,setError]=useState('');
  useEffect(()=>{
    if(preview || !functions)return;
    let active=true;
    httpsCallable<{action:string},{preferences:Preferences;ready:boolean;configured:boolean}>(functions,'learningEmailPreferences')({action:'get'}).then(result=>{if(active){setPreferences(result.data.configured?result.data.preferences:{...result.data.preferences,timeZone:initial.timeZone});setReady(result.data.ready);}}).catch(()=>{if(active)setError('Email settings could not load. Try again later.');}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[preview]);
  const verified=preview || auth?.currentUser?.emailVerified;
  return <section className="settings-section email-settings ph-no-capture"><Mail size={24}/><h2>Emails that fit your rhythm.</h2><p>{ready?'A useful nudge, up to three times a week. You can stop at any time.':'Choose your preferences now. Learning emails will start after the delivery service is ready.'}</p>
    <form onSubmit={async event=>{event.preventDefault();setBusy(true);setError('');setStatus('');try {if(!preview && functions){await auth?.currentUser?.reload();await auth?.currentUser?.getIdToken(true);await httpsCallable(functions,'learningEmailPreferences')({action:'save',preferences});}setStatus(preview?'Preview only. No email is sent.':ready?'Email preferences saved.':'Preferences saved. Delivery is not active yet.');}catch{setError('Could not save. If you enabled emails, confirm your email address first, then retry.');}finally{setBusy(false);}}}>
      <fieldset disabled={loading || busy}><legend className="sr-only">Learning email preferences</legend>
        <label className="preference-toggle"><span>Enable learning emails</span><input type="checkbox" checked={preferences.enabled} onChange={e=>setPreferences({...preferences,enabled:e.target.checked})}/></label>
        {[['reminders','Practice and due reviews'],['weekly','Weekly progress'],['milestones','Apply milestones']].map(([key,label])=><label className="preference-toggle" key={key}><span>{label}</span><input type="checkbox" disabled={!preferences.enabled} checked={preferences[key as 'reminders'|'weekly'|'milestones']} onChange={e=>setPreferences({...preferences,[key]:e.target.checked})}/></label>)}
        <label htmlFor="email-language">Email language</label><select id="email-language" value={preferences.language} onChange={e=>setPreferences({...preferences,language:e.target.value as 'en'|'es'})}><option value="en">English</option><option value="es">Español</option></select>
        <label htmlFor="email-hour">Preferred local time</label><select id="email-hour" value={preferences.hour} onChange={e=>setPreferences({...preferences,hour:Number(e.target.value)})}>{Array.from({length:13},(_,i)=>i+8).map(hour=><option key={hour} value={hour}>{String(hour).padStart(2,'0')}:00</option>)}</select>
        <label htmlFor="email-zone">Time zone</label><input id="email-zone" value={preferences.timeZone} maxLength={80} onChange={e=>setPreferences({...preferences,timeZone:e.target.value})}/>
        <button className="button primary" disabled={busy || loading}>{busy?'Saving…':'Save email preferences'} <Check size={18}/></button>
      </fieldset>
    </form>
    {!verified && <div className="email-verification"><p>Confirm your address to enable optional emails. Learning remains available.</p><button className="button subtle" disabled={busy} onClick={async()=>{if(!auth?.currentUser)return;setBusy(true);setError('');try{await sendEmailVerification(auth.currentUser,{url:'https://t1ger.app/app/settings'});setStatus('Confirmation email requested. Check your inbox, confirm, then save your preferences.');}catch{setError('Could not request confirmation. Wait a moment and retry.');}finally{setBusy(false);}}}>Send confirmation email</button></div>}
    {status && <p role="status">{status}</p>}{error && <p className="error" role="alert">{error}</p>}
  </section>;
}
