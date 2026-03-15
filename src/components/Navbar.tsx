import React from 'react';

interface Props {
  onOpenJoin: () => void;
  onOpenSignIn: () => void;
  onOpenVip: () => void;
}

export default function Navbar({ onOpenJoin, onOpenSignIn, onOpenVip }: Props) {
  return (
    <nav className="fixed top-0 inset-x-0 h-[64px] z-50 flex items-center justify-between px-6 md:px-12 pointer-events-none">
        {/* Floating Logo - Left */}
        <div 
            className="flex items-center gap-3 rounded-full px-5 py-2 pointer-events-auto glass-pill !backdrop-blur-[8px]"
            style={{ '--accent-color': '#ffffff' } as React.CSSProperties}
        >
            <div className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-gradient-to-br from-[#FF9F1C] to-orange-600 text-black flex items-center justify-center font-black text-xs md:text-sm tracking-tighter shadow-[0_0_15px_rgba(255,159,28,0.3)]">
                T1
            </div>
            <span className="font-bold tracking-widest text-white/90 uppercase text-xs sm:text-sm">T1GER</span>
        </div>

        {/* Floating Actions - Right */}
        <div className="flex items-center gap-2 md:gap-3 pointer-events-auto">
            <button 
               onClick={onOpenSignIn}
               className="hidden lg:inline-flex rounded-lg items-center justify-center px-[14px] py-[7px] font-bold text-white/50 bg-white/5 border border-white/10 text-xs transition-colors hover:bg-white/10"
            >
                Sign in
            </button>
            <button 
               onClick={onOpenVip}
               className="hidden md:inline-flex rounded-lg glass-pill items-center justify-center px-[14px] py-[7px] font-bold text-[#E8952A] text-xs shadow-[inset_0_0_10px_rgba(232,149,42,0.1)] hover:shadow-[inset_0_0_20px_rgba(232,149,42,0.2)]"
               style={{ '--accent-color': '#E8952A' } as React.CSSProperties}
            >
                VIP code
            </button>
            <button 
                onClick={onOpenJoin}
                className="btn-primary rounded-lg items-center justify-center px-[14px] py-[7px] font-bold text-black text-xs"
                style={{ '--accent-color': '#E8952A' } as React.CSSProperties}
            >
                Join
            </button>
        </div>
    </nav>
  );
}
