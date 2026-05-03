import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * ParallaxBands — Chainzoku-style infinite marquee bands.
 * Two counter-rotating bands with infinite CSS animation + parallax scroll offset.
 */
export default function ParallaxBands() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const xShift = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  const band1Items = [
    'BUILD HABITS', '◆', 'LEARN DAILY', '◆', 'COMPETE', '◆',
    'LEVEL UP', '◆', 'HUNT', '◆', 'DISCIPLINE', '◆',
  ];

  const band2Items = [
    'T1GER PROTOCOL', '●', 'APEX PREDATOR', '●', 'NO EXCUSES', '●',
    'DAILY GRIND', '●', 'STREAK', '●', 'DOMINATE', '●',
  ];

  return (
    <div
      ref={ref}
      className="relative w-full overflow-hidden select-none pointer-events-none"
      style={{ height: '8rem' }}
    >
      {/* Band 1 — Orange, slight negative rotation */}
      <motion.div
        className="absolute inset-y-0 w-[200%]"
        style={{ x: xShift, top: '10%' }}
      >
        <div
          className="flex items-center py-3 bg-[#FF6B00] w-full"
          style={{ transform: 'rotate(-1.5deg)' }}
        >
          <div className="marquee-track --speed-1 flex items-center">
            {[...band1Items, ...band1Items, ...band1Items, ...band1Items].map((item, i) => (
              <span
                key={i}
                className="font-outfit font-black text-sm md:text-base text-[#050505] uppercase tracking-[0.15em] px-3 md:px-5 whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Band 2 — Acid green, slight positive rotation */}
      <motion.div
        className="absolute inset-y-0 w-[200%]"
        style={{
          x: useTransform(scrollYProgress, [0, 1], ['5%', '-5%']),
          top: '55%',
        }}
      >
        <div
          className="flex items-center py-3 bg-[#CCFF00] w-full"
          style={{ transform: 'rotate(1.5deg)' }}
        >
          <div className="marquee-track --speed-2 flex items-center">
            {[...band2Items, ...band2Items, ...band2Items, ...band2Items].map((item, i) => (
              <span
                key={i}
                className="font-outfit font-black text-sm md:text-base text-[#050505] uppercase tracking-[0.15em] px-3 md:px-5 whitespace-nowrap"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
