import React from 'react';
import { ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  onClick: () => void;
  showText?: boolean;
}

export default function JoinPill({ onClick, showText = true }: Props) {
  return (
    <motion.button
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200, damping: 20 }}
      onClick={onClick}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 glass-pill rounded-full border border-white/10 p-2 pr-6 flex items-center justify-center gap-4 group transition-all duration-300 hover:scale-105 active:scale-95 ${!showText ? 'pr-2' : ''}`}
      style={{ '--accent-color': '#FF6B00' } as React.CSSProperties}
    >
      <div className="w-10 h-10 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.6)] animate-haptic">
        <ChevronDown className="w-5 h-5 text-obsidian font-black group-hover:translate-y-1 transition-transform" />
      </div>
      {showText && (
        <span className="font-sans font-bold text-sm tracking-widest uppercase text-white group-hover:text-[#FF6B00] transition-colors">
          Join the Pride
        </span>
      )}
    </motion.button>
  );
}
