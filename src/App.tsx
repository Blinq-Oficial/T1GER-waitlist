import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Waitlist from './components/Waitlist';
import Marquee from './components/Marquee';
import WhatIsT1ger from './components/WhatIsT1ger';
import Pillars from './components/Pillars';
import Manifesto from './components/Manifesto';
import JoinWaitlistModal from './components/modals/JoinWaitlistModal';
import SignInModal from './components/modals/SignInModal';
import VipCodeModal from './components/modals/VipCodeModal';

export default function App() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);

  return (
    <div className="text-slate-50 selection:bg-[#E8952A]/30 scrollbar-hide overflow-x-hidden">
      {/* Global Atmospheric Light Sources */}
      <div className="absolute inset-x-0 top-0 h-full pointer-events-none z-0 overflow-hidden">
        {/* Cool blue-teal behind hero */}
        <div className="absolute top-0 left-[10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-[#0E3547]/40 rounded-full blur-[120px] mix-blend-screen" />
        
        {/* Very subtle warm amber glow emerging toward middle */}
        <div className="absolute top-[30%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-[#E8952A]/10 rounded-full blur-[150px] mix-blend-screen" />
        
        {/* Soft fill further down */}
        <div className="absolute top-[60%] left-[-20%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] bg-[#0A1A2A]/20 rounded-full blur-[140px] mix-blend-screen" />
      </div>

      <div className="relative z-10 w-full flex flex-col">
        <Navbar 
          onOpenJoin={() => setIsJoinOpen(true)}
          onOpenSignIn={() => setIsSignInOpen(true)}
          onOpenVip={() => setIsVipOpen(true)}
        />
        <Waitlist 
          onOpenJoin={() => setIsJoinOpen(true)}
          onOpenVip={() => setIsVipOpen(true)}
        />
        <Marquee />
        <WhatIsT1ger />
        <Pillars />
        <Manifesto />
      </div>

      {/* Modals */}
      <JoinWaitlistModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <SignInModal isOpen={isSignInOpen} onClose={() => setIsSignInOpen(false)} />
      <VipCodeModal 
        isOpen={isVipOpen} 
        onClose={() => setIsVipOpen(false)} 
        onOpenRegularWaitlist={() => setIsJoinOpen(true)}
      />
    </div>
  );
}
