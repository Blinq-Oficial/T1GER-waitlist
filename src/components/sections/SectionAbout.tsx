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
          className="mb-8 md:mb-10"
        >
          <span className="t-label text-[#FF6B00]/60 tracking-[0.3em]">
            ● THE TRANSITION
          </span>
        </motion.div>

        {/* Main text paragraphs */}
        <div className="mb-12">
          <TextReveal
            className="text-white/85 leading-[1.6] text-xl md:text-2xl lg:text-3xl font-sans font-light"
          >
            PRODUCTIVITY, WEAPONIZED.
          </TextReveal>
        </div>

        <div className="mb-16">
          <TextReveal
            className="text-white/55 leading-[1.6] text-lg md:text-xl lg:text-2xl font-sans font-light"
            delay={200}
          >
            Traditional to-do lists don't work because they don't punish you for failing. T1GER combines gamified learning with ruthless survival mechanics.
          </TextReveal>
        </div>

        {/* Feature highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 mt-12 md:mt-16"
        >
          {[
            {
              title: '[ DAILY MISSIONS & XP ]',
              description: [
                "Bite-sized, actionable tracks in business, mindset, and execution.",
                "Build your 7-day streak, earn XP, and level up your real-world skills.",
                "It’s like Duolingo for building an empire, designed specifically for the top 1%."
              ],
              delay: 0,
            },
            {
              title: '[ SURVIVAL MECHANICS ]',
              description: [
                "Meet Tigo, your digital apex predator.",
                "Your daily discipline feeds him; your procrastination starves him.",
                "If you try to switch to TikTok during Focus Time, he roars.",
                "If you abandon your streak, he dies. Actions have real consequences."
              ],
              delay: 150,
            },
            {
              title: '[ MEMENTO MORI ]',
              description: [
                "Stop acting like you have endless time.",
                "T1GER's psychological visualizer maps out your exact lifespan in individual dots on your screen.",
                "Watch your time slowly disappear so you finally stop scrolling and start hunting."
              ],
              delay: 300,
            },
            {
              title: '[ WEAPONIZED ACCOUNTABILITY ]',
              description: [
                'Invite up to 3 friends to form your "Squad."',
                "If you skip your daily tasks, everyone's pet takes damage.",
                "We turned social pressure into a tool for mutual growth.",
                "You don't just let yourself down; you let the Pride down."
              ],
              delay: 450,
            },
          ].map((feature) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: feature.delay / 1000, ease: [0.19, 1, 0.22, 1] }}
              className="flex flex-col"
            >
              <HighlightSweep delay={feature.delay} className="mb-4 block">
                <span className="font-outfit font-black text-xl text-white uppercase tracking-wide">
                  {feature.title}
                </span>
              </HighlightSweep>

              <MultiLineReveal
                lines={feature.description}
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
