import { Tiger } from './Visual';
import { completionAnimation } from './mascotMotion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, LockKeyhole } from 'lucide-react';
import type { AtomicLesson, SavedLearningArtifact } from './product/interactiveCurriculumTypes';
import type { BrainState } from './product/brainService';
import { FIELD_MISSION_CATALOG } from './product/fieldMissionCatalog';
import { getApplyDesign } from './product/applyMissionDesign';
import { calculateCompoundProjection, compoundSeries } from './projection';
import { cashPurchasingPower, educationBriefs } from './education';
import { completeApply, explainError, isComplete, prepareApply, readArtifact, recordReview, type Mission } from './state';
import CurriculumLesson from './CurriculumLesson';
import Challenge from './Challenge';
import GoldLesson from './GoldLesson';
import LessonOpening, { LessonReading } from './LessonOpening';

type Stage = 'hook' | 'learn' | 'interact' | 'apply' | 'master' | 'reward';
const stages: Stage[] = ['hook', 'learn', 'interact', 'apply', 'master', 'reward'];
const currency = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount);


function EvidenceNotes({ lessonId }: { lessonId: string }) {
  const brief = educationBriefs[lessonId];
  if (!brief) return null;
  return <details className="evidence-notes"><summary>Evidence &amp; model limits <span>2 primary sources</span></summary><div className="evidence-notes-body"><p><strong>What the model shows.</strong> {brief.model}</p><p><strong>What it does not show.</strong> {brief.limits}</p><p><strong>Common misconception.</strong> {brief.misconception}</p><div className="evidence-links">{brief.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"><span>{source.publisher}</span><strong>{source.title} ↗</strong><small>{source.supports}</small></a>)}</div><small>Sources checked {brief.lastVerified}. Content review by {brief.reviewBy}.</small></div></details>;
}

function GrowthChart({ monthly, years, rate, cash, cashDecline = false }: { monthly: number; years: number; rate: number; cash?: number; cashDecline?: boolean }) {
  const [focusYear, setFocusYear] = useState(years);
  useEffect(() => setFocusYear(years), [years]);
  const data = cash ? Array.from({ length: years + 1 }, (_, year) => ({ year, contributed: cash, finalValue: cashDecline ? cash / (1 + rate / 100) ** year : cash * (1 + rate / 100) ** year })) : compoundSeries(monthly, years, rate);
  const max = Math.max(...data.map(point => point.finalValue), 1);
  const points = data.map((point, index) => `${40 + (index / (data.length - 1 || 1)) * 540},${226 - point.finalValue / max * 180}`).join(' ');
  const base = data.map((point, index) => `${40 + (index / (data.length - 1 || 1)) * 540},${226 - point.contributed / max * 180}`).join(' ');
  const selected = data[Math.min(focusYear, years)];
  const focusX = 40 + (focusYear / (years || 1)) * 540;
  const focusY = 226 - selected.finalValue / max * 180;
  return <div className="chart-wrap">
    <div className="chart-readout"><span>YEAR {String(focusYear).padStart(2, '0')}</span><strong>{currency(selected.finalValue)}</strong><small>{cashDecline ? 'Buying power at assumed inflation' : 'Estimated value at assumed return'}</small></div>
    <svg role="img" aria-label={`${cashDecline ? 'Estimated buying power' : 'Projected final value'} ${currency(data[years].finalValue)} after ${years} years at an assumed ${rate}% annual rate`} viewBox="0 0 620 270" preserveAspectRatio="none"><line x1="40" y1="226" x2="580" y2="226" className="chart-axis"/><line x1="40" y1="136" x2="580" y2="136" className="chart-grid"/><line x1="40" y1="46" x2="580" y2="46" className="chart-grid"/><polygon points={`40,226 ${points} 580,226`} className="chart-area"/><polyline points={base} className="chart-base"/><polyline points={points} className="chart-growth"/><line x1={focusX} y1="46" x2={focusX} y2="226" className="chart-cursor"/><circle cx={focusX} cy={focusY} r="6" className="chart-dot"/><text x="40" y="253">TODAY</text><text x="580" y="253" textAnchor="end">YEAR {years}</text></svg>
    <label className="sr-only" htmlFor={`chart-year-${cashDecline ? 'cash' : 'growth'}-${monthly}-${years}`}>Explore the projection year</label><input id={`chart-year-${cashDecline ? 'cash' : 'growth'}-${monthly}-${years}`} className="chart-scrubber" type="range" min="0" max={years} value={focusYear} onChange={event => setFocusYear(Number(event.target.value))}/>
    <div className="chart-legend"><span><i className="legend-deposit"/> {cash ? 'Starting cash' : 'Contributions'}</span><span><i className="legend-growth"/> {cashDecline ? 'Buying power' : 'Estimated value'}</span></div>
  </div>;
}

type LessonProps = { lesson: AtomicLesson; uid: string; brain: BrainState; missions: Mission[]; artifacts?: SavedLearningArtifact[]; close: () => void; preview?: boolean };
export default function Lesson(props: LessonProps) {
  if (props.lesson.id === 'learn-money-02') return <GoldLesson {...props}/>;
  return ['learn-money-01', 'learn-money-02'].includes(props.lesson.id) ? <MoneyLesson {...props}/> : <CurriculumLesson {...props} preview={props.preview || false}/>;
}
function MoneyLesson({ lesson, uid, brain, missions, artifacts = [], close, preview = false }: LessonProps) {
  const sessionKey = `t1ger_web_lesson_v1_${uid}_${lesson.id}`;
  const mission = missions.find(item => item.lessonId === lesson.id);
  const completed = isComplete(mission) || brain.missionHistory.some(item => item.missionId === `field-${lesson.id}` && item.completed);
  const [wasApplied] = useState(completed);
  const [savedThisVisit, setSavedThisVisit] = useState(false);
  const [stage, setStage] = useState<Stage>(() => completed ? 'master' : mission ? 'apply' : 'hook');
  const [learningScore, setLearningScore] = useState(mission?.learningScore || 100);
  const [values, setValues] = useState<Record<string, string | number>>(() => ({ ...Object.fromEntries(lesson.phases[2].widget.fields.map(field => [field.id, field.defaultValue ?? ''])), ...(mission?.artifact || readArtifact(uid, lesson.id, artifacts))?.values }));
  const [artifactSaved, setArtifactSaved] = useState(Boolean((mission?.artifact || readArtifact(uid, lesson.id, artifacts)) && mission));
  const [reflection, setReflection] = useState(''); const [reviewAnswer, setReviewAnswer] = useState(''); const [answerShown, setAnswerShown] = useState(false);
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const [showDetail, setShowDetail] = useState(0);
  const design = lesson.learningDesign; const gold = design.goldStandard;
  const fields = lesson.phases[2].widget.fields;
  const monthly = Number(values.monthly ?? 0), years = Number(values.years ?? 5), rate = Number(values.rate ?? 8), cash = Number(values.cash ?? 0);
  const projection = useMemo(() => lesson.id === 'learn-money-02' ? calculateCompoundProjection(monthly, years, rate) : { finalValue: cashPurchasingPower(cash, years, 3), contributed: cash, growth: 0 }, [lesson.id, monthly, years, rate, cash]);
  const challenge = lesson.phases[1].challenge;
  const brief = educationBriefs[lesson.id];
  const keyConcept = lesson.id === 'learn-money-02' ? 'With equal total deposits and the same assumed rate, an earlier start gives each deposit more time in the model.' : 'Cash held for emergencies and money for long-term goals have different jobs.';
  const blueprint = FIELD_MISSION_CATALOG[lesson.id];
  const applyDesign = getApplyDesign(lesson.id, 'en');
  const advance = useCallback((next: Stage) => { setStage(next); sessionStorage.setItem(sessionKey, next); setError(''); window.scrollTo(0, 0); }, [sessionKey]);
  useEffect(() => { document.title = `${lesson.title.en} — T1GER`; return () => { document.title = 'T1GER — Learn it. Apply it. Master it.'; }; }, [lesson.title.en]);

  async function saveTool() {
    setBusy(true); setError('');
    try {
      const summary = lesson.id === 'learn-money-02' ? `My rule: contribute ${currency(monthly)} monthly for ${years} years at an assumed ${rate}% return; review ${values.reviewCadence === 'quarterly' ? 'every 3 months' : 'once a year'}.` : `I will keep my buffer separate and review ${currency(cash)} of surplus over ${years} years.`;
      const artifact: SavedLearningArtifact = { lessonId: lesson.id, trackId: lesson.trackId, title: lesson.phases[2].widget.artifactTitle.en, summary, values, createdAt: Date.now() };
      if (!preview) await prepareApply(uid, lesson, artifact, learningScore);
      setArtifactSaved(true); setSavedThisVisit(true);
    } catch (cause) { if (import.meta.env.DEV) console.error('Tool save failed', cause); setError(explainError(cause, 'Could not save your tool.')); }
    finally { setBusy(false); }
  }
  async function finishApply() {
    if (!artifactSaved || reflection.trim().length < 20) return;
    setBusy(true); setError('');
    try { if (!preview) await completeApply(uid, lesson.id, reflection, mission?.learningScore || (learningScore)); advance('master'); }
    catch (cause) { setError(explainError(cause, 'Could not save your Apply step. Please retry.')); }
    finally { setBusy(false); }
  }
  const submitRating = useCallback(async (score: number) => {
    setBusy(true); setError('');
    try { if (!preview) await recordReview(uid, lesson.id, score); advance('reward'); }
    catch (cause) { setError(explainError(cause, 'Could not save your review.')); }
    finally { setBusy(false); }
  }, [advance, lesson.id, preview, uid]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]') || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'Enter' && target.closest('button, a, summary, [role="button"]')) return;
      const number = Number(event.key);
      if (stage === 'master' && answerShown && !busy && number >= 1 && number <= 4) {
        event.preventDefault(); void submitRating([40, 60, 80, 100][number - 1]);
      } else if (event.key === 'Enter') {
        if (stage === 'master' && reviewAnswer.trim() && !answerShown) { event.preventDefault(); setAnswerShown(true); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answerShown, busy, reviewAnswer, stage, submitRating]);
  return <div className="lesson-shell"><header className="lesson-header"><button className="back-button" onClick={close}><ArrowLeft size={18}/><span>Exit lesson</span></button><div className="lesson-header-title"><span>{lesson.trackId === 'smart-money' ? 'SMART MONEY' : lesson.trackId.toUpperCase()}</span><strong>{lesson.title.en}</strong></div><span className="lesson-count">{String(stages.indexOf(stage) + 1).padStart(2, '0')} / 06</span></header>{preview && <div className="lesson-preview-notice"><span>DESIGN PREVIEW · PROGRESS IS NOT SAVED</span><button onClick={() => { sessionStorage.removeItem(sessionKey); setStage('hook'); setLearningScore(100); setArtifactSaved(false); setReflection(''); setReviewAnswer(''); setAnswerShown(false); }}>Restart lesson</button></div>}<div className="stage-progress" aria-label={`Lesson stage ${stages.indexOf(stage) + 1} of 6`}>{stages.map((item, index) => <span key={item} className={index <= stages.indexOf(stage) ? 'filled' : ''}/>)}</div>
    <div className="stage-labels">{stages.map(item => <span key={item} className={item === stage ? 'active' : ''}>{['Start', 'Learn', 'Practice', 'Use', 'Recall', 'Done'][stages.indexOf(item)]}</span>)}</div>
    {stage === 'master' && <p className="lesson-keyboard">AFTER REVEAL · 1–4 RATE</p>}
    {stage === 'hook' && <main className="lesson-focus"><LessonOpening lesson={lesson} onContinue={() => advance('learn')}/></main>}
    {stage === 'learn' && <main className="lesson-main learn-stage"><div className="lesson-copy"><p className="eyebrow">02 / LEARN · SEE THE PATTERN</p><h1>{lesson.phases[0].title.en}</h1><p>{lesson.id === 'learn-money-02' ? 'Under a fixed assumed return, early deposits have more periods to grow. This comparison holds total deposits equal so timing is the only changed input.' : 'A balance and its buying power are different. Emergency cash provides access when you need it; compare longer-term money separately.'}</p><div className="beat-selector" aria-label="Concept steps">{design.storyBeats.map((beat, index) => <button aria-pressed={showDetail === index} key={beat.title.en} onClick={() => setShowDetail(index)}>{String(index + 1).padStart(2, '0')} <span>{beat.title.en}</span></button>)}</div><div className="beat-content"><h3>{design.storyBeats[showDetail].title.en}</h3><p>{design.storyBeats[showDetail].body.en}</p></div></div><div className="learn-visual"><div className="visual-head"><span>THE SHAPE OF TIME</span><strong>{lesson.id === 'learn-money-02' ? 'Small deposits, repeated' : 'Cash and buying power'}</strong></div><GrowthChart monthly={lesson.id === 'learn-money-02' ? 100 : 0} years={lesson.id === 'learn-money-02' ? 20 : 5} rate={lesson.id === 'learn-money-02' ? 8 : 3} cash={lesson.id === 'learn-money-01' ? 1000 : undefined} cashDecline={lesson.id === 'learn-money-01'}/><div className="visual-insight"><span>THE IDEA</span><p>{keyConcept}</p></div></div><LessonReading lesson={lesson}/><EvidenceNotes lessonId={lesson.id}/><button className="button primary large learn-next" onClick={() => advance('interact')}>Test your judgment <ArrowRight size={19}/></button></main>}
    {stage === 'interact' && <main className="lesson-focus"><p className="eyebrow">03 / INTERACT · TEST YOUR JUDGMENT</p><Challenge challenge={challenge} onDone={firstTry => { setLearningScore(firstTry ? 100 : 75); advance('apply'); }}/></main>}
    {stage === 'apply' && <main className="apply-stage"><div className="apply-stage-head"><p className="eyebrow">04 / APPLY · MAKE A RULE</p><h1>{lesson.id === 'learn-money-01' ? 'See what cash can buy' : lesson.phases[2].title.en}</h1><p>{lesson.id === 'learn-money-01' ? 'Choose a cash balance and time horizon. This illustrates inflation; it does not decide how much you should invest.' : lesson.phases[2].widget.instruction.en}</p></div><div className="apply-stage-grid"><div className="tool-controls"><div className="tool-title"><span>YOUR MODEL</span><strong>{lesson.id === 'learn-money-01' ? 'Buying power lens' : lesson.phases[2].widget.title.en}</strong></div>{fields.map(field => <label key={field.id} className="tool-field"><span>{lesson.id === 'learn-money-01' ? field.id === 'cash' ? 'Cash balance' : 'Years held' : field.label.en} <strong>{field.kind === 'select' ? field.options.find(option => option.value === values[field.id])?.label.en : `${field.id === 'rate' ? '' : field.id === 'monthly' || field.id === 'cash' ? '$' : ''}${values[field.id]}${field.id === 'rate' ? '%' : ''}`}</strong></span>{field.kind === 'range' ? <input type="range" min={field.min} max={field.max} step={field.step} value={values[field.id]} onChange={e => { setValues({ ...values, [field.id]: Number(e.target.value) }); setArtifactSaved(false); }}/> : field.kind === 'select' ? <select value={values[field.id]} onChange={e => { setValues({ ...values, [field.id]: e.target.value }); setArtifactSaved(false); }}>{field.options.map(option => <option key={option.value} value={option.value}>{option.label.en}</option>)}</select> : null}</label>)}<div className="companion-cue tool-companion"><Tiger animation={error ? 'retry' : busy ? 'thinking' : artifactSaved ? savedThisVisit ? 'saved' : 'idle' : 'thinking'}/><span>{error ? 'Your draft is still here. Try saving again.' : busy ? 'Saving your work…' : artifactSaved ? preview ? 'Preview tool ready.' : 'Your tool is saved.' : 'Turn the idea into something useful.'}</span></div><button className="button subtle" onClick={() => void saveTool()} disabled={busy || artifactSaved}>{artifactSaved ? <><Check size={17}/> Rule saved</> : <><LockKeyhole size={17}/> Save this rule</>}</button></div><div className="tool-output"><div className="tool-total"><span>{lesson.id === 'learn-money-01' ? 'Buying power after inflation' : lesson.phases[2].widget.resultLabel.en}</span><strong>{currency(projection.finalValue)}</strong><small>{lesson.id === 'learn-money-01' ? 'Assumes 3% annual inflation, no interest, no taxes.' : 'Fixed-rate illustration only · fees, taxes, inflation and losses excluded.'}</small></div><GrowthChart monthly={monthly} years={years} rate={lesson.id === 'learn-money-02' ? rate : 3} cash={lesson.id === 'learn-money-01' ? cash : undefined} cashDecline={lesson.id === 'learn-money-01'}/>{lesson.id === 'learn-money-02' && <div className="projection-breakdown"><div><span>Contributed</span><strong>{currency(projection.contributed)}</strong></div><div><span>Estimated growth</span><strong>{currency(projection.growth)}</strong></div></div>}</div></div><div className="real-action"><div><p className="eyebrow">NOW USE IT</p><h2>{applyDesign?.title || lesson.phases[2].title.en}</h2><p>{applyDesign?.why || blueprint.description[1]}</p><ol>{(applyDesign?.steps || blueprint.steps.map(step => step[1])).map((step, index) => <li key={index}>{step}</li>)}</ol></div><div><label htmlFor="reflection">What did you set up or decide?</label><textarea id="reflection" value={reflection} onChange={e => setReflection(e.target.value)} placeholder="Describe a concrete rule, including the amount or decision and when you will review it…"/><small>Use a simulated plan if you are not ready to act with real money. Keep private financial details out.</small><button className="button primary large" disabled={!artifactSaved || reflection.trim().length < 20 || busy} onClick={() => void finishApply()}>{busy ? 'Saving progress…' : 'Complete Apply'} <ArrowRight size={19}/></button></div></div>{error && <p role="alert" className="error">{error}</p>}</main>}
    {stage === 'master' && <main className="lesson-focus master-stage"><p className="eyebrow">05 / MASTER · RETRIEVE</p><h1>{brief?.retrievalPrompt || gold?.master.prompt.en || design.retrievalPrompt.en}</h1><p>Close the explanation in your mind. Answer from memory.</p><label className="sr-only" htmlFor="master-answer">Your answer</label><textarea id="master-answer" value={reviewAnswer} onChange={e => setReviewAnswer(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && reviewAnswer.trim()) { e.preventDefault(); setAnswerShown(true); } }} disabled={answerShown} placeholder="What can you recall?"/><div className="companion-cue"><Tiger animation={error ? 'retry' : answerShown ? 'recall' : 'thinking'}/><span>{error ? 'Try saving your review again.' : answerShown ? 'Compare the idea with what you recalled.' : 'Take a moment. What do you remember?'}</span></div>{!answerShown ? <button className="button primary large" disabled={!reviewAnswer.trim()} onClick={() => setAnswerShown(true)}>Reveal answer <ArrowRight size={19}/></button> : <><div className="answer-reveal" role="status"><span>THE CORE IDEA</span><p>{brief?.retrievalAnswer || gold?.master.explanation.en || design.retrievalAnswer.en}</p></div><p className="rate-label">How well did you remember?</p><div className="rating-row">{[['Again', 40], ['Hard', 60], ['Good', 80], ['Easy', 100]].map(([label, score]) => <button key={label} disabled={busy} onClick={() => void submitRating(Number(score))}>{label}</button>)}</div></>}{error && <p role="alert" className="error">{error}</p>}</main>}
    {stage === 'reward' && <main className="reward-stage"><Tiger animation={completionAnimation(wasApplied, lesson.order)}/><p className="eyebrow">{wasApplied ? "REVIEW COMPLETE" : "LESSON COMPLETE"}</p><h1>{wasApplied ? "Idea refreshed." : lesson.phases[3].title.en}</h1><p>{wasApplied ? 'You brought this idea back from memory. Your next review follows your recall.' : lesson.id === 'learn-money-02' ? 'You can now separate the effect of time from the amount deposited, and explain why a projection is not a promise.' : 'You can now distinguish the purpose of emergency cash from a long-term goal and read an inflation scenario without treating it as a forecast.'}</p><button className="button primary large" onClick={() => { sessionStorage.removeItem(sessionKey); close(); }}>Return to Learn <ArrowRight size={19}/></button><details className="reward-details"><summary>{wasApplied ? "The idea you refreshed" : "Your takeaway and tool"}</summary><div className="reward-summary"><div><span>WHAT YOU LEARNED</span><strong>{keyConcept}</strong></div><div><span>WHAT YOU DID</span><strong>{blueprint.description[1]}</strong></div></div></details></main>}
  </div>;
}


