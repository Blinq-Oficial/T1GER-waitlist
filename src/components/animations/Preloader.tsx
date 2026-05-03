import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Preloader — Chainzoku-inspired loading screen.
 *
 * Features:
 * - Letter-by-letter "T1GER" reveal with staggered delays
 * - SVG liquid-glitch filter for chromatic aberration
 * - Aggressive strikethrough line
 * - Loading progress text
 * - Smooth exit (slides up with the signature easing)
 */
interface Props {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerating progress
        const increment = p < 70 ? Math.random() * 15 + 5 : Math.random() * 8 + 2;
        return Math.min(100, p + increment);
      });
    }, 120);

    // Dismiss after timeline
    const timer = setTimeout(() => {
      setIsLoading(false);
      onComplete?.();
    }, 3200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [onComplete]);

  const text = 'T1GER';
  const letters = Array.from(text);

  return (
    <>
      {/* SVG Filters */}
      <svg className="hidden" aria-hidden="true">
        <defs>
          <filter id="liquid-glitch" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.05 0.9"
              numOctaves="3"
              result="noise"
            >
              <animate
                attributeName="baseFrequency"
                values="0.05 0.9; 0.1 0.1; 0.05 0.9"
                dur="0.2s"
                repeatCount="indefinite"
              />
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="5"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feOffset in="displaced" dx="-3" dy="0" result="red-shift" />
            <feOffset in="displaced" dx="3" dy="0" result="blue-shift" />
            <feComponentTransfer in="red-shift" result="red-channel">
              <feFuncR type="linear" slope="1" />
              <feFuncG type="linear" slope="0" />
              <feFuncB type="linear" slope="0" />
            </feComponentTransfer>
            <feComponentTransfer in="blue-shift" result="blue-channel">
              <feFuncR type="linear" slope="0" />
              <feFuncG type="linear" slope="0" />
              <feFuncB type="linear" slope="1" />
            </feComponentTransfer>
            <feBlend in="red-channel" in2="displaced" mode="screen" result="blend1" />
            <feBlend in="blue-channel" in2="blend1" mode="screen" />
          </filter>

          {/* Squiggly filters for glitch text effect */}
          {[0, 1, 2, 3, 4].map((i) => (
            <filter key={i} id={`squiggly-${i}`}>
              <feTurbulence
                baseFrequency={`${0.02 + i * 0.005}`}
                numOctaves="3"
                result="noise"
                seed={i * 10}
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={`${2 + i}`}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          ))}
        </defs>
      </svg>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="preloader"
            initial={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{ duration: 1, ease: [0.19, 1, 0.22, 1], delay: 0.15 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] pointer-events-none"
          >
            <div className="relative flex items-center justify-center">
              {/* Letter-by-letter reveal */}
              <div className="flex" aria-label="T1GER">
                {letters.map((letter, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 40, skewX: 15 }}
                    animate={{
                      opacity: [0, 1, 0.6, 1],
                      y: 0,
                      skewX: 0,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + index * 0.08,
                      times: [0, 0.15, 0.3, 1],
                    }}
                    className="block text-6xl md:text-8xl lg:text-[10rem] font-black text-[#FF6B00] font-syncopate tracking-widest relative z-10"
                    style={{
                      filter: 'url(#liquid-glitch)',
                      textShadow: '0 0 60px rgba(255, 107, 0, 0.6)',
                      marginRight: letter === '1' ? '0.5rem' : '0.15rem',
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              {/* Strikethrough line */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: [0, 1, 0.5, 1] }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute top-1/2 left-[-10%] right-[-10%] h-0.5 bg-[#FF6B00] z-20 origin-left"
                style={{ filter: 'blur(1px)', mixBlendMode: 'screen' }}
              />
            </div>

            {/* Progress indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-16 flex flex-col items-center gap-4"
            >
              {/* Progress bar */}
              <div className="w-32 h-px bg-white/10 relative overflow-hidden rounded-full">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-[#FF6B00]"
                  style={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>

              <span className="font-mono text-[10px] text-white/40 tracking-[0.4em] uppercase">
                Initializing Protocol
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
