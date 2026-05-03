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
      className="relative py-24 md:py-40 px-6 sm:px-12 md:pl-40 lg:px-24 flex flex-col items-center overflow-hidden bg-section-warm"
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

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* ─── Text Content (below the visual) ─── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mb-10"
        >
          <span className="t-label text-[#FF6B00]/60 tracking-[0.3em]">
            ● What is T1GER?
          </span>
        </motion.div>

        {/* Main text paragraphs */}
        <div className="mb-12">
          <TextReveal
            className="text-white/85 leading-[1.6] text-xl md:text-2xl lg:text-3xl font-sans font-light"
          >
            A daily operating system for ambitious people who refuse to be average.
          </TextReveal>
        </div>

        <div className="mb-16">
          <TextReveal
            className="text-white/55 leading-[1.6] text-lg md:text-xl lg:text-2xl font-sans font-light"
            delay={200}
          >
            It combines habit tracking, micro-learning, and competitive gamification into one protocol designed to forge discipline.
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
              title: 'DAILY HABITS',
              description: 'Gamified streaks that punish laziness and reward consistency. Every day you show up, you level up.',
              delay: 0,
            },
            {
              title: 'LEARN & GROW',
              description: 'Bite-sized daily lessons on finance, marketing, and discipline. Real executable knowledge for predators.',
              delay: 150,
            },
            {
              title: 'COMPETE & RISE',
              description: 'Global leaderboards. Weekly tournaments. Your progress is public. The pride watches.',
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
