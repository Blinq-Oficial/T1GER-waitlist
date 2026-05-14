import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: 'What exactly is T1GER?',
    answer:
      'It’s the first productivity app with actual consequences. Think of it like Duolingo, but for building your business and leveling up your mindset. You complete daily, bite-sized missions to earn XP and build your streak.',
  },
  {
    question: 'What happens if my tiger dies?',
    answer:
      'If you slack off, procrastinate, or leave the app during Focus Time, your digital apex predator takes damage. If he dies, your streak burns, your multipliers reset, and your Squad is penalized. Actions have real consequences here.',
  },
  {
    question: 'How does the "Squad" feature work?',
    answer:
      'Weaponized peer pressure. You link your account with up to 3 friends. If one of you misses a daily mission, the entire Squad’s pet takes a hit. You grow together, or you fail together. You don\'t just let yourself down; you let the Pride down.',
  },
  {
    question: 'Why do you show my lifespan in dots?',
    answer:
      "Memento Mori. We visualize your exact estimated lifespan on your screen. It's a psychological trigger designed to wake you up. Stop acting like you have infinite time to build your empire. Watch your time disappear, stop scrolling, and start hunting.",
  },
  {
    question: 'When do I get access to the app?',
    answer:
      'We are currently in the closed waitlist phase. By entering your email, you secure your spot in line. Want to get in faster? After you sign up, you\'ll get a unique referral link. Share it with your network to skip ahead, or upgrade to T1GER PRO to bypass the line entirely.',
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
            style={{ fontSize: 'clamp(2rem, 8vw, 4.5rem)' }}
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
