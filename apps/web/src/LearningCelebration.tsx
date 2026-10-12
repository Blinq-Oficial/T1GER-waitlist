import { Check, RotateCcw, Sparkles } from 'lucide-react';
import { Tiger } from './Visual';
import { completionAnimation } from './mascotMotion';

/** A visual receipt shown only after the existing completion flow succeeds. */
export default function LearningCelebration({ revisited, order, preview }: { revisited: boolean; order: number; preview: boolean }) {
  return <div className={`learning-celebration ${revisited ? 'is-revisit' : ''}`}>
    <div className="celebration-scene">
      <div className="celebration-orbit" aria-hidden="true"/>
      {!revisited && <div className="celebration-sparks" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} style={{ '--spark-index': index } as React.CSSProperties}/>)}</div>}
      <Tiger animation={completionAnimation(revisited, order)}/>
      <span className="celebration-seal" aria-hidden="true">{revisited ? <RotateCcw size={23}/> : <Check size={26} strokeWidth={3}/>}</span>
    </div>
    <div className="completion-receipt" aria-label="Your learning session">
      <span><Check size={16}/>{preview ? 'Idea practiced' : revisited ? 'Idea revisited' : 'Apply saved'}</span>
      <span><Sparkles size={16}/>{preview ? 'Preview only' : 'Recall recorded'}</span>
    </div>
  </div>;
}
