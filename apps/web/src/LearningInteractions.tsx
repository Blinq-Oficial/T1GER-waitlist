import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Tiger } from './Visual';
import { assessRetrieval, boundedRecallScore, numericAnswer, usd, type RetrievalResponse, type RetrievalVariant } from './product/learningEngine';

export function TeachingFeedback({ correct, children, title }: { correct: boolean; children: React.ReactNode; title?: string }) {
  return <div className={`gold-feedback ${correct ? 'is-correct' : 'is-retry'}`} role="status"><Tiger animation={correct ? 'correct' : 'retry'}/><div><strong>{title || (correct ? 'That answer fits this model.' : 'Let’s look at what changed.')}</strong><p>{children}</p></div></div>;
}
type Attempt = (answer: string, correct: boolean) => void;
export function ChoiceInteraction({ prompt, context, options, correctId, explanation, onAttempt, onDone, busy = false }: {
  prompt: string; context?: string; options: { id: string; label: string; feedback?: string }[]; correctId: string; explanation: string; onAttempt: Attempt; onDone: () => void; busy?: boolean;
}) {
  const [choice, setChoice] = useState(''), [checked, setChecked] = useState(false);
  const correct = choice === correctId;
  return <><h1>{prompt}</h1>{context && <p>{context}</p>}<div className="gold-options">{options.map(option => <button key={option.id} disabled={checked} aria-pressed={choice === option.id} onClick={() => setChoice(option.id)}>{option.label}</button>)}</div>
    {checked && <TeachingFeedback correct={correct}>{correct ? explanation : options.find(item => item.id === choice)?.feedback || explanation}</TeachingFeedback>}
    {checked && !correct && <button className="button subtle" onClick={() => { setChecked(false); setChoice(''); }}>Try a new answer</button>}
    <button className="button primary large" disabled={!choice || busy || checked && !correct} onClick={() => { if (checked) onDone(); else { onAttempt(choice, correct); setChecked(true); } }}>{busy ? 'Saving…' : checked ? 'Keep exploring' : 'Check my reasoning'}<ArrowRight size={18}/></button></>;
}
export function WorkedExample({ onAttempt, onDone, busy }: { onAttempt: Attempt; onDone: () => void; busy: boolean }) {
  const [answer, setAnswer] = useState(''), [checked, setChecked] = useState(false);
  const correct = numericAnswer(answer, 121, 0.01);
  return <><h1>Growth can grow too.</h1><p>One $100 deposit. No extra deposits. An illustrative 10% each year.</p><ol className="gold-equation"><li><span>Start</span><strong>$100</strong></li><li><span>Year 1</span><strong>$100 + $10 = $110</strong></li><li><span>Year 2</span><strong>$110 + 10% of $110</strong></li></ol><label className="gold-answer">Complete the second year’s ending value<input type="number" inputMode="decimal" value={answer} disabled={checked} onChange={event => setAnswer(event.target.value)} placeholder="Amount in dollars"/></label>
    {checked && <TeachingFeedback correct={correct} title={correct ? 'That calculation works.' : undefined}>{correct ? '10% of $110 is $11. The extra $1 comes from growth on last year’s growth: $110 + $11 = $121.' : 'Year two begins with $110, not $100. Find 10% of the new balance, then add it. The base has changed.'}</TeachingFeedback>}
    {checked && !correct && <button className="button subtle" onClick={() => { setChecked(false); setAnswer(''); }}>Complete that step again</button>}
    <button className="button primary large" disabled={!answer.trim() || busy || checked && !correct} onClick={() => { if (checked) onDone(); else { onAttempt(answer, correct); setChecked(true); } }}>{busy ? 'Saving…' : checked ? 'Try it yourself' : 'Check the step'}<ArrowRight size={18}/></button></>;
}
export function TransferScenario({ onAttempt, onDone, busy }: { onAttempt: Attempt; onDone: () => void; busy: boolean }) {
  const [periods, setPeriods] = useState(''), [choice, setChoice] = useState(''), [checked, setChecked] = useState(false);
  const correct = numericAnswer(periods, 10, 0) && choice === 'equal';
  return <><h1>New dates.<br/>Same time to grow?</h1><p>A museum puts in $1,000 in year 0 and measures it in year 10. Another puts in $1,000 in year 5 and measures it in year 15. No other deposits. Both use the same fixed 5% yearly assumption.</p><div className="gold-transfer-lines"><div><span>Museum A</span><strong>Year 0 → Year 10</strong></div><div><span>Museum B</span><strong>Year 5 → Year 15</strong></div></div><label className="gold-answer">How many growth periods does Museum B get?<input type="number" inputMode="numeric" value={periods} disabled={checked} onChange={event => setPeriods(event.target.value)}/></label><p>At each museum’s own measurement date, which value is higher?</p><div className="gold-options">{[{id:'a',label:'Museum A'},{id:'b',label:'Museum B'},{id:'equal',label:'They are equal in this model'}].map(option => <button disabled={checked} aria-pressed={choice === option.id} key={option.id} onClick={() => setChoice(option.id)}>{option.label}</button>)}</div>
    {checked && <TeachingFeedback correct={correct}>{correct ? 'Both get ten growth periods: 10 − 0 and 15 − 5. Both model $1,000 × 1.05¹⁰, about $1,629. Time available to grow matters; calendar order alone does not.' : 'Compare durations, not just who began first. Subtract each start year from its own measurement year. Then compare equal deposits at the same rate.'}</TeachingFeedback>}
    {checked && !correct && <button className="button subtle" onClick={() => { setChecked(false); setPeriods(''); setChoice(''); }}>Try the new timeline again</button>}
    <button className="button primary large" disabled={!choice || !periods.trim() || busy || checked && !correct} onClick={() => { if (checked) onDone(); else { onAttempt(`${periods} periods | ${choice}`,correct); setChecked(true); } }}>{busy ? 'Saving…' : checked ? 'Make your own illustration' : 'Check the new scenario'}<ArrowRight size={18}/></button></>;
}
export function CompoundingComparison({ plans, year, onYear, breakdown = false }: { plans: { label: string; color: string; data: { year: number; contributed: number; finalValue: number }[] }[]; year: number; onYear?: (year: number) => void; breakdown?: boolean }) {
  const end = plans[0].data.length - 1;
  const max = Math.max(1, ...plans.flatMap(plan => plan.data.map(point => point.finalValue)));
  const x = (v: number) => 38 + v / Math.max(1, end) * 500;
  const y = (v: number) => 218 - v / max * 178;
  return <div className="gold-chart"><div className="gold-chart-head"><span>Illustrative value</span><strong>Year {year}</strong></div><svg viewBox="0 0 570 255" role="img" aria-label={`Year ${year}. ${plans.map(plan => `${plan.label}: ${usd(plan.data[year].finalValue)}, ${usd(plan.data[year].contributed)} contributed`).join('. ')}`}>
    {[0, 0.5, 1].map(fraction => <g key={fraction}><line x1="38" x2="538" y1={y(max * fraction)} y2={y(max * fraction)} className="gold-grid"/><text x="38" y={y(max * fraction) - 8}>{usd(max * fraction)}</text></g>)}
    {plans.map(plan => <g key={plan.label} className={`gold-line ${plan.color}`}><polyline points={plan.data.slice(0, year + 1).map(point => `${x(point.year)},${y(point.finalValue)}`).join(' ')}/>{breakdown && <polyline className="gold-deposits" points={plan.data.slice(0, year + 1).map(point => `${x(point.year)},${y(point.contributed)}`).join(' ')}/>}<circle cx={x(year)} cy={y(plan.data[year].finalValue)} r="5"/></g>)}<text x="38" y="247">Start</text><text x="538" y="247" textAnchor="end">Year {end}</text></svg>
    {onYear && <label className="gold-range">Explore year <strong>{year}</strong><input aria-label="Explore comparison year" type="range" min="0" max={end} step="1" value={year} onChange={event => onYear(Number(event.target.value))}/></label>}
    <div className="gold-chart-values">{plans.map(plan => <div key={plan.label} className={plan.color}><span>{plan.label}</span><strong>{usd(plan.data[year].finalValue)}</strong>{breakdown && <small>{usd(plan.data[year].contributed)} deposited · {usd(Math.max(0, plan.data[year].finalValue - plan.data[year].contributed))} modeled growth</small>}</div>)}</div>{breakdown && <p className="gold-chart-note">Solid = value · Dashed = contributions</p>}
  </div>;
}

