import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw, ShieldAlert, Target, TrendingUp } from 'lucide-react';

const TOTAL_MONTHS = 960;

/**
 * SectionLife — Final "Memento Mori" Implementation.
 * 
 * Uses a fixed 40-column grid (Desktop) / 20-column grid (Mobile) 
 * for a perfectly mathematical representation of a life in months.
 */
export default function SectionLife() {
  const [age, setAge] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile to adjust grid
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalMonths = TOTAL_MONTHS;
  const numAge = parseInt(age);
  const isValidAge = !isNaN(numAge) && numAge >= 1 && numAge <= 100;
  const livedMonths = isValidAge ? Math.min(numAge * 12, totalMonths) : 0;
  const remainingMonths = Math.max(0, totalMonths - livedMonths);

  const dots = useMemo(() => Array.from({ length: TOTAL_MONTHS }, (_, i) => i), []);

  const handleSubmitAge = () => {
    if (isValidAge) setSubmitted(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSubmitAge();
  };

  const handleReset = () => {
    setSubmitted(false);
    setAge('');
  };

  // Grid Configuration
  const cols = isMobile ? 20 : 40;
  const rows = totalMonths / cols; // 48 or 24

  return (
    <section
      id="life"
      className="relative px-6 sm:px-12 md:pl-40 flex flex-col items-center overflow-hidden bg-section-fire"
      style={{
        paddingTop: 'clamp(5rem, 10vw, 10rem)',
        paddingBottom: 'clamp(5rem, 10vw, 10rem)',
      }}
    >
      <div className="absolute inset-0 pointer-events-none bg-noise opacity-20" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        {/* ─── HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <span className="w-12 h-[1px] bg-[#FF6B00]/30" />
            <span className="font-mono text-[10px] text-[#FF6B00] tracking-[0.4em] uppercase">Biological Countdown</span>
            <span className="w-12 h-[1px] bg-[#FF6B00]/30" />
          </div>
          <h2 className="font-outfit font-black text-white uppercase tracking-tighter leading-[0.88] text-[clamp(2.5rem,10vw,5.5rem)] text-center w-full">
            YOUR LIFE <br className="md:hidden" />
            <span className="text-[#FF6B00]">IN MONTHS.</span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            /* ─── PHASE 1: INPUT ─── */
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, filter: 'blur(20px)' }}
              className="flex flex-col items-center justify-center bg-black/40 border border-white/10 rounded-3xl p-8 md:p-16 backdrop-blur-xl shadow-2xl w-full max-w-md mx-auto text-center"
            >
              <p className="text-white/40 font-mono text-[10px] sm:text-xs tracking-widest uppercase mb-8 text-center">Confirm your biological level</p>
              <div className="relative mb-12 flex justify-center w-full">
                <label htmlFor="life-age" className="sr-only">
                  Age in years
                </label>
                <input
                  id="life-age"
                  type="number"
                  inputMode="numeric"
                  min="1"
                  max="100"
                  aria-label="Age in years"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="00"
                  className="w-24 sm:w-32 bg-transparent border-none text-center font-outfit font-black text-white outline-none focus:ring-0 placeholder-white/5"
                  style={{ fontSize: 'clamp(4rem, 15vw, 7rem)', lineHeight: 1 }}
                />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-50" />
              </div>
              <button
                onClick={handleSubmitAge}
                disabled={!isValidAge}
                className="group relative px-8 sm:px-16 py-5 sm:py-6 rounded-full bg-[#FF6B00] text-black font-outfit font-black text-xs sm:text-sm tracking-[0.2em] uppercase transition-all hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-10 shadow-[0_0_40px_rgba(255,107,0,0.2)]"
              >
                REVEAL TIMELINE <ChevronRight className="inline-block w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ) : (
            /* ─── PHASE 2: THE REAL GRID ─── */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              {/* Analytics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-12">
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl">
                  <p className="text-white/20 font-mono text-[9px] tracking-widest uppercase mb-2">Age</p>
                  <p className="text-white font-outfit font-black text-3xl">{age}</p>
                </div>
                <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 p-6 rounded-2xl">
                  <p className="text-[#FF6B00]/50 font-mono text-[9px] tracking-widest uppercase mb-2">Months Gone</p>
                  <p className="text-[#FF6B00] font-outfit font-black text-3xl">{livedMonths}</p>
                </div>
                <div className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl">
                  <p className="text-white/20 font-mono text-[9px] tracking-widest uppercase mb-2">Months Left</p>
                  <p className="text-white font-outfit font-black text-3xl">{remainingMonths}</p>
                </div>
                <button 
                  onClick={handleReset}
                  aria-label="Reset age timeline"
                  className="bg-white/[0.03] border border-white/5 p-6 rounded-2xl hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  <RotateCcw className="w-6 h-6 text-white/30" />
                </button>
              </div>

              {/* Grid with bulletproof inline styles */}
              <div className="relative w-full bg-black/60 border border-white/10 p-4 md:p-10 rounded-2xl shadow-inner">
                <div 
                  className="grid gap-[3px] md:gap-[4px] w-full"
                  style={{ 
                    gridTemplateColumns: `repeat(${cols}, 1fr)`,
                    gridTemplateRows: `repeat(${rows}, 1fr)` 
                  }}
                >
                  {dots.map((dotIndex) => {
                    const isLived = dotIndex < livedMonths;
                    return (
                      <motion.div
                        key={dotIndex}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          delay: (dotIndex / totalMonths) * 0.8,
                          duration: 0.2
                        }}
                        className={`aspect-square rounded-[1px] md:rounded-sm transition-all duration-700 ${
                          isLived 
                            ? 'bg-[#FF6B00] shadow-[0_0_8px_rgba(255,107,0,0.4)]' 
                            : 'bg-white/10 border border-white/5'
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between items-center px-2 font-mono text-[10px] tracking-widest uppercase">
                  <div className="flex gap-6 text-white/40">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-[#FF6B00] rounded-sm" /> Gone
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 bg-white/10 rounded-sm" /> Remaining
                    </div>
                  </div>
                  <div className="hidden sm:block text-white/10">
                    Baseline: 80 Years / 960 Months
                  </div>
                </div>
              </div>

              {/* The "Brutal" Analysis */}
              <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-4xl">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-[#FF6B00]">
                    <ShieldAlert className="w-8 h-8" />
                    <h3 className="font-outfit font-black text-2xl uppercase tracking-tight">The Reality of Drift</h3>
                  </div>
                  <p className="text-white/40 font-mono text-sm leading-relaxed">
                    Every orange dot is a month you already spent. You cannot trade them back. 
                    You cannot buy more. The grey dots are not guaranteed; they are merely potential.
                    Drifting is the slow death of your empire.
                  </p>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center gap-4 text-white">
                    <TrendingUp className="w-8 h-8" />
                    <h3 className="font-outfit font-black text-2xl uppercase tracking-tight">Weaponize the Rest</h3>
                  </div>
                  <p className="text-white/40 font-mono text-sm leading-relaxed">
                    Most founders waste 40% of their grey dots in distraction. 
                    T1GER is designed to ensure every remaining dot is used for execution, 
                    discipline, and building a legacy that outlasts the grid.
                  </p>
                </div>
              </div>

              {/* Ultimate CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="mt-20 w-full flex flex-col items-center"
              >
                <button
                  type="button"
                  onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative flex items-center gap-6 bg-white text-black px-14 py-6 rounded-full font-outfit font-black text-base uppercase tracking-[0.2em] transition-all hover:bg-[#FF6B00] hover:text-white hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(255,107,0,0.15)]"
                >
                  <Target className="w-5 h-5 transition-transform group-hover:rotate-45" />
                  JOIN THE TOP 1% NOW
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>
                <p className="mt-6 text-white/20 font-mono text-[10px] tracking-[0.4em] uppercase">
                  Do not waste another month.
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
