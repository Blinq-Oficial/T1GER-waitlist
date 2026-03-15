import { motion } from "framer-motion";

interface Props {
  onOpenJoin: () => void;
  onOpenVip: () => void;
}

export default function Waitlist({ onOpenJoin, onOpenVip }: Props) {
    return (
        <div className="relative min-h-screen w-full shrink-0 text-white font-sans flex flex-col items-center justify-center overflow-hidden">
            
            {/* CENTERED HERO CONTENT */}
            <main className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-12 w-full max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="flex flex-col items-center w-full"
                >
                    {/* TYPOGRAPHY OVERHAUL (Sentence Case, Tight Tracking) */}
                    <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[110px] font-serif uppercase tracking-normal leading-none flex flex-col items-center text-center w-full">
                        <span className="text-white">Stop scrolling.</span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF9F1C] to-orange-500 drop-shadow-[0_0_20px_rgba(255,159,28,0.3)]">
                            Start hunting.
                        </span>
                    </h1>
                    
                    {/* SUB-HEADLINE & SPACING */}
                    <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed mt-6 md:mt-8">
                        Turn your real-world goals into a game.<br className="hidden sm:block"/> The Black Market opens soon.
                    </p>

                    {/* CALL TO ACTION GROUP */}
                    <div className="flex flex-col sm:flex-row items-center gap-4 justify-center w-full mt-10">
                        <button
                            onClick={onOpenJoin}
                            className="btn-primary w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-10 py-4 text-base md:text-lg rounded-full"
                            style={{ '--accent-color': '#E8952A' } as React.CSSProperties}
                        >
                            <span className="relative z-10 flex items-center gap-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
                                Join Waitlist
                            </span>
                        </button>
                        
                        <button 
                           onClick={onOpenVip}
                           className="glass-pill rounded-full w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 font-medium text-white text-sm md:text-base hover:text-[#E8952A] transition-colors"
                           style={{ '--accent-color': '#ffffff' } as React.CSSProperties}
                        >
                            Have an invite code?
                        </button>
                    </div>
                </motion.div>
            </main>

            {/* Scroll Indicator (Slide 1) */}
            <motion.div 
                className="absolute bottom-12 right-12 flex items-center gap-3 cursor-pointer z-50 pointer-events-auto group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
            >
                <span className="text-slate-500 font-mono text-[10px] uppercase tracking-[0.3em] group-hover:text-white transition-colors">Scroll</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    <svg className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </motion.div>
            </motion.div>
        </div>
    );
}
