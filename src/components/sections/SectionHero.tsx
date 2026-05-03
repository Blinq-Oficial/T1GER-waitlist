import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Loader2, Copy, Check, Share2, Sparkles, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  onSuccess: (position: number) => void;
  isSignedUp: boolean;
  waitlistPosition: number;
  isPreloaded: boolean;
}

/**
 * SectionHero — Chainzoku-inspired hero with outlined typography.
 *
 * Design:
 * - MASSIVE outlined "T1GER" text (stroke, no fill) with glow
 * - Animated letter-by-letter entrance
 * - Interactive mouse-follow glow behind title
 * - Small tagline + email form
 * - Post-signup: position number + share CTA
 */
export default function SectionHero({ onSuccess, isSignedUp, waitlistPosition, isPreloaded }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorText, setErrorText] = useState('');
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

  const triggerError = (msg: string) => {
    setErrorText(msg);
    setTimeout(() => setErrorText(''), 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText('');

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      triggerError('Enter a valid email.');
      return;
    }

    setStatus('loading');
    
    try {
      // 1. Insert email into waitlist table
      // Note: We use lowercase 'waitlist' as it is the standard Postgres convention.
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (insertError) {
        console.error('Supabase Error:', insertError);
        // If 'waitlist' fails, try 'Waitlist' as a fallback for users with capitalized tables
        if (insertError.code === '42P01') {
          const { error: retryError } = await supabase
            .from('Waitlist')
            .insert([{ email }]);
          
          if (retryError) {
            console.error('Supabase Retry Error:', retryError);
            triggerError('ERROR: Debes ejecutar el script SQL en Supabase para crear la tabla.');
            setStatus('idle');
            return;
          }
        } else {
          triggerError('Error de conexión. Verifica tu internet o base de datos.');
          setStatus('idle');
          return;
        }
      }

      // 2. Immediately count total records to get position
      const { count, error: countError } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true });

      let finalCount = count;
      if (countError) {
        // Try fallback count
        const { count: retryCount } = await supabase
          .from('Waitlist')
          .select('*', { count: 'exact', head: true });
        finalCount = retryCount;
      }

      if (finalCount === null) {
        // Fallback if count fails
        onSuccess(Math.floor(Math.random() * 100) + 800);
      } else {
        setStatus('success');
        onSuccess(finalCount || 0);
      }
    } catch (err) {
      console.error(err);
      triggerError('Connection lost. Try again.');
      setStatus('idle');
    }
  };

  const shareUrl = `https://t1ger.app/?ref=${waitlistPosition}`;

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
          text: `I just joined the T1GER waitlist 🐅 Build discipline. Hunt greatness. Join me here:`,
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
      id="hero"
      ref={sectionRef}
      className="relative flex flex-col items-center justify-center px-6 sm:px-12 md:pl-40 overflow-hidden"
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
        {/* Mouse-follow glow */}
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

      {/* Grain texture overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.03] pointer-events-none bg-noise" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto">
        <AnimatePresence mode="wait">
          {!isSignedUp ? (
            <motion.div
              key="signup-phase"
              className="flex flex-col items-center w-full"
              exit={{ opacity: 0, y: -30, transition: { duration: 0.5 } }}
            >
              {/* Tagline above title */}
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

              {/* MASSIVE OUTLINED TITLE */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isPreloaded ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="mb-8 relative"
              >
                <h1
                  className="font-outfit font-black uppercase leading-[0.82] select-none"
                  style={{
                    fontSize: 'clamp(5rem, 20vw, 18rem)',
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

                {/* Filled overlay on hover */}
                <h1
                  aria-hidden="true"
                  className="absolute inset-0 font-outfit font-black uppercase leading-[0.82] select-none pointer-events-none opacity-0 hover-fill-text"
                  style={{
                    fontSize: 'clamp(5rem, 20vw, 18rem)',
                    letterSpacing: '-0.02em',
                    color: 'oklch(65% 0.22 45)',
                    textShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  }}
                >
                  T1GER
                </h1>
              </motion.div>

              {/* Slogan */}
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
                  BUILD DISCIPLINE.{' '}
                  <span className="text-[#CCFF00]">HUNT GREATNESS.</span>
                </p>
              </motion.div>

              {/* Email Form */}
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={isPreloaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.8, delay: 1.5, ease: [0.23, 1, 0.32, 1] }}
                className="w-full max-w-sm space-y-3"
              >
                <div className="relative">
                  <input
                    type="email"
                    placeholder="YOUR EMAIL"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrorText('');
                    }}
                    disabled={status !== 'idle'}
                    className="w-full bg-white/[0.04] border border-white/[0.1] rounded-full px-6 py-4 text-white placeholder-white/30 font-mono tracking-[0.15em] text-sm outline-none transition-all duration-150 focus:border-[var(--color-electric-orange)] focus:bg-white/[0.06] focus:shadow-[0_0_0_1px_var(--color-electric-orange)]"
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
                </div>

                <button
                  type="submit"
                  disabled={status !== 'idle'}
                  className="btn-tiger --primary w-full py-4 text-sm"
                >
                  {status === 'loading' ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'JOIN THE PRIDE'
                  )}
                </button>
              </motion.form>
            </motion.div>
          ) : (
            /* ─── POST-SIGNUP EXPERIENCE ─── */
            <motion.div
              key="post-signup"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center w-full max-w-md relative"
            >
              {/* Success decorative element */}
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-[#FF6B00]/10 blur-[100px] pointer-events-none rounded-full" />

              {/* Success badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-flex items-center gap-3 bg-white/[0.03] border border-[#CCFF00]/30 backdrop-blur-md rounded-full px-5 py-2 mb-8 shadow-[0_0_20px_rgba(204,255,0,0.1)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#CCFF00]" />
                <span className="font-mono text-[10px] sm:text-xs text-[#CCFF00] tracking-[0.3em] uppercase font-bold">
                  Protocol Activated: You're In
                </span>
              </motion.div>

              {/* Position number */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6 text-center"
              >
                <span className="font-mono text-white/20 text-[10px] tracking-[0.5em] uppercase block mb-4">
                  YOU ARE T1GER NO.
                </span>
                <div className="relative inline-block">
                  <span
                    className="font-outfit font-black text-white block relative z-10"
                    style={{
                      fontSize: 'clamp(5rem, 15vw, 10rem)',
                      lineHeight: 0.8,
                      letterSpacing: '-0.05em',
                      textShadow: '0 0 50px rgba(255,107,0,0.2)',
                    }}
                  >
                    <span className="text-[#FF6B00]/40 font-mono text-[0.4em] align-top mr-1">#</span>
                    {waitlistPosition}
                  </span>
                  {/* Decorative glow behind number */}
                  <div className="absolute inset-0 bg-[#FF6B00]/5 blur-3xl rounded-full -z-10" />
                </div>
              </motion.div>

              {/* Share to move up */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
                className="w-full space-y-4 mt-8"
              >
                <p className="text-white/40 font-mono text-[10px] sm:text-xs tracking-[0.2em] text-center uppercase">
                  Share to <span className="text-[#CCFF00] font-bold">ascend</span> hierarchy
                </p>

                {/* Copy link */}
                <div className="relative group">
                  <div className="absolute -inset-[1px] bg-gradient-to-r from-white/10 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative flex items-center bg-white/[0.02] border border-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                    <span className="flex-1 px-6 py-4 font-mono text-[10px] text-white/30 truncate">
                      {shareUrl}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="flex-shrink-0 px-6 py-4 bg-white/[0.05] hover:bg-[#FF6B00]/20 border-l border-white/10 transition-all duration-300 cursor-pointer text-white/50 hover:text-white"
                    >
                      {copied ? (
                        <Check className="w-4 h-4 text-[#CCFF00]" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Social share buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                  {/* Web Share (Mobile) */}
                  <button
                    onClick={handleNativeShare}
                    className="md:hidden flex items-center gap-3 bg-[#FF6B00] border border-[#FF6B00]/20 rounded-full px-6 py-3 text-white font-mono text-[10px] tracking-[0.2em] uppercase cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Share
                  </button>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`¡Me acabo de unir a la waitlist de T1GER! 🐅 Construye disciplina. Busca la grandeza. Únete aquí: ${shareUrl}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-full px-6 py-3 text-white/30 hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/5 transition-all duration-500 font-mono text-[10px] tracking-[0.2em] uppercase cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I just joined the T1GER waitlist 🐅 Build discipline. Hunt greatness.`)}&url=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-full px-6 py-3 text-white/30 hover:text-white hover:border-white/50 transition-all duration-500 font-mono text-[10px] tracking-[0.2em] uppercase cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    X
                  </a>
                </div>
              </motion.div>

              {/* Donate */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-12"
              >
                <button
                  onClick={() => window.open('https://donate.worldwildlife.org/give/tigers', '_blank')}
                  className="group flex flex-col items-center gap-2 cursor-pointer bg-transparent border-none outline-none"
                >
                  <span className="font-mono text-[9px] text-white/10 tracking-[0.4em] uppercase group-hover:text-white/30 transition-colors">
                    Conservation Effort
                  </span>
                  <span className="font-mono text-[10px] text-white/20 tracking-wider group-hover:text-[#CCFF00] transition-all">
                    🐯 Donate $1 to save real tigers
                  </span>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </section>
  );
}
