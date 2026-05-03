import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * SectionShowcase — Purely visual section (no text paragraphs).
 *
 * Like Chainzoku: after the hero, you scroll into a visual
 * experience before any text content appears.
 *
 * Features:
 * - Parallax scrolling text (huge outlined words)
 * - Interactive mouse-follow stripe effect
 * - Dramatic color transition
 * - No paragraphs — just pure visual impact
 */
export default function SectionShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const marqueeX = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const marqueeX2 = useTransform(scrollYProgress, [0, 1], ['-10%', '20%']);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.9, 1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const section = sectionRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      if (e.clientY < rect.top || e.clientY > rect.bottom) return;
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: (e.clientY - rect.top) / rect.height,
      });
    };
    window.addEventListener('mousemove', handleMouse);
    return () => window.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        height: '100vh',
        background: 'linear-gradient(180deg, #050505 0%, #0a0500 30%, #150a00 50%, #0a0500 70%, #050505 100%)',
      }}
    >
      {/* Mouse-follow glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none transition-all duration-[800ms] ease-out"
        style={{
          background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)',
          left: `${mousePos.x * 100}%`,
          top: `${mousePos.y * 100}%`,
          transform: 'translate(-50%, -50%)',
        }}
      />

      {/* Scrolling content */}
      <motion.div
        id="showcase"
        className="relative py-24 md:py-40 px-6 sm:px-12 flex flex-col items-center overflow-hidden bg-section-warm"
        style={{ scale, opacity }}
      >
        {/* Scrolling text row 1 */}
        <motion.div
          className="whitespace-nowrap mb-4"
          style={{ x: marqueeX }}
        >
          <span
            className="font-outfit font-black uppercase select-none"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.06)',
              letterSpacing: '-0.03em',
            }}
          >
            DISCIPLINE • CONSISTENCY • GROWTH • DISCIPLINE • CONSISTENCY • GROWTH •
          </span>
        </motion.div>

        {/* Center visual statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="text-center px-6 my-8"
        >
          <h2
            className="font-outfit font-black text-white uppercase tracking-tighter leading-[0.88]"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)' }}
          >
            DISCIPLINE IS THE
            <br />
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '2px #FF6B00',
                filter: 'drop-shadow(0 0 30px rgba(255,107,0,0.2))',
              }}
            >
              NEW CURRENCY.
            </span>
          </h2>
        </motion.div>

        {/* Scrolling text row 2 (opposite direction) */}
        <motion.div
          className="whitespace-nowrap mt-4"
          style={{ x: marqueeX2 }}
        >
          <span
            className="font-outfit font-black uppercase select-none"
            style={{
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,255,255,0.04)',
              letterSpacing: '-0.03em',
            }}
          >
            PROTOCOL • STREAKS • LEADERBOARD • PROTOCOL • STREAKS • LEADERBOARD •
          </span>
        </motion.div>
      </motion.div>

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #050505, transparent)',
        }}
      />
    </section>
  );
}
