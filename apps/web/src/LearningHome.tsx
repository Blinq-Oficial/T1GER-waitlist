import { ArrowRight, BookOpen, Check, ChevronDown, Clock, Flag, Lock, Play, RotateCcw, Sparkles } from 'lucide-react';
import { Tiger, DomainIcon } from './Visual';
import { getJourneyNodes, getSectionsForTrack } from './product/learningJourney';
import type { InteractiveTrack } from './product/interactiveCurriculumTypes';
import type { BrainState } from './product/brainService';
import { isComplete, type Mission } from './state';

export default function LearningHome({ track, brain, missions, dueCount, openLesson, go, dailyTime }: {
  track: InteractiveTrack; brain: BrainState; missions: Mission[]; dueCount: number; dailyTime: number;
  openLesson: (id: string) => void; go: (path: string) => void;
}) {
  const nodes = getJourneyNodes(track, brain, missions.filter(isComplete).map(m => m.id));
  const next = nodes.find(node => node.state !== 'completed');
  const done = nodes.filter(node => node.state === 'completed').length;
  const pending = next && missions.some(m => m.lessonId === next.lesson.id && !isComplete(m));
  const sections = getSectionsForTrack(track.id);
  return <div className="page learning-home">
    <header className="learning-heading"><div><p className="eyebrow">A LITTLE EVERY DAY</p><h1>Your next good idea.</h1><p className="muted">Learn it. Put it to work. Make it yours.</p></div><span className="intention-pill"><Clock size={16}/>{dailyTime} min / day</span></header>
    <div className="learning-layout"><section className="learning-route" aria-label="Learning path">
      <div className="course-heading"><DomainIcon domain={track.id}/><div><span>YOUR PATH</span><h2>{track.title.en}</h2></div><button className="icon-button" onClick={() => go('/discover')} aria-label="Choose learning path"><ChevronDown size={19}/></button></div>
      {next && <button className="button primary mobile-next-lesson" onClick={() => next.state === 'review' ? go('/master') : openLesson(next.lesson.id)}>{next.state === 'review' ? 'Review then continue' : pending ? 'Continue Apply' : 'Continue learning'}<ArrowRight size={18}/></button>}
      {sections.map((section, index) => <section className="route-unit" key={section.id}><header className="unit-banner"><span>UNIT {index + 1}</span><h3>{section.title.en}</h3><p>{section.description.en}</p></header><ol className="lesson-map">{nodes.filter(node => section.lessonIds.includes(node.lesson.id)).map(node => {
        const Icon = node.state === 'completed' ? Check : node.state === 'locked' ? Lock : node.state === 'review' ? RotateCcw : Play;
        return <li key={node.lesson.id} className={`map-stop ${node.state}`}><div className="node-position"><button className="path-node" disabled={node.state === 'locked'} aria-label={`Open ${node.lesson.title.en}${node.state === 'locked' ? ' — locked' : ''}`} aria-current={node.state === 'current' || node.state === 'review' ? 'step' : undefined} onClick={() => node.state === 'review' ? go('/master') : openLesson(node.lesson.id)}><Icon size={28} fill={node.state === 'current' ? 'currentColor' : 'none'} strokeWidth={2.5}/></button><div className="node-caption"><strong>{node.lesson.title.en}</strong><span>{node.state === 'completed' ? 'Applied · revisit anytime' : node.state === 'locked' ? 'Complete the previous idea' : node.state === 'review' ? 'Review first' : 'Start here · about 4 min'}</span></div></div></li>;
      })}</ol></section>)}
      <div className="path-finish"><Flag size={26}/><span>{done === nodes.length ? 'You made it. Keep these ideas fresh in Master.' : 'Five useful ideas. A stronger way to think.'}</span></div>
    </section><aside className="learning-side">
      <section className="companion-card"><div className="companion-message">{next ? 'Big ideas start with a small step.' : 'Look how far you’ve come.'}</div><Tiger mood={next ? 'curious' : 'happy'}/><h2>{next?.lesson.title.en || 'A path worth keeping.'}</h2><p>{next?.lesson.objective.en || 'Your reviews will help you keep it.'}</p><button className="button primary" onClick={() => next ? next.state === 'review' ? go('/master') : openLesson(next.lesson.id) : go('/master')}>{next ? next.state === 'review' ? 'Review then continue' : pending ? 'Continue Apply' : 'Start lesson' : 'Go to Master'}<ArrowRight size={18}/></button></section>
      <section className="small-panel progress-panel"><BookOpen size={20}/><div><strong>{done} of {nodes.length} ideas applied</strong><span>Your progress, one decision at a time.</span></div><progress aria-label="Path completion" value={done} max={nodes.length}/></section>
      <section className="small-panel recall-panel"><Sparkles size={22}/><h3>{dueCount ? `${dueCount} ready to remember` : 'A little room for recall.'}</h3><p>{dueCount ? 'Bring the idea back before seeing the answer.' : 'Your memory queue is clear. Reviews appear when they’re due.'}</p>{dueCount ? <button className="button subtle" onClick={() => go('/master')}>Start review<ArrowRight size={16}/></button> : <span className="clear-status"><Check size={15}/>All caught up</span>}</section>
    </aside></div>
  </div>;
}
