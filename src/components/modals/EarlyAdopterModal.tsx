import { useEffect, useId, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Flame, Heart, ShieldCheck, Trophy, X, Zap } from 'lucide-react';

const PAYMENT_LINK = 'https://buy.stripe.com/fZueVeaebe5T5pvdpQaZi01';

const benefits = [
  { icon: Flame, title: 'Priority Early Access', description: 'Enter the Closed Beta before the general waitlist.' },
  { icon: Zap, title: '6-Month Premium Pass', description: 'Get the full action roadmap experience ($60 value).' },
  { icon: Trophy, title: 'Founder Status', description: 'Keep an exclusive Founder badge on your profile.' },
  { icon: ShieldCheck, title: 'Risk-Free Before Launch', description: 'Request a full refund any time before global launch.' },
];

interface EarlyAdopterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EarlyAdopterModal({ isOpen, onClose }: EarlyAdopterModalProps) {
  const titleId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      if (event.key !== 'Tab' || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto bg-black/85 p-0 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative max-h-[95dvh] w-full max-w-4xl overflow-y-auto rounded-t-[8px] border border-white/15 bg-[#090909] shadow-[0_-20px_80px_rgba(0,0,0,0.75)] sm:rounded-[8px] sm:shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-1.5 w-full bg-[#FF6B00]" />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close Early Adopter Access dialog"
              className="absolute right-3 top-3 z-30 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/75 text-white/70 transition-colors hover:border-white/40 hover:text-white sm:right-5 sm:top-5"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>

            <div className="grid md:grid-cols-[0.88fr_1.12fr]">
              <aside className="relative min-h-[230px] overflow-hidden border-b border-white/10 bg-black md:min-h-[620px] md:border-b-0 md:border-r">
                <video
                  className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-label="Wild tiger moving through a dark cinematic scene"
                >
                  <source src="/Tiger_lunges_swipes_glass_202604282106.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20 md:bg-gradient-to-t md:from-black md:via-transparent md:to-black/30" />
                <div className="relative flex h-full min-h-[230px] flex-col justify-end p-5 text-white md:min-h-[620px] md:p-7">
                  <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-[#CCFF00]">Founding access · Tiger impact</p>
                  <div className="mt-2 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-outfit text-3xl font-black uppercase leading-[0.92] md:text-5xl">Give<br />More Wild</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-white/60">Starts at</p>
                      <p className="font-outfit text-5xl font-black leading-none text-[#FF6B00] md:text-7xl">$5+</p>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9 md:px-10">
                <p className="mb-3 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#CCFF00]">Limited Early Adopter Offer</p>
                <h2 id={titleId} className="max-w-lg pr-10 font-outfit text-[1.75rem] font-black uppercase leading-[0.98] text-white sm:text-4xl">Unlock T1GER. Help Protect Tigers.</h2>
                <p id={descriptionId} className="mt-3 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">Pay $5 for founding access. Choose a higher amount at checkout to support wild tiger conservation.</p>

                <div className="my-5 grid grid-cols-3 gap-2" aria-label="Example contribution amounts">
                  {['$10', '$25', '$50+'].map((amount) => (
                    <div key={amount} className="rounded-[6px] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-2 py-2.5 text-center">
                      <span className="font-outfit text-lg font-black text-[#FF6B00]">{amount}</span>
                    </div>
                  ))}
                </div>

                <ul className="grid gap-3 sm:grid-cols-2">
                  {benefits.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="grid grid-cols-[32px_1fr] gap-2.5">
                      <span className="flex h-8 w-8 items-center justify-center rounded-[6px] border border-[#FF6B00]/25 bg-[#FF6B00]/10 text-[#FF6B00]">
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-outfit text-sm font-extrabold text-white">{title}</h3>
                        <p className="mt-0.5 text-[11px] leading-relaxed text-white/45">{description}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 rounded-[6px] border border-[#CCFF00]/20 bg-[#CCFF00]/[0.06] p-3">
                  <p className="flex items-center gap-2 font-mono text-[10px] font-black uppercase tracking-[0.12em] text-[#CCFF00]">
                    <Heart className="h-4 w-4 fill-[#CCFF00]" aria-hidden="true" />
                    $5 unlocks access. Extra supports tigers.
                  </p>
                </div>

                <a
                  href={PAYMENT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-[6px] bg-[#FF6B00] px-5 py-4 text-center font-mono text-[11px] font-black uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#CCFF00] sm:text-xs"
                >
                  Choose $5+ &amp; Claim Founder Access
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
                <p className="mt-3 text-center text-[10px] leading-relaxed text-white/35">Amounts above the $5 access price are intended for tiger conservation, net of applicable costs. Not tax-deductible. See <a href="/terms#payments-taxes-and-refunds" className="underline underline-offset-2 hover:text-white">Terms</a>.</p>
                <div className="mt-3 flex items-center justify-center gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
                  <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
                  Secure checkout powered by Stripe
                  <span aria-hidden="true">·</span>
                  <a href="/privacy" className="hover:text-white">Privacy</a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
