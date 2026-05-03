import { useRef, useEffect, useState } from 'react';

interface LetterRevealProps {
  text: string;
  /** Additional className for the wrapper */
  className?: string;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Tag to render */
  as?: React.ElementType;
  /** If true, always show */
  forceVisible?: boolean;
  /** Class for each letter span */
  letterClassName?: string;
}

/**
 * LetterReveal — Chainzoku-style letter-by-letter heading reveal.
 *
 * Each character is wrapped in an overflow-hidden container.
 * Characters slide up from below with staggered delays (0.08s apart).
 * Triggered by IntersectionObserver.
 */
export default function LetterReveal({
  text,
  className = '',
  delay = 0,
  as: Tag = 'h1',
  forceVisible = false,
  letterClassName = '',
}: LetterRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(forceVisible);

  useEffect(() => {
    if (forceVisible) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setInView(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, forceVisible]);

  const chars = Array.from(text);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={`letter-reveal ${inView ? 'in-view' : ''} ${className}`}
      aria-label={text}
    >
      {chars.map((char, i) => (
        <span key={i} className="char" aria-hidden="true">
          <span className={`letter ${letterClassName}`}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </Tag>
  );
}
