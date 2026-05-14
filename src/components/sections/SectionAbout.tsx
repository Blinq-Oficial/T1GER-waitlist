import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';
import TextReveal, { MultiLineReveal } from '../animations/TextReveal';
import HighlightSweep from '../animations/HighlightSweep';

/**
 * SectionAbout — Visual-first approach like Chainzoku.
 *
 * Instead of immediately hitting with text paragraphs,
 * starts with a big visual statement, then reveals text below.
 */
export default function SectionAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const bgOpacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-20 md:py-40 px-6 sm:px-12 md:pl-40 lg:px-24 flex flex-col items-center overflow-x-hidden bg-section-warm"
      style={{ minHeight: '100vh' }}
    >
      {/* Animated ambient glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          opacity: bgOpacity,
          background: 'radial-gradient(ellipse at 30% 40%, rgba(255,107,0,0.08) 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* ─── Text Content (below the visual) ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mb-10"
        >
          <span className="t-label text-[#FF6B00]/60 tracking-[0.3em]">
            ● THE PROTOCOL
          </span>
        </motion.div>

        {/* Main text paragraphs */}
        <div className="mb-12">
          <TextReveal
            className="text-white/85 leading-[1.6] text-xl md:text-2xl lg:text-3xl font-sans font-light"
          >
            T1GER is a sovereign operating system for the elite 1% who refuse to be average.
          </TextReveal>
        </div>

        <div className="mb-16">
          <TextReveal
            className="text-white/55 leading-[1.6] text-lg md:text-xl lg:text-2xl font-sans font-light"
            delay={200}
          >
            Built to forge unshakeable discipline through micro-learning, lethal consistency, and high-stakes gamification.
          </TextReveal>
        </div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-14 mt-16"
        >
          {[
            {
              title: 'FORGE STREAKS',
              description: 'Gamified systems that punish stagnation. Every win builds your legacy; every failure resets the hunt.',
              delay: 0,
            },
            {
              title: 'PREDATOR KNOWLEDGE',
              description: 'Elite-tier insights on wealth, strategy, and power. Executable knowledge distilled for those who lead.',
              delay: 150,
            },
            {
              title: 'PRIDE HIERARCHY',
              description: 'Public leaderboards. Ruthless accountability. Discipline is the only currency that matters.',
              delay: 300,
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: feature.delay / 1000, ease: [0.19, 1, 0.22, 1] }}
            >
              <HighlightSweep delay={feature.delay} className="mb-4 block">
                <span className="font-outfit font-black text-xl text-white uppercase tracking-wide">
                  {feature.title}
                </span>
              </HighlightSweep>

              <MultiLineReveal
                lines={feature.description.split('. ').map((s, i, arr) =>
                  i < arr.length - 1 ? s + '.' : s
                )}
                delay={feature.delay + 200}
                lineClassName="text-white/45 text-base leading-relaxed font-sans"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
