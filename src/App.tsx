import { Suspense, lazy, useCallback, useEffect, useState } from 'react';
import SmoothScroll from './components/animations/SmoothScroll';
import CustomCursor from './components/animations/CustomCursor';
import Sidebar from './components/navigation/Sidebar';
import SectionHero from './components/sections/SectionHero';
import EarlyAdopterModal from './components/modals/EarlyAdopterModal';
import LegalPage from './components/legal/LegalPage';
import EarlyAccessSuccess from './components/early-access/EarlyAccessSuccess';

const SectionAbout = lazy(() => import('./components/sections/SectionAbout'));
const SectionVision = lazy(() => import('./components/sections/SectionVision'));
const SectionProtocol = lazy(() => import('./components/sections/SectionProtocol'));
const SectionJoin = lazy(() => import('./components/sections/SectionJoin'));
const SectionFAQ = lazy(() => import('./components/sections/SectionFAQ'));
const Footer = lazy(() => import('./components/sections/Footer'));

export default function App() {
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
  useEffect(() => {
    const metadata: Record<string, { title: string; description: string }> = {
      '/': {
        title: 'T1GER | Learn. Apply. Advance.',
        description: 'Turn investing lessons into real-world action. Join the T1GER waitlist for daily missions, proof of work, and staged beta access.',
      },
      '/terms': { title: 'Terms & Conditions | T1GER', description: 'Terms and conditions for the T1GER waitlist and Early Adopter offer.' },
      '/privacy': { title: 'Privacy Policy | T1GER', description: 'How T1GER collects, uses, and protects waitlist and payment information.' },
      '/early-access/success': { title: 'Early Adopter Checkout | T1GER', description: 'Return page for the T1GER Early Adopter checkout.' },
    };
    const current = metadata[path] || metadata['/'];
    document.title = current.title;
    document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute('content', current.description);
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', `https://t1ger.app${path === '/' ? '/' : path}`);
  }, [path]);

  if (path === '/early-access/success') return <><CustomCursor /><EarlyAccessSuccess /></>;
  if (path === '/terms') return <><CustomCursor /><LegalPage type="terms" /></>;
  if (path === '/privacy') return <><CustomCursor /><LegalPage type="privacy" /></>;

  return (
    <SmoothScroll>
      <CustomCursor />
      <div className="relative w-full min-h-screen text-white font-sans">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <div className="fixed inset-0 z-0 bg-[#050505]">
          <div className="absolute inset-0 bg-gradient-radial opacity-40" />
        </div>

        <Sidebar isPreloaded />

        <main id="main-content" className="relative z-10 w-full overflow-x-hidden">
          <SectionHero
            onSuccess={handleSignup}
            isSignedUp={isSignedUp}
            waitlistPosition={waitlistPosition}
            waitlistShareUrl={waitlistShareUrl}
            isPreloaded
            onOpenEarlyAdopter={() => setIsEarlyAdopterOpen(true)}
          />

          <Suspense fallback={null}>
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
