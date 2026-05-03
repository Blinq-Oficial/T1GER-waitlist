import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import TextReveal from '../animations/TextReveal';

const stickers = [
  { type: 'italic', text: 'Core features.', bg: '#FF6B00' },
  { type: 'bold', text: '7-DAY', bg: '#CCFF00' },
  { type: 'italic', text: 'Zero excuses.', bg: '#FF6B00' },
  { type: 'bold', text: 'STREAK', bg: '#CCFF00' },
  { type: 'italic', text: 'The pressure never stops.', bg: '#FF6B00' },
  { type: 'bold', text: 'TOP 5%', bg: '#CCFF00' },
];

/**
 * SectionProtocol — Chainzoku "When" style sticker text reveals.
 *
 * Deep purple gradient background with animated sticker text blocks.
 * Each sticker has:
 * - Clip-path reveal from alternating sides
 * - Scale + rotation entrance animation (framer-motion)
 * - Colored underline/highlight
 */
export default function SectionProtocol() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      id="protocol"
      ref={sectionRef}
      className="relative w-full md:pl-40 overflow-hidden bg-section-deep"
      style={{ minHeight: '100vh' }}
    >
      <div className="relative flex flex-col items-center justify-center py-24 md:py-32 min-h-screen">
        {/* Section label — animated */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="absolute top-10 left-6 sm:left-12"
        >
          <span className="t-label text-white/30 tracking-[0.3em]">
            ● The Protocol
          </span>
        </motion.div>

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 50% 50%, rgba(150,80,255,0.04) 0%, transparent 50%)',
          }}
        />

        {/* Sticker text blocks */}
        <div className="flex flex-col items-center justify-center gap-0 w-full px-4">
          {stickers.map((sticker, i) => (
            <StickerBlock key={i} {...sticker} index={i} />
          ))}
        </div>

        {/* Bottom description — animated */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="mt-16 px-6 text-center max-w-lg"
        >
          <TextReveal className="text-white/35 font-mono text-sm tracking-wider leading-relaxed">
            Your consistency is your weapon. The protocol tracks every habit, every lesson, every win. There is no hiding.
          </TextReveal>
        </motion.div>
      </div>
    </section>
  );
}

function StickerBlock({
  type,
  text,
  bg,
  index,
}: {
  type: string;
  text: string;
  bg: string;
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
      { threshold: 0.2, rootMargin: '-20px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const isItalic = type === 'italic';
  const isOdd = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.85, y: 40 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: 0.9,
        delay: index * 0.12,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="relative flex items-center justify-center w-full"
      style={{
        marginTop: isOdd ? '-0.5rem' : '0.25rem',
      }}
    >
      <div
        className={`relative text-center transition-[clip-path] duration-[1.4s] will-change-[clip-path] ${
          isOdd ? 'clip-reveal-left' : 'clip-reveal-right'
        } ${inView ? 'in-view' : ''}`}
        style={{
          transform: isOdd ? 'rotate(2deg)' : 'rotate(-2deg)',
        }}
      >
        {/* Colored underline background */}
        <span
          className="absolute inset-0 z-0 transition-opacity duration-700"
          style={{
            backgroundColor: bg,
            opacity: inView ? 0.15 : 0.05,
            transform: 'skew(-3deg)',
            borderRadius: '6px',
          }}
        />

        {/* Text */}
        <span
          className="relative z-10 block px-8 py-3 md:px-14 md:py-4"
          style={{
            font: isItalic
              ? `italic 500 clamp(1.25rem, 3vw, 2.5rem)/1.1 'Kanit', sans-serif`
              : `900 clamp(3rem, 9vw, 8rem)/0.85 'Outfit', sans-serif`,
            color: isItalic ? 'rgba(255,255,255,0.75)' : '#fff',
            letterSpacing: isItalic ? '-0.01em' : '-0.03em',
            textTransform: isItalic ? 'none' as const : 'uppercase' as const,
          }}
        >
          {text}
        </span>
      </div>
    </motion.div>
  );
}
