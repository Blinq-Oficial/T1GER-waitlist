import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const pillars = [
  {
    number: '01',
    title: 'Habits',
    description: 'Gamified streaks that punish laziness and reward consistency. Every day you show up, your rank climbs.',
  },
  {
    number: '02',
    title: 'Learn',
    description: 'Bite-sized daily lessons on finance, marketing, and strategy. Real knowledge designed for predators.',
  },
  {
    number: '03',
    title: 'Compete',
    description: 'Global leaderboards. Weekly tournaments. Your progress is public. The pride watches.',
  },
  {
    number: '04',
    title: 'Track',
    description: 'Every habit, every lesson, every win — all tracked and measured. Beautiful data that shows exactly where you stand.',
  },
  {
    number: '05',
    title: 'Community',
    description: 'We build with the people who show up. Whether you are here for the grind, the growth, or the glory.',
  },
  {
    number: '06',
    title: 'Accountability',
    description: 'No empty roadmaps. T1GER launches with the protocol ready. This is just the beginning.',
  },
];

/**
 * SectionVision — Centered card grid with watermark numbers.
 * Chainzoku-style: properly centered, glassmorphism cards,
 * stagger reveal, hover effects.
 */
export default function SectionVision() {
  return (
    <section
      id="vision"
      className="relative w-full md:pl-40 flex flex-col items-center overflow-hidden bg-section-jungle"
      style={{
        paddingTop: 'clamp(5rem, 10vw, 10rem)',
        paddingBottom: 'clamp(5rem, 10vw, 10rem)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, oklch(90% 0.18 135 / 0.02) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 px-6 sm:px-12 max-w-5xl">
        {/* Section heading — centered */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="text-left mb-14 md:mb-20 max-w-2xl"
        >
          <span className="font-mono text-[var(--color-acid-green)] opacity-40 tracking-[0.3em] text-xs uppercase block mb-4">
            ● The Vision
          </span>
          <h2
            className="font-outfit font-black text-white uppercase tracking-tighter leading-[0.9]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            6 PILLARS.{' '}
            <span
              style={{
                color: 'transparent',
                WebkitTextStroke: '1px var(--color-acid-green)',
                filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
              }}
            >
              ONE PROTOCOL.
            </span>
          </h2>
        </motion.div>

        {/* Card grid — 2×3 asymmetric/left-aligned */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {pillars.map((pillar, i) => (
            <VisionCard key={pillar.number} {...pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function VisionCard({
  number,
  title,
  description,
  index,
}: {
  number: string;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
      className="relative group"
    >
      <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-lg p-8 md:p-10 overflow-hidden hover:bg-white/[0.06] hover:border-white/[0.15] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(0,0,0,0.2)] transition-all duration-150 cursor-default h-full flex flex-col items-start justify-start">
        {/* Number watermark */}
        <span
          className="absolute bottom-4 right-6 font-outfit font-black transition-colors duration-150 select-none pointer-events-none"
          style={{
            fontSize: 'clamp(3rem, 8vw, 6rem)',
            color: inView ? 'oklch(90% 0.18 135 / 0.06)' : 'oklch(90% 0.18 135 / 0.02)',
            lineHeight: 1,
            zIndex: 0,
          }}
        >
          {number}
        </span>

        {/* Title */}
        <h3 className="font-outfit font-black text-lg md:text-xl text-white uppercase tracking-tight mb-3 relative z-10 group-hover:text-[var(--color-acid-green)] transition-colors duration-150 text-left">
          {title}
        </h3>

        {/* Description */}
        <p className="text-white/40 text-sm leading-relaxed font-sans relative z-10 group-hover:text-white/60 transition-colors duration-150 text-left">
          {description}
        </p>

      </div>
    </motion.div>
  );
}
