import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: 'What is T1GER?',
    answer:
      'T1GER is a daily operating system for ambitious people. It combines habit tracking, micro-learning, and competitive gamification into one protocol designed to build discipline, consistency, and growth.',
  },
  {
    question: 'How does the daily protocol work?',
    answer:
      'Each day you complete habits, a micro-lesson, and compete on leaderboards. Your streak determines your rank. Miss a day? Your streak resets. The pressure is constant — that\'s the point.',
  },
  {
    question: 'Is T1GER free?',
    answer:
      'T1GER will launch with a free tier covering the core daily protocol. A Pro tier will unlock advanced analytics, AI auditing, and exclusive community features.',
  },
  {
    question: 'When does T1GER launch?',
    answer:
      'We are currently in the waitlist phase. Join now to secure your position. Early members get priority access and exclusive founding benefits when we go live.',
  },
  {
    question: 'What makes T1GER different from other habit apps?',
    answer:
      'Most habit apps are passive trackers. T1GER is a competitive protocol — it punishes laziness, rewards consistency, and puts your progress on public leaderboards. It is designed to create real accountability.',
  },
  {
    question: 'How does the donation feature work?',
    answer:
      'For every $1 donated through T1GER, 100% goes directly to tiger conservation through trusted wildlife organizations. We believe in building something that gives back to the species that inspired us.',
  },
  {
    question: 'Can I use T1GER on mobile?',
    answer:
      'T1GER is built mobile-first. The web app works on all devices, and a native mobile app is planned for launch. Your progress syncs across all platforms.',
  },
];

/**
 * SectionFAQ — Chainzoku-style FAQ with accordion.
 *
 * - Light off-white background
 * - Properly constrained max-width for readability
 * - Accordion with smooth expand/collapse
 * - Top border separator on first item
 */
export default function SectionFAQ() {
  return (
    <section
      id="faq"
      className="relative w-full md:pl-40 flex flex-col items-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #050505 0%, #f5f5f0 6%, #f5f5f0 94%, #050505 100%)',
      }}
    >
      <div
        className="relative z-10 mx-auto px-6 sm:px-12"
        style={{
          maxWidth: '780px',
          paddingTop: 'clamp(5rem, 10vw, 9rem)',
          paddingBottom: 'clamp(5rem, 10vw, 9rem)',
        }}
      >
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="mb-10 md:mb-16 text-center"
        >
          <span
            className="block mb-3 tracking-[0.3em] uppercase text-black/25"
            style={{ font: "700 0.7rem/1 'JetBrains Mono', monospace" }}
          >
            ● Frequently Asked
          </span>
          <h2
            className="font-outfit font-black text-black uppercase tracking-tighter leading-[0.9]"
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
          >
            FAQ
          </h2>
        </motion.div>

        {/* Accordion items */}
        <div>
          {faqs.map((faq, i) => (
            <FAQItem key={i} {...faq} index={i} isFirst={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQItem({
  question,
  answer,
  index,
  isFirst,
}: {
  question: string;
  answer: string;
  index: number;
  isFirst: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.19, 1, 0.22, 1] }}
      className={`border-b border-black/5 ${isFirst ? 'border-t' : ''}`}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-6 md:py-8 text-left cursor-pointer bg-transparent border-none group outline-none"
      >
        <span className="font-outfit font-bold text-black text-lg md:text-xl group-hover:text-[#FF6B00] transition-colors duration-500 leading-snug pr-8">
          {question}
        </span>

        {/* Toggle icon */}
        <span
          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full border border-black/10 flex items-center justify-center text-black/20 group-hover:border-[#FF6B00] group-hover:text-[#FF6B00] transition-all duration-500"
          style={{
            transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        >
          <Plus className="w-4 h-4 md:w-5 md:h-5" />
        </span>
      </button>

      {/* Answer — collapsible */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="overflow-hidden"
          >
            <div className="pb-8">
              <p className="text-black/50 text-base md:text-lg leading-relaxed font-sans max-w-2xl">
                {answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
