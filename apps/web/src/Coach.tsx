import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowUp, BookOpen, Lightbulb, MessageCirclePlus, Puzzle, Sparkles } from 'lucide-react';
import { addDoc, collection, doc, getDoc, getDocs, limitToLast, orderBy, query, serverTimestamp, updateDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { db, functions } from './firebase';
import { Tiger, TigerPortrait } from './Visual';
import { hasMentorConsent, mentorConsentVersion, mentorError } from './product/webProgress';
import { appHref } from './basePath';
import './mentor.css';

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
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (input.current) { input.current.style.height = 'auto'; input.current.style.height = Math.min(input.current.scrollHeight, 128) + 'px'; } }, [draft]);
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
  const locked = busy || loading || historyFailed || !!unsaved;
  const prompts = [
    { icon: Lightbulb, title: 'Make it click', text: 'Explain one important idea from ' + pathTitle + ' with a simple example.' },
    { icon: BookOpen, title: 'Quiz me', text: 'Ask me one retrieval question about ' + pathTitle + '. Wait for my answer.' },
    { icon: Puzzle, title: 'Try an exercise', text: 'Give me a small educational exercise for ' + pathTitle + '.' },
    { icon: Sparkles, title: 'A real-life example', text: 'Show how an idea from ' + pathTitle + ' could be useful in everyday life. Keep it educational.' },
  ];
  return <section className="page mentor-studio" aria-labelledby="mentor-title">
    <header className="mentor-header"><button className="icon-button mentor-back" onClick={() => go('/learn')} aria-label="Back to learning"><ArrowLeft size={20}/></button><div className="mentor-identity"><TigerPortrait/><div><h1 id="mentor-title">T1GER AI</h1><p>Your learning companion <span>· Beta</span></p></div></div><button className="icon-button mentor-new" disabled={locked || !messages.length} aria-label="Start a new conversation" title="Start a new conversation. Saved chats stay in your account." onClick={() => { setMessages([]); setError(''); input.current?.focus(); }}><MessageCirclePlus size={22}/></button></header>
    <div className="mentor-scroll">
      {!mentorAvailable && <p className="notice" role="status">Your mentor is getting ready. Keep learning while we finish connecting it.</p>}
      {loading && <div className="mentor-loading" role="status"><span className="mentor-dots"><i/><i/><i/></span>Opening your conversations…</div>}
      {!messages.length && !loading && !busy && <div className="mentor-empty"><div className="mentor-orb"><span className="mentor-orb-glow"/><Tiger animation="welcome"/></div><p className="eyebrow">A little curiosity goes a long way</p><h2>What’s on your mind?</h2><p>Exploring {pathTitle}? Let’s make it click.</p><div className="mentor-prompts">{prompts.map(prompt => <button key={prompt.title} disabled={locked || !mentorAvailable} onClick={() => { setDraft(prompt.text); input.current?.focus(); }}><prompt.icon size={19}/><span>{prompt.title}</span></button>)}</div></div>}
      <div className="mentor-messages" role="log" aria-label="Conversation with your AI mentor" aria-live="polite" aria-relevant="additions">{messages.map((message, index) => <article className={'mentor-message ' + message.role} key={index}>{message.role === 'model' && <TigerPortrait/>}<div><span className="mentor-speaker">{message.role === 'user' ? 'You' : 'T1GER'}</span><div className="mentor-reply">{message.text.split(/\n\n+/).map((paragraph, i) => <p key={i}>{paragraph.replace(/^#{1,4}\s+/gm, '').split(/(\*\*[^*]+\*\*)/g).map((part, j) => part.startsWith('**') && part.endsWith('**') ? <strong key={j}>{part.slice(2, -2)}</strong> : part)}</p>)}</div></div></article>)}{busy && <div className="mentor-thinking" role="status"><Tiger animation="thinking"/><span>Thinking it through<span className="mentor-dots"><i/><i/><i/></span></span></div>}</div><div ref={end}/>
    </div>
    <div className="mentor-bottom">{error && <div className="mentor-error" role="alert"><p>{error}</p>{historyFailed && <button className="button subtle" onClick={() => window.location.reload()}>Reload conversations</button>}</div>}{saveError && <div className="mentor-error" role="alert"><p>{saveError}</p><button className="button subtle" disabled={busy} onClick={async () => { if (!unsaved) return; setBusy(true); try { await persist(unsaved); setUnsaved(null); setSaveError(''); } catch { setSaveError('Still unable to save. Your reply remains on this page.'); } finally { setBusy(false); } }}>Retry saving</button></div>}
      <form className="mentor-composer" onSubmit={send}><label className="sr-only" htmlFor="coach-question">Your question</label><textarea ref={input} id="coach-question" value={draft} onChange={event => setDraft(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); event.currentTarget.form?.requestSubmit(); } }} maxLength={3000} rows={1} placeholder="Ask anything about your learning…" disabled={locked || !mentorAvailable}/><button type="submit" className="button primary mentor-send" aria-label={busy ? 'Waiting for your mentor' : 'Send question'} disabled={!mentorAvailable || !draft.trim() || locked}><ArrowUp size={23}/></button></form>
      <div className="mentor-controls"><label>Reply in <select disabled={busy} value={language} onChange={event => setLanguage(event.target.value as 'en' | 'es')} aria-label="Mentor response language"><option value="en">English</option><option value="es">Español</option></select></label><span>AI can make mistakes.</span><details className="mentor-privacy"><summary>AI &amp; privacy</summary><div><p>Your question and up to eight recent messages go to OpenRouter and Novita AI. For adults 18+. Keep private information out of your questions. Free replies depend on daily limits and provider capacity.</p><a href={appHref('/privacy')} target="_blank" rel="noreferrer">Privacy notice</a><a href="https://openrouter.ai/terms" target="_blank" rel="noreferrer">OpenRouter terms</a><a href="https://novita.ai/legal/terms-of-service" target="_blank" rel="noreferrer">Novita terms</a>{adultConfirmed && <button type="button" onClick={() => void resetMentorChoice()} disabled={busy}>Reset my AI choice</button>}</div></details></div>
    </div>
    <dialog ref={consentDialog} className="mentor-intro" aria-labelledby="mentor-intro-title" aria-describedby="mentor-intro-description" onCancel={event => { if (busy) event.preventDefault(); }}>
      <span className="mentor-intro-icon"><Sparkles size={26}/></span><h2 id="mentor-intro-title">Before we chat.</h2><p id="mentor-intro-description">Your questions and recent messages go to OpenRouter and Novita AI for replies. Keep private information out of your chat.</p><a href={appHref('/privacy')} target="_blank" rel="noreferrer" className="mentor-intro-link">How your chat is handled ↗</a>
      {consentError && <p className="error" role="alert">{consentError}</p>}<div className="mentor-intro-actions"><button className="button primary" onClick={() => void confirmMentor()} disabled={busy}>{busy ? 'One moment…' : 'I’m 18+ · Start chatting'}</button><button className="mentor-intro-later" onClick={() => consentDialog.current?.close()} disabled={busy}>Not now</button></div>
    </dialog>
  </section>;
}
