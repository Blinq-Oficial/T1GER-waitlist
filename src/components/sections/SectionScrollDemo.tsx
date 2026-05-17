import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export default function SectionScrollDemo() {
  return (
    <section className="relative w-full md:pl-40 bg-[#050505] border-t border-white/5 py-12 overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-radial from-[rgba(255,107,0,0.04)] to-transparent pointer-events-none" />

      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <span className="t-caption text-[#FF6B00] mb-4 block tracking-[0.25em] font-semibold">
              PREVIEW SYSTEM 1.0
            </span>
            <h2 className="t-heading text-white tracking-tighter leading-[0.95] mb-6">
              ENGAGE THE T1GER
              <br />
              <span
                className="text-transparent font-black"
                style={{
                  WebkitTextStroke: "1.5px #FF6B00",
                  filter: "drop-shadow(0 0 20px rgba(255,107,0,0.25))",
                }}
              >
                PREVIEW SYSTEM
              </span>
            </h2>
            <p className="max-w-md mx-auto text-zinc-500 font-sans text-sm md:text-base mb-2">
              Watch the interactive console transition into a high-performance tactical interface in real-time.
            </p>
          </div>
        }
      >
        <div className="relative w-full h-full bg-zinc-950 overflow-hidden flex flex-col">
          {/* Real video running as the mobile app screen */}
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/Tiger_lunges_swipes_glass_202604282106.mp4" type="video/mp4" />
            </video>
            {/* Dark glass cover overlays to make it look premium */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
          </div>

          {/* Interactive UI Overlay layer inside app (mock status bar + app indicator) */}
          <div className="absolute inset-x-0 top-0 h-14 bg-gradient-to-b from-black/60 to-transparent z-20 flex justify-between items-end px-6 pb-2 pointer-events-none font-mono text-[9px] text-zinc-400">
            <span>T1GER // OS</span>
            <span>9:41 AM</span>
          </div>

          {/* Home swipe indicator at bottom of screen */}
          <div className="absolute inset-x-0 bottom-2.5 h-1 z-20 flex justify-center pointer-events-none">
            <div className="w-32 h-1 bg-white/40 rounded-full" />
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
}
