import { useState } from 'react';
import { ArrowRight, Brain, Check } from 'lucide-react';
import type { MasterySnapshot } from './product/masteryService';
import { explainError, recordReview } from './state';

export default function Review({ uid, snapshot, onLearn }: { uid: string; snapshot: MasterySnapshot; onLearn: () => void }) {
  const [reviewedIds, setReviewedIds] = useState<string[]>([]); const [revealed, setRevealed] = useState(false);
  const [answer, setAnswer] = useState(''); const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const remaining = snapshot.due.filter(entry => !reviewedIds.includes(entry.lesson.id));
  const item = remaining[0];
  async function rate(score: number) {
    if (!item) return; setBusy(true); setError('');
    try { await recordReview(uid, item.lesson.id, score); setReviewedIds(ids => [...ids, item.lesson.id]); setRevealed(false); setAnswer(''); }
    catch (cause) { setError(explainError(cause, 'Could not save review.')); }
    finally { setBusy(false); }
  }
  return <div className="page master-page"><div className="page-top"><p className="eyebrow">MASTER</p><h1>Keep it with you.</h1><p className="muted">Recall first. Check your answer. Then rate how well you remembered.</p></div>
    {item ? <div className="review-canvas"><div className="review-side"><Brain size={27}/><p className="eyebrow">REVIEW {reviewedIds.length + 1} / {reviewedIds.length + remaining.length}</p><h2>{item.lesson.title.en}</h2><p>Bring the idea back before checking the answer.</p></div><div className="review-main"><p className="eyebrow">FROM MEMORY</p><h2>{item.lesson.learningDesign.retrievalPrompt.en}</h2><label className="sr-only" htmlFor="recall">Your answer</label><textarea id="recall" value={answer} onChange={e => setAnswer(e.target.value)} placeholder="Put the idea into your own words…" disabled={revealed}/>{!revealed ? <button className="button primary" onClick={() => setRevealed(true)} disabled={!answer.trim()}>Check answer <ArrowRight size={18}/></button> : <><div className="answer-reveal"><span>THE CORE IDEA</span><p>{item.lesson.learningDesign.retrievalAnswer.en}</p></div><p className="rate-label">How did recall feel?</p><div className="rating-row">{[['Again', 40], ['Hard', 60], ['Good', 80], ['Easy', 100]].map(([label, score]) => <button key={label} disabled={busy} onClick={() => void rate(Number(score))}>{label}</button>)}</div></>}{error && <p className="error" role="alert">{error}</p>}</div></div> : <div className="master-empty"><div className="master-empty-icon"><Check size={32}/></div><p className="eyebrow">MEMORY QUEUE CLEAR</p><h2>All caught up.</h2><p>{snapshot.learnedCount ? 'The concepts you learned are scheduled. Come back when the next review is due.' : 'Complete and apply a lesson to begin building your review queue.'}</p><button className="button subtle" onClick={onLearn}>Continue learning <ArrowRight size={17}/></button></div>}
    <div className="master-bottom"><div><p className="eyebrow">RECENT CONCEPTS</p>{snapshot.recent.length ? snapshot.recent.map(entry => <span key={entry.lesson.id}>{entry.lesson.title.en}</span>) : <p>Nothing learned yet.</p>}</div><div><p className="eyebrow">YOUR MEMORY</p><strong>{snapshot.learnedCount}</strong><span>concept{snapshot.learnedCount === 1 ? '' : 's'} in practice</span></div></div>
  </div>;
}


