import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Check, CornerDownLeft } from 'lucide-react';
import type { MasterySnapshot } from './product/masteryService';
import { explainError, recordReview } from './state';

const ratings = [
  { label: 'Again', score: 40, key: '1', hint: 'I forgot it' },
  { label: 'Hard', score: 60, key: '2', hint: 'I struggled' },
  { label: 'Good', score: 80, key: '3', hint: 'I recalled it' },
  { label: 'Easy', score: 100, key: '4', hint: 'It was clear' },
];

export default function Review({ uid, snapshot, onLearn, preview = false }: { uid: string; snapshot: MasterySnapshot; onLearn: () => void; preview?: boolean }) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [reviewedIds, setReviewedIds] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const remaining = snapshot.due.filter(entry => !reviewedIds.includes(entry.lesson.id));
  const item = remaining[0];
  const total = reviewedIds.length + remaining.length;

  const rate = useCallback(async (score: number) => {
    if (!item || busy) return;
    setBusy(true);
    setError('');
    try {
      if (!preview) await recordReview(uid, item.lesson.id, score);
      setReviewedIds(ids => [...ids, item.lesson.id]);
      setRevealed(false);
      setAnswer('');
    } catch (cause) {
      setError(explainError(cause, 'Could not save review. Please retry.'));
    } finally {
      setBusy(false);
    }
  }, [busy, item, preview, uid]);

  useEffect(() => {
    if (!sessionStarted || !item) return;
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"]') || event.altKey || event.ctrlKey || event.metaKey) return;
      if (!revealed && event.key === 'Enter' && answer.trim()) {
        event.preventDefault();
        setRevealed(true);
      } else if (revealed && !busy) {
        const rating = ratings.find(entry => entry.key === event.key);
        if (rating) { event.preventDefault(); void rate(rating.score); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [answer, busy, item, rate, revealed, sessionStarted]);

  const nextReview = snapshot.nextDueAt?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return <div className="page master-page">
    {!sessionStarted ? <>
      <div className="page-top"><p className="eyebrow">MASTER / YOUR MEMORY</p><h1>Make it stick.</h1><p className="muted">A few minutes now. More to remember later.</p></div>
      {item ? <section className="master-hero due" aria-label={`${remaining.length} reviews due`}>
        <div className="master-hero-copy"><p className="eyebrow">TODAY'S RECALL</p><h2>{remaining.length} concept{remaining.length === 1 ? '' : 's'} ready.</h2><p>Retrieve the idea before you see the answer.</p><button className="button primary large" onClick={() => setSessionStarted(true)}>Start review <ArrowRight size={19}/></button></div>
        <div className="master-hero-visual" aria-hidden="true"><span>MEMORY / ACTIVE</span><strong>{String(remaining.length).padStart(2, '0')}</strong><div className="memory-lines">{remaining.slice(0, 6).map(entry => <i key={entry.lesson.id}/>)}</div><small>Due now</small></div>
      </section> : <section className="master-hero caught-up"><div className="master-hero-copy"><p className="eyebrow">TODAY'S RECALL</p><h2>You're caught up.</h2><p>{snapshot.learnedCount ? nextReview ? `Next review scheduled for ${nextReview}.` : 'Your next review will appear when it is due.' : 'Apply your first lesson to start a memory queue.'}</p><button className="button subtle" onClick={onLearn}>Continue learning <ArrowRight size={18}/></button></div><div className="master-hero-visual" aria-hidden="true"><span>MEMORY / CLEAR</span><strong>00</strong><Check size={36}/><small>Nothing due</small></div></section>}
      <section className="memory-section"><div className="section-heading"><div><p className="eyebrow">YOUR MEMORY</p><h2>Ideas worth keeping.</h2></div><span>{snapshot.learnedCount} learned</span></div>
        {snapshot.recent.length ? <div className="memory-list">{snapshot.recent.map(entry => <div key={entry.lesson.id} className="memory-row"><span className="memory-index">{String(entry.lesson.order).padStart(2, '0')}</span><div><strong>{entry.lesson.title.en}</strong><p>{entry.lesson.keyConcept.en}</p></div><span>{entry.dueAt.getTime() <= Date.now() ? 'Due now' : `Next ${entry.dueAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}</span></div>)}</div> : <p className="memory-empty">Your learned concepts will appear here after your first Apply step.</p>}
      </section>
    </> : item ? <section className="review-session" aria-label="Review session">
      <div className="review-session-head"><button className="text-link" onClick={() => setSessionStarted(false)}>← Back to Master</button><span>REVIEW {String(reviewedIds.length + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span></div>
      <div className="review-session-progress" aria-label={`${reviewedIds.length} of ${total} reviews completed`}><span style={{ width: `${total ? (reviewedIds.length / total) * 100 : 0}%` }}/></div>
      <div className="review-session-body"><p className="eyebrow">{item.lesson.title.en.toUpperCase()} / FROM MEMORY</p><h1>{item.lesson.learningDesign.retrievalPrompt.en}</h1><p className="review-instruction">Say it in your own words. A short answer is enough.</p><label className="sr-only" htmlFor="recall">Your answer</label><textarea id="recall" value={answer} onChange={event => setAnswer(event.target.value)} placeholder="What do you remember?" disabled={revealed}/>
        {!revealed ? <button className="button primary large" onClick={() => setRevealed(true)} disabled={!answer.trim()}>Reveal the idea <ArrowRight size={18}/></button> : <><div className="answer-reveal"><span>THE CORE IDEA</span><p>{item.lesson.learningDesign.retrievalAnswer.en}</p></div><p className="rate-label">How well did you remember?</p><div className="rating-row">{ratings.map(entry => <button key={entry.key} disabled={busy} onClick={() => void rate(entry.score)}><kbd>{entry.key}</kbd><strong>{entry.label}</strong><small>{entry.hint}</small></button>)}</div></>}
        {error && <p className="error" role="alert">{error}</p>}
      </div><div className="review-session-foot"><span>RETRIEVE → REVEAL → RATE</span><span><CornerDownLeft size={13}/> Enter to reveal · 1–4 to rate</span></div>
    </section> : <section className="master-session-done"><div className="done-mark"><Check size={30}/></div><p className="eyebrow">SESSION COMPLETE</p><h1>You brought it back.</h1><p>{reviewedIds.length} concept{reviewedIds.length === 1 ? '' : 's'} reviewed. Your next queue will follow your recall.</p><button className="button primary" onClick={() => setSessionStarted(false)}>Back to Master <ArrowRight size={17}/></button></section>}
  </div>;
}
