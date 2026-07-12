import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Sparkle } from 'lucide-react';

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
  const [isInteractive, setIsInteractive] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // Track raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappier, lighter physics for the trailing star
  const springConfig = { damping: 25, stiffness: 300, mass: 0.2 };
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
    const handlePointerOver = (event: PointerEvent) => {
      const target = event.target;
      setIsInteractive(target instanceof Element && Boolean(target.closest('a, button, input, textarea, [role="button"]')));
    };
    const handlePointerDown = () => setIsPressed(true);
    const handlePointerUp = () => setIsPressed(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('pointerover', handlePointerOver);
    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('pointerover', handlePointerOver);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <>
      <motion.div
        className="fixed left-0 top-0 z-[9999] rounded-full border pointer-events-none"
        style={{ x: smoothX, y: smoothY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          width: isInteractive ? 46 : 28,
          height: isInteractive ? 46 : 28,
          borderColor: isInteractive ? 'rgba(204,255,0,0.65)' : 'rgba(255,107,0,0.45)',
          backgroundColor: isInteractive ? 'rgba(204,255,0,0.05)' : 'rgba(255,107,0,0.02)',
          scale: isPressed ? 0.78 : 1,
        }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
      />

      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] flex items-center justify-center text-[#FF6B00]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          filter: 'drop-shadow(0 0 8px rgba(255,107,0,0.6))',
        }}
        animate={{ scale: isPressed ? 0.65 : isInteractive ? 1.15 : 0.9, rotate: isInteractive ? 45 : 0 }}
        transition={{ type: 'spring', stiffness: 420, damping: 22 }}
      >
        <Sparkle className="h-4 w-4 fill-current" aria-hidden="true" />
      </motion.div>
    </>
  );
}
