import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface Props {
  children: React.ReactNode;
  yOffset?: number;
  duration?: number;
  delay?: number;
}

export default function ScrollReveal({ children, yOffset = 50, duration = 0.8, delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.2 1"] // When the top of the element hits bottom of viewport, start. Ends when it goes slightly above.
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [yOffset, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);
  const filter = useTransform(scrollYProgress, [0, 1], ["blur(10px)", "blur(0px)"]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale, filter }}
      transition={{ duration, delay }}
      className="w-full will-change-transform"
    >
      {children}
    </motion.div>
  );
}
