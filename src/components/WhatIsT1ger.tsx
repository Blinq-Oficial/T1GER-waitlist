import { motion } from 'framer-motion';

export default function WhatIsT1ger() {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 relative z-20"
    >
      <div className="text-center w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Eyebrow */}
        <span className="text-[#E8952A] text-sm sm:text-[11px] tracking-[3px] uppercase font-bold mb-6 font-sans">
          WHAT IS T1GER
        </span>
        
        {/* Headline */}
        <h2 className="font-serif text-[clamp(40px,7vw,72px)] leading-tight text-white mb-8 tracking-normal">
          The only metric that matters is showing up.
        </h2>
        
        {/* Body Text */}
        <p className="text-slate-400 text-base md:text-lg max-w-[520px] mx-auto text-center leading-relaxed mb-16 font-sans">
          T1GER is a game engine for your real life. Complete a mission — gym, study session, business task. Snap a photo. AI verifies it happened. You earn XP. No proof, no credit.
        </p>
        
        {/* Pills */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-3xl mb-8">
          <div className="glass-pill inline-flex items-center rounded-full px-5 py-2.5 font-sans" style={{ '--accent-color': '#E8952A' } as React.CSSProperties}>
            <span className="w-2 h-2 rounded-full bg-[#E8952A] shadow-[0_0_8px_#E8952A] animate-pulse mr-3" />
            <span className="text-white font-medium text-sm drop-shadow-[0_0_4px_rgba(232,149,42,0.5)]">31 day streak</span>
          </div>
          <div className="glass-pill inline-flex items-center rounded-full px-5 py-2.5 font-sans" style={{ '--accent-color': '#4CAF7D' } as React.CSSProperties}>
            <span className="w-2 h-2 rounded-full bg-[#4CAF7D] shadow-[0_0_8px_#4CAF7D] mr-3" />
            <span className="text-white font-medium text-sm drop-shadow-[0_0_4px_rgba(76,175,125,0.5)]">Mission complete</span>
          </div>
          <div className="glass-pill inline-flex items-center rounded-full px-5 py-2.5 font-sans" style={{ '--accent-color': '#8B73FF' } as React.CSSProperties}>
            <span className="w-2 h-2 rounded-full bg-[#8B73FF] shadow-[0_0_8px_#8B73FF] mr-3" />
            <span className="text-white font-medium text-sm drop-shadow-[0_0_4px_rgba(139,115,255,0.5)]">Deep study · 2hr</span>
          </div>
          <div className="glass-pill inline-flex items-center rounded-full px-5 py-2.5 font-sans" style={{ '--accent-color': '#FFC107' } as React.CSSProperties}>
            <span className="w-2 h-2 rounded-full bg-[#FFC107] shadow-[0_0_8px_#FFC107] animate-pulse mr-3" />
            <span className="text-white font-medium text-sm drop-shadow-[0_0_4px_rgba(255,193,7,0.5)]">Proof verified</span>
          </div>
          <div className="glass-pill inline-flex items-center rounded-full px-5 py-2.5 font-sans" style={{ '--accent-color': '#FFEB3B' } as React.CSSProperties}>
            <span className="w-2 h-2 rounded-full bg-[#FFEB3B] shadow-[0_0_8px_#FFEB3B] mr-3" />
            <span className="text-white font-medium text-sm drop-shadow-[0_0_4px_rgba(255,235,59,0.5)]">+400 XP earned</span>
          </div>
          <div className="glass-pill inline-flex items-center rounded-full px-5 py-2.5 font-sans" style={{ '--accent-color': '#F44336' } as React.CSSProperties}>
            <span className="w-2 h-2 rounded-full bg-[#F44336] shadow-[0_0_8px_#F44336] mr-3" />
            <span className="text-white font-medium text-sm drop-shadow-[0_0_4px_rgba(244,67,54,0.5)]">Level 14 unlocked</span>
          </div>
        </div>
        
        {/* Caption */}
        <p className="text-slate-500 text-sm sm:text-[12px] font-sans">The status language of T1GER</p>
      </div>
    </motion.section>
  );
}
