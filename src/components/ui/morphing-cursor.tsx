import type React from 'react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

type MagneticTextProps = {
  text: string;
  hoverText?: string;
  className?: string;
  textClassName?: string;
};

export function MagneticText({
  text,
  hoverText = 'ACT DAILY',
  className,
  textClassName,
}: MagneticTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const moveLens = (event: React.PointerEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    const circle = circleRef.current;
    const inner = innerRef.current;
    if (!container || !circle || !inner) return;

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    circle.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    inner.style.width = `${rect.width}px`;
    inner.style.height = `${rect.height}px`;
    inner.style.transform = `translate3d(${-x}px, ${-y}px, 0)`;
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative inline-flex max-w-full select-none items-center justify-center overflow-hidden', className)}
      onPointerEnter={(event) => {
        if (event.pointerType === 'touch') return;
        setIsHovered(true);
        moveLens(event);
      }}
      onPointerMove={moveLens}
      onPointerLeave={() => setIsHovered(false)}
    >
      <span className={cn('font-outfit font-black uppercase leading-none text-white', textClassName)}>{text}</span>
      <div
        ref={circleRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 overflow-hidden rounded-full bg-[#CCFF00] transition-[width,height] duration-500"
        style={{ width: isHovered ? 150 : 0, height: isHovered ? 150 : 0 }}
      >
        <span
          ref={innerRef}
          className={cn('absolute left-1/2 top-1/2 flex h-full items-center whitespace-nowrap font-outfit font-black uppercase leading-none text-black will-change-transform', textClassName)}
        >
          {hoverText}
        </span>
      </div>
    </div>
  );
}
