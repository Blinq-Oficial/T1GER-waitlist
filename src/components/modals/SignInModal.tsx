import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, CheckCircle2 } from 'lucide-react';
import Modal from '../Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SignInModal({ isOpen, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success'>('idle');
  const [errorText, setErrorText] = useState('');
  const [shouldShake, setShouldShake] = useState(false);

  const triggerError = (msg: string) => {
    setErrorText(msg);
    setShouldShake(true);
    setTimeout(() => setShouldShake(false), 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      triggerError('Please enter a valid email address.');
      return;
    }

    // Success placeholder logic for now
    setStatus('success');
    setTimeout(() => {
        setStatus('idle');
        setEmail('');
        onClose();
    }, 3000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <AnimatePresence mode="wait">
        {status !== 'success' ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="w-full flex flex-col items-center"
          >
            <h2 className="font-serif text-[40px] leading-none text-white mb-8 uppercase text-center w-full">
              Welcome back.
            </h2>

            <form onSubmit={handleSubmit} className="w-full space-y-4 font-sans">
              <div className="space-y-1">
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setErrorText(''); }}
                    className={`w-full bg-black/40 border pl-12 pr-4 ${shouldShake ? 'border-red-500/50' : 'border-white/10 focus:border-white/30'} rounded-xl py-3 text-white placeholder-slate-500 outline-none transition-colors ${shouldShake ? 'animate-shake' : ''}`}
                    />
                </div>
                {errorText && (
                  <p className="text-[#E8952A] text-xs font-medium pl-1 mt-1">{errorText}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl mt-2 flex items-center justify-center font-bold text-white bg-white/10 border border-white/20 hover:bg-white/15 transition-colors"
              >
                Send magic link
              </button>
            </form>

            <div className="w-full flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-slate-500 text-xs font-medium uppercase tracking-wider">Or continue with</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <div className="w-full space-y-3">
              <button 
                onClick={() => alert("Coming soon")}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-3 bg-white text-black font-semibold hover:bg-slate-200 transition-colors"
              >
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
                Google
              </button>
              <button 
                 onClick={() => alert("Coming soon")}
                className="w-full py-3 rounded-xl flex items-center justify-center gap-3 bg-black/50 border border-white/10 text-white font-semibold hover:bg-white/5 transition-colors"
                >
                 Apple
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full flex flex-col items-center text-center py-6"
          >
            <div className="w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mb-6 text-green-400">
               <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-[32px] leading-none text-white mb-4 uppercase">
              Check your email
            </h2>
            <p className="text-slate-400 font-sans">
              We sent a secure sign-in link to<br/>
              <strong className="text-white mt-1 block">{email}</strong>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
}
