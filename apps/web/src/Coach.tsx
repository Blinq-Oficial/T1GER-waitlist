import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, ArrowUpRight, BookOpen, Lightbulb, Sparkles } from 'lucide-react';
import { addDoc, collection, doc, getDoc, getDocs, limitToLast, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';
import { Tiger, TigerPortrait } from './Visual';
import { hasMentorConsent, mentorConsentVersion, mentorError } from './product/webProgress';
import { appHref } from './basePath';

type Message = { role: 'user' | 'model'; text: string };
const mentorAvailable = import.meta.env.VITE_MENTOR_AVAILABLE !== 'false';
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
  const [consentError, setConsentError] = useState('');
  const consentDialog = useRef<HTMLDialogElement>(null);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (preview || !db) return;
    let active = true;
    Promise.all([
      getDocs(query(collection(db, 'users', uid, 'coachingSessions'), orderBy('timestamp', 'asc'), limitToLast(12))),
      getDoc(doc(db, 'users', uid)),
    ]).then(([snapshot, profile]) => {
      if (!active) return;
      setMessages(snapshot.docs.flatMap(item => (item.data().messages || []) as Message[]).filter(item => ['user', 'model'].includes(item.role) && typeof item.text === 'string').slice(-24));
      setAdultConfirmed(hasMentorConsent(profile.data()?.aiMentorConsent));
    }).catch(() => { if (active) { setHistoryFailed(true); setError('Your mentor settings or conversations could not load. Reload before continuing.'); } }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [uid, preview]);
  useEffect(() => { if (messages.length || busy) end.current?.scrollIntoView({ block: 'nearest' }); }, [messages.length, busy]);
  async function persist(pair: Message[]) {
    if (!db) throw new Error('Account unavailable');
    await addDoc(collection(db, 'users', uid, 'coachingSessions'), { coachId: 't1ger', schemaVersion: 2, messages: pair, summary: pair[1].text.slice(0, 100), timestamp: serverTimestamp() });
  }
  async function send(event: FormEvent) {
    event.preventDefault();
    if (!draft.trim() || busy || loading || historyFailed || unsaved || !mentorAvailable) return;
    if (!adultConfirmed) { setConsentError(''); consentDialog.current?.showModal(); return; }
    await requestReply();
  }
  async function confirmMentor() {
    if (busy) return;
    setBusy(true); setConsentError('');
    try {
      if (!preview) {
        if (!db) throw new Error('Account unavailable');
        await updateDoc(doc(db, 'users', uid), { aiMentorConsent: { adultConfirmed: true, providerConsentVersion: mentorConsentVersion, acceptedAt: serverTimestamp() } });
      }
      setAdultConfirmed(true); consentDialog.current?.close();
      await requestReply();
    } catch { setConsentError('Could not save your choice. Your question is still here; try again.'); }
    finally { setBusy(false); }
  }
  async function resetMentorChoice() {
    setBusy(true); setError('');
    try {
      if (!preview) {
        if (!db) throw new Error('Account unavailable');
        await updateDoc(doc(db, 'users', uid), { aiMentorConsent: null });
      }
      setAdultConfirmed(false);
    } catch { setError('Could not reset your AI choice. Please try again.'); }
    finally { setBusy(false); }
  }
  async function requestReply() {
    if (preview) { setError('Design preview. Sign in to use the live AI mentor.'); return; }
    setBusy(true); setError('');
    try {
      if (!functions) throw new Error('Mentor unavailable');
      const result = await httpsCallable<{ message: string; history: Message[]; language: string; adultConfirmed: boolean; providerConsentVersion: string }, { text: string }>(functions, 'askT1gerMentor', { timeout: 70000 })({ message: draft.trim(), history: messages.slice(-8), language, adultConfirmed: true, providerConsentVersion: mentorConsentVersion });
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
      {!messages.length && !loading && <div className="coach-welcome"><TigerPortrait animated className="mentor-portrait"/><h2>What’s on your mind?</h2><p>You’re exploring {pathTitle}. Start wherever you’re curious.</p><div className="prompt-grid">{prompts.map(prompt => <button key={prompt.title} disabled={busy || loading || historyFailed || !!unsaved} onClick={() => setDraft(prompt.text)}><prompt.icon size={21}/><strong>{prompt.title}</strong><ArrowUpRight size={16}/></button>)}</div></div>}
      <div className="chat-messages" aria-live="polite" aria-relevant="additions">{messages.map((message, index) => <article className={`chat-message ${message.role}`} key={index}><span>{message.role === 'user' ? 'You' : 'T1GER'}</span><p>{message.text.replace(/\*\*([^*]+)\*\*/g, '$1').replace(/^#{1,4}\s+/gm, '')}</p></article>)}{busy && <div className="coach-thinking" role="status"><Tiger animation="thinking"/><span>Thinking it through…</span></div>}</div><div ref={end}/>
      {error && <p className="error" role="alert">{error}</p>}{saveError && <div className="notice" role="alert"><p>{saveError}</p><button className="button subtle" disabled={busy} onClick={async () => { if (!unsaved) return; setBusy(true); try { await persist(unsaved); setUnsaved(null); setSaveError(''); } catch { setSaveError('Still unable to save. Your reply remains on this page.'); } finally { setBusy(false); } }}>Retry saving</button></div>}
      <form className="coach-composer" onSubmit={send}><label className="sr-only" htmlFor="coach-question">Your question</label><textarea id="coach-question" value={draft} onChange={event => setDraft(event.target.value)} maxLength={3000} rows={2} placeholder="Ask a question, explore an idea…" disabled={busy || loading || historyFailed}/><div><label>Reply in <select disabled={busy} value={language} onChange={event => setLanguage(event.target.value as 'en' | 'es')} aria-label="Mentor response language"><option value="en">English</option><option value="es">Español</option></select></label><button className="button primary" aria-label="Send question" disabled={!mentorAvailable || !draft.trim() || busy || loading || historyFailed || !!unsaved}><ArrowUp size={21}/></button></div></form><p className="coach-footnote">AI can make mistakes. Keep private information out of your questions.</p>
      <details className="coach-privacy"><summary>About AI &amp; privacy</summary><p>Your question and up to eight recent messages go to OpenRouter and ModelRun (Modular) for a reply. The mentor is for adults 18+. Your choice is saved privately in your account.</p><div><a href={appHref('/privacy')} target="_blank" rel="noreferrer">Privacy notice</a><a href="https://openrouter.ai/terms" target="_blank" rel="noreferrer">OpenRouter terms</a><a href="https://www.modular.com/legal/terms" target="_blank" rel="noreferrer">ModelRun terms</a>{adultConfirmed && <button type="button" onClick={() => void resetMentorChoice()} disabled={busy}>Reset my AI choice</button>}</div></details>
      <dialog ref={consentDialog} className="mentor-intro" aria-labelledby="mentor-intro-title" aria-describedby="mentor-intro-description" onCancel={event => { if (busy) event.preventDefault(); }}>
        <span className="mentor-intro-icon"><Sparkles size={26}/></span><h2 id="mentor-intro-title">Before we chat.</h2><p id="mentor-intro-description">Your questions and recent messages go to OpenRouter and ModelRun for AI replies. Keep private information out of your chat.</p><a href={appHref('/privacy')} target="_blank" rel="noreferrer" className="mentor-intro-link">How your chat is handled ↗</a>
        {consentError && <p className="error" role="alert">{consentError}</p>}
        <div className="mentor-intro-actions"><button className="button primary" onClick={() => void confirmMentor()} disabled={busy}>{busy ? 'One moment…' : 'I’m 18+ · Start chatting'}</button><button className="mentor-intro-later" onClick={() => consentDialog.current?.close()} disabled={busy}>Not now</button></div>
      </dialog>
    </section><aside className="coach-sidebar"><span className="editorial-icon"><Sparkles size={24}/></span><h2>Curiosity has company.</h2><p>Use your mentor to clarify an idea. Bring it back to your lesson and make it yours.</p><button className="text-link" onClick={() => go('/learn')}>Continue your path <ArrowUpRight size={17}/></button><div className="quiet-rule"/><p className="small-copy">Free mentor beta. Replies depend on daily limits and provider capacity. Your conversations are saved privately in your T1GER account.</p></aside></div></div>;
}
