import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { ArrowUpRight, Heart, Loader2, Mail, Sparkles, ChevronRight, ShieldCheck, Zap } from 'lucide-react';
import { joinWaitlist } from '../../lib/waitlistSignup';

type ConfettiParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
};

interface Props {
  onSuccess: (position: number, shareUrl?: string) => void;
  isSignedUp: boolean;
  waitlistPosition: number;
  waitlistShareUrl: string;
  isPreloaded: boolean;
  onOpenEarlyAdopter: () => void;
}

/**
 * SectionHero — Chainzoku-inspired hero with outlined typography.
 */
export default function SectionHero({ onSuccess, isSignedUp, waitlistPosition, waitlistShareUrl, isPreloaded, onOpenEarlyAdopter }: Props) {
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

    const particles: ConfettiParticle[] = [];
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

  const shareUrl = waitlistShareUrl || 'https://t1ger.app/';

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
        .hero-orbit-backdrop {
          perspective: 900px;
          transform: perspective(900px) rotateX(10deg);
          transform-origin: center bottom;
          opacity: 0.72;
        }
        .hero-orbit-disc {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(var(--orbit-rotation));
          z-index: var(--orbit-z);
          width: var(--orbit-size-mobile);
          height: var(--orbit-size-mobile);
          will-change: transform;
        }
        @media (min-width: 768px) {
          .hero-orbit-backdrop {
            perspective: 1200px;
            transform: perspective(1200px) rotateX(15deg);
            opacity: 1;
          }
          .hero-orbit-disc {
            width: var(--orbit-size-desktop);
            height: var(--orbit-size-desktop);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-spin-slow,
          .animate-spin-slow-reverse {
            animation-duration: 180s;
          }
        }
      `}} />

      {/* 3D Perspective Spinning Backdrop Layer */}
      <div
        className="hero-orbit-backdrop absolute inset-0 block w-full h-full pointer-events-none z-0"
      >
        {/* Image 3 (Back) - spins clockwise */}
        <div className="absolute inset-0 hidden animate-spin-slow md:block">
          <div
            className="hero-orbit-disc"
            style={{
              '--orbit-size-mobile': '920px',
              '--orbit-size-desktop': '2000px',
              '--orbit-rotation': '279.05deg',
              '--orbit-z': 0,
            } as React.CSSProperties}
          >
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="/images/hero/hero-orbit-back.png"
              />
              <img
                src="/images/hero/hero-orbit-back.png"
                alt=""
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="w-full h-full object-cover opacity-35 md:opacity-50"
              />
            </picture>
          </div>
        </div>

        {/* Image 2 (Middle) - spins counter-clockwise */}
        <div className="absolute inset-0 animate-spin-slow-reverse">
          <div
            className="hero-orbit-disc"
            style={{
              '--orbit-size-mobile': '620px',
              '--orbit-size-desktop': '1000px',
              '--orbit-rotation': '304.42deg',
              '--orbit-z': 1,
            } as React.CSSProperties}
          >
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="/images/hero/hero-orbit-middle.png"
              />
              <img
                src="/images/hero/hero-orbit-middle.png"
                alt=""
                loading="lazy"
                decoding="async"
                fetchPriority="low"
                className="w-full h-full object-cover opacity-45 md:opacity-60"
              />
            </picture>
          </div>
        </div>

        {/* Image 1 (Front) - spins clockwise */}
        <div className="absolute inset-0 animate-spin-slow">
          <div
            className="hero-orbit-disc"
            style={{
              '--orbit-size-mobile': '460px',
              '--orbit-size-desktop': '800px',
              '--orbit-rotation': '48.33deg',
              '--orbit-z': 2,
            } as React.CSSProperties}
          >
            <picture>
              <source
                media="(max-width: 767px)"
                srcSet="/images/hero/hero-orbit-front.png"
              />
              <img
                src="/images/hero/hero-orbit-front.png"
                alt=""
                loading="eager"
                decoding="async"
                fetchPriority="high"
                className="w-full h-full object-cover opacity-60 md:opacity-80"
              />
            </picture>
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

      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center pt-20 text-center md:pt-0">
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
                className="mb-4 md:mb-6"
              >
                <span className="inline-flex rounded-full border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-4 py-2 font-mono text-[#FF6B00] tracking-[0.22em] text-[10px] sm:text-xs uppercase font-black shadow-[0_0_24px_rgba(255,107,0,0.08)]">
                  THE DUOLINGO FOR FOUNDERS
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isPreloaded ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.7, delay: 0.25, ease: [0.23, 1, 0.32, 1] }}
                className="mb-3 max-w-3xl md:mb-4"
              >
                <h1 className="font-outfit font-black text-white uppercase leading-[0.98] tracking-tight text-[clamp(1.85rem,6.3vw,4.05rem)]">
                  Learn and build discipline daily.
                </h1>
                <p className="mt-3 mx-auto max-w-2xl text-white/75 font-mono text-[10px] sm:text-xs leading-relaxed tracking-[0.08em] uppercase">
                  Daily missions. Proof-based XP. Squad accountability.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isPreloaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="relative mb-3 md:mb-4"
              >
                <div
                  aria-hidden="true"
                  className="font-outfit font-black uppercase leading-[0.82] select-none"
                  style={{
                    fontSize: 'clamp(3.5rem, 12vw, 9rem)',
                    letterSpacing: '-0.02em',
                    color: 'rgba(255,255,255,0.07)',
                    WebkitTextStroke: '1.5px rgba(255,255,255,0.34)',
                    filter: 'drop-shadow(0 8px 22px rgba(255,107,0,0.22)) drop-shadow(0 4px 12px rgba(0,0,0,0.6))',
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
                </div>
              </motion.div>

              <div className="relative w-full max-w-4xl">
                {/* Click-through Confetti Canvas */}
                <canvas
                  ref={canvasRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-50"
                />

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.55, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="mx-auto mt-4 grid w-full max-w-[760px] gap-4 text-left md:mt-6 md:grid-cols-2 md:gap-6"
                >
                  <button
                    type="button"
                    onClick={onOpenEarlyAdopter}
                    className="group relative min-h-[168px] overflow-hidden rounded-[8px] border border-[#FF6B00] bg-[#FF6B00] p-4 text-black shadow-[0_18px_60px_rgba(255,107,0,0.18)] transition-transform hover:-translate-y-1"
                  >
                    <span className="absolute -right-3 -top-7 font-outfit text-[7rem] font-black leading-none text-black/[0.07]">$5+</span>
                    <span className="relative flex h-full flex-col">
                      <span className="flex items-center gap-2 font-mono text-[9px] font-black uppercase tracking-[0.19em]">
                        <Heart className="h-3.5 w-3.5 fill-black" aria-hidden="true" />
                        Access + tiger impact
                      </span>
                      <span className="mt-1.5 block font-outfit text-[1.45rem] font-black uppercase leading-[0.92] sm:text-[1.65rem]">Early Adopter</span>
                      <span className="mt-1.5 block max-w-[18rem] text-[11px] font-semibold leading-relaxed text-black/65 sm:text-xs">Start at $5. Add more at checkout to support wild tiger conservation.</span>
                      <span className="mt-auto flex min-h-11 items-center justify-between gap-3 rounded-[6px] bg-black px-4 py-2.5 font-mono text-[10px] font-black uppercase tracking-[0.08em] text-white sm:text-[11px]">
                        Claim access · Give $5+
                        <ArrowUpRight className="h-4 w-4 shrink-0 text-[#CCFF00] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                      </span>
                    </span>
                  </button>

                  <form
                    onSubmit={handleSubmit}
                    noValidate
                    className="flex min-h-[168px] flex-col rounded-[8px] border border-white/20 bg-black/55 p-4 backdrop-blur-md"
                  >
                    <span className="font-mono text-[9px] font-black uppercase tracking-[0.22em] text-[#CCFF00]">Free · No card required</span>
                    <span className="mt-1.5 flex items-center gap-2 font-outfit text-[1.45rem] font-black uppercase leading-none text-white sm:text-[1.65rem]">
                      <Mail className="h-5 w-5 text-[#CCFF00]" aria-hidden="true" />
                      Join Waitlist
                    </span>
                    <p className="mt-1.5 text-[11px] leading-relaxed text-white/50 sm:text-xs">Get your rank instantly and move up by sharing your referral link.</p>

                    <div className="relative mt-auto pt-3">
                      <ShieldCheck className="absolute bottom-4 left-4 h-4 w-4 text-white/25" aria-hidden="true" />
                      <input
                        id="hero-email"
                        name="email"
                        type="email"
                        aria-label="Email address"
                        autoComplete="email"
                        placeholder="YOUR EMAIL"
                        value={email}
                        onChange={(event) => {
                          setEmail(event.target.value);
                          setErrorText('');
                        }}
                        disabled={isLoading}
                        className="h-12 w-full rounded-[6px] border border-white/15 bg-white/[0.06] pl-11 pr-32 font-mono text-xs tracking-[0.08em] text-white outline-none transition-all placeholder:text-white/30 focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20"
                      />
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute bottom-1.5 right-1.5 flex h-9 min-w-[112px] items-center justify-center rounded-[5px] bg-white px-3 font-mono text-[9px] font-black uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#CCFF00] disabled:opacity-60"
                      >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-label="Joining waitlist" /> : 'Join Waitlist'}
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {(errorText || helperText) && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className={`mt-2 font-mono text-[9px] uppercase tracking-[0.08em] ${errorText ? 'text-[#FF6B00]' : 'text-[#CCFF00]'}`}
                        >
                          {errorText || helperText}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </form>
                </motion.div>
                <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.12em] text-white/35">
                  Secure checkout by Stripe · Free waitlist emails by Resend
                </p>
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

                <button type="button" onClick={onOpenEarlyAdopter} className="w-full rounded-[8px] border border-[#FF6B00]/35 bg-[#FF6B00]/10 px-5 py-5 text-left transition-all hover:border-[#FF6B00] hover:bg-[#FF6B00]/15">
                  <span className="flex items-center justify-between gap-4">
                    <span>
                      <span className="block font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">Optional upgrade</span>
                      <span className="mt-1 block font-outfit text-base font-black uppercase text-white">Get immediate beta access for $5</span>
                    </span>
                    <Zap className="h-5 w-5 shrink-0 text-[#CCFF00]" aria-hidden="true" />
                  </span>
                </button>

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
