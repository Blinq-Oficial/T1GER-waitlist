

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-obsidian">
      {/* Subtle Noise Texture overlay */}
      <div className="absolute inset-0 bg-noise mix-blend-overlay opacity-30" />
      
      {/* Moving Grid to simulate an 'alive' OS */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'linear-gradient(rgba(204, 255, 0, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(204, 255, 0, 0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0',
          animation: 'moveGrid 20s linear infinite'
        }}
      />

      {/* Deep Obsidian Gradients to ensure text readability */}
      <div className="absolute inset-x-0 bottom-0 h-[40vh] bg-gradient-to-t from-obsidian to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[30vh] bg-gradient-to-b from-obsidian to-transparent" />

      {/* Soft Electric Orange/Acid Green glows mapped to quadrants */}
      <div className="absolute top-[10%] left-[20%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-[#FF6B00]/5 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" />
      <div className="absolute bottom-[20%] right-[10%] w-[50vw] h-[50vw] max-w-[800px] max-h-[800px] bg-[#CCFF00]/5 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />

      <style>{`
        @keyframes moveGrid {
          0% { transform: translateY(0); }
          100% { transform: translateY(40px); }
        }
      `}</style>
    </div>
  );
}
