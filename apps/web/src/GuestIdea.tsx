import { useState, type ReactNode } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw } from 'lucide-react';
import type { AtomicLesson } from './product/interactiveCurriculumTypes';
import LessonOpening, { LessonReading } from './LessonOpening';
import { Tiger } from './Visual';
import { behaviorEvent } from '../../../src/lib/behaviorAnalytics';

/** A real learning sample. Account, rewards and persisted lesson progress start after sign-up. */
export default function GuestIdea({ lesson, themeAction, back, createAccount }: {
  lesson: AtomicLesson; themeAction: ReactNode; back: () => void; createAccount: () => void;
}) {
  const [finished, setFinished] = useState(false);
  return <div className="guest-idea">
    <header className="guest-idea-header"><button className="back-button" onClick={back}><ArrowLeft size={18}/>My path</button><span>T1GER</span>{themeAction}</header>
    <div className="guest-idea-progress" aria-label={finished ? 'First idea explored' : 'Explore your first idea'}><span className="filled"/><span className={finished ? 'filled' : ''}/></div>
    <main key={finished ? 'takeaway' : 'sample'} className="guest-idea-body">
      {!finished ? <><p className="guest-idea-note"><BookOpen size={16}/>Your first idea · no account needed</p><LessonOpening lesson={lesson} sample onContinue={() => { setFinished(true); window.scrollTo(0,0); behaviorEvent('first_idea_completed', { lesson_id: lesson.id }); }}/></> : <section className="guest-idea-result">
        <Tiger animation="correct"/><p className="eyebrow">A SMALL START, ALREADY USEFUL</p><h1>That’s your first idea.</h1>
        <div className="guest-takeaway"><Check size={22}/><div><span>WHAT YOU JUST EXPLORED</span><p>{lesson.learningDesign.summaryPoints[0].en}</p></div></div>
        <p>Keep going with a full interactive lesson, a tool you can save, and a review when it’s due.</p>
        <button className="button primary large" onClick={createAccount}>Keep learning free<ArrowRight size={19}/></button>
        <small>Create an account to save your path. This sample does not award XP or a streak.</small>
        <details className="guest-source"><summary>Where this idea comes from</summary><LessonReading lesson={lesson}/></details>
        <button className="text-link" onClick={() => setFinished(false)}><RotateCcw size={16}/>Try the example again</button>
      </section>}
    </main>
  </div>;
}
