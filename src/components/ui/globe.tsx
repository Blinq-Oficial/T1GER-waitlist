import createGlobe, { type COBEOptions } from 'cobe';
import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  devicePixelRatio: 1.5,
  phi: 0,
  theta: 0.25,
  dark: 1,
  diffuse: 1.1,
  mapSamples: 12000,
  mapBrightness: 3,
  baseColor: [0.08, 0.08, 0.08],
  markerColor: [1, 0.42, 0],
  glowColor: [0.35, 0.12, 0.01],
  markers: [
    { location: [40.7128, -74.006], size: 0.08 },
    { location: [51.5072, -0.1276], size: 0.07 },
    { location: [19.4326, -99.1332], size: 0.07 },
    { location: [-23.5505, -46.6333], size: 0.08 },
    { location: [6.2442, -75.5812], size: 0.07 },
    { location: [25.2048, 55.2708], size: 0.06 },
    { location: [19.076, 72.8777], size: 0.07 },
    { location: [1.3521, 103.8198], size: 0.06 },
    { location: [35.6762, 139.6503], size: 0.08 },
    { location: [-33.8688, 151.2093], size: 0.06 },
  ],
};

type GlobeProps = {
  className?: string;
  config?: COBEOptions;
};

export function Globe({ className, config = GLOBE_CONFIG }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const phiRef = useRef(0);
  const widthRef = useRef(0);
  const dragStartRef = useRef<number | null>(null);
  const dragOffsetRef = useRef(0);
  const rotationRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      widthRef.current = canvas.offsetWidth;
    };
    updateSize();

    const globe = createGlobe(canvas, {
      ...config,
      width: widthRef.current * 2,
      height: widthRef.current * 2,
      devicePixelRatio: Math.min(window.devicePixelRatio, config.devicePixelRatio ?? 1.5),
    });
    const observer = new ResizeObserver(() => {
      updateSize();
      globe.update({
        width: widthRef.current * 2,
        height: widthRef.current * 2,
      });
    });
    observer.observe(canvas);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let frameId = 0;
    const render = () => {
      if (!reduceMotion && dragStartRef.current === null) phiRef.current += 0.0035;
      globe.update({ phi: phiRef.current + rotationRef.current });
      if (!reduceMotion) frameId = window.requestAnimationFrame(render);
    };
    render();

    const revealTimer = window.setTimeout(() => {
      canvas.style.opacity = '1';
    }, 60);

    return () => {
      window.clearTimeout(revealTimer);
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      globe.destroy();
    };
  }, [config]);

  const updateDrag = (clientX: number) => {
    if (dragStartRef.current === null) return;
    const delta = clientX - dragStartRef.current;
    dragOffsetRef.current = delta;
    rotationRef.current = delta / 180;
  };

  return (
    <div className={cn('absolute inset-0 mx-auto aspect-square w-full', className)}>
      <canvas
        ref={canvasRef}
        aria-label="Interactive globe showing global learning sources"
        className="size-full touch-none opacity-0 transition-opacity duration-500 [contain:layout_paint_size]"
        onPointerDown={(event) => {
          dragStartRef.current = event.clientX - dragOffsetRef.current;
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => updateDrag(event.clientX)}
        onPointerUp={(event) => {
          dragStartRef.current = null;
          event.currentTarget.releasePointerCapture(event.pointerId);
        }}
        onPointerCancel={() => {
          dragStartRef.current = null;
        }}
      />
    </div>
  );
}
