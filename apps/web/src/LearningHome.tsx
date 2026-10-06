import { useRef, useState } from 'react';
import { ArrowRight, BookOpen, Check, ChevronDown, Clock, Flag, Library, Lock, Play, RotateCcw, Sparkles, X } from 'lucide-react';
import { Tiger, DomainIcon } from './Visual';
import LearningMomentum from './LearningMomentum';
import { getJourneyAction, getJourneyNodes, getSectionsForTrack, type JourneyNode } from './product/learningJourney';
import { dailyLearningGoals } from './product/learningRhythm';
import type { InteractiveTrack } from './product/interactiveCurriculumTypes';
import type { BrainState } from './product/brainService';
import { isComplete, type Mission, type Profile } from './state';

export default function LearningHome({ track, brain, missions, dueCount, openLesson, go, dailyTime, savedToolCount = 0, profile }: {
  track: InteractiveTrack; brain: BrainState; missions: Mission[]; dueCount: number; dailyTime: number; savedToolCount?: number; profile: Profile;
  openLesson: (id: string) => void; go: (path: string) => void;
}) {
  const nodes = getJourneyNodes(track, brain, missions.filter(isComplete).map(m => m.id));
  const next = nodes.find(node => node.state !== 'completed');
  const done = nodes.filter(node => node.state === 'completed').length;
  const pendingApply = (id: string) => missions.some(m => m.lessonId === id && !isComplete(m));
  const pending = next && pendingApply(next.lesson.id);
  const reviewing = next?.state === 'review';
  const action = next && getJourneyAction(next, pending);
  const sections = getSectionsForTrack(track.id);
  const sectionIndex = next ? sections.findIndex(section => section.lessonIds.includes(next.lesson.id)) : sections.length - 1;
  const currentSection = sections[Math.max(0, sectionIndex)];
  const goals = dailyLearningGoals(brain, missions, profile.timeZone);
  const [selected, setSelected] = useState<JourneyNode | null>(null);
  const lessonDialog = useRef<HTMLDialogElement>(null);
  const selectedAction = selected && getJourneyAction(selected, pendingApply(selected.lesson.id));
  function continueStep(node: JourneyNode) {
    const step = getJourneyAction(node, pendingApply(node.lesson.id));
    if (!step.destination) return;
    lessonDialog.current?.close();
    if (step.destination === 'review') go('/master');
    else openLesson(node.lesson.id);
  }
  return <div className="page learning-home">
    <header className="learning-heading"><div><p className="eyebrow">Your learning, one step at a time</p><h1>{next ? 'Your next step.' : 'Look how far you’ve come.'}</h1><p>{track.title.en}</p></div><span className="intention-pill"><Clock size={16}/>{dailyTime} min a day</span></header>
    <div className="learning-dashboard"><div className="learning-main">
    <section className="current-stage" aria-label="Current stage"><DomainIcon domain={track.id}/><div><span>Stage {Math.max(0, sectionIndex) + 1} of {sections.length}</span><strong>{currentSection.title.en}</strong></div><button className="icon-button" onClick={() => go('/discover')} aria-label="Choose learning path"><ChevronDown size={19}/></button></section>
    <section className="daily-hero"><div className="daily-hero-copy"><span className="eyebrow">{reviewing ? 'A quick recall before moving on' : pending ? 'A lesson to finish' : next ? `Lesson ${next.lesson.order} of ${nodes.length}` : 'Path complete'}</span>
      <h2>{reviewing ? 'Keep your good ideas close.' : next?.lesson.title.en || 'A foundation worth building on.'}</h2>
      <p>{reviewing ? `Review what you learned, then continue with “${next?.lesson.title.en}”.` : pending ? 'Continue from your saved lesson step, then finish Apply to save your work and unlock the next idea.' : next?.lesson.objective.en || 'Revisit an idea, keep your memory fresh, or explore a new path.'}</p>
      <button className="button primary large" onClick={() => next ? continueStep(next) : go(dueCount ? '/master' : '/discover')}>{action?.label || (dueCount ? 'Start review' : 'Explore another path')}<ArrowRight size={20}/></button>
      <span className="hero-duration"><Clock size={14}/>{reviewing ? 'A short recall session' : pending ? 'Pick up where you left off' : next ? 'About 4 minutes · learn, then apply' : 'Your progress stays with you'}</span>
    </div><div className="daily-character portrait-scene"><span className="character-caption">{reviewing ? 'Let’s bring it back.' : pending ? 'Make it yours.' : next ? 'You’ve got this.' : 'Nicely done.'}</span><div className="portrait-halo"/><Tiger animation={reviewing ? 'recall' : pending ? 'thinking' : next ? 'welcome' : 'milestone'}/></div></section>
    <div className="learning-quick-actions" aria-label="Learning shortcuts">
      <button onClick={() => go('/coach')}><span className="quick-icon violet"><Sparkles size={20}/></span><span><strong>Ask your mentor</strong><small>Make a tricky idea click</small></span><ArrowRight size={17}/></button>
      <button onClick={() => go('/library')}><span className="quick-icon mint"><Library size={20}/></span><span><strong>Your saved tools</strong><small>{savedToolCount ? `${savedToolCount} ready to use again` : 'Keep what you make in Apply'}</small></span><ArrowRight size={17}/></button>
    </div>
    <section className="learning-route" aria-label="Learning path">
      <div className="course-heading"><DomainIcon domain={track.id}/><div><span>Your path · {done} of {nodes.length} applied</span><h2>{track.title.en}</h2></div><button className="icon-button" onClick={() => go('/discover')} aria-label="Choose learning path"><ChevronDown size={19}/></button></div>
      {sections.map((section, index) => <section className={`route-unit ${section.id === currentSection.id ? 'active-unit' : ''}`} key={section.id}><header className="unit-banner"><span>Stage {index + 1}{section.id === currentSection.id ? ' · Your current stage' : ''}</span><h3>{section.title.en}</h3><p>{section.description.en}</p></header><ol className="lesson-map">{nodes.filter(node => section.lessonIds.includes(node.lesson.id)).map(node => {
        const Icon = node.state === 'completed' ? Check : node.state === 'locked' ? Lock : node.state === 'review' ? RotateCcw : Play;
        return <li key={node.lesson.id} className={`map-stop ${node.state}`}><div className="node-position"><button className="path-node" aria-label={`Preview ${node.lesson.title.en}${node.state === 'locked' ? ' — locked' : ''}`} aria-haspopup="dialog" aria-current={node.state === 'current' || node.state === 'review' ? 'step' : undefined} onClick={() => { setSelected(node); lessonDialog.current?.showModal(); }}><Icon size={28} fill={node.state === 'current' ? 'currentColor' : 'none'} strokeWidth={2.5}/></button><div className="node-caption"><strong>{node.lesson.title.en}</strong><span>{node.state === 'completed' ? 'Applied · revisit anytime' : node.state === 'locked' ? 'Tap to see what’s ahead' : node.state === 'review' ? 'A review is due first' : pendingApply(node.lesson.id) ? getJourneyAction(node, true).label : 'Your next idea · about 4 min'}</span></div></div></li>;
      })}</ol></section>)}
      <div className="path-finish"><Flag size={26}/><span>{done === nodes.length ? 'You made it. Keep these ideas fresh in Master.' : `${nodes.length} useful ideas. A stronger way to think.`}</span></div>
    </section></div><aside className="learning-side">
      <section className="daily-challenges" aria-labelledby="daily-challenges-title"><header><div><span className="eyebrow">A LITTLE, EVERY DAY</span><h2 id="daily-challenges-title">Daily challenges</h2></div><span className="challenge-score" aria-label={`${goals.completed} of 2 challenges complete`}>{goals.completed}<small>/2</small></span></header><p>One idea. One useful action.</p>
        <div className={`daily-challenge ${goals.learned ? 'is-done' : ''}`}><span className="challenge-icon"><BookOpen size={21}/></span><div><strong>Learn one idea</strong><span>{goals.learned ? 'Completed today' : 'Finish a lesson today'}</span><progress aria-label="Learn one idea" value={Number(goals.learned)} max={1}/></div><span className="challenge-check" aria-label={goals.learned ? 'Complete' : 'Not yet complete'}>{goals.learned ? <Check size={16}/> : '0/1'}</span></div>
        <div className={`daily-challenge ${goals.applied ? 'is-done' : ''}`}><span className="challenge-icon mint"><Flag size={21}/></span><div><strong>Make it useful</strong><span>{goals.applied ? 'Completed today' : 'Complete one Apply step'}</span><progress aria-label="Make it useful" value={Number(goals.applied)} max={1}/></div><span className="challenge-check" aria-label={goals.applied ? 'Complete' : 'Not yet complete'}>{goals.applied ? <Check size={16}/> : '0/1'}</span></div>
        <span className="challenge-note">{goals.completed === 2 ? 'Your daily loop is complete. Nicely done.' : 'A fresh pair of challenges every day.'}</span>
      </section>
      <LearningMomentum profile={profile} missions={missions} savedTools={savedToolCount} dueCount={dueCount} go={go}/>
      <section className="small-panel progress-panel"><BookOpen size={20}/><div><strong>{done} of {nodes.length} ideas applied</strong><span>Learn it. Use it. Bring it back.</span></div><progress aria-label="Path completion" value={done} max={nodes.length}/><button className="text-link" onClick={() => go('/progress')}>See your progress <ArrowRight size={17}/></button></section>
      <section className="small-panel recall-panel"><Sparkles size={22}/><h3>{dueCount ? `${dueCount} ready to remember` : done ? 'Your memory is up to date.' : 'Make your first idea stick.'}</h3><p>{dueCount ? 'Try recalling the idea before seeing the answer.' : done ? 'Your next review will arrive when it’s due.' : 'Finish a lesson and its application. We’ll bring it back for review later.'}</p>{dueCount ? <button className="button subtle" onClick={() => go('/master')}>Start review<ArrowRight size={16}/></button> : done ? <span className="clear-status"><Check size={15}/>All caught up</span> : <span className="small-copy">Reviews appear after your first Apply</span>}</section>
    </aside></div>
    <dialog ref={lessonDialog} className="path-preview" aria-labelledby="path-preview-title" aria-describedby="path-preview-description">
      <button className="icon-button preview-close" onClick={() => lessonDialog.current?.close()} aria-label="Close lesson preview"><X size={20}/></button>
      {selected && <><DomainIcon domain={track.id}/><p className="eyebrow">Lesson {selected.lesson.order} of {nodes.length} · {track.title.en}</p><h2 id="path-preview-title">{selected.lesson.title.en}</h2><p id="path-preview-description">{selected.lesson.objective.en}</p>
        <div className="preview-learning-loop"><span><BookOpen size={16}/>Learn an idea</span><span><Check size={16}/>Put it to use</span><span><RotateCcw size={16}/>Recall it later</span></div>
        {selected.state === 'locked' ? <div className="preview-locked"><Lock size={19}/><p>Finish the earlier lessons and their Apply steps to unlock this one. Your next step is highlighted on the path.</p></div> : selected.state === 'review' ? <p className="preview-hint">An earlier idea is due for review. Bring it back before starting this lesson.</p> : selected.state === 'completed' ? <p className="preview-hint">Already applied. Revisit whenever you like.</p> : <p className="preview-hint">{pendingApply(selected.lesson.id) ? 'Continue from your saved lesson step. Your progress is kept.' : 'About four minutes to explore the idea.'}</p>}
        <button className="button primary" onClick={() => selected.state === 'locked' ? lessonDialog.current?.close() : continueStep(selected)}>{selectedAction?.destination ? selectedAction.label : 'Back to my path'}<ArrowRight size={18}/></button>
      </>}
    </dialog>
  </div>;
}
