import { useState } from 'react';
import { Coins, Crown, Glasses, Heart, Shirt, Sparkles } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { brainOf, explainError, type Mission, type Profile } from './state';
import { functions } from './firebase';
import { Tiger } from './Visual';
import { DEFAULT_PET_STATE } from './product/petEngine';
import { learningRhythm } from './product/learningRhythm';

const items = [
  {id:'cap',name:'Hacker cap',cost:500,icon:Shirt,detail:'A little curiosity. A lot of style.'},
  {id:'cyber_glasses',name:'Cyber glasses',cost:1500,icon:Glasses,detail:'A fresh perspective.'},
  {id:'founder_tie',name:'Founder tie',cost:800,icon:Shirt,detail:'Ready for your next big idea.'},
  {id:'gold_chain',name:'Gold chain',cost:2500,icon:Sparkles,detail:'A golden little milestone.'},
  {id:'crown',name:'Titan crown',cost:5000,icon:Crown,detail:'For all the days you showed up.'},
];
export default function Companion({profile,missions,preview,go}:{profile:Profile;missions:Mission[];preview:boolean;go:(path:string)=>void}) {
  const pet=brainOf(profile).petState || DEFAULT_PET_STATE;
  const owned=profile.unlockedAccessories || [],equipped=profile.equippedAccessories || [];
  const [replay,setReplay]=useState(0),[busy,setBusy]=useState(''),[error,setError]=useState(''),[status,setStatus]=useState('');
  const date=new Date(); const today=`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  async function update(id:string,action:'purchase'|'equip') { if(busy)return;setBusy(id);setError('');setStatus('');try {if(preview){setStatus('Design preview. Coins and equipment are not changed.');return;}if(!functions)throw new Error('Account unavailable'); await httpsCallable(functions,'updateWebCosmetic')({id,action});setStatus(action==='purchase'?'Added to your collection.':'Your equipment is saved across devices.');setReplay(value=>value+1);}catch(cause){setError(explainError(cause,'Could not update your collection. Try again.'));}finally{setBusy('');} }
  return <div className="page companion-page"><header className="page-top"><p className="eyebrow">Your companion</p><h1>A little tiger.<br/><span className="soft-heading">A lot of possibility.</span></h1><p className="muted">Growing with you, one useful idea at a time.</p></header><section className="pet-hero"><div><Tiger animation={replay?'correct':'welcome'} replay={replay}/><button className="button subtle" onClick={()=>setReplay(value=>value+1)}><Heart size={18}/>Say hello</button></div><div><h2>Small habits. Happy company.</h2><p>Keep your learning rhythm with a lesson, an applied idea or a moment of focus.</p><div className="pet-facts"><div><strong>{pet.metricsDate===today?pet.totalFocusMinutesToday||0:0}</strong><span>focus minutes today</span></div><div><strong>{learningRhythm(profile,missions).streak}</strong><span>day learning streak</span></div></div><button className="button primary" onClick={()=>go('/learn')}>Continue learning</button><button className="text-link" onClick={()=>go('/focus')}>Make time to focus</button></div></section><section className="cosmetic-section"><header><div><p className="eyebrow">Earned along the way</p><h2>A style of your own.</h2><p>Accessories sync with your mobile companion. This Web character keeps its original animated look.</p></div><span className="coin-balance"><Coins size={21}/>{profile.coins||0} earned coins</span></header>{error&&<p className="error" role="alert">{error}</p>}{status&&<p role="status">{status}</p>}<div className="cosmetic-grid">{items.map(item=><article key={item.id} className={owned.includes(item.id)?'owned':''}><div className="cosmetic-art"><item.icon size={56} strokeWidth={1.3}/></div><h3>{item.name}</h3><p>{item.detail}</p><button className="button subtle" disabled={!!busy||(!owned.includes(item.id)&&(profile.coins||0)<item.cost)} onClick={()=>update(item.id,owned.includes(item.id)?'equip':'purchase')}>{busy===item.id?'Saving…':owned.includes(item.id)?equipped.includes(item.id)?'Unequip':'Equip on mobile':`${item.cost.toLocaleString()} coins`}</button><small>{owned.includes(item.id)?equipped.includes(item.id)?'Equipped':'In your collection':'Earn coins by completing Apply'}</small></article>)}</div><p className="small-copy">Coins are earned in T1GER. No real-money purchase is offered here.</p></section></div>;
}
