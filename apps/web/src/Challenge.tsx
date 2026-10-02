import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Check } from 'lucide-react';
import type { FlashChallenge } from './product/interactiveCurriculumTypes';
import { Tiger } from './Visual';
export default function Challenge({ challenge, onDone }: { challenge: FlashChallenge; onDone: (firstTry: boolean) => void }) {
  const [choice, setChoice] = useState('');
  const [order, setOrder] = useState(() => [...(challenge.options || [])].reverse().map(option => option.id));
  const [matches, setMatches] = useState<Record<string,string>>({});
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const response = useRef<HTMLDivElement>(null);
  useEffect(() => { if (checked) response.current?.scrollIntoView({ block: 'nearest' }); }, [checked]);
  const ready = challenge.kind === 'matching' ? challenge.pairs?.every(pair => matches[pair.id]) : challenge.kind === 'ordering' ? order.length > 0 : !!choice;
  function check() {
    const result = challenge.kind === 'matching' ? !!challenge.pairs?.every(pair => matches[pair.id] === pair.id) : challenge.kind === 'ordering' ? order.join('|') === challenge.orderedIds?.join('|') : challenge.options?.find(option => option.id === choice)?.correct === true;
    setCorrect(result); setChecked(true); setAttempts(current => current + 1);
  }
  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= order.length) return;
    setOrder(current => { const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });
  }
  return <><h1>{challenge.prompt.en}</h1>
    {challenge.kind === 'matching' ? <div className="match-choices">{challenge.pairs?.map(pair => <label key={pair.id}>{pair.left.en}<select value={matches[pair.id] || ''} disabled={checked} onChange={event => setMatches(current => ({ ...current, [pair.id]: event.target.value }))}><option value="">Choose the consequence</option>{[...(challenge.pairs || [])].reverse().map(option => <option value={option.id} key={option.id}>{option.right.en}</option>)}</select></label>)}</div> : challenge.kind === 'ordering' ? <ol className="order-choices">{order.map((id,index) => <li key={id}><span>{index + 1}</span><strong>{challenge.options?.find(option => option.id === id)?.label.en}</strong><button className="button subtle" disabled={checked || index === 0} aria-label={`Move item ${index + 1} up`} onClick={() => move(index, -1)}><ArrowUp size={17}/></button><button className="button subtle" disabled={checked || index === order.length - 1} aria-label={`Move item ${index + 1} down`} onClick={() => move(index, 1)}><ArrowDown size={17}/></button></li>)}</ol> : <div className="answer-options">{challenge.options?.map(option => <button key={option.id} disabled={checked} aria-pressed={choice === option.id} className={`${choice === option.id ? 'selected' : ''} ${checked && option.correct ? 'correct' : checked && choice === option.id ? 'incorrect' : ''}`} onClick={() => setChoice(option.id)}>{option.label.en}{checked && option.correct && <Check size={18}/>}</button>)}</div>}
    <div ref={response} className={`challenge-footer ${checked ? correct ? 'is-correct' : 'is-incorrect' : ''}`}><div className="challenge-response"><Tiger animation={checked ? correct ? 'correct' : 'retry' : 'thinking'}/><div role="status">{checked ? <><strong>{correct ? challenge.feedback.correct.en : challenge.feedback.incorrect.en}</strong><p>{challenge.feedback.explanation.en}</p>{!correct && <button className="button subtle" onClick={() => setChecked(false)}>Try again</button>}</> : <p>Make your call. Then check your judgment.</p>}</div></div>
    <button className="button primary large" disabled={!ready || (checked && !correct)} onClick={() => checked ? onDone(attempts === 1) : check()}>{checked ? 'Put it to work' : 'Check my judgment'}</button></div>
  </>;
}