export function RetrievalInteraction({ variant, onRate, onCheck, initialResponse, busy, error }: {
  variant: RetrievalVariant; onRate: (score: number, response: RetrievalResponse) => void;
  onCheck?: (response: RetrievalResponse) => void; initialResponse?: RetrievalResponse;
  busy: boolean; error?: string;
}) {
  const [answer, setAnswer] = useState(initialResponse?.result || ''), [mechanism, setMechanism] = useState(initialResponse?.mechanism || '');
  const [reason, setReason] = useState(initialResponse?.reflection || ''), [revealed, setRevealed] = useState(!!initialResponse);
  const response = assessRetrieval(variant, answer, mechanism, reason);
  const correct = response.resultCorrect && response.mechanismCorrect;
  return <div className="gold-retrieval"><p className="gold-kicker">From memory · no chart</p><h1>{variant.prompt}</h1>{variant.context && <p>{variant.context}</p>}
    <p className="gold-small">Part A · result</p>
    {variant.options ? <div className="gold-options">{variant.options.map(option => <button key={option.id} disabled={revealed} aria-pressed={answer === option.id} onClick={() => setAnswer(option.id)}>{option.label}</button>)}</div> : <label className="gold-answer">Your amount in dollars<input type="number" inputMode="decimal" value={answer} disabled={revealed} onChange={event => setAnswer(event.target.value)}/></label>}
    <h2>{variant.mechanismPrompt}</h2><p className="gold-small">Part B · mechanism</p>
    <div className="gold-options">{variant.mechanismOptions.map(option => <button key={option.id} disabled={revealed} aria-pressed={mechanism === option.id} onClick={() => setMechanism(option.id)}>{option.label}</button>)}</div>
    <details className="gold-hint"><summary>Add an optional reflection</summary><label className="gold-answer">{variant.explanationPrompt}<textarea value={reason} maxLength={500} disabled={revealed} onChange={event => setReason(event.target.value)} placeholder="Optional, ungraded reflection"/></label></details>
    {!revealed ? <button className="button primary large" disabled={busy || !answer.trim() || !mechanism} onClick={() => { onCheck?.(response); setRevealed(true); }}>Compare with the idea<ArrowRight size={18}/></button> : <>
      <TeachingFeedback correct={response.resultCorrect} title={response.resultCorrect ? (variant.expected !== undefined ? 'That calculation works.' : 'That result fits this model.') : 'The result needs another look.'}>{response.resultCorrect ? 'Part A is correct. The mechanism is checked separately below.' : 'Part A did not match the model.'}</TeachingFeedback>
      <TeachingFeedback correct={response.mechanismCorrect} title={response.mechanismCorrect ? 'That mechanism fits this model.' : 'The mechanism needs another look.'}>{variant.answer}</TeachingFeedback>
      <p className="gold-small">Result and mechanism are checked separately. Optional wording is a reflection, not verified understanding.</p>
      <p>{correct ? 'How independently did you recall both parts? If you guessed or used help, choose Again or Hard.' : 'One objective check showed a gap. We’ll schedule another retrieval with Again.'}</p>
      <div className="gold-ratings">{[{ score: 40, label: 'Again', hint: 'I needed the explanation' }, { score: 60, label: 'Hard', hint: 'I needed effort or help' }, { score: 80, label: 'Good', hint: 'I recalled both parts' }, { score: 100, label: 'Easy', hint: 'I recalled both without help' }].map(rating => <button disabled={busy || !correct && rating.score !== 40} key={rating.label} onClick={() => onRate(boundedRecallScore(rating.score, correct), response)}><strong>{rating.label}</strong><small>{rating.hint}</small></button>)}</div>
    </>}
    {error && <p className="error" role="alert">{error}</p>}
  </div>;
}
