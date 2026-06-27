"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode;
  children: React.ReactNode;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
  });
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const scaleDimensions = () => {
    return isMobile ? [0.8, 0.95] : [1.05, 1];
  };

  const rotate = useTransform(scrollYProgress, [0, 1], [18, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      className="h-[48rem] md:h-[75rem] flex items-center justify-center relative p-4 md:p-20 overflow-hidden"
      ref={containerRef}
    >
      <div
        className="py-10 md:py-24 w-full relative"
        style={{
          perspective: "1000px",
        }}
      >
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>
          {children}
        </Card>
      </div>
    </div>
  );
};

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>;
  titleComponent: string | React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        translateY: translate,
        margin: "0 auto",
      }}
      className="div max-w-5xl mx-auto text-center relative z-20"
    >
      {titleComponent}
    </motion.div>
  );
};

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>;
  scale: MotionValue<number>;
  translate: MotionValue<number>;
  children: React.ReactNode;
}) => {
  return (
    <motion.div
      style={{
        rotateX: rotate,
        scale,
        margin: "0 auto",
        boxShadow:
          "0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 107, 0, 0.1)",
      }}
      className="max-w-[280px] md:max-w-[340px] aspect-[9/19.5] mx-auto -mt-12 w-full border-[6px] border-zinc-850 ring-1 ring-white/20 p-2.5 bg-black rounded-[46px] shadow-2xl relative"
    >
      {/* Premium glow element behind the phone */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF6B00] to-[#FF9E00] rounded-[46px] opacity-15 blur-2xl pointer-events-none" />

      {/* Dynamic Island */}
      <div className="absolute top-5 w-20 h-5 md:w-24 md:h-6 bg-black rounded-full z-30 flex items-center justify-between px-3 md:px-3.5 pointer-events-none left-1/2 -translate-x-1/2">
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
        <div className="w-2 md:w-2.5 h-1 bg-zinc-800 rounded-full" />
      </div>

      {/* Screen Bezel and Inner Frame */}
      <div className="h-full w-full overflow-hidden rounded-[36px] bg-zinc-950 border border-white/5 relative z-10">
        {children}
      </div>
    </motion.div>
  );
};
