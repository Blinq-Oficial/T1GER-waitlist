import { motion } from 'framer-motion';

export default function Pillars() {
  const pillars = [
    {
      num: "01",
      title: "SNAP PROOF",
      text: "Every mission requires a photo. AI checks it against your goal in seconds. No shortcuts. No faking."
    },
    {
      num: "02",
      title: "BUILD STREAKS",
      text: "Miss a day, lose your streak. The pressure is the point. Streaks are the metric your future self will thank you for."
    },
    {
      num: "03",
      title: "EARN YOUR RANK",
      text: "Your position on the global board is earned, not bought. Every XP comes from real proof."
    }
  ];

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 relative z-20">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
              className="glass-pill flex flex-col p-10 md:p-12 rounded-3xl"
              style={{ '--accent-color': '#ffffff' } as React.CSSProperties}
            >
              <span className="font-['Bebas_Neue'] text-[48px] text-white/15 mb-6 leading-none">
                {pillar.num}
              </span>
              <h3 className="font-['Bebas_Neue'] text-[26px] text-white uppercase mb-4 tracking-wide leading-none">
                {pillar.title}
              </h3>
              <p className="text-slate-400 text-base sm:text-[14px] leading-relaxed font-sans">
                {pillar.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
