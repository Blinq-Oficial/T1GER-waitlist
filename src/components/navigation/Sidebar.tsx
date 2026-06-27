"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'HOME', href: '#hero', id: 'hero' },
  { label: 'ABOUT', href: '#about', id: 'about' },
  { label: 'VISION', href: '#vision', id: 'vision' },
  { label: 'PROTOCOL', href: '#protocol', id: 'protocol' },
  { label: 'JOIN', href: '#join', id: 'join' },
  { label: 'FAQ', href: '#faq', id: 'faq' },
];

interface Props {
  isPreloaded: boolean;
}

export default function Sidebar({ isPreloaded }: Props) {
  const [activeId, setActiveId] = useState('hero');
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // ScrollSpy Logic
    const handleScroll = () => {
      const sections = navLinks.map((link) => document.getElementById(link.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let current = 'hero';
      for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition) {
          current = section.id;
        }
      }
      setActiveId(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // init
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* ─── DESKTOP SIDEBAR (Liquid Glass Capsule) ─── */}
      <motion.aside
        initial={{ opacity: 0, x: -30, y: '-50%' }}
        animate={isPreloaded ? { opacity: 1, x: 0, y: '-50%' } : { opacity: 0, x: -30, y: '-50%' }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="fixed left-6 top-1/2 -translate-y-1/2 w-[124px] hidden md:flex flex-col py-8 px-3 z-[60] rounded-[2.5rem] bg-white/[0.02] border border-white/10 backdrop-blur-xl shadow-[inset_1px_1px_1px_rgba(255,255,255,0.15),_0_20px_40px_rgba(0,0,0,0.6)] items-center pointer-events-auto"
      >
        {/* Decorative Brand Accent Dot */}
        <div className="w-2 h-2 rounded-full bg-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,0.8)] animate-pulse mb-8" />

        {/* Index Links */}
         <nav className="flex flex-col gap-5 w-full items-center">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <div key={link.label} className="relative flex items-center justify-center w-full px-2 py-1 group">
                {/* Dynamic Sliding Orange Glass Pill Background (Centered Bubble) */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="active-sidebar-bubble"
                      className="absolute inset-0 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full z-0 shadow-[0_0_15px_rgba(255,107,0,0.2)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </AnimatePresence>

                <button
                  onClick={() => scrollTo(link.href)}
                  className={`relative z-10 font-mono text-[9px] tracking-[0.2em] uppercase cursor-pointer bg-transparent border-none transition-all duration-300 py-1.5 w-full flex items-center justify-center font-black select-none ${
                    isActive 
                      ? 'text-white font-extrabold scale-[1.04]' 
                      : 'text-white/35 group-hover:text-white/70 group-hover:scale-[1.04]'
                  }`}
                  style={{
                    textShadow: isActive ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                    paddingLeft: '0.2em', // Corrects the letter-spacing shift to ensure absolute center alignment
                  }}
                >
                  {link.label}
                </button>
              </div>
            );
          })}
        </nav>
      </motion.aside>

      {/* ─── MOBILE HEADER (Floating Glass Pill) ─── */}
      <motion.header
        initial={{ y: -80 }}
        animate={isPreloaded ? { y: 0 } : { y: -80 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="fixed top-3 left-4 right-4 h-14 md:hidden z-[60] flex items-center justify-between px-5 rounded-full border border-white/10 backdrop-blur-xl bg-black/60 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
      >
        <button
          onClick={() => scrollTo('#hero')}
          className="font-syncopate text-xs font-bold tracking-[0.2em] bg-transparent border-none text-white hover:text-[#FF6B00] transition-colors"
          aria-label="Go to top"
        >
          T1GER
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo('#join')}
            aria-label="Join the waitlist"
            className="rounded-full bg-[#FF6B00] px-4 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-black shadow-[0_0_12px_rgba(255,107,0,0.3)] hover:scale-105 transition-transform"
          >
            Get Rank
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-8 h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer rounded-full bg-white/5 hover:bg-white/10 transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            <span className={`block w-3.5 h-px bg-white transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} />
            <span className={`block w-3.5 h-px bg-white transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-3.5 h-px bg-white transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} />
          </button>
        </div>
      </motion.header>

      {/* Mobile Overlay (Liquid Glass Terminal Menu) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-[#050505]/95 backdrop-blur-2xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => {
              const isActive = activeId === link.id;
              return (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, ease: [0.19, 1, 0.22, 1] }}
                  onClick={() => scrollTo(link.href)}
                  className="font-outfit font-black text-2xl uppercase tracking-[0.2em] cursor-pointer bg-transparent border-none transition-all duration-300 hover:scale-105"
                  style={{ 
                    color: isActive ? '#FF6B00' : 'white',
                    textShadow: isActive ? '0 0 15px rgba(255,107,0,0.4)' : 'none'
                  }}
                >
                  {link.label}
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
