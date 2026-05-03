import { useState } from 'react';
import ScrollReveal from '../animations/ScrollReveal';

export default function SlideLifeVisualizer() {
  const [age, setAge] = useState<string>('25');

  const totalMonths = 960; // 80 years * 12

  const numAge = parseInt(age);
  const livedMonths = (!isNaN(numAge) && numAge >= 0 && numAge <= 100) 
    ? Math.min(numAge * 12, totalMonths) 
    : 300;

  // Generate dots array
  const dots = Array.from({ length: totalMonths }, (_, i) => i);

  return (
    <section className="min-h-screen py-24 w-full relative flex flex-col items-center justify-center p-6 sm:p-12 overflow-hidden bg-transparent">
      
      <ScrollReveal yOffset={60} duration={1}>
        {/* Top Header Section */}
        <div className="w-full max-w-4xl flex flex-col items-center gap-6 z-10 mb-8 mx-auto">
          <div className="flex flex-col items-center gap-2">
            <label htmlFor="age-input" className="text-white/60 font-sans tracking-widest text-xs uppercase font-bold">
              Enter your age
            </label>
            <input
              id="age-input"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 text-center text-4xl font-mono text-white focus:outline-none focus:border-[#FF6B00]/50 focus:shadow-[0_0_20px_rgba(255,107,0,0.3)] transition-all w-32"
              min="0"
              max="100"
            />
          </div>

          <h1 className="font-outfit font-black text-4xl sm:text-6xl md:text-7xl text-center leading-[0.9] text-white my-4 uppercase tracking-tighter">
            YOU HAVE <br/>
            <span className="text-[#FF6B00] animate-pulse drop-shadow-[0_0_20px_rgba(255,107,0,0.8)] font-mono tracking-normal">{(totalMonths - livedMonths).toLocaleString()}</span> <br/>
            MONTHS LEFT.
          </h1>
          <h2 className="font-mono text-[#CCFF00] tracking-widest text-sm sm:text-lg font-bold">
            STOP SCROLLING. START HUNTING.
          </h2>
        </div>

        {/* Grid of Dots */}
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-24 sm:grid-cols-40 md:grid-cols-48 gap-1 p-6 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-xl shadow-2xl z-10 w-full max-w-5xl">
            {dots.map((dotIndex) => {
              const isLived = dotIndex < livedMonths;
              return (
                <div
                  key={dotIndex}
                  className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-colors duration-500 ${
                    isLived 
                      ? 'bg-[#FF6B00] shadow-[0_0_8px_rgba(255,107,0,0.8)]' 
                      : 'bg-[#333333]'
                  }`}
                />
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center gap-6 mt-6 z-10 font-sans text-xs text-white/50 font-bold uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#FF6B00] shadow-[0_0_8px_rgba(255,107,0,0.8)]" />
              Time spent
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#333333]" />
              Time remaining (assuming 80y)
            </div>
          </div>
        </div>
      </ScrollReveal>

    </section>
  );
}
