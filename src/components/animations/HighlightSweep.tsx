import { useRef, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface HighlightSweepProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Custom highlight color (defaults to electric orange) */
  color?: string;
}

/**
 * HighlightSweep — Skewed accent-color underline that sweeps behind text.
 *
 * A pseudo-element slides from left to right with a slight skew,
 * creating a highlighter-pen effect behind inline text.
 */
export default function HighlightSweep({
  children,
  className = '',
  delay = 0,
  color,
}: HighlightSweepProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setInView(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <span
      ref={ref}
      className={`highlight-sweep ${inView ? 'in-view' : ''} ${className}`}
      style={color ? { '--sweep-color': color } as React.CSSProperties : undefined}
    >
      {children}
    </span>
  );
}
