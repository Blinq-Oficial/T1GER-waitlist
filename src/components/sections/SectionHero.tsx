import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { joinWaitlist } from '../../lib/waitlistSignup';

interface Props {
  onSuccess: (position: number, shareUrl?: string) => void;
  isSignedUp: boolean;
  waitlistPosition: number;
  waitlistShareUrl: string;
  isPreloaded: boolean;
}

/**
 * SectionHero — Chainzoku-inspired hero with outlined typography.
 */
export default function SectionHero({ onSuccess, isSignedUp, waitlistPosition, waitlistShareUrl, isPreloaded }: Props) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [helperText, setHelperText] = useState('');
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Mouse-follow glow
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth);
      mouseY.set(e.clientY / window.innerHeight);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorText('');
    setHelperText('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setErrorText('Enter a valid email.');
      return;
    }

    setIsLoading(true);
    
    try {
      const data = await joinWaitlist(email);
      setEmail('');
      setHelperText(data.alreadyJoined ? "You're already in. Showing your position." : 'Position secured.');
      onSuccess(data.position || 800, data.shareUrl);
    } catch (err: unknown) {
      console.error('Network Error:', err);
      setErrorText(err instanceof Error ? err.message : 'Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const shareUrl = waitlistShareUrl || `https://t1ger.app/?ref=${waitlistPosition}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center px-6 sm:px-12 md:pl-40 overflow-x-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 80% 60% at 50% 50%, rgba(255,107,0,0.08) 0%, transparent 70%),
              radial-gradient(ellipse 60% 40% at 30% 70%, rgba(255,60,0,0.05) 0%, transparent 60%),
              radial-gradient(ellipse 50% 50% at 70% 30%, rgba(200,80,0,0.04) 0%, transparent 50%)
            `,
          }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, oklch(65% 0.22 45 / 0.04) 0%, transparent 60%)',
            left: smoothX,
            top: smoothY,
            x: '-50%',
            y: '-50%',
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      </div>

      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-noise" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isSignedUp ? (
            <motion.div
              key="signup-phase"
              className="flex flex-col items-center w-full"
              exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isPreloaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
                className="mb-8"
              >
                <span className="font-mono text-white/30 tracking-[0.5em] text-xs sm:text-sm uppercase">
                  THE DUOLINGO FOR FOUNDERS
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isPreloaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="mb-8 relative"
              >
                <h1
                  className="font-outfit font-black uppercase leading-[0.82] select-none"
                  style={{
                    fontSize: 'clamp(3.5rem, 18vw, 18rem)',
                    letterSpacing: '-0.02em',
                    color: 'transparent',
                    WebkitTextStroke: '1px rgba(255,255,255,0.15)',
                    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
                  }}
                >
                  {'T1GER'.split('').map((char, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 80, rotateX: 90 }}
                      animate={isPreloaded ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 80, rotateX: 90 }}
                      transition={{
                        duration: 1,
                        delay: 0.5 + i * 0.1,
                        ease: [0.19, 1, 0.22, 1],
                      }}
                      className="inline-block"
                      style={{ transformOrigin: 'bottom center' }}
                    >
                      {char}
                    </motion.span>
                  ))}
                </h1>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isPreloaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.23, 1, 0.32, 1] }}
                className="mb-12"
              >
                <p
                  className="font-outfit font-black text-white/90 uppercase tracking-[0.06em]"
                  style={{ fontSize: 'clamp(1rem, 2.5vw, 1.8rem)' }}
                >
                  BUILD DISCIPLINE.<br className="md:hidden" />{' '}
                  <span className="text-[#CCFF00]">HUNT GREATNESS.</span>
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                noValidate
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isPreloaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 1.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-sm space-y-3"
              >
                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    aria-label="Email address"
                    autoComplete="email"
                    placeholder="YOUR EMAIL"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorText('');
                    }}
                    disabled={isLoading}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-full px-6 py-4 text-white placeholder-white/30 font-mono tracking-[0.15em] text-sm outline-none transition-all duration-150 focus:border-[#FF6B00]"
                  />
                  <AnimatePresence>
                    {errorText && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-6 left-4 text-[#FF6B00] text-xs font-mono"
                      >
                        {errorText}
                      </motion.p>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {helperText && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="absolute -bottom-6 left-4 text-[#CCFF00] text-xs font-mono"
                      >
                        {helperText}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-tiger --primary w-full py-4 text-sm flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>CONNECTING...</span>
                      </>
                    ) : (
                      'JOIN THE WAITLIST'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => document.getElementById('life')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-white/20 hover:text-[#FF6B00] font-mono text-[10px] tracking-[0.3em] uppercase transition-colors"
                  >
                    [ CALCULATE YOUR TIMELINE ]
                  </button>
                </div>
              </motion.form>
            </motion.div>
          ) : (
            <motion.div
              key="post-signup"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(15px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full max-w-2xl relative"
              style={{ minHeight: '60vh', justifyContent: 'center' }}
            >
              <div className="absolute inset-0 bg-[#FF6B00]/5 blur-[120px] pointer-events-none rounded-full" />

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-3 bg-white/[0.03] border border-[#FF6B00]/30 backdrop-blur-md rounded-full px-6 py-2.5 mb-10"
              >
                <Sparkles className="w-4 h-4 text-[#FF6B00]" />
                <span className="font-mono text-xs text-white tracking-[0.4em] uppercase font-bold">
                  THE HUNT BEGINS
                </span>
              </motion.div>              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-14 text-center"
              >
                <span className="font-mono text-white/50 text-[11px] tracking-[0.5em] uppercase block mb-6">
                  YOUR ELITE RANK
                </span>
                <div className="relative inline-flex items-baseline justify-center group">
                  <span className="text-[#FF6B00] font-mono text-[4vw] md:text-[3rem] font-black mr-2 leading-none">#</span>
                  <span
                    className="font-outfit font-black text-white block relative z-10 transition-transform group-hover:scale-105 duration-700"
                    style={{
                      fontSize: 'clamp(6rem, 22vw, 14rem)',
                      lineHeight: 0.7,
                      letterSpacing: '-0.06em',
                    }}
                  >
                    {waitlistPosition}
                  </span>
                  <div className="absolute inset-0 bg-[#FF6B00]/10 blur-[100px] rounded-full -z-10 group-hover:bg-[#FF6B00]/20 transition-colors duration-700" />
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="w-full max-w-sm flex flex-col items-center gap-8"
              >
                <div className="w-full space-y-4">
                  <p className="text-white/40 font-mono text-[9px] tracking-[0.3em] uppercase text-center">
                    Share your rank to climb higher
                  </p>
                  
                  <div className="flex items-center gap-2 bg-white/[0.02] border border-white/10 rounded-full pl-6 pr-1.5 py-1.5 group">
                    <span className="flex-1 font-mono text-[10px] text-white/30 truncate select-all">{shareUrl}</span>
                    <button 
                      onClick={handleCopy}
                      className="bg-[#FF6B00] text-black px-6 py-2.5 rounded-full font-mono text-[10px] font-bold hover:bg-white transition-all uppercase tracking-widest"
                    >
                      {copied ? 'COPIED' : 'COPY'}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <a 
                      href={`https://wa.me/?text=${encodeURIComponent(`I just joined the T1GER waitlist! 🐅 I'm Rank #${waitlistPosition}. Join the hunt: ${shareUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/[0.03] border border-white/10 hover:border-[#25D366]/40 hover:text-[#25D366] transition-all rounded-2xl py-5 text-center font-mono text-[9px] font-bold tracking-[0.2em] uppercase"
                    >
                      WHATSAPP
                    </a>
                    <a 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just secured my rank on the T1GER waitlist. 🐅\n\nRank: #${waitlistPosition}\nJoin the elite 1%: ${shareUrl}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-white/[0.03] border border-white/10 hover:border-white hover:text-white transition-all rounded-2xl py-5 text-center font-mono text-[9px] font-bold tracking-[0.2em] uppercase"
                    >
                      SHARE ON X
                    </a>
                  </div>
                </div>

                <button
                  onClick={() => document.getElementById('life')?.scrollIntoView({ behavior: 'smooth' })}
                  className="w-full relative bg-white text-black py-6 rounded-full font-outfit font-black text-[11px] uppercase tracking-[0.25em] hover:bg-[#FF6B00] hover:text-white transition-all shadow-2xl overflow-hidden group"
                >
                  <span className="relative z-10">REVEAL BIOLOGICAL CLOCK</span>
                  <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
