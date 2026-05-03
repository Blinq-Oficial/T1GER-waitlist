import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SectionLife — "Your life in months" emotional visualizer.
 *
 * Flow:
 * 1. User scrolls here and sees "THIS IS YOUR LIFE IN MONTHS"
 * 2. Big prominent age input is the first interactive thing
 * 3. They enter their age and hit SHOW ME (or press Enter)
 * 4. Dot grid reveals with staggered animation
 * 5. Emotional punch text + CTA to join
 *
 * The grid IS the visual statement. No numbers shown first —
 * only the grid with the legend tells the story.
 */
export default function SectionLife() {
  const [age, setAge] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const totalMonths = 960; // 80 years × 12 months
  const numAge = parseInt(age);
  const isValidAge = !isNaN(numAge) && numAge >= 1 && numAge <= 100;
  const livedMonths = isValidAge ? Math.min(numAge * 12, totalMonths) : 0;
  const remaining = totalMonths - livedMonths;

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
      className="relative px-6 sm:px-12 md:pl-40 flex flex-col items-center overflow-hidden bg-section-fire"
      style={{
        paddingTop: 'clamp(5rem, 10vw, 10rem)',
        paddingBottom: 'clamp(5rem, 10vw, 10rem)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, oklch(65% 0.22 45 / 0.04) 0%, transparent 55%)',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">

        {/* ─── BIG STATEMENT ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          className="text-center mb-10 md:mb-14"
        >
          <h2
            className="font-outfit font-black text-white uppercase tracking-tighter leading-[0.88]"
            style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}
          >
            THIS IS YOUR LIFE
            <br />
            <span className="text-[var(--color-electric-orange)]">IN MONTHS.</span>
          </h2>
        </motion.div>

        {/* ─── PHASE 1: AGE INPUT ─── */}
        <AnimatePresence mode="wait">
          {!submitted ? (
            <motion.div
              key="input-phase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center gap-5 w-full max-w-xs"
            >
              <p className="text-white/45 font-mono text-sm md:text-base tracking-[0.2em] uppercase text-center">
                How old are you?
              </p>

              {/* Big age input */}
              <input
                id="age-input-life"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="25"
                className="w-full bg-white/[0.06] border border-white/[0.1] rounded-lg px-8 py-5 text-center font-mono text-white focus:outline-none focus:border-[var(--color-electric-orange)] focus:shadow-[0_0_0_1px_var(--color-electric-orange)] transition-all duration-150 placeholder-white/30"
                style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.2 }}
                min="1"
                max="100"
              />

              {/* Submit button */}
              <button
                onClick={handleSubmitAge}
                disabled={!isValidAge}
                className="btn-tiger --primary w-full py-4 text-sm tracking-widest disabled:opacity-25 disabled:cursor-not-allowed"
              >
                SHOW ME
              </button>

              <p className="text-white/15 font-mono text-xs tracking-wider text-center mt-1">
                Each dot = 1 month. 80 years = 960 dots.
              </p>
            </motion.div>
          ) : (
            /* ─── PHASE 2: DOT GRID ─── */
            <motion.div
              key="grid-phase"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
              className="flex flex-col items-center w-full"
            >
              {/* Age indicator + reset */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mb-5"
              >
                <span className="text-white/35 font-mono text-sm tracking-wider">
                  Age {numAge}
                </span>
                <span className="text-white/10">•</span>
                <button
                  onClick={handleReset}
                  className="text-white/40 hover:text-[var(--color-electric-orange)] font-mono text-xs tracking-wider cursor-pointer bg-transparent border-none transition-colors duration-150 underline underline-offset-4"
                >
                  Change
                </button>
              </motion.div>

              {/* Dot Grid */}
              <motion.div
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="w-full"
              >
                <div
                  className="grid gap-[2px] sm:gap-[3px] p-4 sm:p-6 rounded-2xl bg-black/50 border border-white/[0.06] backdrop-blur-sm shadow-[0_0_80px_rgba(255,107,0,0.04)] w-full grid-cols-20 sm:grid-cols-40"
                >
                  {dots.map((dotIndex) => {
                    const isLived = dotIndex < livedMonths;
                    return (
                      <div
                        key={dotIndex}
                        className={`aspect-square rounded-sm transition-colors duration-500 ${
                          isLived
                            ? 'bg-[var(--color-electric-orange)]'
                            : 'bg-white/[0.06]'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Legend */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-center gap-8 mt-4 font-mono text-xs text-white/30 tracking-[0.12em] uppercase"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-electric-orange)]" />
                    Gone ({livedMonths.toLocaleString()})
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-sm bg-white/[0.06] border border-white/10" />
                    Left ({remaining.toLocaleString()})
                  </div>
                </motion.div>
              </motion.div>

              {/* Emotional text */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                className="text-center mt-10 md:mt-14 max-w-lg"
              >
                <p
                  className="font-outfit font-black text-white/90 uppercase tracking-tight leading-[1.1]"
                  style={{ fontSize: 'clamp(1.2rem, 3vw, 2rem)' }}
                >
                  Each dot you can never get back.
                </p>
                <p className="mt-3 text-white/30 font-mono text-sm tracking-wider leading-relaxed">
                  The orange is gone. The dark is all you have.
                  <br />
                  What will you do with it?
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.4, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                className="mt-8"
              >
                <button
                  onClick={() => {
                    const el = document.getElementById('join');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="btn-tiger --primary px-10 py-4 text-sm tracking-widest cursor-pointer"
                >
                  STOP WASTING TIME — JOIN NOW
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
