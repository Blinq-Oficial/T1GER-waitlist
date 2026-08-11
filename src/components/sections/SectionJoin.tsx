import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Copy, Loader2, MessageCircle, Send, Share2, ShieldCheck, Zap } from 'lucide-react';
import { joinWaitlist } from '../../lib/waitlistSignup';
import { trackEvent } from '../../lib/analytics';

interface Props {
  onSuccess: (position: number, shareUrl?: string) => void;
  isSignedUp: boolean;
  waitlistPosition: number;
  waitlistShareUrl: string;
  onOpenEarlyAdopter: () => void;
}

export default function SectionJoin({ onSuccess, isSignedUp, waitlistPosition, waitlistShareUrl, onOpenEarlyAdopter }: Props) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const emailRef = useRef<HTMLInputElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const shareUrl = waitlistShareUrl || 'https://t1ger.app/';

  useEffect(() => {
    if (isSignedUp) successRef.current?.focus();
  }, [isSignedUp]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorText('');

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setErrorText('Enter a valid email address.');
      emailRef.current?.focus();
      return;
    }

    setIsLoading(true);
    try {
      const data = await joinWaitlist(email);
      onSuccess(data.position, data.shareUrl);
      trackEvent('Waitlist Signup Success', { source: 'final-cta', returning: Boolean(data.alreadyJoined) });
    } catch (error) {
      setErrorText(error instanceof Error ? error.message : 'Connection failed. Please try again.');
      emailRef.current?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyStatus('copied');
      trackEvent('Referral Link Copied', { source: 'final-cta' });
    } catch {
      setCopyStatus('error');
    }
    window.setTimeout(() => setCopyStatus('idle'), 2000);
  };

  const handleShare = async () => {
    if (!navigator.share) {
      await handleCopy();
      return;
    }

    try {
      await navigator.share({
        title: 'T1GER Waitlist',
        text: `Join me on the T1GER waitlist. My position is #${waitlistPosition}.`,
        url: shareUrl,
      });
      trackEvent('Referral Shared', { channel: 'native', source: 'final-cta' });
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setCopyStatus('error');
    }
  };

  return (
    <section
      id="join"
      className="relative flex min-h-[82vh] items-center justify-center overflow-hidden bg-[#020202] px-6 py-24 sm:px-12 md:pl-40"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,107,0,0.12),transparent_42%)]" aria-hidden="true" />
      <div className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        {!isSignedUp ? (
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.7 }}
            className="w-full"
          >
            <p className="font-mono text-[11px] font-black uppercase tracking-[0.22em] text-[#FF6B00]">Secure your position</p>
            <h2 className="mt-4 font-outfit text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-[0.88] tracking-tighter text-white">
              Learn it.<br /><span className="text-[#CCFF00]">Apply it.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-white/65 sm:text-base">
              Join free for product updates and staged beta invitations. No card required.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mx-auto mt-10 max-w-xl text-left">
              <label htmlFor="join-email" className="sr-only">Email address</label>
              <div className="relative flex flex-col gap-3 sm:flex-row sm:rounded-full sm:border sm:border-white/15 sm:bg-white/[0.04] sm:p-1.5 sm:focus-within:border-[#CCFF00]">
                <ShieldCheck className="pointer-events-none absolute left-5 top-[30px] h-5 w-5 -translate-y-1/2 text-white/40 sm:top-1/2" aria-hidden="true" />
                <input
                  ref={emailRef}
                  id="join-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  placeholder="YOUR EMAIL"
                  value={email}
                  disabled={isLoading}
                  aria-invalid={Boolean(errorText)}
                  aria-describedby={errorText ? 'join-email-error' : 'join-email-help'}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setErrorText('');
                  }}
                  className="h-[60px] min-w-0 flex-1 rounded-full border border-white/15 bg-white/[0.04] pl-13 pr-5 font-mono text-xs tracking-[0.1em] text-white outline-none placeholder:text-white/40 focus:border-[#CCFF00] focus:ring-2 focus:ring-[#CCFF00]/20 sm:border-0 sm:bg-transparent sm:focus:ring-0"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex h-[54px] items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-6 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-black transition-colors hover:bg-[#CCFF00] disabled:cursor-wait disabled:opacity-60"
                >
                  {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Securing…</> : 'Join the waitlist'}
                </button>
              </div>
              <p id="join-email-help" className="mt-3 text-center text-[11px] leading-relaxed text-white/55">We will only send product and access updates. Unsubscribe anytime.</p>
              {errorText && <p id="join-email-error" role="alert" className="mt-3 text-center font-mono text-xs text-[#FF8A3D]">{errorText}</p>}
            </form>

            <button type="button" onClick={onOpenEarlyAdopter} className="mx-auto mt-7 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#FF6B00]/35 px-5 font-mono text-[10px] font-bold uppercase tracking-[0.12em] text-white/70 transition-colors hover:border-[#FF6B00] hover:text-white">
              <Zap className="h-4 w-4 text-[#FF6B00]" aria-hidden="true" />
              Explore optional Founder benefits
            </button>
          </motion.div>
        ) : (
          <motion.div
            ref={successRef}
            tabIndex={-1}
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-xl outline-none"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#CCFF00] text-black shadow-[0_0_45px_rgba(204,255,0,0.25)]">
              <Check className="h-7 w-7 stroke-[3]" aria-hidden="true" />
            </div>
            <p className="mt-6 font-mono text-[11px] font-black uppercase tracking-[0.24em] text-[#CCFF00]">Position secured</p>
            <h2 className="mt-3 font-outfit text-5xl font-black uppercase text-white sm:text-7xl">You are #{waitlistPosition}</h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/65">Keep this referral link and invite someone who wants to turn learning into action.</p>

            <div className="mt-8 flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] py-1.5 pl-5 pr-1.5">
              <span className="min-w-0 flex-1 truncate text-left font-mono text-[10px] text-white/65">{shareUrl}</span>
              <button type="button" onClick={handleCopy} aria-label="Copy your T1GER referral link" className="flex h-10 min-w-24 items-center justify-center gap-2 rounded-full bg-[#FF6B00] px-4 font-mono text-[9px] font-black uppercase text-black hover:bg-[#CCFF00]">
                <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                {copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Failed' : 'Copy'}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button type="button" onClick={handleShare} className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 text-[10px] font-bold uppercase text-white/75 hover:border-white/40">
                <Share2 className="h-4 w-4" aria-hidden="true" /> Share
              </button>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Join me on T1GER: ${shareUrl}`)}`} onClick={() => trackEvent('Referral Shared', { channel: 'whatsapp', source: 'final-cta' })} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 text-[10px] font-bold uppercase text-white/75 hover:border-[#25D366]/60">
                <MessageCircle className="h-4 w-4" aria-hidden="true" /> WhatsApp
              </a>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I joined the T1GER waitlist at position #${waitlistPosition}. ${shareUrl}`)}`} onClick={() => trackEvent('Referral Shared', { channel: 'x', source: 'final-cta' })} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/15 text-[10px] font-bold uppercase text-white/75 hover:border-white/40">
                <Send className="h-4 w-4" aria-hidden="true" /> X
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
