"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const TARGETS = ["FOUNDERS", "ENTREPRENEURS", "INVESTORS", "BUILDERS"];

export default function SectionMarker() {
  const [index, setIndex] = useState(0);
  const [highlightActive, setHighlightActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5, once: false });

  // Word cycling logic
  useEffect(() => {
    if (!isInView) {
      setHighlightActive(false);
      return;
    }

    // Initial delay highlight trigger when scrolling in
    const initialTimeout = setTimeout(() => {
      setHighlightActive(true);
    }, 400);

    const interval = setInterval(() => {
      setHighlightActive(false);
      // Wait for highlight retract, then swap word and re-highlight
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % TARGETS.length);
        setHighlightActive(true);
      }, 500);
    }, 3500);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [isInView]);

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-[55vh] flex flex-col items-center justify-center bg-[#050505] border-t border-b border-white/5 px-6 md:pl-40 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-radial from-[rgba(204,255,0,0.02)] to-transparent pointer-events-none z-0" />
      
      {/* Dynamic Grid Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.01)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto">
        <span className="font-mono text-white/30 tracking-[0.4em] text-[10px] sm:text-xs uppercase mb-8 block font-black">
          TARGET PROTOCOL ACTIVE // 1.0
        </span>

        <h2 className="font-outfit font-black text-white leading-[1.1] tracking-tight uppercase select-none text-[2.5rem] sm:text-[4rem] md:text-[5.5rem]">
          MADE FOR{" "}
          <span className="relative inline-block whitespace-nowrap px-4 py-1 mt-2 md:mt-0">
            {/* Draw Highlight marker bar */}
            <motion.span
              initial={{ scaleX: 0 }}
              animate={highlightActive ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{
                type: "spring",
                stiffness: 110,
                damping: 14,
                restDelta: 0.001
              }}
              style={{ originX: 0 }}
              className="absolute inset-0 w-full bg-[#CCFF00] z-0 rounded-lg sm:rounded-2xl shadow-[0_0_40px_rgba(204,255,0,0.25)]"
            />
            
            {/* Swapping Text */}
            <span className="relative z-10 block min-w-[280px] sm:min-w-[420px] md:min-w-[580px]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
                  style={{
                    color: highlightActive ? "#050505" : "#ffffff",
                    transition: "color 0.4s ease-out-in"
                  }}
                  className="inline-block transition-colors duration-500 font-extrabold font-outfit"
                >
                  {TARGETS[index]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </h2>

        <p className="font-sans text-xs sm:text-sm text-zinc-500 tracking-[0.05em] max-w-lg mt-10 leading-relaxed font-medium uppercase">
          T1GER is built specifically to cultivate relentless focus, mechanical consistency, and elite execution for high-performance operators.
        </p>
      </div>
    </section>
  );
}
