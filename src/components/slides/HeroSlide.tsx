import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import AnimatedText from '../animations/AnimatedText';

interface Props {
  onSuccess: () => void;
}

export default function HeroSlide({ onSuccess }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorText, setErrorText] = useState('');

  const triggerError = (msg: string) => {
    setErrorText(msg);
    setTimeout(() => setErrorText(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      triggerError('INVALID COORDINATES. RE-ENTER EMAIL.');
      return;
    }

    setStatus('loading');

    // Mock API call
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 1000);
  };

  return (
    <section id="hero" className="min-h-screen w-full relative flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden perspective-1000">
      
      {/* LA CAPA SUPERPUESTA (Overlay negro semi-transparente para mejorar lectura) */}
      <div className="absolute inset-0 bg-obsidian/40 z-[1]" />
      
      {/* EL CONTENIDO Y LA FLUIDEZ (Texto animado y formulario con z-index superior) */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl text-center space-y-6 md:space-y-10">
        {/* Animated Headline */}
        <AnimatedText 
          text="YOUR TIME IS RUNNING OUT." 
          className="font-outfit font-black text-5xl md:text-7xl lg:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 uppercase tracking-tighter justify-center leading-[0.9]"
        />
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-[#CCFF00] font-mono tracking-widest text-xs md:text-base font-bold px-4"
        >
          THE DUOLINGO FOR FOUNDERS. BUT IT BITES BACK.
        </motion.p>

        {/* Capture Form Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, duration: 0.6, type: "spring" }}
          className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative"
        >
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-50" />

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div className="space-y-2 relative">
              <input
                type="email"
                placeholder="ENTER EMAIL ADDRESS"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrorText(''); }}
                disabled={status !== 'idle'}
                className="w-full bg-transparent border border-white/20 focus:border-[#FF6B00] rounded-xl px-6 py-4 text-white placeholder-white/40 font-mono tracking-widest text-sm outline-none transition-all focus:shadow-[inset_0_0_15px_rgba(255,107,0,0.2),_0_0_15px_rgba(255,107,0,0.3)]"
              />
              <AnimatePresence>
                {errorText && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-[#FF6B00] text-xs font-mono font-bold pl-2 absolute -bottom-5 left-0"
                  >
                    {errorText}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={status !== 'idle'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="w-full bg-[#FF6B00] text-[#050505] py-4 rounded-xl flex items-center justify-center gap-3 font-black text-xl uppercase tracking-widest relative overflow-hidden group shadow-[0_0_20px_rgba(255,107,0,0.4)] hover:shadow-[0_0_40px_rgba(255,107,0,0.6)] transition-shadow duration-300"
            >
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[glint_1s_ease-out_infinite]" />

              {status === 'loading' ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : status === 'success' ? (
                <span>ACCESS GRANTED</span>
              ) : (
                <span>JOIN THE PRIDE</span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
      
      <style>{`
        @keyframes glint {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>

    </section>
  );
}
