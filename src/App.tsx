import { Suspense, lazy, type ReactNode, useEffect, useRef, useState, useCallback } from 'react';
import SmoothScroll from './components/animations/SmoothScroll';
import Preloader from './components/animations/Preloader';
import CustomCursor from './components/animations/CustomCursor';
import Sidebar from './components/navigation/Sidebar';

// Sections (in order)
import SectionHero from './components/sections/SectionHero';
const SectionMarker = lazy(() => import('./components/sections/SectionMarker'));
const SectionShowcase = lazy(() => import('./components/sections/SectionShowcase'));
const SectionScrollDemo = lazy(() => import('./components/sections/SectionScrollDemo'));
const SectionAbout = lazy(() => import('./components/sections/SectionAbout'));
const SectionVision = lazy(() => import('./components/sections/SectionVision'));
const SectionProtocol = lazy(() => import('./components/sections/SectionProtocol'));
const SectionLife = lazy(() => import('./components/sections/SectionLife'));
const SectionJoin = lazy(() => import('./components/sections/SectionJoin'));
const SectionFAQ = lazy(() => import('./components/sections/SectionFAQ'));
const Footer = lazy(() => import('./components/sections/Footer'));

function DeferredSection({ children, minHeight = '60vh' }: { children: ReactNode; minHeight?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin: '900px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={!shouldRender ? { minHeight } : undefined}>
      {shouldRender ? children : null}
    </div>
  );
}

export default function App() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(0);
  const [waitlistShareUrl, setWaitlistShareUrl] = useState('');

  const handleSignup = useCallback((position: number, shareUrl?: string) => {
    setWaitlistPosition(position);
    setWaitlistShareUrl(shareUrl || `https://t1ger.app/?ref=${position}`);
    setIsSignedUp(true);
  }, []);

  return (
    <SmoothScroll>
      <Preloader onComplete={() => setIsPreloaded(true)} />
      <CustomCursor />
      <div className="relative w-full text-white font-sans min-h-screen">
        {/* Layered gradient background (replaces WebGL) */}
        <div className="fixed inset-0 z-0 bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-radial opacity-40" />
        </div>

        {/* Left Navigation Sidebar */}
        <Sidebar isPreloaded={isPreloaded} />

        {/* Main Content */}
        <div className="w-full relative z-10 overflow-x-hidden">
          {/* Section 1: Hero (massive outlined title) */}
          <SectionHero
            onSuccess={handleSignup}
            isSignedUp={isSignedUp}
            waitlistPosition={waitlistPosition}
            waitlistShareUrl={waitlistShareUrl}
            isPreloaded={isPreloaded}
          />

          {/* Section 2: Cinematic Video Bridge */}
          <Suspense fallback={null}>
            <DeferredSection minHeight="55vh">
              <SectionMarker />
            </DeferredSection>
            <DeferredSection minHeight="55rem">
              <SectionScrollDemo />
            </DeferredSection>

          {/* Section 3: Visual Showcase (purely visual, no text) */}
          <DeferredSection minHeight="90vh">
            <SectionShowcase />
          </DeferredSection>

          {/* Section 3: About (visual statement → text) */}
          <DeferredSection minHeight="100vh">
            <SectionAbout />
          </DeferredSection>

          {/* Section 4: Vision (Numbered Pillars) */}
          <DeferredSection minHeight="100vh">
            <SectionVision />
          </DeferredSection>

          {/* Section 5: The Protocol (Sticker Text Reveals) */}
          <DeferredSection minHeight="100vh">
            <SectionProtocol />
          </DeferredSection>

          {/* Section 6: Life Visualizer */}
          <DeferredSection minHeight="100vh">
            <SectionLife />
          </DeferredSection>

          {/* Section 7: Join / Donate */}
          <DeferredSection minHeight="100vh">
            <SectionJoin
              onSuccess={handleSignup}
              isSignedUp={isSignedUp}
              waitlistPosition={waitlistPosition}
              waitlistShareUrl={waitlistShareUrl}
            />
          </DeferredSection>

          {/* Section 8: FAQ */}
          <DeferredSection minHeight="80vh">
            <SectionFAQ />

          {/* Section 9: Footer */}
            <Footer />
          </DeferredSection>
          </Suspense>
        </div>
      </div>
    </SmoothScroll>
  );
}
