import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw, Clock, Target, Zap } from 'lucide-react';

/**
 * SectionLife — Redesigned "Your life in months" visualizer.
 * 
 * Optimized for "High-Ticket" luxury aesthetics.
 * Uses a 12-column grid (1 year per row) for intuitive mapping.
 */
export default function SectionLife() {
  const [age, setAge] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalYears = 80;
  const totalMonths = totalYears * 12; // 960
  const numAge = parseInt(age);
  const isValidAge = !isNaN(numAge) && numAge >= 1 && numAge <= 100;
  const livedMonths = isValidAge ? Math.min(numAge * 12, totalMonths) : 0;
  const remainingMonths = totalMonths - livedMonths;

  const dots = useMemo(() => Array.from({ length: totalMonths }, (_, i) => i), []);

  const handleSubmitAge = () => {
    if (isValidAge) {
      setSubmitted(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmitAge();
  };

  const handleReset = () => {
    setSubmitted(false);
    setAge('');
  };

  return (
    <section
      id="life"
      className="relative px-6 sm:px-12 md:pl-40 flex flex-col items-center overflow-hidden bg-section-fire"
      style={{
        paddingTop: 'clamp(5rem, 10vw, 10rem)',
        paddingBottom: 'clamp(5rem, 10vw, 10rem)',
      }}
    >
      {/* Cinematic ambient background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full h-[60%] bg-gradient-radial opacity-10 blur-[100px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
        
        {/* ─── HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-20"
        >
          <span className="inline-block font-mono text-[10px] text-[#FF6B00] tracking-[0.4em] uppercase mb-4 opacity-60">
            ● Biological Reality Check
          </span>
          <h2 className="font-outfit font-black text-white uppercase tracking-tighter leading-[0.88] text-[clamp(2.5rem,8vw,5.5rem)]">
            YOUR LIFE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B00] to-[#FF9F1C]">IN MONTHS.</span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            /* ─── PHASE 1: INPUT ─── */
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md flex flex-col items-center bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl"
            >
              <div className="mb-8 text-center">
                <p className="text-white/40 font-mono text-xs tracking-[0.2em] uppercase mb-2">Enter Current Age</p>
                <div className="relative group">
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="00"
                    className="w-full bg-transparent border-b-2 border-white/10 py-6 text-center font-outfit font-black text-white outline-none focus:border-[#FF6B00] transition-colors duration-500 placeholder-white/5"
                    style={{ fontSize: 'clamp(4rem, 10vw, 6rem)' }}
                  />
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FF6B00] group-focus-within:w-full transition-all duration-700 ease-out" />
                </div>
              </div>

              <button
                onClick={handleSubmitAge}
                disabled={!isValidAge}
                className="group relative w-full overflow-hidden rounded-xl bg-white text-black py-5 font-mono text-sm font-bold tracking-[0.2em] transition-all hover:bg-[#FF6B00] hover:text-white disabled:opacity-20"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  ACTIVATE SCAN <ChevronRight className="w-4 h-4" />
                </span>
              </button>
              
              <p className="mt-6 text-white/20 font-mono text-[10px] tracking-widest uppercase text-center">
                Visualization based on 80-year baseline
              </p>
            </motion.div>
          ) : (
            /* ─── PHASE 2: VISUALIZATION ─── */
            <motion.div
              key="viz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="w-full flex flex-col items-center"
            >
              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-10 w-full">
                <div className="flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 min-w-[120px]">
                  <span className="text-white/30 font-mono text-[9px] tracking-widest uppercase mb-1">Status</span>
                  <span className="text-[#FF6B00] font-outfit font-black text-xl uppercase">LEVEL {age}</span>
                </div>
                <div className="flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 min-w-[120px]">
                  <span className="text-white/30 font-mono text-[9px] tracking-widest uppercase mb-1">Burned</span>
                  <span className="text-white font-outfit font-black text-xl">{livedMonths}</span>
                </div>
                <div className="flex flex-col items-center bg-white/[0.03] border border-white/10 rounded-2xl px-6 py-4 min-w-[120px]">
                  <span className="text-white/30 font-mono text-[9px] tracking-widest uppercase mb-1">Remaining</span>
                  <span className="text-white font-outfit font-black text-xl">{remainingMonths}</span>
                </div>
                <button 
                  onClick={handleReset}
                  className="flex flex-col items-center justify-center bg-white/[0.03] border border-white/10 rounded-2xl px-4 py-4 hover:bg-white/10 transition-colors group"
                >
                  <RotateCcw className="w-4 h-4 text-white/40 group-hover:text-[#FF6B00] transition-colors" />
                </button>
              </div>

              {/* The Grid — Now 12 columns (1 row = 1 year) */}
              <div className="relative p-2 md:p-6 bg-black/40 border border-white/5 rounded-3xl backdrop-blur-xl shadow-inner max-h-[60vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-12 gap-[3px] md:gap-1.5 p-1">
                  {dots.map((dotIndex) => {
                    const isLived = dotIndex < livedMonths;
                    const isCurrentYear = dotIndex >= livedMonths && dotIndex < livedMonths + 12;
                    
                    return (
                      <motion.div
                        key={dotIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: (dotIndex / totalMonths) * 0.5,
                          duration: 0.3
                        }}
                        className={`w-2 h-2 md:w-3 md:h-3 rounded-[1px] md:rounded-sm transition-all duration-700 ${
                          isLived 
                            ? 'bg-[#FF6B00] shadow-[0_0_8px_rgba(255,107,0,0.3)]' 
                            : isCurrentYear
                              ? 'bg-white/40 animate-pulse'
                              : 'bg-white/5 border border-white/5'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Legend & Analysis */}
              <div className="mt-8 flex flex-col items-center">
                <div className="flex gap-6 font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 mb-12">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#FF6B00] rounded-full" /> GONE
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white/10 rounded-full" /> POTENTIAL
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl"
                >
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-center">
                    <Clock className="w-5 h-5 text-[#FF6B00] mx-auto mb-3" />
                    <p className="text-[10px] font-mono text-white/20 uppercase mb-2">Time Urgency</p>
                    <p className="text-white text-xs font-medium leading-relaxed">Most people overestimate what they can do in a day, but underestimate what they waste in a month.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-center">
                    <Target className="w-5 h-5 text-[#FF6B00] mx-auto mb-3" />
                    <p className="text-[10px] font-mono text-white/20 uppercase mb-2">The Mission</p>
                    <p className="text-white text-xs font-medium leading-relaxed">Every orange dot is a month of execution that is now permanent history. The potential is shrinking.</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl text-center">
                    <Zap className="w-5 h-5 text-[#FF6B00] mx-auto mb-3" />
                    <p className="text-[10px] font-mono text-white/20 uppercase mb-2">Call to Action</p>
                    <p className="text-white text-xs font-medium leading-relaxed">Stop counting months. Make the months count. The hunt begins today.</p>
                  </div>
                </motion.div>

                <motion.button
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.8 }}
                  onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                  className="mt-12 group flex items-center gap-4 bg-[#FF6B00] px-10 py-5 rounded-full text-black font-outfit font-black text-sm uppercase tracking-widest hover:bg-white transition-all duration-500 shadow-[0_0_40px_rgba(255,107,0,0.2)]"
                >
                  I'M READY TO HUNT <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
