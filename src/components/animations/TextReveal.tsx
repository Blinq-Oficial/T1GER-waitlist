import { useRef, useEffect, useState } from 'react';

interface TextRevealProps {
  children: string;
  /** Additional className for the wrapper */
  className?: string;
  /** Delay before animation starts (ms) */
  delay?: number;
  /** Tag to render: p, h1, h2, etc. */
  as?: React.ElementType;
  /** If true, always show (skip intersection check) */
  forceVisible?: boolean;
}

/**
 * TextReveal — Chainzoku-style word-by-word text reveal.
 * 
 * Splits text into lines/words. Each word starts translated below
 * its overflow-hidden container and slides up when the element
 * enters the viewport.
 */
export default function TextReveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  forceVisible = false,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(forceVisible);

  useEffect(() => {
    if (forceVisible) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Small delay for stagger effect
          setTimeout(() => setInView(true), delay);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, forceVisible]);

  // Split text into words
  const words = children.split(/\s+/).filter(Boolean);

  return (
    <Tag
      ref={ref as React.RefObject<HTMLElement>}
      className={`lines ${inView ? 'in-view' : ''} ${className}`}
    >
      <span className="line">
        <span className="words">
          {words.map((word, i) => (
            <span
              key={i}
              className="word"
              style={{ '--line-delay': `${i * 0.04}s` } as React.CSSProperties}
            >
              {word}
            </span>
          ))}
        </span>
      </span>
    </Tag>
  );
}

/* ── Multi-line variant ── */

interface MultiLineRevealProps {
  lines: string[];
  className?: string;
  delay?: number;
  lineClassName?: string;
}

export function MultiLineReveal({
  lines,
  className = '',
  delay = 0,
  lineClassName = '',
}: MultiLineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
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
      { threshold: 0.15, rootMargin: '-50px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={`line-reveal ${inView ? 'in-view' : ''} ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="line-wrapper">
          <span
            className={`line-content ${lineClassName}`}
            style={{ '--line-delay': `${i * 0.1}s` } as React.CSSProperties}
          >
            {line}
          </span>
        </span>
      ))}
    </div>
  );
}
