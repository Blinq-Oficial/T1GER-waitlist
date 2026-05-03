import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import ScrollReveal from '../animations/ScrollReveal';

interface Props {
  onSuccess: () => void;
}

export default function SlideCapture({ onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorText, setErrorText] = useState('');
  const [shouldShake, setShouldShake] = useState(false);

  const triggerError = (msg: string) => {
    setErrorText(msg);
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      triggerError('Invalid coordinates. Check your email.');
      return;
    }

    setStatus('loading');

    // Mock API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500); // Allow XP animation to play before sliding
    }, 1000);
  };

  return (
    <section id="capture" className="min-h-screen py-24 w-full relative flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden bg-transparent perspective-1000">
      
      {/* Background glow specific to this slide */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.05)_0%,transparent_50%)] pointer-events-none" />

      <ScrollReveal yOffset={60} duration={1}>
        <div className="w-full max-w-lg mx-auto z-10 bg-black/50 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-50" />

          <h2 className="font-outfit font-black text-5xl leading-none text-white mb-2 uppercase text-center w-full">
            CLAIM YOUR SPOT
          </h2>
          <p className="text-white/50 text-sm mb-12 text-center font-mono tracking-wider">
            THE BLACK MARKET OPENS SOON.
          </p>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2 relative">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrorText(''); }}
                disabled={status !== 'idle'}
                className={`w-full bg-white/5 border ${shouldShake ? 'border-red-500/50' : 'border-white/10 focus:border-[#FF6B00]/80 focus:bg-[#FF6B00]/5'} rounded-xl px-6 py-5 text-white placeholder-white/20 font-mono tracking-widest text-sm outline-none transition-all shadow-[inset_0_0_10px_rgba(255,107,0,0)] focus:shadow-[inset_0_0_15px_rgba(255,107,0,0.1)] ${shouldShake ? 'animate-shake' : ''}`}
              />
              {errorText && (
                <p className="text-[#FF6B00] text-xs font-mono font-bold pl-2 absolute -bottom-6 left-0">{errorText}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={status !== 'idle'}
              className="w-full btn-electric py-5 rounded-xl flex items-center justify-center gap-3 font-black text-lg uppercase tracking-wider relative overflow-hidden group"
            >
              {/* Hover Glint Effect */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-[glint_1s_ease-out_infinite]" />

              {status === 'loading' ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : status === 'success' ? (
                <span className="text-obsidian">ACCESS GRANTED</span>
              ) : (
                <span>INITIATE HUNT</span>
              )}
            </button>
          </form>

          {/* XP Gain Overlay */}
          <AnimatePresence>
            {status === 'success' && (
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: -50 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", damping: 12, stiffness: 200 }}
                className="absolute -top-12 left-1/2 -translate-x-1/2 font-mono font-black text-3xl text-[#CCFF00] drop-shadow-[0_0_20px_rgba(204,255,0,0.8)] pointer-events-none"
              >
                +1000 XP
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </ScrollReveal>

      <style>{`
        @keyframes glint {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

    </section>
  );
}
