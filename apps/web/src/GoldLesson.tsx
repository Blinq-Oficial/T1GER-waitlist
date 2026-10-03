import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Check, RotateCcw } from 'lucide-react';
import type { AtomicLesson, SavedLearningArtifact } from './product/interactiveCurriculumTypes';
import type { BrainState } from './product/brainService';
import { completeApply, explainError, isComplete, prepareApply, type Mission } from './state';
import { calculateCompoundProjection } from './projection';
import { Tiger } from './Visual';
import { completionAnimation } from './mascotMotion';
import { ChoiceInteraction, CompoundingComparison, RetrievalInteraction, TeachingFeedback, TransferScenario, WorkedExample } from './LearningInteractions';
import { addLearningEvent, assessRetrieval, canAdvanceStep, coherentRule, compoundingConcept, delayedSeries, equalTimingPlans, generateGoldSession, goldRewardTitle, goldSteps, manipulationComplete, newGoldDraft, practiceScore, predictionReasons, retainLearningEvents, retrievalEvidence, retrievalVariants, structuredRule, targetMonthly, usd, validGoldDraft, validPrediction, type GoldDraft, type RetrievalResponse } from './product/learningEngine';
import { loadGoldDraft, recordGoldReview, saveGoldDraft } from './product/learningEvidence';
import './goldLesson.css';

