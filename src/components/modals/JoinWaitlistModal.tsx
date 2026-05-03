import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Twitter, MessageCircle, Copy, Loader2, Check } from 'lucide-react';
import Modal from '../Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinWaitlistModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorText, setErrorText] = useState('');
  const [shouldShake, setShouldShake] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // Mock success data
  const [position, setPosition] = useState(0);
  const [refCode, setRefCode] = useState('');

  const triggerError = (msg: string) => {
    setErrorText(msg);
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 400); // match animation duration
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      triggerError('Please enter a valid email address.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name })
      });

      const data = await res.json();

      if (res.status === 409) {
        setStatus('idle');
        triggerError('You\'re already on the list.');
        return;
      }

      if (!res.ok) {
        setStatus('idle');
        triggerError('Failed to join. Please try again.');
        return;
      }

      setPosition(data.position || 248);
      setRefCode(data.refCode || 'T1G-X9A2');
      setStatus('success');

      // Dispatch event to update navbar counter if it existed
      window.dispatchEvent(new CustomEvent('t1ger-joined'));

    } catch {
      setStatus('idle');
      triggerError('Network error. Check your connection.');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://t1ger.app/ref/${refCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={status === 'loading' ? () => {} : onClose}>
      <AnimatePresence mode="wait">
        {status !== 'success' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-serif text-[40px] leading-none text-white mb-2 uppercase text-center w-full">
              Claim your spot.
            </h2>
            <p className="text-slate-400 text-sm mb-8 text-center font-sans">
              The Black Market opens soon. Be first.
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-4 font-sans">
              <div className="space-y-1">
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrorText(''); }}
                  disabled={status === 'loading'}
                  className={`w-full bg-black/40 border ${shouldShake ? 'border-red-500/50' : 'border-white/10 focus:border-[#E8952A]/50'} rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors ${shouldShake ? 'animate-shake' : ''}`}
                />
                {errorText && (
                  <p className="text-[#E8952A] text-xs font-medium pl-1">{errorText}</p>
                )}
              </div>

              <input
                type="text"
                placeholder="Your name (optional)"
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={status === 'loading'}
                className="w-full bg-black/40 border border-white/10 focus:border-[#E8952A]/50 rounded-xl px-4 py-3 text-white placeholder-slate-500 outline-none transition-colors"
              />

              <button
                type="submit"
                disabled={status === 'loading'}
                className="btn-primary w-full py-4 rounded-xl mt-4 flex items-center justify-center gap-2 font-bold text-black"
                style={{ '--accent-color': '#E8952A' } as React.CSSProperties}
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>Claim my spot <span className="text-lg leading-none">→</span></>
                )}
              </button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center text-center"
          >
            <div className="font-serif text-[80px] leading-none text-[#E8952A] drop-shadow-[0_0_20px_rgba(232,149,42,0.4)] mb-2">
              #{position}
            </div>
            <h2 className="font-serif text-[28px] leading-none text-white mb-8 uppercase">
              You're in. The hunt begins.
            </h2>

            <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 mb-4 flex items-center justify-between font-mono text-sm group relative overflow-hidden">
              <span className="text-slate-300">t1ger.app/ref/{refCode}</span>
              
              {copied ? (
                <span className="text-[#4CAF7D] text-xs font-bold font-sans flex items-center gap-1">
                  <Check className="w-3 h-3" /> Copied!
                </span>
              ) : (
                <button 
                  onClick={handleCopy}
                  className="text-[#E8952A] text-xs font-bold uppercase tracking-wider font-sans opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 w-full mb-6">
              <button 
                onClick={handleCopy}
                className="glass-pill rounded-lg py-2 flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white"
                style={{ '--accent-color': '#ffffff' } as React.CSSProperties}
              >
                <Copy className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider font-bold">Copy link</span>
              </button>
              <a 
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm #${position} on the T1GER waitlist. Join me → https://t1ger.app/ref/${refCode}`)}`}
                target="_blank"
                rel="noreferrer"
                className="glass-pill rounded-lg py-2 flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white"
                style={{ '--accent-color': '#ffffff' } as React.CSSProperties}
              >
                <Twitter className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider font-bold">Share on X</span>
              </a>
              <a 
                href={`https://wa.me/?text=${encodeURIComponent(`I'm #${position} on the T1GER waitlist → https://t1ger.app/ref/${refCode}`)}`}
                target="_blank"
                rel="noreferrer"
                className="glass-pill rounded-lg py-2 flex flex-col items-center justify-center gap-1 text-slate-300 hover:text-white"
                style={{ '--accent-color': '#ffffff' } as React.CSSProperties}
              >
                <MessageCircle className="w-4 h-4" />
                <span className="text-[10px] uppercase tracking-wider font-bold">WhatsApp</span>
              </a>
            </div>

            <p className="text-slate-500 text-[11px] font-sans">
              Each referral moves you up 100 spots
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
