import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyRound, ArrowRight } from 'lucide-react';
import Modal from '../Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegularWaitlist: () => void;
}

export default function VipCodeModal({ isOpen, onClose, onOpenRegularWaitlist }: Props) {
  const [code, setCode] = useState('');
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

    if (!code) {
      triggerError('Please enter a code.');
      return;
    }

    if (!code.startsWith('T1GER-')) {
      triggerError('Invalid VIP code format.');
      return;
    }

    // Success placeholder logic for now
    alert('Valid VIP code: Access granted (placeholder)');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full flex flex-col items-center"
      >
        <div className="w-12 h-12 rounded-full bg-[#E8952A]/10 border border-[#E8952A]/30 flex items-center justify-center mb-6 text-[#E8952A] shadow-[inset_0_0_15px_rgba(232,149,42,0.2)]">
          <KeyRound className="w-6 h-6" />
        </div>

        <h2 className="font-serif text-[40px] leading-none text-white mb-2 uppercase text-center w-full">
          Enter VIP Code
        </h2>
        <p className="text-slate-400 text-sm mb-8 text-center font-sans">
          Got a code from a founding member?
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-4 font-sans flex flex-col items-center">
          <div className="space-y-1 w-full relative">
            <input
              type="text"
              placeholder="T1GER-XXXX-XXXX"
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setErrorText(''); }}
              className={`w-full bg-black/40 border ${shouldShake ? 'border-red-500/50' : 'border-[#E8952A]/40 focus:border-[#E8952A]'} rounded-xl px-4 py-4 text-center text-[#E8952A] font-mono font-bold tracking-[0.2em] placeholder-[#E8952A]/30 outline-none transition-colors shadow-[inset_0_0_10px_rgba(232,149,42,0.1)] ${shouldShake ? 'animate-shake' : ''}`}
            />
            {errorText && (
              <p className="text-[#E8952A] text-xs font-medium pl-1 text-center mt-2">{errorText}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-4 rounded-xl mt-4 flex items-center justify-center gap-2 font-bold text-black border border-[#E8952A]/50"
            style={{ '--accent-color': '#E8952A' } as React.CSSProperties}
          >
            Unlock access <ArrowRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              onClose();
              setTimeout(onOpenRegularWaitlist, 150); // slight delay to allow closing transition
            }}
            className="mt-6 text-slate-400 text-sm hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
          >
            Join the regular waitlist instead
          </button>
        </form>
      </motion.div>
    </Modal>
  );
}