const phases = ['hook', 'learn', 'interact', 'apply', 'master', 'reward'];
function localDraft(key: string) { try { const value: unknown = JSON.parse(localStorage.getItem(key) || 'null'); return validGoldDraft(value) && !value.finished ? value : null; } catch { return null; } }
export default function GoldLesson({ lesson, uid, brain, missions, close, preview = false }: { lesson: AtomicLesson; uid: string; brain: BrainState; missions: Mission[]; artifacts?: SavedLearningArtifact[]; close: () => void; preview?: boolean }) {
  const key = `t1ger_gold_v2_${uid}`;
  const [draft, setDraft] = useState<GoldDraft>(() => localDraft(key) || newGoldDraft());
  const [loaded, setLoaded] = useState(preview), [busy, setBusy] = useState(false), [error, setError] = useState('');
  const saving = useRef(false);
  const [year, setYear] = useState(0), [breakdown, setBreakdown] = useState(false);
  const [applySaved, setApplySaved] = useState(false);
  const wasApplied = useRef(missions.some(m => m.lessonId === lesson.id && isComplete(m)) || brain.missionHistory.some(m => m.missionId === `field-${lesson.id}` && m.completed));
  const step = goldSteps[draft.step], inputs = draft.inputs;
  const prediction = String(inputs.prediction || '');
  const setPrediction = (value: string) => input('prediction', value);
  const startAge = Number(inputs.startAge), finishAge = Number(inputs.finishAge), monthly = Number(inputs.monthly);
  const applyMonthly = Number(inputs.applyMonthly), applyYears = Number(inputs.applyYears), applyRate = Number(inputs.applyRate);
  const model = calculateCompoundProjection(applyMonthly, applyYears, applyRate);
  const currentModel = calculateCompoundProjection(monthly, finishAge - startAge, 8);
  const target = calculateCompoundProjection(100, 30, 8);
  const card = brain.fsrsCards?.[lesson.id];
  const [sessionVariant] = useState(() => generateGoldSession(card?.reps || 0).retrieval);
  const coldVariant = retrievalVariants.find(variant => variant.id === inputs.retrievalVariant) || sessionVariant;
  const recalledResult = draft.events.find(event => event.id === draft.sessionId + '-review-calculation');
  const recalledMechanism = draft.events.find(event => event.id === draft.sessionId + '-review-mechanism');
  const recalledReflection = draft.events.find(event => event.id === draft.sessionId + '-review-reflection');
  const initialRecall = recalledResult && recalledMechanism ? assessRetrieval(coldVariant, recalledResult.answer || '', recalledMechanism.answer || '', recalledReflection?.answer) : undefined;
  const manipulationPredicted = draft.events.some(event => event.name === 'manipulation_prediction' && event.interactionId === 'manipulate');
  const interpretation = draft.events.filter(event => event.name === 'manipulation_interpretation').at(-1);
  const ruleCheck = draft.events.filter(event => event.name === 'apply_rule').at(-1);
  const ruleChecked = coherentRule(inputs) && ruleCheck?.correct === true && ruleCheck.answer === JSON.stringify([inputs.ruleContribution, inputs.ruleBoundary]);

  useEffect(() => {
    let active = true;
    document.title = 'Time is the multiplier · Gold Lesson V2.1 — T1GER';
    if (!preview) void loadGoldDraft(uid).then(cloud => {
      if (!active) return;
      const cached = localDraft(key);
      const candidates = [cached, cloud && !cloud.finished ? cloud : null].filter((item): item is GoldDraft => !!item);
      setDraft(candidates.sort((a, b) => b.updatedAt - a.updatedAt)[0] || newGoldDraft());
      setLoaded(true);
    }).catch(cause => { if (active) setError(explainError(cause, 'Could not load your learning session. Reload to retry; saved progress is kept.')); });
    return () => { active = false; document.title = 'T1GER — Learn it. Apply it. Master it.'; };
  }, [key, preview, uid]);
  useEffect(() => { if (loaded) try { localStorage.setItem(key, JSON.stringify(draft)); } catch { /* Cloud checkpoints still save; in-progress typing cannot survive this browser closing. */ } }, [draft, key, loaded]);
  useEffect(() => {
    if (draft.step !== 1) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setYear(20); return; }
    const timer = window.setInterval(() => { if (!document.hidden) setYear(value => { if (value >= 20) { window.clearInterval(timer); return 20; } return value + 1; }); }, 110);
    return () => window.clearInterval(timer);
  }, [draft.step]);
  function input(name: string, value: string | number) { setDraft(current => ({ ...current, updatedAt: Date.now(), inputs: { ...current.inputs, [name]: value } })); }
  function attempt(answer: string, correct: boolean, misconceptionId: string) {
    setDraft(current => {
      let next = addLearningEvent(current, { name: 'interaction_attempt', interactionId: step.id, answer: answer.slice(0, 700), correct, assessment: 'objective' });
      if (step.id === 'worked' || step.id === 'notice' || step.id === 'contrast') next = addLearningEvent(next, { name: step.id === 'worked' ? 'calculation_result' : 'mechanism_result', interactionId: step.id, answer, correct, assessment: 'objective' });
      if (!correct) next = addLearningEvent(next, { name: 'misconception_detected', interactionId: step.id, misconceptionId });
      if (current.events.some(event => event.interactionId === step.id && event.name === 'interaction_attempt')) next = addLearningEvent(next, { name: 'retry', interactionId: step.id });
      if (step.id === 'transfer') next = addLearningEvent(next, { name: 'transfer_result', interactionId: step.id, correct, assessment: 'objective' });
      return next;
    });
  }
  async function checkpoint(next: GoldDraft) {
    if (saving.current) return;
    saving.current = true; setBusy(true); setError('');
    try { if (!preview) await saveGoldDraft(uid, next); setDraft(next); window.scrollTo(0, 0); }
    catch (cause) { setError(explainError(cause, 'Could not save this step. Your answer is still here. Retry to continue.')); }
    finally { saving.current = false; setBusy(false); }
  }
  function next(event?: Parameters<typeof addLearningEvent>[1]) {
    const updated = event ? addLearningEvent(draft, event) : draft;
    if (!canAdvanceStep(updated)) return;
    void checkpoint({ ...updated, step: draft.step + 1, updatedAt: Date.now() });
  }
  async function apply() {
    if (saving.current || !ruleChecked) return;
    saving.current = true; setBusy(true); setError('');
    const summary = `Illustration: ${usd(applyMonthly)}/month for ${applyYears} years at an assumed ${applyRate}% nominal annual rate; end-of-month deposits. Learning rule: ${structuredRule} Review: ${inputs.cadence}.`;
    try {
      if (!preview) {
        const artifact: SavedLearningArtifact = { lessonId: lesson.id, trackId: lesson.trackId, title: 'My compounding learning rule', summary, values: { monthly: applyMonthly, years: applyYears, rate: applyRate, reviewCadence: String(inputs.cadence), learningRule: structuredRule, ruleContribution: String(inputs.ruleContribution), ruleBoundary: String(inputs.ruleBoundary), optionalReflection: String(inputs.rule) }, createdAt: Date.now() };
        const score = practiceScore(draft);
        await prepareApply(uid, lesson, artifact, score);
        await completeApply(uid, lesson.id, summary.slice(0, 500), score);
      }
      setApplySaved(true);
      let updated = addLearningEvent(draft, { name: 'apply_completed', interactionId: 'apply', assessment: 'self_reported' });
      if (String(inputs.rule).trim()) updated = addLearningEvent(updated, { name: 'reflection', interactionId: 'apply', answer: String(inputs.rule), assessment: 'self_reported' });
      updated = { ...updated, inputs: { ...updated.inputs, retrievalVariant: coldVariant.id } };
      const updatedDraft = { ...updated, step: 8, updatedAt: Date.now() };
      if (!preview) await saveGoldDraft(uid, updatedDraft);
      setDraft(updatedDraft); window.scrollTo(0, 0);
    } catch (cause) { setError(explainError(cause, 'Could not save Apply. Your scenario and rule are kept. Retry safely.')); }
    finally { saving.current = false; setBusy(false); }
  }
  function checkRecall(response: RetrievalResponse) {
    const events = retrievalEvidence(draft.sessionId + '-review', coldVariant, response, 40).filter(event => !['difficulty_rating', 'retrieval_result'].includes(event.name));
    const updated = { ...draft, updatedAt: Date.now(), inputs: { ...draft.inputs, retrievalVariant: coldVariant.id }, events: retainLearningEvents([...draft.events, ...events]) };
    setDraft(updated);
    void checkpoint(updated);
  }
  async function rate(score: number, response: RetrievalResponse) {
    if (saving.current) return;
    saving.current = true; setBusy(true); setError('');
    const bundle = retrievalEvidence(draft.sessionId + '-review', coldVariant, response, score);
    let updated = { ...draft, events: retainLearningEvents([...draft.events.filter(event => !bundle.some(item => item.id === event.id)), ...bundle]) };
    if (!response.resultCorrect || !response.mechanismCorrect) updated = addLearningEvent(updated, { name: 'misconception_detected', interactionId: coldVariant.id, misconceptionId: coldVariant.misconceptionId });
    updated = addLearningEvent(updated, { name: 'lesson_completed', interactionId: 'gold-v2' });
    // Stable event ID makes retry after a lost response idempotent.
    const reviewEvent = bundle[bundle.length - 1];
    const finished = { ...updated, step: 9, finished: true, updatedAt: Date.now() };
    try { if (!preview) await recordGoldReview(uid, score, reviewEvent, finished, bundle); setDraft(finished); window.scrollTo(0, 0); }
    catch (cause) { setError(explainError(cause, 'Could not save your retrieval. Your answer is kept; retry the rating.')); }
    finally { saving.current = false; setBusy(false); }
  }
  const continueButton = (label: string, disabled = false, action = () => next()) => <button className="button primary large" disabled={busy || disabled} onClick={action}>{busy ? 'Saving…' : label}<ArrowRight size={18}/></button>;
  const slider = (name: string, label: string, min: number, max: number, stepSize: number, suffix = '') => <label className="gold-range">{label}<strong>{name.includes('Monthly') || name === 'monthly' ? usd(Number(inputs[name])) : `${inputs[name]}${suffix}`}</strong><input aria-label={label} type="range" min={min} max={max} step={stepSize} value={inputs[name]} disabled={busy || draft.step === 4 && !manipulationPredicted} onChange={event => input(name, Number(event.target.value))}/></label>;
  if (!loaded) return <main className="gold-loading"><p>{error || 'Loading your concept practice…'}</p>{error && <button className="button primary" onClick={() => window.location.reload()}>Reload session</button>}<button className="text-link" onClick={close}>Return to Learn</button></main>;
  return <div className="gold-shell"><header className="gold-header"><button className="back-button" onClick={close} disabled={busy}><ArrowLeft size={18}/>Exit lesson</button><strong>Time is the multiplier</strong><span>{draft.step + 1} / {goldSteps.length}</span></header>
    {preview && <div className="gold-preview"><span>Preview · progress is not saved</span><button onClick={() => { setDraft(newGoldDraft()); setYear(0); setBreakdown(false); setPrediction(''); setApplySaved(false); setError(''); }}><RotateCcw size={14}/>Restart</button></div>}
    <nav className="gold-phases" aria-label="Learning phases">{phases.map(phase => <span key={phase} aria-current={phase === step.phase ? 'step' : undefined}>{phase}</span>)}</nav><div className="gold-progress" role="progressbar" aria-label="Session steps completed" aria-valuemin={0} aria-valuemax={10} aria-valuenow={draft.finished ? 10 : draft.step}><span style={{ width: `${(draft.finished ? 10 : draft.step) / 10 * 100}%` }}/></div>
    <main className={`gold-stage gold-${step.id}`} key={`${draft.sessionId}-${step.id}`}><div className="gold-copy"><p className="gold-kicker">{step.title}</p>
      {draft.step === 0 && <><p className="gold-kicker">Same total money. Different timing.</p><h1>Who ends with more?</h1><p>Alex deposits $100/month for 20 years. Chris deposits $250/month during the final 8 years. Each adds $24,000. Same end date, same fixed 8% model.</p><div className="gold-options">{[{id:'early',label:'Alex — starts earlier'},{id:'late',label:'Chris — adds more each month'},{id:'equal',label:'They finish equal'},{id:'unsure',label:"I don’t know yet"}].map(option => <button key={option.id} aria-pressed={prediction === option.id} onClick={() => setPrediction(option.id)}>{option.label}</button>)}</div><label className="gold-answer">I chose this because<select value={String(inputs.predictionBasis || '')} onChange={event => input('predictionBasis', event.target.value)}><option value="">Choose a reason</option>{predictionReasons.map(reason => <option key={reason.id} value={reason.id}>{reason.label}</option>)}</select></label><details className="gold-hint"><summary>Add an optional thought</summary><label className="gold-answer">Your prediction in your own words (optional)<textarea maxLength={300} value={String(inputs.predictionReason || '')} onChange={event => input('predictionReason', event.target.value)}/></label></details>{continueButton('Reveal the comparison', !validPrediction(inputs), () => next({ name: 'prediction_answer', interactionId: 'prediction', answer: JSON.stringify({ choice: prediction, reason: inputs.predictionBasis, reflection: inputs.predictionReason || '' }), assessment: 'self_reported' }))}<p className="gold-small">Uncertainty is a valid prediction. There’s no penalty for changing your mind.</p></>}
      {draft.step === 1 && <><h1>Watch the two<br/>paths unfold.</h1><p>When do the paths separate? Alex deposits from the start. Chris starts in year 12. Compare what each adds with the ending value.</p><button className="button subtle" aria-pressed={breakdown} onClick={() => setBreakdown(value => !value)}>{breakdown ? 'Hide contribution lines' : 'Compare contributions and growth'}</button>{continueButton('Read what changed', !breakdown || year !== 20, () => next({ name: 'interaction_attempt', interactionId: 'reveal', answer: 'year-20-contributions-compared', assessment: 'self_reported' }))}<p className="gold-small">Explore the years, then compare contributions at year 20.</p></>}
      {draft.step === 2 && <ChoiceInteraction prompt="Chris adds more each month. Why does Alex end higher here?" options={[{ id: 'more', label: 'Alex deposited more money in total', feedback: 'Read the dashed contribution lines: both end at $24,000. The difference must come from another relationship.' }, { id: 'time', label: 'Alex’s deposits and their growth had more periods to grow' }, { id: 'rate', label: 'Alex was given a higher growth rate', feedback: 'Both paths use the same 8% assumption. Follow when each path starts instead: the periods available differ.' }]} correctId="time" explanation="The monthly amount alone does not decide the result. With equal total deposits and the same rate, earlier deposits have more periods for growth on growth." onAttempt={(answer, correct) => attempt(answer, correct, 'more-deposited')} onDone={() => next()} busy={busy}/>}
      {draft.step === 3 && <WorkedExample onAttempt={(answer, correct) => attempt(answer, correct, 'linear-growth')} onDone={() => next()} busy={busy}/>}
      {draft.step === 4 && <><h1>Can more money<br/>make up the gap?</h1><p>Target: start at 20, add $100/month, finish at 50. Now set the start to <strong>30</strong>, keep the finish at <strong>50</strong>, and find a monthly amount that just meets the target.</p><p>Before adjusting: with fewer years at the same rate, what probably has to happen to the monthly contribution?</p><div className="gold-options">{[{id:'increase',label:'Increase'},{id:'decrease',label:'Decrease'},{id:'same',label:'Stay roughly the same'}].map(option => <button key={option.id} disabled={manipulationPredicted || busy} aria-pressed={inputs.manipulationPrediction === option.id} onClick={() => input('manipulationPrediction', option.id)}>{option.label}</button>)}</div>{!manipulationPredicted && continueButton('Commit prediction & explore', !['increase','decrease','same'].includes(String(inputs.manipulationPrediction)), () => { setDraft(current => addLearningEvent(current, {name:'manipulation_prediction',interactionId:'manipulate',answer:String(current.inputs.manipulationPrediction),assessment:'self_reported'})); })}{slider('startAge', 'Starting age', 20, 40, 1)}{slider('finishAge', 'Finish age', 45, 65, 1)}{slider('monthly', 'Monthly contribution', 25, 500, 5)}<div className="gold-target" role="status"><span>Target {usd(target.finalValue)}</span><strong>{startAge !== 30 || finishAge !== 50 ? 'Set start to 30 and finish to 50' : currentModel.finalValue >= target.finalValue ? (manipulationComplete(inputs) ? 'Target matched' : 'Lower the amount to just meet the target') : usd(target.finalValue - currentModel.finalValue) + ' below target'}</strong></div>{manipulationPredicted && manipulationComplete(inputs) && <><h2>What compensated for fewer years?</h2><div className="gold-options">{[{id:'contributions',label:'A larger monthly contribution at the same assumed rate'},{id:'rate',label:'The rate increased automatically'},{id:'time',label:'Starting later created more growth periods'}].map(option => <button disabled={busy} key={option.id} aria-pressed={interpretation?.answer === option.id} onClick={() => setDraft(current => addLearningEvent(current, {name:'manipulation_interpretation',interactionId:'manipulate',answer:option.id,correct:option.id === 'contributions',assessment:'objective'}))}>{option.label}</button>)}</div>{interpretation && <TeachingFeedback correct={!!interpretation.correct}>{interpretation.correct ? 'The rate stayed at 8%. Adding more each month compensated for having fewer growth periods in this model.' : 'The rate did not change and there are fewer periods. Compare the monthly contributions.'}</TeachingFeedback>}</>}{continueButton('Compare the trade-off', !canAdvanceStep(draft), () => next({ name: 'interaction_attempt', interactionId: 'manipulate', answer: 'age ' + startAge + ', finish ' + finishAge + ', monthly ' + monthly, correct: true, assessment: 'objective' }))}<details className="gold-hint"><summary>Give me a hint</summary><p>Set age 30 and finish 50. The model needs about {usd(targetMonthly(30, 50))}/month. Aim within $30 above that amount. This is a comparison task, not a recommended contribution.</p></details></>}
      {draft.step === 5 && <ChoiceInteraction prompt="Which plan ends higher in this model?" context="Both use the same fixed 8% nominal annual assumption, compounded monthly, with end-of-month deposits. Compare the timing and total contributions. Does starting earlier have to win?" options={[{ id: 'earlier', label: '$100/month for 30 years', feedback: `This models ${usd(target.finalValue)}. Compare both inputs: the later plan puts in twice as much total money, which can outweigh fewer years.` }, { id: 'later', label: '$300/month for 20 years' }, { id: 'always', label: 'Timing alone decides every scenario', feedback: 'Timing is one input. Contributions and the assumed rate also change the result; real returns are uncertain.' }]} correctId="later" explanation={`At the same 8% assumption, the later plan models ${usd(calculateCompoundProjection(300, 20, 8).finalValue)}, versus ${usd(target.finalValue)}. More contributions can outweigh less time. There is no universal winning variable.`} onAttempt={(answer, correct) => attempt(answer, correct, 'time-always-wins')} onDone={() => next()} busy={busy}/>}
      {draft.step === 6 && <TransferScenario onAttempt={(answer, correct) => attempt(answer, correct, 'time-always-wins')} onDone={() => next()} busy={busy}/>}
      {draft.step === 7 && <><h1>Keep a rule.<br/>Not a forecast.</h1><p>Create a fictional scenario. Separate what you deposit from what the model assumes. No real transaction is required.</p>{slider('applyMonthly', 'Illustrative monthly amount', 25, 1500, 25)}{slider('applyYears', 'Time horizon', 5, 30, 1, ' years')}{slider('applyRate', 'Assumed nominal annual rate', 0, 10, 1, '%')}<label className="gold-answer">When time is shorter, reaching the same target at the same positive fixed rate…<select disabled={busy} value={String(inputs.ruleContribution || '')} onChange={event => input('ruleContribution', event.target.value)}><option value="">Complete the rule</option><option value="increase">may require a larger contribution.</option><option value="decrease">always requires a smaller contribution.</option><option value="same">requires the same contribution regardless of time.</option></select></label><label className="gold-answer">But starting earlier…<select disabled={busy} value={String(inputs.ruleBoundary || '')} onChange={event => input('ruleBoundary', event.target.value)}><option value="">Add the boundary</option><option value="always">always wins, whatever the contributions or rate.</option><option value="compare">does not automatically win; compare time, contributions and rate.</option></select></label><button className="button subtle" disabled={busy || !inputs.ruleContribution || !inputs.ruleBoundary} onClick={() => setDraft(current => addLearningEvent(current, {name:'apply_rule',interactionId:'apply',answer:JSON.stringify([current.inputs.ruleContribution,current.inputs.ruleBoundary]),correct:coherentRule(current.inputs),assessment:'objective'}))}>Check my rule</button>{ruleCheck && <TeachingFeedback correct={ruleChecked}>{ruleChecked ? 'This conditional rule fits the model. It is not a guarantee of real returns.' : 'Time is one input. Less time may need more contribution; earlier does not beat every possible contribution or rate. Adjust the rule and check again.'}</TeachingFeedback>}<details className="gold-hint"><summary>Add your own wording (optional)</summary><label className="gold-answer">Ungraded reflection<textarea maxLength={300} value={String(inputs.rule)} disabled={busy} onChange={event => input('rule', event.target.value)}/></label></details><label className="gold-answer">When will you revisit this illustration?<select value={inputs.cadence} disabled={busy} onChange={event => input('cadence', event.target.value)}><option value="yearly">Once a year</option><option value="quarterly">Every three months</option></select></label>{continueButton(applySaved ? 'Retry saving progress' : 'Save rule & complete Apply', !ruleChecked, () => void apply())}<p className="gold-small">The structured rule and optional reflection are saved separately. Your own wording is not graded.</p></>}
      {draft.step === 8 && <RetrievalInteraction key={coldVariant.id} variant={coldVariant} initialResponse={initialRecall} onCheck={checkRecall} onRate={(score, response) => void rate(score, response)} busy={busy} error={error}/>}
      {draft.step === 9 && <><Tiger animation={completionAnimation(wasApplied.current, 2)}/><h1>{goldRewardTitle}</h1><ul><li>Separating contributions from modeled growth</li><li>Reasoning about time in the model</li><li>Identifying growth on previous growth</li><li>Applying the model to a new scenario</li></ul><div className="gold-understood"><Check size={20}/><p>We’ll bring this idea back later to see what sticks.</p></div><p>Your rule is saved. Your recall rating schedules the next review with FSRS. Completion records practice; it does not establish mastery.</p><div className="gold-reward-meta"><span>{wasApplied.current ? 'Revisit · no duplicate lesson reward' : 'Apply saved · lesson reward credited once'}</span><span>Next review follows your recall</span></div>{continueButton('Return to Learn', false, () => { try { localStorage.removeItem(key); } catch { /* optional cache */ } close(); })}</>}
      {error && draft.step !== 8 && <p className="error" role="alert">{error}</p>}
    </div>
    {(draft.step === 0 || draft.step === 1 || draft.step === 2) && <aside className="gold-visual">{draft.step === 0 ? <div className="gold-unrevealed"><span>Equal total deposits</span><strong>$24,000<span>each</span></strong><p>Choose a prediction to reveal the two paths.</p><div className="gold-timeline"><i/><i/><i/><i/><i/><i/></div></div> : <><CompoundingComparison plans={equalTimingPlans} year={draft.step === 2 ? 20 : year} onYear={draft.step === 1 ? setYear : undefined} breakdown={draft.step === 2 || breakdown}/><p className="gold-model-note">Same end date. Fixed 8% nominal annual assumption, divided by 12. Monthly end-of-period deposits. Excludes fees, taxes, inflation and losses.</p></>}</aside>}
    {draft.step === 4 && <aside className="gold-visual"><CompoundingComparison plans={[{ label: 'Target · $100/month from age 20', color: 'early', data: delayedSeries(100, 0, finishAge - 20, 8) }, { label: `Your model · ${usd(monthly)}/month from age ${startAge}`, color: 'late', data: delayedSeries(monthly, startAge - 20, finishAge - 20, 8) }]} year={finishAge - 20} breakdown/><p className="gold-model-note">Both use the same illustrative 8% assumption. At finish ages other than 50, the chart explores those ages; the matching task’s target remains age 50.</p></aside>}
    {draft.step === 7 && <aside className="gold-visual"><CompoundingComparison plans={[{ label: 'Your fictional scenario', color: 'early', data: delayedSeries(applyMonthly, 0, applyYears, applyRate) }]} year={applyYears} breakdown/><div className="gold-output"><span>Contributions<strong>{usd(model.contributed)}</strong></span><span>Modeled growth<strong>{usd(model.growth)}</strong></span><span>Illustrative value<strong>{usd(model.finalValue)}</strong></span></div><p className="gold-model-note">End-of-month deposits. Nominal annual assumption ÷ 12, compounded monthly. Constant rates, no fees, taxes, inflation or market losses. A learning illustration, not financial advice or a promised result.</p></aside>}
    </main>
    {draft.step !== 8 && <footer className="gold-sources"><details><summary>Sources, assumptions & teaching notes</summary><p>{compoundingConcept.mentalModel}</p>{compoundingConcept.sources.map(source => <a href={source.url} target="_blank" rel="noopener noreferrer" key={source.id}><strong>{source.publisher} · {source.title} ↗</strong><span>{source.notes}</span><small>Checked {source.checkedAt} · review by {source.reviewBy}</small></a>)}<p>Original T1GER teaching. No source wording copied. This pilot has not yet been tested with real learners.</p></details></footer>}
  </div>;
}
