import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  {
    question: 'What exactly is T1GER?',
    answer:
      'T1GER turns discipline into a daily game. Complete focused, bite-sized missions, submit proof, earn XP, and build momentum alongside your Squad.',
  },
  {
    question: 'What happens if my tiger dies?',
    answer:
      'Missing missions or leaving during Focus Time reduces your tiger’s health. If it reaches zero, your current streak and multipliers reset. The mechanic makes consistency feel tangible without blocking you from starting again.',
  },
  {
    question: 'How does the "Squad" feature work?',
    answer:
      'Squads create shared accountability with up to three friends. You can see each other’s progress, protect a shared streak, and help the group stay consistent.',
  },
  {
    question: 'Why do you show my lifespan in dots?',
    answer:
      'The timeline is a simple Memento Mori exercise based on an estimated lifespan. It turns abstract time into something visible so you can choose what deserves your attention today.',
  },
  {
    question: 'When do I get access to the app?',
    answer:
      'Joining the waitlist secures your place for the upcoming beta. You can move up by sharing your referral link, or purchase Early Adopter Access for $5 to receive priority entry to the Closed Beta.',
  },
  {
    question: 'What is included with Early Adopter Access?',
    answer:
      'You get priority Closed Beta access, six months of T1GER Premium, and a permanent Founder badge. You can request a full refund anytime before the global launch.',
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
