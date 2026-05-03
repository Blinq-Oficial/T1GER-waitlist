import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * CustomCursor — Chainzoku style
 * A small 4-pointed star with a trailing physics lag.
 */
export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window !== 'undefined') {
      return !window.matchMedia('(pointer: coarse)').matches;
    }
    return false;
  });
  
  // Track raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Stronger lag effect for the star
  const springConfig = { damping: 18, stiffness: 120, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) {
      if (isVisible) {
        setTimeout(() => setIsVisible(false), 0);
      }
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      {/* Invisible instant dot (optional, keeping it clean by just using the trailing star) */}
      
      {/* Trailing Star */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center text-[#FF6B00]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          fontSize: '24px',
          lineHeight: 1,
          filter: 'drop-shadow(0 0 8px rgba(255,107,0,0.6))',
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 0L13.82 8.18L22 10L13.82 11.82L12 20L10.18 11.82L2 10L10.18 8.18L12 0Z"
            fill="currentColor"
          />
        </svg>
      </motion.div>
    </>
  );
}
