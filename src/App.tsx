import { Suspense, lazy, useCallback, useState } from 'react';
import SmoothScroll from './components/animations/SmoothScroll';
import Preloader from './components/animations/Preloader';
import CustomCursor from './components/animations/CustomCursor';
import Sidebar from './components/navigation/Sidebar';
import SectionHero from './components/sections/SectionHero';
import EarlyAdopterModal from './components/modals/EarlyAdopterModal';
import LegalPage from './components/legal/LegalPage';

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

export default function App() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(0);
  const [waitlistShareUrl, setWaitlistShareUrl] = useState('');
  const [isEarlyAdopterOpen, setIsEarlyAdopterOpen] = useState(false);

  const handleSignup = useCallback((position: number, shareUrl?: string) => {
    setWaitlistPosition(position);
    setWaitlistShareUrl(shareUrl || 'https://t1ger.app/');
    setIsSignedUp(true);
  }, []);

  const path = window.location.pathname.replace(/\/$/, '') || '/';
  if (path === '/terms') return <LegalPage type="terms" />;
  if (path === '/privacy') return <LegalPage type="privacy" />;

  return (
    <SmoothScroll>
      <Preloader onComplete={() => setIsPreloaded(true)} />
      <CustomCursor />
      <div className="relative w-full min-h-screen text-white font-sans">
        <div className="fixed inset-0 z-0 bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-radial opacity-40" />
        </div>

        <Sidebar isPreloaded={isPreloaded} />

        <main className="relative z-10 w-full overflow-x-hidden">
          <SectionHero
            onSuccess={handleSignup}
            isSignedUp={isSignedUp}
            waitlistPosition={waitlistPosition}
            waitlistShareUrl={waitlistShareUrl}
            isPreloaded={isPreloaded}
            onOpenEarlyAdopter={() => setIsEarlyAdopterOpen(true)}
          />

          <Suspense fallback={null}>
            <SectionMarker />
            <SectionLife />
            <SectionScrollDemo />
            <SectionShowcase />
            <SectionAbout />
            <SectionVision />
            <SectionProtocol />
            <SectionJoin
              onSuccess={handleSignup}
              isSignedUp={isSignedUp}
              waitlistPosition={waitlistPosition}
              waitlistShareUrl={waitlistShareUrl}
              onOpenEarlyAdopter={() => setIsEarlyAdopterOpen(true)}
            />
            <SectionFAQ />
            <Footer />
          </Suspense>
        </main>
        <EarlyAdopterModal isOpen={isEarlyAdopterOpen} onClose={() => setIsEarlyAdopterOpen(false)} />
      </div>
    </SmoothScroll>
  );
}
