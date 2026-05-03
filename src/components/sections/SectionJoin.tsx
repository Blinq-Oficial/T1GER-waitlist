import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Heart, Mail, Copy, Check, Share2, Sparkles, MessageCircle, Send } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Props {
  onSuccess: (position: number) => void;
  isSignedUp: boolean;
  waitlistPosition: number;
}

/**
 * SectionJoin — CTA section with post-signup experience.
 *
 * Before signup: heading + email form + donate CTA
 * After signup: position number + share link + donation
 */
export default function SectionJoin({ onSuccess, isSignedUp, waitlistPosition }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorText, setErrorText] = useState('');
  const [copied, setCopied] = useState(false);

  const triggerError = (msg: string) => {
    setErrorText(msg);
    setTimeout(() => setErrorText(''), 3000);
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
      // 1. Insert email into waitlist table
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert([{ email }]);

      if (insertError) {
        console.error('Supabase Error:', insertError);
        // Fallback for capitalized table name
        if (insertError.code === '42P01') {
          const { error: retryError } = await supabase
            .from('Waitlist')
            .insert([{ email }]);
          
          if (retryError) {
            triggerError('ERROR: Tabla no encontrada. Ejecuta el script SQL.');
            setStatus('idle');
            return;
          }
        } else {
          triggerError('Error al unirse. Inténtalo de nuevo.');
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
        const { count: retryCount } = await supabase
          .from('Waitlist')
          .select('*', { count: 'exact', head: true });
        finalCount = retryCount;
      }

      if (finalCount === null) {
        onSuccess(Math.floor(Math.random() * 100) + 900);
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
          text: `¡Únete a la waitlist de T1GER! 🐅`,
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
      className="relative px-6 sm:px-12 md:pl-40 flex flex-col items-center justify-center bg-section-warm"
      style={{
        minHeight: '90vh',
        paddingTop: 'clamp(5rem, 10vw, 10rem)',
        paddingBottom: 'clamp(5rem, 10vw, 10rem)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,107,0,0.06) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {!isSignedUp ? (
            <motion.div
              key="join-form"
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Section label */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: [0.19, 1, 0.22, 1] }}
                className="text-center mb-6"
              >
                <span className="font-mono text-[#FF6B00]/40 tracking-[0.3em] text-xs uppercase">
                  ● Secure Your Position
                </span>
              </motion.div>

              {/* Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
                className="text-center mb-10"
              >
                <h2
                  className="font-outfit font-black text-white uppercase tracking-tighter leading-[0.9]"
                  style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
                >
                  CLAIM YOUR{' '}
                  <span className="text-[#FF6B00]">SPOT</span>
                </h2>
                <p className="mt-3 text-white/30 font-mono text-sm tracking-wider">
                  The protocol activates soon. Secure your position.
                </p>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
                className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8"
              >

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/15" />
                    <input
                      type="email"
                      placeholder="YOUR EMAIL"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrorText('');
                      }}
                      disabled={status !== 'idle'}
                      className="w-full bg-white/[0.04] border border-white/[0.08] rounded-full pl-12 pr-6 py-4 text-white placeholder-white/15 font-mono tracking-[0.15em] text-sm outline-none transition-all duration-500 focus:border-[#FF6B00]/40 focus:bg-white/[0.06]"
                    />
                    <AnimatePresence>
                      {errorText && (
                        <motion.p
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="absolute -bottom-5 left-4 text-[#FF6B00] text-xs font-mono"
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
                      'INITIATE HUNT'
                    )}
                  </button>
                </form>
              </motion.div>

              {/* Donate */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5, duration: 0.7 }}
                className="mt-6 text-center"
              >
                <button
                  onClick={() => window.open('https://donate.worldwildlife.org/give/tigers', '_blank')}
                  className="inline-flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-full px-5 py-2.5 group hover:border-red-500/20 transition-all duration-500 cursor-pointer"
                >
                  <Heart className="w-3.5 h-3.5 text-red-500/40 group-hover:text-red-500 transition-colors" />
                  <span className="text-white/30 text-sm font-mono group-hover:text-white/50 transition-colors">
                    Donate $1 to save real tigers
                  </span>
                </button>
              </motion.div>
            </motion.div>
          ) : (
            /* ─── POST-SIGNUP ─── */
            <motion.div
              key="post-signup"
              initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center text-center"
            >
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
                <span className="font-mono text-white/20 text-[10px] tracking-[0.4em] uppercase block mb-2">
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
                    <span className="flex-1 px-5 py-3 font-mono text-[10px] text-white/25 truncate">
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
                    <Send className="w-3 h-3" /> Compartir
                  </button>

                  {/* WhatsApp */}
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(`¡Me acabo de unir a la waitlist de T1GER! 🐅 Únete aquí: ${shareUrl}`)}`}
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
      </div>
    </section>
  );
}
