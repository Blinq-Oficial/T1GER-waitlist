import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, BookOpen, BrainCircuit, Lightbulb, Mic2, Sparkles, TrendingUp } from 'lucide-react';
import DisplayCards from '../ui/display-cards';
import { MagneticText } from '../ui/morphing-cursor';
import { MetalButton } from '../ui/liquid-glass-button';

const LazyGlobe = lazy(() => import('../ui/globe').then((module) => ({ default: module.Globe })));

const floatingIcons = [
  { Icon: BookOpen, className: 'left-[4%] top-[20%]', delay: 0, duration: 5.8 },
  { Icon: Mic2, className: 'right-[5%] top-[15%]', delay: 0.7, duration: 6.4 },
  { Icon: BrainCircuit, className: 'left-[8%] bottom-[16%]', delay: 1.1, duration: 7.1 },
  { Icon: Lightbulb, className: 'right-[7%] bottom-[14%]', delay: 0.3, duration: 5.5 },
  { Icon: TrendingUp, className: 'left-[44%] top-[2%] hidden sm:flex', delay: 1.5, duration: 6.8 },
  { Icon: Sparkles, className: 'right-[38%] bottom-[2%] hidden sm:flex', delay: 0.9, duration: 6.1 },
];

export default function SectionGlobalLearning() {
  const sectionRef = useRef<HTMLElement>(null);
  const [shouldRenderGlobe, setShouldRenderGlobe] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || shouldRenderGlobe) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldRenderGlobe(true);
        observer.disconnect();
      },
      { rootMargin: '320px 0px' },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [shouldRenderGlobe]);

  return (
    <section id="global-learning" ref={sectionRef} className="relative overflow-hidden border-y border-white/[0.06] bg-[#070707] px-5 py-20 sm:px-10 md:pl-40 md:pr-12 md:py-28">
      <div className="mx-auto max-w-6xl">
        <header className="max-w-4xl">
          <p className="font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#FF6B00]">Global knowledge · Daily action</p>
          <h2 className="mt-4 font-outfit text-[2.7rem] font-black uppercase leading-[0.92] text-white sm:text-6xl md:text-7xl">
            The best ideas in the world. Built for action.
          </h2>
          <div className="mt-7 hidden md:block">
            <MagneticText
              text="LEARN GLOBALLY"
              hoverText="ACT DAILY"
              textClassName="text-[clamp(2rem,4vw,4rem)]"
            />
          </div>
        </header>

        <div className="mt-12 grid items-center gap-10 md:mt-16 md:grid-cols-[0.78fr_1.22fr] md:gap-4">
          <div className="relative z-20">
            <p className="max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
              T1GER takes powerful lessons from books, podcasts, operators, and case studies around the globe, then turns them into one mission you can use today.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 md:hidden">
              {['Books', 'Podcasts', 'Case studies'].map((source) => (
                <span key={source} className="rounded-[5px] border border-white/10 bg-white/[0.04] px-3 py-2 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white/55">{source}</span>
              ))}
            </div>
            <div className="mt-8">
              <MetalButton
                variant="bronze"
                className="gap-2 font-mono text-[10px] font-black uppercase tracking-[0.1em]"
                onClick={() => document.querySelector('#join')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Join the waitlist
                <ArrowDown className="h-4 w-4" aria-hidden="true" />
              </MetalButton>
            </div>
          </div>

          <div className="relative mx-auto aspect-square w-full max-w-[620px]">
            <div className="absolute inset-[10%] rounded-full border border-white/[0.06]" />
            <div className="absolute inset-[20%] rounded-full border border-[#FF6B00]/10" />
            {shouldRenderGlobe && (
              <Suspense fallback={<div className="absolute inset-[9%] rounded-full border border-white/10 bg-black" />}>
                <LazyGlobe className="inset-[3%]" />
              </Suspense>
            )}
            <div className="absolute -left-24 bottom-24 z-20 hidden lg:block">
              <DisplayCards />
            </div>

            <div className="absolute inset-0 pointer-events-none">
              {floatingIcons.map(({ Icon, className, delay, duration }) => (
                <motion.span
                  key={className}
                  className={`absolute flex h-10 w-10 items-center justify-center rounded-[7px] border border-white/15 bg-black/70 text-[#FF6B00] shadow-[0_10px_35px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:h-12 sm:w-12 ${className}`}
                  animate={reduceMotion ? { y: 0, rotate: 0 } : { y: [0, -9, 4, 0], rotate: [0, 3, -2, 0] }}
                  transition={{ duration, delay, repeat: reduceMotion ? 0 : Infinity, ease: 'easeInOut' }}
                >
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
                </motion.span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
