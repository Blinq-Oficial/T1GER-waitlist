import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, ArrowUpRight, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { addDoc, collection, getDocs, limitToLast, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';
import { Tiger } from './Visual';
import { mentorError } from './product/webProgress';

type Message = { role: 'user' | 'model'; text: string };
const mentorAvailable = import.meta.env.VITE_MENTOR_AVAILABLE === 'true';
export default function Coach({ uid, pathTitle, preview, go }: { uid: string; pathTitle: string; preview: boolean; go: (path: string) => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(!preview);
  const [error, setError] = useState('');
  const [historyFailed, setHistoryFailed] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [unsaved, setUnsaved] = useState<Message[] | null>(null);
  const [language, setLanguage] = useState<'en' | 'es'>('en');
  const [adultConfirmed, setAdultConfirmed] = useState(false);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (preview || !db) return;
    let active = true;
    getDocs(query(collection(db, 'users', uid, 'coachingSessions'), orderBy('timestamp', 'asc'), limitToLast(12))).then(snapshot => {
      if (active) setMessages(snapshot.docs.flatMap(item => (item.data().messages || []) as Message[]).filter(item => ['user', 'model'].includes(item.role) && typeof item.text === 'string').slice(-24));
    }).catch(() => { if (active) { setHistoryFailed(true); setError('Your earlier conversations could not load. Reload to recover them before continuing.'); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [uid, preview]);
  useEffect(() => { if (messages.length || busy) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages.length, busy]);
  async function persist(pair: Message[]) {
    if (!db) throw new Error('Account unavailable');
    await addDoc(collection(db, 'users', uid, 'coachingSessions'), { coachId: 't1ger', schemaVersion: 2, messages: pair, summary: pair[1].text.slice(0, 100), timestamp: serverTimestamp() });
  }
  async function send(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || busy || loading || historyFailed || unsaved || !mentorAvailable || !adultConfirmed) return;
    if (preview) { setError('Design preview. Sign in to use the live AI mentor.'); return; }
    setBusy(true); setError('');
    try {
      if (!functions) throw new Error('Mentor unavailable');
      const result = await httpsCallable<{ message: string; history: Message[]; language: string; adultConfirmed: boolean; providerConsentVersion: string }, { text: string }>(functions, 'askT1gerMentor', { timeout: 70000 })({ message: draft.trim(), history: messages.slice(-8), language, adultConfirmed, providerConsentVersion: 'openrouter-deepinfra-v1' });
      if (!result.data.text?.trim()) throw new Error('Empty reply');
      const pair: Message[] = [{ role: 'user', text: draft.trim() }, { role: 'model', text: result.data.text.trim() }];
      setMessages(previous => [...previous, ...pair]); setDraft('');
      try { await persist(pair); } catch { setUnsaved(pair); setSaveError('Reply received. Conversation could not save. Keep this page open and retry saving.'); }
    } catch (cause) { setError(mentorError(cause)); }
    finally { setBusy(false); }
  }
  const prompts = [{ icon: Lightbulb, title: 'Make it click', text: `Explain one important idea from ${pathTitle} with a simple example.` }, { icon: BookOpen, title: 'Test my understanding', text: `Ask me one retrieval question about ${pathTitle}. Wait for my answer.` }, { icon: Sparkles, title: 'Put it into practice', text: `Give me a small educational exercise for ${pathTitle}.` }];
  return <div className="page coach-page"><header className="page-top"><p className="eyebrow">Your AI learning companion</p><h1>Think it through.</h1><p className="muted">Think it through with T1GER. Examples, explanations and a little guidance.</p></header>
    <div className="coach-layout"><section className="coach-conversation" aria-label="Conversation with your AI mentor">
      {!mentorAvailable && <p className="notice" role="status">Your mentor is getting ready. Lessons are available while we finish connecting it.</p>}
      {loading && <p role="status">Loading your conversations…</p>}
      {!messages.length && !loading && <div className="coach-welcome"><Tiger animation="welcome"/><h2>What’s on your mind?</h2><p>You’re exploring {pathTitle}. Start wherever you’re curious.</p><div className="prompt-grid">{prompts.map(prompt => <button key={prompt.title} onClick={() => setDraft(prompt.text)}><prompt.icon size={21}/><strong>{prompt.title}</strong><ArrowUpRight size={16}/></button>)}</div></div>}
      <div className="chat-messages" aria-live="polite" aria-relevant="additions">{messages.map((message, index) => <article className={`chat-message ${message.role}`} key={index}><span>{message.role === 'user' ? 'You' : 'T1GER'}</span><p>{message.text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/^#{1,4}\s+/gm, '')}</p></article>)}{busy && <div className="coach-thinking" role="status"><Tiger animation="thinking"/><span>Thinking it through…</span></div>}</div><div ref={end}/>
      {error && <p className="error" role="alert">{error}</p>}{saveError && <div className="notice" role="alert"><p>{saveError}</p><button className="button subtle" disabled={busy} onClick={async () => { if (!unsaved) return; setBusy(true); try { await persist(unsaved); setUnsaved(null); setSaveError(''); } catch { setSaveError('Still unable to save. Your reply remains on this page.'); } finally { setBusy(false); } }}>Retry saving</button></div>}
      <div className="notice"><label><input type="checkbox" checked={adultConfirmed} onChange={event => setAdultConfirmed(event.target.checked)} disabled={busy}/> I am 18 or older and agree to send my question and recent chat history to OpenRouter and DeepInfra for an AI reply.</label><p className="small-copy">The AI mentor is for adults. <a href="https://openrouter.ai/terms" target="_blank" rel="noreferrer">OpenRouter terms</a> · <a href="https://deepinfra.com/terms" target="_blank" rel="noreferrer">DeepInfra terms</a> · <button className="text-link" type="button" onClick={() => go('/privacy')}>T1GER privacy notice</button></p></div>
      <form className="coach-composer" onSubmit={send}><label className="sr-only" htmlFor="coach-question">Your question</label><textarea id="coach-question" value={draft} onChange={event => setDraft(event.target.value)} maxLength={3000} rows={2} placeholder="Ask a question, explore an idea…" disabled={busy || loading || historyFailed}/><div><label>Reply in <select value={language} onChange={event => setLanguage(event.target.value as 'en' | 'es')} aria-label="Mentor response language"><option value="en">English</option><option value="es">Español</option></select></label><button className="button primary" aria-label="Send question" disabled={!mentorAvailable || !adultConfirmed || !draft.trim() || busy || loading || historyFailed || !!unsaved}><ArrowUp size={21}/></button></div></form><p className="coach-footnote">AI can make mistakes. Check important claims against your lesson sources. Keep private information out of your questions.</p>
    </section><aside className="coach-sidebar"><span className="editorial-icon"><Sparkles size={24}/></span><h2>Curiosity has company.</h2><p>Use your mentor to clarify an idea. Bring it back to your lesson and make it yours.</p><button className="text-link" onClick={() => go('/learn')}>Continue your path <ArrowUpRight size={17}/></button><div className="quiet-rule"/><p className="small-copy">Lessons and AI conversations share your T1GER account across Web and mobile.</p></aside></div></div>;
}
