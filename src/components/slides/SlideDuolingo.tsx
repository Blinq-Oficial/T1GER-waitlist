import { motion } from 'framer-motion';
import ScrollReveal from '../animations/ScrollReveal';

export default function SlideDuolingo() {
  // Mock data for the 7-day streak grid
  const mockDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const mockStreak = [true, true, true, true, false, false, false];

  return (
    <section className="min-h-screen py-24 w-full relative flex flex-col md:flex-row items-center justify-center p-6 sm:p-12 overflow-hidden bg-transparent perspective-1000">
      
      <ScrollReveal yOffset={60} duration={1}>
        <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-6xl mx-auto">
          {/* Text Section */}
          <div className="w-full md:w-1/2 flex flex-col items-start gap-6 z-10 md:pr-12">
            <div className="glass-pill px-4 py-1.5 rounded-full flex items-center gap-2 font-mono text-xs text-[#CCFF00] font-bold tracking-widest" style={{ '--accent-color': '#CCFF00' } as React.CSSProperties}>
              <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              THE GAME OF SUCCESS
            </div>

            <h1 className="font-outfit font-black text-5xl sm:text-7xl leading-[0.9] text-white uppercase tracking-tighter">
              DUOLINGO <br />
              <span className="text-white/40">FOR</span> <br />
              ENTREPRENEURS.
            </h1>
            
            <p className="font-sans text-lg text-white/70 max-w-md">
              Stop consuming. Start executing. Gamify your daily progress and hunt down your goals alongside the most hungry predators on the planet.
            </p>
          </div>

          {/* 3D Visual Section */}
          <motion.div 
            initial={{ opacity: 0, rotateY: -20, rotateX: 10, z: -100 }}
            whileInView={{ opacity: 1, rotateY: -15, rotateX: 15, z: 0 }}
            transition={{ duration: 1, type: "spring" }}
            whileHover={{ rotateY: 0, rotateX: 0, scale: 1.05, transition: { duration: 0.4 } }}
            className="w-full max-w-sm mt-12 md:mt-0 z-10"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
              {/* Internal Glow */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-[#FF6B00]/20 to-transparent pointer-events-none" />
              
              <h3 className="font-sans font-black text-2xl text-white mb-8 uppercase tracking-wide">
                Current target 
                <span className="block text-[#FF6B00] font-mono mt-1 text-3xl">4 DAY STREAK</span>
              </h3>

              <div className="grid grid-cols-7 gap-3 mb-6">
                {mockDays.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-3">
                    <span className="text-white/40 font-mono text-xs">{day}</span>
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1, type: "spring" }}
                      className={`w-10 h-12 rounded-lg flex items-center justify-center border transition-all ${
                        mockStreak[i] 
                          ? 'bg-[#FF6B00]/20 border-[#FF6B00] shadow-[0_0_15px_rgba(255,107,0,0.5)]' 
                          : 'bg-white/5 border-white/10'
                      }`}
                    >
                      {mockStreak[i] && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1 + i * 0.1 }}
                          className="w-4 h-4 rounded-sm bg-[#FF6B00]" 
                        />
                      )}
                    </motion.div>
                  </div>
                ))}
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '57%' }}
                  transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#FF6B00] shadow-[0_0_10px_rgba(255,107,0,1)]" 
                />
              </div>
              <div className="flex justify-between mt-2 font-mono text-xs text-white/50">
                <span>Progress: 57%</span>
                <span>+150 XP</span>
              </div>

            </div>
          </motion.div>
        </div>
      </ScrollReveal>

    </section>
  );
}
