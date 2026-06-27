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
      className="relative py-32 md:py-64 px-6 sm:px-12 md:pl-40 lg:px-24 flex flex-col items-center overflow-hidden bg-[#020202]"
      style={{ minHeight: '100vh', position: 'relative' }}
    >
      {/* Animated ambient glow (Hardware Accelerated) */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0 hw-accel"
        style={{
          opacity: bgOpacity,
          background: 'radial-gradient(ellipse at 30% 40%, rgba(255,107,0,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {/* ─── Elite Editorial Layout ─── */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 md:mb-24 flex items-center gap-4 hw-accel"
        >
          <div className="w-12 h-[1px] bg-[#FF6B00]/40" />
          <span className="font-mono text-[10px] text-[#FF6B00]/80 tracking-[0.4em] uppercase font-black">
            The Transition
          </span>
        </motion.div>

        {/* Aggressive Typographic Hero */}
        <div className="mb-24 md:mb-40 max-w-4xl">
          <TextReveal
            className="text-white leading-[0.95] text-[3rem] md:text-[5rem] lg:text-[7rem] font-outfit font-black tracking-tighter uppercase"
          >
            PRODUCTIVITY, WEAPONIZED.
          </TextReveal>

          <div className="mt-12 max-w-2xl">
            <TextReveal
              className="text-white/40 leading-[1.4] text-xl md:text-3xl font-sans font-light tracking-tight"
              delay={150}
            >
              Traditional to-do lists fail because they lack consequence. T1GER fuses gamification with ruthless survival mechanics.
            </TextReveal>
          </div>
        </div>

        {/* Asymmetric Bento/Editorial Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 md:gap-y-24 gap-x-12 mt-20 hw-accel text-center lg:text-left"
        >
          {[
            {
              title: 'DAILY MISSIONS',
              col: 'lg:col-span-5',
              description: [
                "Bite-sized tracks in business, mindset, and execution.",
                "Build your 7-day streak and level up real-world skills."
              ],
              delay: 0,
            },
            {
              title: 'SURVIVAL MECHANICS',
              col: 'lg:col-span-6 lg:col-start-7',
              description: [
                "Meet Tigo, your digital apex predator.",
                "Discipline feeds him. Procrastination starves him."
              ],
              delay: 150,
            },
            {
              title: 'MEMENTO MORI',
              col: 'lg:col-span-5',
              description: [
                "A psychological visualizer maps your exact lifespan.",
                "Watch your time disappear. Stop scrolling. Start hunting."
              ],
              delay: 300,
            },
            {
              title: 'SQUAD ACCOUNTABILITY',
              col: 'lg:col-span-6 lg:col-start-7',
              description: [
                "Skip a task, and your entire squad's pride takes damage.",
                "We turned social pressure into a weapon for mutual growth."
              ],
              delay: 450,
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5%" }}
              transition={{ duration: 1, delay: feature.delay / 1000, ease: [0.16, 1, 0.3, 1] }}
              className={`flex flex-col items-center lg:items-start hw-accel ${feature.col}`}
            >
              <HighlightSweep delay={feature.delay} className="mb-4 lg:mb-6 block">
                <span className="font-mono text-sm md:text-base text-white/90 uppercase tracking-[0.2em] font-bold">
                  // {feature.title}
                </span>
              </HighlightSweep>

              <MultiLineReveal
                lines={feature.description}
                delay={feature.delay + 200}
                lineClassName="text-white/50 text-lg md:text-xl leading-[1.6] font-sans font-light tracking-tight"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
