import { useState, useCallback } from 'react';
import SmoothScroll from './components/animations/SmoothScroll';
import Preloader from './components/animations/Preloader';
import CustomCursor from './components/animations/CustomCursor';
import Sidebar from './components/navigation/Sidebar';

// Sections (in order)
import SectionHero from './components/sections/SectionHero';
import SectionShowcase from './components/sections/SectionShowcase';
import SectionAbout from './components/sections/SectionAbout';
import SectionVision from './components/sections/SectionVision';
import SectionProtocol from './components/sections/SectionProtocol';
import SectionLife from './components/sections/SectionLife';
import SectionJoin from './components/sections/SectionJoin';
import SectionFAQ from './components/sections/SectionFAQ';
import SectionVideo from './components/sections/SectionVideo';
import Footer from './components/sections/Footer';

export default function App() {
  const [isPreloaded, setIsPreloaded] = useState(false);
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState(0);

  const handleSignup = useCallback((position: number) => {
    setWaitlistPosition(position);
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
        <div className="w-full relative z-10">
          {/* Section 1: Hero (massive outlined title) */}
          <SectionHero
            onSuccess={handleSignup}
            isSignedUp={isSignedUp}
            waitlistPosition={waitlistPosition}
            isPreloaded={isPreloaded}
          />

          {/* Section 2: Cinematic Video Bridge */}
          <SectionVideo />

          {/* Section 3: Visual Showcase (purely visual, no text) */}
          <SectionShowcase />

          {/* Section 3: About (visual statement → text) */}
          <SectionAbout />

          {/* Section 4: Vision (Numbered Pillars) */}
          <SectionVision />

          {/* Section 5: The Protocol (Sticker Text Reveals) */}
          <SectionProtocol />

          {/* Section 6: Life Visualizer */}
          <SectionLife />

          {/* Section 7: Join / Donate */}
          <SectionJoin
            onSuccess={handleSignup}
            isSignedUp={isSignedUp}
            waitlistPosition={waitlistPosition}
          />

          {/* Section 8: FAQ */}
          <SectionFAQ />

          {/* Section 9: Footer */}
          <Footer />
        </div>
      </div>
    </SmoothScroll>
  );
}
