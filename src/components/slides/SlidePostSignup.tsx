import { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import ScrollReveal from '../animations/ScrollReveal';

export default function SlidePostSignup() {
  const [copied, setCopied] = useState(false);
  const [animatedRank, setAnimatedRank] = useState(0);

  const finalRank = 4281;
  const refCode = 'T1G-X9A2';

  // Number animation
  useEffect(() => {
    let startTime: number;
    const duration = 1500; // ms

    const animateNumber = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // easeOutExpo
      const easing = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setAnimatedRank(Math.floor(easing * finalRank));

      if (percentage < 1) {
        requestAnimationFrame(animateNumber);
      }
    };

    requestAnimationFrame(animateNumber);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://t1ger.app/ref/${refCode}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="min-h-screen py-24 w-full relative flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden bg-transparent">
      
      <ScrollReveal yOffset={60} duration={1}>
        <div className="w-full flex flex-col items-center z-10 mx-auto">
          <h3 className="font-sans font-bold text-[#CCFF00] uppercase tracking-widest text-sm mb-4 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#CCFF00] shadow-[0_0_10px_rgba(204,255,0,0.8)]" />
            POSITION SECURED
          </h3>
          
          <div className="font-outfit text-7xl sm:text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-8 tracking-tighter tabular-nums">
            #{animatedRank.toLocaleString()}
          </div>

          <p className="text-white/60 font-sans text-center max-w-sm mb-12">
            Your spot aligns you with the elite. Want to hunt sooner? Rise through the ranks by sharing your code.
          </p>

          {/* Action Card */}
          <div className="w-full max-w-md bg-white/5 border border-[#CCFF00]/30 rounded-2xl p-6 backdrop-blur-xl relative shadow-[0_0_40px_rgba(204,255,0,0.05)]">
            <h4 className="font-sans font-black text-xl text-white mb-2 uppercase">
              Boost Your Rank
            </h4>
            <p className="text-[#CCFF00]/70 font-mono text-xs mb-6 uppercase tracking-wider">
              Share to skip 500 people.
            </p>

            <div className="w-full bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between font-mono text-sm group relative overflow-hidden mb-4">
              <span className="text-white tracking-widest truncate mr-4">
                t1ger.app/ref/{refCode}
              </span>
              
              <button 
                onClick={handleCopy}
                className={`p-2 rounded-md transition-all ${copied ? 'bg-[#CCFF00]/20 text-[#CCFF00]' : 'bg-white/10 text-white hover:bg-white/20'}`}
                title="Copy referral link"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            
            <button onClick={handleCopy} className="w-full py-3 rounded-xl border border-[#CCFF00]/50 text-[#CCFF00] font-sans font-bold uppercase tracking-widest text-sm hover:bg-[#CCFF00]/10 transition-colors shadow-[inset_0_0_15px_rgba(204,255,0,0.1)]">
              {copied ? 'LINK COPIED' : 'COPY RECRUITMENT LINK'}
            </button>
          </div>

        </div>
      </ScrollReveal>
    </section>
  );
}
