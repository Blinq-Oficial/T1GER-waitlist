import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Copy, Check, Share2, Sparkles, MessageCircle, Send, ShieldCheck, Zap } from 'lucide-react';
import { joinWaitlist } from '../../lib/waitlistSignup';
import { RatingInteraction } from '../ui/emoji-rating';

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
  onOpenEarlyAdopter: () => void;
}

export default function SectionJoin({ onSuccess, isSignedUp, waitlistPosition, waitlistShareUrl, onOpenEarlyAdopter }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const triggerError = (msg: string) => {
    setErrorText(msg);
    setTimeout(() => setErrorText(''), 3000);
  };

  // --- Confetti Logic ---
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      triggerError('Invalid email. Try again.');
      return;
    }

    setStatus('loading');
    
    try {
      const data = await joinWaitlist(email);
      setStatus('success');
      onSuccess(data.position || 0, data.shareUrl);
      fireConfetti();
    } catch (err: unknown) {
      console.error('Network Error:', err);
      triggerError(err instanceof Error ? err.message : 'Connection failed. Please try again.');
      setStatus('idle');
    }
  };

  const shareUrl = waitlistShareUrl || 'https://t1ger.app/';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'T1GER Waitlist',
          text: `Join the T1GER waitlist! 🐅`,
          url: shareUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <section
      id="join"
      className="relative px-6 sm:px-12 md:pl-40 flex flex-col items-center justify-center bg-[#020202] overflow-hidden hw-accel"
      style={{
        minHeight: '100vh',
        paddingTop: 'clamp(8rem, 15vw, 15rem)',
        paddingBottom: 'clamp(8rem, 15vw, 15rem)',
      }}
    >
      {/* Immersive Style Tags for waitlist-hero check animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 0 0 100px rgba(16, 185, 129, 0.4); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}} />

      {/* Immersive 3D Spinning Background Discs */}
      <div
        className="absolute inset-0 hidden md:block w-full h-full pointer-events-none overflow-hidden z-0"
        style={{
          perspective: "1200px",
          transform: "perspective(1200px) rotateX(15deg)",
          transformOrigin: "center bottom",
          opacity: 0.35,
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
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-30"
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
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-40"
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
              alt=""
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover opacity-60"
            />
          </div>
        </div>
      </div>

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, #050505 10%, rgba(5,5,5,0.85) 45%, transparent 100%)',
        }}
      />

      <div className="relative z-20 w-full max-w-lg mx-auto flex flex-col items-center">
        <AnimatePresence mode="wait">
          {!isSignedUp ? (
            <motion.div
              key="join-form"
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex flex-col items-center"
            >
              {/* Section label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="text-center mb-6"
              >
                <span className="font-mono text-[#FF6B00]/40 tracking-[0.3em] text-[10px] sm:text-xs uppercase font-black">
                  ● Secure Your Position
                </span>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="text-center mb-16 relative z-10 hw-accel"
              >
                <h2 className="font-outfit font-black text-white text-[3rem] md:text-[5rem] lg:text-[7rem] leading-[0.9] tracking-tighter uppercase mb-6">
                  CLAIM YOUR<br />POSITION.
                </h2>
                <p className="text-white/40 font-mono text-xs sm:text-sm tracking-[0.2em] uppercase max-w-xl mx-auto font-bold">
                  Join free. Earn a higher rank by sharing.
                </p>
              </motion.div>

              {/* Form Container with floating Confetti canvas */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="w-full relative px-4"
              >
                <canvas
                  ref={canvasRef}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-50"
                />

                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="relative flex w-full flex-col gap-3 rounded-[2rem] transition-all duration-300 sm:h-[60px] sm:flex-row sm:rounded-full group"
                >
                  <ShieldCheck className="absolute left-5 top-[30px] -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-[#FF6B00] transition-colors z-20 sm:top-1/2" />
                  <input
                    id="join-email"
                    name="email"
                    type="email"
                    required
                    aria-label="Email address"
                    autoComplete="email"
                    placeholder="YOUR EMAIL"
                    value={email}
                    disabled={status === 'loading'}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorText('');
                    }}
                    className="w-full h-[60px] pl-13 pr-6 sm:pr-[160px] rounded-full outline-none transition-all duration-300 placeholder-white/25 text-white font-mono tracking-[0.15em] text-xs sm:text-sm bg-white/[0.03] border border-white/10 focus:border-[#FF6B00] focus:bg-white/[0.06] focus:ring-1 focus:ring-[#FF6B00]/30 shadow-[inset_0_1px_2px_rgba(0,0,0,0.8)]"
                  />

                  <div className="z-10 sm:absolute sm:top-[6px] sm:right-[6px] sm:bottom-[6px]">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="h-[54px] w-full px-5 sm:h-full sm:w-auto sm:px-6 rounded-full font-mono text-[10px] tracking-[0.15em] font-black uppercase text-white transition-all duration-300 active:scale-95 hover:brightness-110 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center sm:min-w-[140px] border border-[#FF6B00]/25 shadow-[0_0_20px_rgba(255,107,0,0.15)] hover:shadow-[0_0_35px_rgba(255,107,0,0.35)] gap-2"
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.6) 0%, rgba(255, 107, 0, 0.9) 100%)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>SECURING...</span>
                        </>
                      ) : (
                        'GET MY EARLY ACCESS RANK'
                      )}
                    </button>
                  </div>
                </form>
                <button type="button" onClick={onOpenEarlyAdopter} className="mx-auto mt-5 flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#FF6B00]/25 bg-black/20 px-5 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 transition-all hover:border-[#FF6B00]/60 hover:text-white">
                  <Zap className="h-3.5 w-3.5 text-[#FF6B00]" aria-hidden="true" />
                  Or skip the line for $5
                </button>
              </motion.div>

              <AnimatePresence mode="wait">
                {errorText && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden w-full flex justify-center z-20"
                  >
                    <p className="text-[#FF6B00] text-xs font-mono text-center tracking-[0.1em] uppercase">
                      ⚠ {errorText}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          ) : (
            /* ─── POST-SIGNUP ─── */
            <motion.div
              key="post-signup"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center w-full z-20"
            >
              {/* Immersive drawing checkmark bubble from waitlist-hero */}
              <div className="relative w-16 h-16 rounded-full bg-[#10b981] flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(16,185,129,0.5)] animate-success-pulse animate-success-glow">
                <div className="absolute inset-0 rounded-full border border-emerald-400 animate-ring" style={{ animationDelay: "0s" }} />
                <div className="absolute inset-0 rounded-full border border-emerald-300 animate-ring" style={{ animationDelay: "0.15s" }} />
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    className="animate-checkmark"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-2 bg-[#CCFF00]/10 border border-[#CCFF00]/30 rounded-full px-5 py-2 mb-8 shadow-[0_0_20px_rgba(204,255,0,0.1)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span className="font-mono text-[10px] text-[#CCFF00] tracking-[0.3em] uppercase font-bold">
                  Position Secured
                </span>
              </motion.div>

              {/* Position */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8"
              >
                <span className="font-mono text-white/20 text-[10px] tracking-[0.4em] uppercase block mb-2 font-black">
                  YOU ARE T1GER NO.
                </span>
                <span
                  className="font-outfit font-black text-white block"
                  style={{
                    fontSize: 'clamp(4rem, 12vw, 7rem)',
                    lineHeight: 0.8,
                    textShadow: '0 0 50px rgba(255,107,0,0.2)',
                  }}
                >
                  <span className="text-[#FF6B00]/40 font-mono text-[0.4em] align-top">#</span>
                  {waitlistPosition}
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-white/40 font-mono text-[10px] tracking-[0.2em] uppercase mb-8"
              >
                Share to <span className="text-[#CCFF00] font-bold">ascend</span> hierarchy
              </motion.p>

              {/* Share */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full space-y-4"
              >
                <div className="relative group">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <span className="flex-1 px-5 py-3 font-mono text-[10px] text-white/25 truncate text-left">
                      {shareUrl}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex-shrink-0 px-5 py-3 bg-white/[0.05] hover:bg-[#FF6B00]/20 border-l border-white/10 transition-all duration-300 cursor-pointer text-white/50 hover:text-white"
                    >
                      {copied ? <Check className="w-4 h-4 text-[#CCFF00]" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  {/* Native Share (Mobile) */}
                  <button
                    onClick={handleNativeShare}
                    className="md:hidden flex items-center gap-2 bg-[#FF6B00] border border-[#FF6B00]/20 rounded-full px-5 py-2 text-white font-mono text-[10px] tracking-[0.2em] uppercase cursor-pointer"
                  >
                    <Send className="w-3 h-3" /> Share
                  </button>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`I just joined the T1GER waitlist! 🐅 Join here: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-full px-5 py-2.5 text-white/30 hover:text-[#25D366] hover:border-[#25D366]/50 transition-all font-mono text-[10px] tracking-[0.2em] uppercase cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>

                  {/* X */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I joined the T1GER waitlist 🐅`)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-full px-5 py-2.5 text-white/30 hover:text-white hover:border-white/50 transition-all font-mono text-[10px] tracking-[0.2em] uppercase cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" /> X
                  </a>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isSignedUp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 flex flex-col items-center justify-center gap-6 max-w-sm mx-auto z-20 text-center"
          >
            <button type="button" onClick={onOpenEarlyAdopter} className="w-full rounded-[8px] border border-[#FF6B00]/35 bg-[#FF6B00]/10 px-5 py-5 text-left transition-all hover:border-[#FF6B00] hover:bg-[#FF6B00]/15">
              <span className="flex items-center justify-between gap-4">
                <span>
                  <span className="block font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#FF6B00]">Optional upgrade</span>
                  <span className="mt-1 block font-outfit text-base font-black uppercase text-white">Founder access from $5 + tiger impact</span>
                </span>
                <Zap className="h-5 w-5 shrink-0 text-[#CCFF00]" aria-hidden="true" />
              </span>
            </button>
            <div className="w-full flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-md">
              <span className="font-mono text-white/45 tracking-[0.2em] text-[9px] uppercase mb-4 block font-black">
                Operator feedback
              </span>
              <h4 className="font-outfit font-bold text-white text-xs uppercase tracking-wider mb-6">
                Rate your discipline protocol experience
              </h4>
              <RatingInteraction />
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
