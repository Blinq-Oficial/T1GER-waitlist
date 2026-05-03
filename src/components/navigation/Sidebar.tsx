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
  const [isLight, setIsLight] = useState(false);

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

      // Light/Dark text adaptation based on FAQ section
      const faq = document.getElementById('faq');
      if (faq) {
        const rect = faq.getBoundingClientRect();
        setIsLight(rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2);
      } else {
        setIsLight(false);
      }
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

  const textColor = isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)';
  const activeColor = isLight ? '#000' : '#fff';

  return (
    <>
      {/* ─── DESKTOP SIDEBAR ─── */}
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={isPreloaded ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="fixed top-0 left-0 bottom-0 w-40 hidden md:flex flex-col py-12 z-[60] pointer-events-none"
      >
        {/* We use pointer-events-none on the container so we can click through the transparent parts, 
            and pointer-events-auto on the actual clickable elements. */}

        {/* We use pointer-events-none on the container so we can click through the transparent parts, 
            and pointer-events-auto on the actual clickable elements. */}

        {/* Logo removed as requested */}
        <div className="mb-12" />

        {/* Middle: Horizontal Index Links */}
        <nav className="flex flex-col flex-1 justify-center pointer-events-auto relative z-10 w-full pl-[30px]">
          {navLinks.map((link) => {
            const isActive = activeId === link.id;
            return (
              <div key={link.label} className="relative flex items-center mb-6 group">

                <button
                  onClick={() => scrollTo(link.href)}
                  className="font-outfit font-black text-[13px] tracking-widest uppercase cursor-pointer bg-transparent border-none transition-all duration-300 ml-[40px] whitespace-nowrap"
                  style={{
                    color: isActive ? activeColor : textColor,
                    textShadow: isActive && !isLight ? '0 0 10px rgba(255,255,255,0.3)' : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = textColor;
                  }}
                >
                  {link.label}
                </button>
              </div>
            );
          })}
        </nav>
      </motion.aside>

      {/* ─── MOBILE TOP BAR ─── */}
      <motion.header
        initial={{ y: -80 }}
        animate={isPreloaded ? { y: 0 } : { y: -80 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="fixed top-0 left-0 right-0 h-16 md:hidden z-[60] flex items-center justify-between px-6 backdrop-blur-md border-b"
        style={{
          borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
          backgroundColor: isLight ? 'rgba(245,245,240,0.85)' : 'rgba(5,5,5,0.7)',
        }}
      >
        <div />

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
        >
          <span className={`block w-4 h-px transition-transform duration-300 ${mobileOpen ? 'rotate-45 translate-y-1' : ''}`} style={{ backgroundColor: activeColor }} />
          <span className={`block w-4 h-px transition-opacity duration-300 ${mobileOpen ? 'opacity-0' : ''}`} style={{ backgroundColor: activeColor }} />
          <span className={`block w-4 h-px transition-transform duration-300 ${mobileOpen ? '-rotate-45 -translate-y-1' : ''}`} style={{ backgroundColor: activeColor }} />
        </button>
      </motion.header>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[55] bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, i) => {
              const isActive = activeId === link.id;
              return (
                <motion.button
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  onClick={() => scrollTo(link.href)}
                  className="font-outfit font-black text-3xl uppercase tracking-wider cursor-pointer bg-transparent border-none transition-colors"
                  style={{ color: isActive ? '#FF6B00' : 'white' }}
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
