import { ArrowRight, Check, Flame, Gem, Library, RotateCcw, Sparkles } from 'lucide-react';
import type { Mission, Profile } from './state';
import { learningRhythm } from './product/learningRhythm';

export default function LearningMomentum({ profile, missions, savedTools, dueCount, go }: { profile: Profile; missions: Mission[]; savedTools: number; dueCount: number; go: (path: string) => void }) {
  const rhythm = learningRhythm(profile, missions);
  const nextMilestone = [3, 7, 14, 30, 60, 100, 365].find(value => value > rhythm.streak) || Math.ceil((rhythm.streak + 1) / 100) * 100;
  const xp = Math.max(0, profile.xp || 0);
  const xpMilestone = (Math.floor(xp / 200) + 1) * 200;
  return <section className="momentum-grid" aria-label="Your learning momentum">
    <article className={`rhythm-card ${rhythm.doneToday ? 'today-complete' : ''}`}>
      <div className="rhythm-title"><span className="flame-medallion"><Flame size={29} fill="currentColor"/></span><div><span className="eyebrow">Your learning rhythm</span><h2>{rhythm.streak ? <><strong>{rhythm.streak}</strong> day streak</> : 'Start your rhythm.'}</h2></div>{rhythm.doneToday && <span className="today-seal"><Check size={16}/>Today</span>}</div>
      <div className="rhythm-week" aria-label="Applications in the last seven days">{rhythm.days.map(day => <span key={day.key} className={`${day.applied ? 'applied' : ''} ${day.today ? 'is-today' : ''}`} title={`${day.key}: ${day.applied ? 'application completed' : 'no application recorded'}`}><small>{day.label}</small><i>{day.applied ? <Check size={17}/> : day.today ? <Flame size={16}/> : <span/>}</i></span>)}</div>
      <div className="rhythm-footer"><span>{rhythm.doneToday ? 'One useful idea put to work.' : rhythm.streak ? 'One Apply keeps your rhythm going.' : rhythm.previousStreak ? `Your last run: ${rhythm.previousStreak} days. A fresh start is ready.` : 'One lesson. One useful application.'}</span><span>{rhythm.streak}/{nextMilestone}<Gem size={14}/></span></div>
    </article>
    <article className="knowledge-card">
      <div className="knowledge-title"><span className="xp-emblem"><Sparkles size={24}/></span><div><span className="eyebrow">Your learning passport</span><h2><span key={xp} className="animated-value">{xp.toLocaleString()}</span> <small>XP</small></h2></div><span className="level-chip">Level {Math.max(1, profile.level || 1)}</span></div>
      <div className="xp-track" aria-label={`${xp} practice XP, next milestone ${xpMilestone}`}><span style={{ width: `${xp / xpMilestone * 100}%` }}/></div><p className="xp-caption">{xpMilestone - xp} XP to your next {xpMilestone.toLocaleString()}-XP milestone. Practice, not a mastery score.</p>
      <div className="passport-actions"><button onClick={() => go('/library')}><Library size={18}/><strong>{savedTools}</strong><span>saved tools</span><ArrowRight size={15}/></button><button onClick={() => go('/master')}><RotateCcw size={18}/><strong>{dueCount}</strong><span>due to recall</span><ArrowRight size={15}/></button></div>
    </article>
  </section>;
}
