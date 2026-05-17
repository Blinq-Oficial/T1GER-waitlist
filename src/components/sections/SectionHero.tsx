import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Loader2, Sparkles, ChevronRight, ShieldCheck } from 'lucide-react';
import { joinWaitlist } from '../../lib/waitlistSignup';
import { GlassButton } from '../ui/apple-tahoe-liquid-glass-button';

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const fireConfetti = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const particles: any[] = [];
    const colors = ["#FF6B00", "#10b981", "#fbbf24", "#f472b6", "#fff"];

    canvas.width = 600;
    canvas.height = 600;

    const createParticle = () => {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16, // Random spread X
        vy: (Math.random() - 1.8) * 12, // Upward velocity
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 5 + 3,
      };
    };

    for (let i = 0; i < 65; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.45; // Gravity
        p.life -= 1.8;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / 100);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.life <= 0) {
          particles.splice(i, 1);
          i--;
        }
      }

      requestAnimationFrame(animate);
    };

    animate();
  };

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
      fireConfetti();
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
      className="relative flex flex-col items-center justify-center px-6 sm:px-12 md:pl-40 overflow-hidden"
      style={{ minHeight: '100vh' }}
    >
      {/* Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 0, 0.4); }
          50% { box-shadow: 0 0 60px rgba(255, 107, 0, 0.8), 0 0 100px rgba(255, 107, 0, 0.4); }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}} />

      {/* 3D Perspective Spinning Backdrop Layer */}
      <div
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{
          perspective: "1200px",
          transform: "perspective(1200px) rotateX(15deg)",
          transformOrigin: "center bottom",
          opacity: 1,
        }}
      >
        {/* Image 3 (Back) - spins clockwise */}
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: "2000px",
              height: "2000px",
              transform: "translate(-50%, -50%) rotate(279.05deg)",
              zIndex: 0,
            }}
          >
            <img
              src="https://framerusercontent.com/images/oqZEqzDEgSLygmUDuZAYNh2XQ9U.png?scale-down-to=2048"
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        </div>

        {/* Image 2 (Middle) - spins counter-clockwise */}
        <div className="absolute inset-0 animate-spin-slow-reverse">
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: "1000px",
              height: "1000px",
              transform: "translate(-50%, -50%) rotate(304.42deg)",
              zIndex: 1,
            }}
          >
            <img
              src="https://framerusercontent.com/images/UbucGYsHDAUHfaGZNjwyCzViw8.png?scale-down-to=1024"
              alt=""
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        </div>

        {/* Image 1 (Front) - spins clockwise */}
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="absolute top-1/2 left-1/2"
            style={{
              width: "800px",
              height: "800px",
              transform: "translate(-50%, -50%) rotate(48.33deg)",
              zIndex: 2,
            }}
          >
            <img
              src="https://framerusercontent.com/images/Ans5PAxtJfg3CwxlrPMSshx2Pqc.png"
              alt="App Icon"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </div>

      {/* Animated gradient background and mouse follow */}
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

              <div className="w-full max-w-sm relative">
                {/* Click-through Confetti Canvas */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-50"
                />

                <motion.form
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isPreloaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.8, delay: 1.5, ease: [0.23, 1, 0.32, 1] }}
                  className="w-full space-y-6"
                >
                  <div className="relative group">
                    <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#FF6B00] transition-colors" />
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
                      className="w-full bg-white/[0.03] border border-white/10 rounded-full pl-13 pr-6 py-4.5 text-white placeholder-white/20 font-mono tracking-[0.15em] text-sm outline-none transition-all duration-300 focus:border-[#FF6B00] focus:bg-white/[0.06] focus:ring-1 focus:ring-[#FF6B00]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                    />
                  </div>

                  <AnimatePresence mode="wait">
                    {errorText && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden w-full flex justify-center"
                      >
                        <p className="text-[#FF6B00] text-xs font-mono text-center tracking-[0.1em] uppercase">
                          ⚠ {errorText}
                        </p>
                      </motion.div>
                    )}
                    {helperText && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, marginTop: 0 }}
                        animate={{ opacity: 1, height: 'auto', marginTop: 4 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }}
                        className="overflow-hidden w-full flex justify-center"
                      >
                        <p className="text-[#CCFF00] text-xs font-mono text-center tracking-[0.12em] uppercase animate-pulse">
                          ⚡ {helperText}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex flex-col gap-5">
                    <GlassButton
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4.5 text-sm font-mono tracking-[0.2em] font-black uppercase text-white shadow-[0_0_20px_rgba(255,107,0,0.15)] hover:shadow-[0_0_35px_rgba(255,107,0,0.35)] transition-all duration-300 border border-[#FF6B00]/25 hover:border-[#FF6B00]/50"
                      glassColor="rgba(255, 107, 0, 0.38)"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>CONNECTING...</span>
                        </>
                      ) : (
                        'JOIN THE WAITLIST'
                      )}
                    </GlassButton>

                    <button
                      type="button"
                      onClick={() => document.getElementById('life')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-white/20 hover:text-[#FF6B00] font-mono text-[10px] tracking-[0.3em] uppercase transition-colors pt-2"
                    >
                      [ CALCULATE YOUR TIMELINE ]
                    </button>
                  </div>
                </motion.form>
              </div>
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
