import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Flame, Heart, ShieldCheck, Trophy, X, Zap } from 'lucide-react';

const PAYMENT_LINK = 'https://buy.stripe.com/fZueVeaebe5T5pvdpQaZi01';

const benefits = [
  { icon: Flame, title: 'Priority Early Access', description: 'Enter the Closed Beta before the general waitlist.' },
  { icon: Zap, title: '6-Month Premium Pass', description: 'Get the full action roadmap experience ($60 value).' },
  { icon: Trophy, title: 'Founder Status', description: 'Keep an exclusive Founder badge on your profile.' },
  { icon: ShieldCheck, title: 'Risk-Free Before Launch', description: 'Request a full refund any time before global launch.' },
];

const contributionExamples = [
  { amount: '$10', tiger: '🐯', label: 'A good start' },
  { amount: '$25', tiger: '🐯✨', label: 'More habitat' },
  { amount: '$50+', tiger: '🐯🧡', label: 'Big impact' },
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
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
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
      document.body.style.paddingRight = previousPaddingRight;
      window.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[120] flex items-end justify-center overflow-y-auto bg-black/85 p-0 backdrop-blur-md sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onMouseDown={(event) => event.target === event.currentTarget && onClose()}
          data-lenis-prevent
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="relative max-h-[95dvh] w-full max-w-4xl overscroll-contain overflow-y-auto rounded-t-[8px] border border-white/15 bg-[#090909] shadow-[0_-20px_80px_rgba(0,0,0,0.75)] sm:rounded-[8px] sm:shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
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

            <div className="grid md:grid-cols-[0.76fr_1.24fr]">
              <aside className="relative min-h-[165px] overflow-hidden border-b border-black/20 bg-[#FF6B00] text-black md:min-h-[570px] md:border-b-0 md:border-r">
                <div className="absolute inset-0 opacity-10 [background:repeating-linear-gradient(115deg,#000_0,#000_12px,transparent_12px,transparent_34px)]" />
                <div className="relative flex h-full min-h-[165px] items-end justify-between gap-5 p-5 md:min-h-[570px] md:flex-col md:items-start md:justify-between md:p-7">
                  <div>
                    <p className="font-mono text-[9px] font-black uppercase tracking-[0.2em]">Founding access · Tiger impact</p>
                    <p className="mt-2 font-outfit text-3xl font-black uppercase leading-[0.9] md:text-5xl">Give<br />More Wild</p>
                  </div>
                  <div className="flex items-end gap-3 md:w-full md:justify-between">
                    <span className="text-5xl leading-none md:text-7xl" role="img" aria-label="Happy tiger">🐯</span>
                    <div className="text-right">
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] opacity-60">Starts at</p>
                      <p className="font-outfit text-5xl font-black leading-none md:text-6xl">$5+</p>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="px-5 pb-6 pt-7 sm:px-8 sm:pb-8 sm:pt-9 md:px-10">
                <p className="mb-3 font-mono text-[9px] font-black uppercase tracking-[0.24em] text-[#CCFF00]">Limited Early Adopter Offer</p>
                <h2 id={titleId} className="max-w-lg pr-10 font-outfit text-[1.75rem] font-black uppercase leading-[0.98] text-white sm:text-4xl">Unlock T1GER. Help Protect Tigers.</h2>
                <p id={descriptionId} className="mt-3 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">Pay $5 for founding access. Choose a higher amount at checkout to support wild tiger conservation.</p>

                <div className="my-6 grid grid-cols-3 gap-2.5" aria-label="Example contribution amounts">
                  {contributionExamples.map(({ amount, tiger, label }) => (
                    <div key={amount} className="flex min-h-[72px] flex-col items-center justify-center rounded-[6px] border border-[#FF6B00]/30 bg-[#FF6B00]/10 px-2 py-2 text-center">
                      <span className="text-xl leading-none" aria-hidden="true">{tiger}</span>
                      <span className="mt-1 font-outfit text-base font-black text-[#FF6B00]">{amount}</span>
                      <span className="font-mono text-[7px] font-bold uppercase tracking-[0.08em] text-white/35">{label}</span>
                    </div>
                  ))}
                </div>

                <ul className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
                  {benefits.map(({ icon: Icon, title, description }) => (
                    <li key={title} className="grid grid-cols-[28px_1fr] gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-[5px] border border-[#FF6B00]/25 bg-[#FF6B00]/10 text-[#FF6B00]">
                        <Icon className="h-3 w-3" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="font-outfit text-[13px] font-extrabold leading-tight text-white">{title}</h3>
                        <p className="mt-1 text-[10px] leading-relaxed text-white/45">{description}</p>
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
                  className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-[6px] bg-[#FF6B00] px-5 py-4 text-center font-mono text-[11px] font-black uppercase tracking-[0.08em] text-black transition-colors hover:bg-[#CCFF00] sm:text-xs"
                >
                  Choose $5+ &amp; Claim Founder Access
                  <ArrowUpRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                </a>
                <a href="/early-access/success?demo=1" className="mt-3 block text-center font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-white/45 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white">
                  Preview what happens after payment
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
    </AnimatePresence>,
    document.body,
  );
}
