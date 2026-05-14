import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RotateCcw, Info } from 'lucide-react';

/**
 * SectionLife — Ultra-Dense "Memento Mori" Visualizer.
 * 
 * Inspired by 'Wait But Why' and high-end editorial life charts.
 * Optimized for maximum width and dense visual impact.
 */
export default function SectionLife() {
  const [age, setAge] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Baseline: 80 years = 960 months
  const totalYears = 80;
  const totalMonths = totalYears * 12; 
  const numAge = parseInt(age);
  const isValidAge = !isNaN(numAge) && numAge >= 1 && numAge <= 100;
  const livedMonths = isValidAge ? Math.min(numAge * 12, totalMonths) : 0;
  const remainingMonths = Math.max(0, totalMonths - livedMonths);

  const dots = useMemo(() => Array.from({ length: totalMonths }, (_, i) => i), []);

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

  return (
    <section
      id="life"
      className="relative px-4 sm:px-12 md:pl-40 flex flex-col items-center overflow-hidden bg-section-fire"
      style={{
        paddingTop: 'clamp(4rem, 8vw, 8rem)',
        paddingBottom: 'clamp(4rem, 8vw, 8rem)',
      }}
    >
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_40%,rgba(255,107,0,0.08),transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
        
        {/* ─── MINIMALIST HEADER ─── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-8 bg-[#FF6B00]/40" />
            <span className="font-mono text-[9px] text-[#FF6B00] tracking-[0.5em] uppercase">Memento Mori</span>
            <div className="h-[1px] w-8 bg-[#FF6B00]/40" />
          </div>
          <h2 className="font-outfit font-black text-white uppercase tracking-tighter leading-none text-[clamp(2rem,7vw,5rem)]">
            YOUR LIFE IN <span className="text-[#FF6B00]">MONTHS.</span>
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {!submitted ? (
            /* ─── PHASE 1: INPUT ─── */
            <motion.div
              key="input"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(15px)' }}
              className="w-full max-w-md flex flex-col items-center py-12"
            >
              <p className="text-white/30 font-mono text-xs tracking-[0.2em] uppercase mb-8">What is your current age?</p>
              
              <div className="relative mb-12">
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="00"
                  className="w-32 bg-transparent border-none text-center font-outfit font-black text-white outline-none focus:ring-0 placeholder-white/5"
                  style={{ fontSize: '7rem', lineHeight: 1 }}
                  autoFocus
                />
                <div className="absolute -bottom-2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#FF6B00] to-transparent opacity-50" />
              </div>

              <button
                onClick={handleSubmitAge}
                disabled={!isValidAge}
                className="group relative px-12 py-4 rounded-full border border-white/10 text-white/50 font-mono text-[10px] tracking-[0.3em] uppercase transition-all hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-10"
              >
                Reveal Timeline <ChevronRight className="inline-block w-3 h-3 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          ) : (
            /* ─── PHASE 2: ULTRA-DENSE GRID ─── */
            <motion.div
              key="viz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full flex flex-col items-center"
            >
              {/* Header Stats */}
              <div className="flex gap-8 mb-10 font-mono text-[10px] tracking-[0.2em] uppercase">
                <div className="flex flex-col items-center">
                  <span className="text-white/20 mb-1">Spent</span>
                  <span className="text-[#FF6B00] font-bold">{livedMonths} Months</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-white/20 mb-1">Remaining</span>
                  <span className="text-white font-bold">{remainingMonths} Months</span>
                </div>
                <div className="h-8 w-[1px] bg-white/10" />
                <button onClick={handleReset} className="text-white/20 hover:text-white transition-colors">
                  <RotateCcw className="w-4 h-4 mt-2" />
                </button>
              </div>

              {/* The Grid — Optimized for width and density */}
              <div className="w-full bg-black/40 border border-white/5 p-4 sm:p-8 rounded-xl backdrop-blur-sm">
                <div 
                  className="grid gap-[2px] sm:gap-[3px] justify-center"
                  style={{ 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(6px, 1fr))',
                    maxWidth: '100%'
                  }}
                >
                  {/* Forcing a wide aspect ratio by controlling the container width if needed */}
                  <div className="contents" style={{ display: 'grid', gridTemplateColumns: 'repeat(24, 1fr)', gap: '2px' }}>
                    {/* Note: In a real responsive scenario, we'd use a more dynamic approach, 
                        but here we'll use a standard dense grid that wraps naturally. */}
                  </div>
                  
                  {/* Let's use a responsive column count that keeps it wide */}
                  <div className="grid grid-cols-24 sm:grid-cols-36 md:grid-cols-48 gap-[2px] sm:gap-[4px]">
                    {dots.map((dotIndex) => {
                      const isLived = dotIndex < livedMonths;
                      return (
                        <motion.div
                          key={dotIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: (dotIndex / totalMonths) * 0.3 }}
                          className={`aspect-square rounded-[1px] ${
                            isLived 
                              ? 'bg-[#FF6B00] shadow-[0_0_4px_rgba(255,107,0,0.4)]' 
                              : 'bg-white/5 border border-white-[0.02]'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Annotation */}
                <div className="mt-8 flex justify-between items-center px-2">
                  <div className="flex gap-6 font-mono text-[9px] tracking-[0.2em] text-white/20 uppercase">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-[#FF6B00] rounded-full" /> History
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-white/10 rounded-full" /> Potential
                    </div>
                  </div>
                  <div className="hidden sm:flex items-center gap-2 text-white/10 font-mono text-[8px] tracking-[0.2em] uppercase">
                    <Info className="w-3 h-3" /> Each dot represents one month of your life (80 yr baseline)
                  </div>
                </div>
              </div>

              {/* Emotional Punchline */}
              <div className="mt-16 text-center max-w-2xl">
                <p className="font-outfit font-black text-white/90 text-2xl md:text-4xl uppercase tracking-tighter leading-tight mb-6">
                  Look at the empty space. <br />
                  That is your only remaining currency.
                </p>
                <p className="text-white/30 font-mono text-sm tracking-wide leading-relaxed mb-12">
                  The orange is permanent. It cannot be moved, edited, or deleted. 
                  Every month you procrastinate adds another orange dot to the grid. 
                  Don't let your grid fill up with regrets.
                </p>

                <button
                  onClick={() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' })}
                  className="inline-flex items-center gap-4 bg-white text-black px-12 py-5 rounded-full font-outfit font-black text-sm uppercase tracking-widest hover:bg-[#FF6B00] hover:text-white transition-all duration-500 shadow-2xl"
                >
                  START THE HUNT NOW <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
