import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * SectionVideo — Immersive cinematic section using the tiger lunges video.
 * Matches Chainzoku's background video transition logic.
 */
export default function SectionVideo() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.1]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-black"
    >
      {/* Background Video */}
      <motion.div 
        className="absolute inset-0 z-0"
        style={{ scale: videoScale, opacity }}
      >
        <div className="absolute inset-0 bg-black/40 z-10" /> {/* Overlay for readability */}
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/Tiger_lunges_swipes_glass_202604282106.mp4" type="video/mp4" />
        </video>
      </motion.div>

    </section>
  );
}
