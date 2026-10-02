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
    <header className="learning-heading"><div><p className="eyebrow">A little curiosity, every day</p><h1>Your next<br/><span className="soft-heading">good idea.</span></h1><p>Learn something useful. Make it yours.</p></div><span className="intention-pill"><Clock size={16}/>{dailyTime} min a day</span></header>
    <section className="daily-hero"><div className="daily-hero-copy"><span className="eyebrow">{next ? next.state === 'review' ? 'A moment to remember' : pending ? 'Ready to put it to work' : 'Up next · '+track.title.en : 'Your path, completed'}</span><h2>{next?.lesson.title.en || 'Keep your good ideas close.'}</h2><p>{next?.lesson.objective.en || 'A little recall keeps the things you learned with you.'}</p><button className="button primary large" onClick={() => next ? next.state === 'review' ? go('/master') : openLesson(next.lesson.id) : go('/master')}>{next ? next.state === 'review' ? 'Refresh your memory' : pending ? 'Continue Apply' : 'Start lesson' : 'Go to Master'}<ArrowRight size={20}/></button><span className="hero-duration">{next ? 'One idea. About four minutes.' : 'Your review queue is ready when you are.'}</span></div><div className="daily-character"><span className="character-caption">{next ? 'You’ve got this.' : 'Look how far you’ve come.'}</span><Tiger animation={next ? pending || next.state === 'review' ? 'thinking' : 'welcome' : 'idle'}/></div></section>
    <div className="learning-layout"><section className="learning-route" aria-label="Learning path">
      <div className="course-heading"><DomainIcon domain={track.id}/><div><span>Your learning path</span><h2>{track.title.en}</h2></div><button className="icon-button" onClick={() => go('/discover')} aria-label="Choose learning path"><ChevronDown size={19}/></button></div>
      {sections.map((section, index) => <section className="route-unit" key={section.id}><header className="unit-banner"><span>Chapter {index + 1}</span><h3>{section.title.en}</h3><p>{section.description.en}</p></header><ol className="lesson-map">{nodes.filter(node => section.lessonIds.includes(node.lesson.id)).map(node => {
        const Icon = node.state === 'completed' ? Check : node.state === 'locked' ? Lock : node.state === 'review' ? RotateCcw : Play;
        return <li key={node.lesson.id} className={`map-stop ${node.state}`}><div className="node-position"><button className="path-node" disabled={node.state === 'locked'} aria-label={`Open ${node.lesson.title.en}${node.state === 'locked' ? ' — locked' : ''}`} aria-current={node.state === 'current' || node.state === 'review' ? 'step' : undefined} onClick={() => node.state === 'review' ? go('/master') : openLesson(node.lesson.id)}><Icon size={28} fill={node.state === 'current' ? 'currentColor' : 'none'} strokeWidth={2.5}/></button><div className="node-caption"><strong>{node.lesson.title.en}</strong><span>{node.state === 'completed' ? 'Applied · revisit anytime' : node.state === 'locked' ? 'Complete the previous idea' : node.state === 'review' ? 'Review first' : 'Start here · about 4 min'}</span></div></div></li>;
      })}</ol></section>)}
      <div className="path-finish"><Flag size={26}/><span>{done === nodes.length ? 'You made it. Keep these ideas fresh in Master.' : 'Five useful ideas. A stronger way to think.'}</span></div>
    </section><aside className="learning-side">
      <section className="small-panel progress-panel"><BookOpen size={20}/><div><strong>{done} of {nodes.length} ideas applied</strong><span>Small steps. Real understanding.</span></div><progress aria-label="Path completion" value={done} max={nodes.length}/><button className="text-link" onClick={() => go('/progress')}>See your progress <ArrowRight size={17}/></button></section>
      <section className="small-panel recall-panel"><Sparkles size={22}/><h3>{dueCount ? `${dueCount} ready to remember` : 'Give good ideas time.'}</h3><p>{dueCount ? 'Bring the idea back before seeing the answer.' : 'Your next review will arrive when it’s useful.'}</p>{dueCount ? <button className="button subtle" onClick={() => go('/master')}>Start review<ArrowRight size={16}/></button> : <span className="clear-status"><Check size={15}/>All caught up</span>}</section>
      <section className="mentor-entry"><span className="editorial-icon"><Sparkles size={23}/></span><h3>A little guidance?</h3><p>Ask your AI mentor to explain, explore or test an idea with you.</p><button className="text-link" onClick={() => go('/coach')}>Ask T1GER <ArrowRight size={17}/></button></section>
    </aside></div>
  </div>;
}
