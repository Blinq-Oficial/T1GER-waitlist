import React from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";

export default function Manifesto() {
    // Parallax logic for Holographic Container
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        // Calculate offset from center (-1 to 1)
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        
        mouseX.set(x);
        mouseY.set(y);
    }

    function handleMouseLeave() {
        mouseX.set(0);
        mouseY.set(0);
    }

    // Map -1/1 range to rotation degrees
    const rotateX = useMotionTemplate`${mouseY.get() * -10}deg`;
    const rotateY = useMotionTemplate`${mouseX.get() * 10}deg`;

    return (
        <section className="shrink-0 relative w-full flex flex-col justify-center overflow-hidden py-12 md:py-20">
            {/* Background Breathing Gradient (Locked to right side of Slide 1) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <motion.div 
                    initial={{ opacity: 0.3, scale: 0.8 }}
                    animate={{ opacity: [0.3, 0.5, 0.3], scale: [0.8, 1.1, 0.8] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-1/2 right-[-20%] -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/20 rounded-full blur-[150px]"
                />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                
                {/* LEFT COLUMN: TYPOGRAPHY */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
                    className="flex flex-col text-left space-y-8 lg:pr-12"
                >
                    <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif uppercase tracking-normal leading-[1.05]">
                        <span className="text-white block">Your to-do list is a </span>
                        <span className="text-slate-600 block my-2">spreadsheet.</span>
                        <span className="text-white block">This is a </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF9F1C] via-orange-400 to-[#FF9F1C] drop-shadow-[0_0_15px_rgba(255,159,28,0.4)] block animate-[gradient_8s_linear_infinite] bg-[length:200%_auto]">command center.</span>
                    </h2>
                    
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-slate-400 text-base md:text-lg font-medium leading-relaxed max-w-lg"
                    >
                        Standard productivity apps suppress your potential. T1GER turns your habits into quests. Stop managing your time. <span className="text-white font-bold">Start playing it.</span>
                    </motion.p>
                </motion.div>


                {/* RIGHT COLUMN: HOLOGRAPHIC CONTAINMENT UNIT */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                    whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                    viewport={{ once: true, amount: 0.05 }}
                    transition={{ duration: 1, type: "spring", bounce: 0.4, delay: 0.2 }}
                    className="relative w-full aspect-[4/5] sm:aspect-square lg:aspect-[3/4] max-w-[600px] mx-auto perspective-[1000px]"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                >
                    {/* The 3D Glass Box */}
                    <motion.div 
                        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                        className="w-full h-full relative rounded-[2.5rem] bg-slate-900/20 backdrop-blur-3xl border border-cyan-500/20 hover:border-cyan-400/60 shadow-[inset_0_0_80px_rgba(34,211,238,0.05),_0_20px_50px_rgba(0,0,0,0.5)] transition-colors duration-500 overflow-hidden group"
                    >
                        {/* Top Highlights */}
                        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent opacity-50"></div>
                        <div className="absolute top-0 right-10 w-32 h-32 bg-cyan-400/20 rounded-full blur-[40px] group-hover:bg-cyan-400/40 transition-colors duration-700"></div>

                        {/* Pedestal Floor Container (to contain the overflow of the floor glow) */}
                        <div className="absolute bottom-[-10%] inset-x-0 h-[40%] flex items-center justify-center pointer-events-none">
                            {/* Glowing Elliptical Ring (Perspective) */}
                            <div className="relative w-[70%] h-[120px] rounded-[100%] border-[2px] border-cyan-500/40 shadow-[0_0_40px_rgba(34,211,238,0.5),_inset_0_0_20px_rgba(34,211,238,0.3)] bg-cyan-900/10"
                                  style={{ transform: "rotateX(70deg)" }}>
                                {/* Center Core Glow */}
                                <div className="absolute inset-0 bg-cyan-400/30 blur-[20px] rounded-full"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] border-[4px] border-cyan-300/40 rounded-full border-dashed animate-[spin_15s_linear_infinite]"></div>
                            </div>
                        </div>

                        {/* Ambient Holographic Dust Particles */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen">
                             {[...Array(15)].map((_, i) => (
                                <div 
                                    key={i}
                                    className="absolute rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee] animate-[hologram-rise_8s_ease-in-out_infinite]"
                                    style={{
                                        width: Math.random() * 3 + 1 + 'px',
                                        height: Math.random() * 3 + 1 + 'px',
                                        left: Math.random() * 100 + '%',
                                        top: Math.random() * 100 + 10 + '%', // Start slightly below
                                        opacity: Math.random() * 0.7 + 0.3,
                                        animationDuration: Math.random() * 10 + 5 + 's',
                                        animationDelay: Math.random() * 5 + 's',
                                    }}
                                />
                            ))}
                        </div>

                        {/* Corner Accents (Sci-fi feel) */}
                        <div className="absolute top-6 left-6 w-4 h-4 border-t-2 border-l-2 border-cyan-500/40 group-hover:border-cyan-400 transition-colors"></div>
                        <div className="absolute top-6 right-6 w-4 h-4 border-t-2 border-r-2 border-cyan-500/40 group-hover:border-cyan-400 transition-colors"></div>
                        <div className="absolute bottom-6 left-6 w-4 h-4 border-b-2 border-l-2 border-cyan-500/40 group-hover:border-cyan-400 transition-colors"></div>
                        <div className="absolute bottom-6 right-6 w-4 h-4 border-b-2 border-r-2 border-cyan-500/40 group-hover:border-cyan-400 transition-colors"></div>
                    </motion.div>
                </motion.div>
            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes hologram-rise {
                    0% {
                         transform: translateY(0px) translateX(0px);
                         opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-500px) translateX(30px);
                        opacity: 0;
                    }
                }
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
            `}} />
        </section>
    );
}
