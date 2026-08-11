import { ArrowRight, Check, Mail, ShieldCheck } from 'lucide-react';

export default function EarlyAccessSuccess() {
  const isDemo = new URLSearchParams(window.location.search).get('demo') === '1';

  return (
    <main className="min-h-screen bg-[#070707] px-5 py-6 text-white sm:px-8 md:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-white/10 pb-5">
          <a href="/" className="font-syncopate text-sm font-bold tracking-[0.2em] text-white transition-colors hover:text-[#FF6B00]">T1GER</a>
          <span className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/55">Secure checkout return</span>
        </header>

        {isDemo && (
          <div className="mt-6 border border-[#CCFF00]/25 bg-[#CCFF00]/[0.06] px-4 py-3 font-mono text-[9px] font-black uppercase tracking-[0.15em] text-[#CCFF00]">
            Demo preview · No payment was made
          </div>
        )}

        <div className="grid gap-12 py-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:py-16">
          <section>
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF6B00] text-black">
              <Check className="h-5 w-5 stroke-[3]" aria-hidden="true" />
            </div>
            <p className="mt-7 font-mono text-[10px] font-black uppercase tracking-[0.22em] text-[#FF6B00]">{isDemo ? 'Demo preview' : 'Checkout submitted'}</p>
            <h1 className="mt-3 max-w-xl font-outfit text-4xl font-black uppercase leading-[0.94] sm:text-6xl">{isDemo ? 'This is the confirmation experience.' : 'Check your email for confirmation.'}</h1>
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/55 sm:text-base">
              {isDemo
                ? 'No payment or benefit reservation occurred in this preview.'
                : 'Stripe sends the verified payment event to T1GER. After it is recorded, we email your Founder benefits, waitlist position, and referral link.'}
            </p>

            <ol className="mt-8 divide-y divide-white/10 border-y border-white/10">
              {[
                ['01', 'Stripe verifies the payment'],
                ['02', 'T1GER records your Founder benefits'],
                ['03', 'Your position and referral link arrive by email'],
              ].map(([number, label]) => (
                <li key={number} className="flex items-center gap-4 py-3.5">
                  <span className="font-mono text-[9px] font-black text-[#CCFF00]">{number}</span>
                  <span className="text-sm font-semibold text-white/75">{label}</span>
                </li>
              ))}
            </ol>

            <a href="/" style={{ color: '#050505' }} className="mt-8 inline-flex min-h-11 items-center gap-3 rounded-[6px] bg-white px-5 py-3 font-mono text-[10px] font-black uppercase tracking-[0.1em] transition-colors hover:bg-[#CCFF00]">
              <span>Return to T1GER</span>
              <ArrowRight className="h-4 w-4 text-black" aria-hidden="true" />
            </a>
          </section>

          <aside>
            <p className="mb-3 font-mono text-[9px] font-black uppercase tracking-[0.18em] text-white/35">Confirmation email preview</p>
            <div className="overflow-hidden rounded-[8px] border border-white/15 bg-[#0d0d0d]">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <span className="flex items-center gap-2 text-xs font-bold text-white/70">
                  <Mail className="h-4 w-4 text-[#FF6B00]" aria-hidden="true" />
                  T1GER
                </span>
                <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-white/25">Payment confirmed</span>
              </div>
              <div className="p-5 sm:p-6">
                <p className="font-mono text-[9px] font-black uppercase tracking-[0.18em] text-[#CCFF00]">Early Adopter unlocked</p>
                <h2 className="mt-3 font-outfit text-2xl font-black uppercase leading-none">You are officially in.</h2>
                <p className="mt-4 text-xs leading-relaxed text-white/45">Your Founder benefits are reserved. Keep this email for your records.</p>
                <div className="my-6 border-y border-white/10 py-5 text-center">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.18em] text-white/30">Waitlist position</p>
                  <p className="mt-1 font-outfit text-5xl font-black text-white">{isDemo ? '#247' : 'EMAIL'}</p>
                </div>
                <div className="space-y-2 text-xs text-white/55">
                  <p>Priority Closed Beta consideration</p>
                  <p>6 months of T1GER Premium</p>
                  <p>Permanent Founder badge</p>
                </div>
              </div>
            </div>
            <p className="mt-4 flex items-start gap-2 text-[10px] leading-relaxed text-white/30">
              <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              If the email does not arrive within a few minutes, check spam or contact hello@t1ger.app using the checkout email.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
}
