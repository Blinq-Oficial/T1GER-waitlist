import { motion } from 'framer-motion';
import TextReveal from '../animations/TextReveal';
import LetterReveal from '../animations/LetterReveal';

/**
 * Footer — Full-height cinematic footer with jungle gradient.
 *
 * Everything animated — wordmark, text, links, credits.
 */
export default function Footer() {
  const navLinks = [
    { label: 'Home', href: '#hero' },
    { label: 'About', href: '#about' },
    { label: 'Vision', href: '#vision' },
    { label: 'Protocol', href: '#protocol' },
    { label: 'Join', href: '#join' },
  ];

  const socialLinks = [
    { label: 'Twitter', href: 'https://twitter.com/t1gerapp' },
    { label: 'Instagram', href: 'https://instagram.com/t1gerapp' },
    { label: 'Contact', href: 'mailto:hello@t1ger.app' },
  ];

  return (
    <footer
      className="relative flex flex-col items-center justify-between overflow-hidden px-6 md:px-[6vw] md:pl-40 bg-section-jungle"
      style={{
        minHeight: '85vh',
        paddingTop: 'var(--page-margin)',
        paddingBottom: 'var(--page-margin)',
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(204,255,0,0.03) 0%, transparent 50%)',
        }}
      />

      {/* Top spacer */}
      <div />

      {/* Center content — animated */}
      <div className="flex flex-col items-center text-center relative z-10 max-w-5xl mx-auto">
        {/* T1GER wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        >
          <LetterReveal
            text="T1GER"
            as="div"
            className="text-[#FF6B00] font-syncopate tracking-[0.15em] mb-6"
            delay={200}
            letterClassName="drop-shadow-[0_0_40px_rgba(255,107,0,0.3)]"
          />
        </motion.div>

        {/* CTA text */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <TextReveal
            className="text-white/35 font-mono text-sm tracking-[0.3em] uppercase mb-8"
            delay={400}
          >
            The hunt begins soon.
          </TextReveal>
        </motion.div>

        {/* Social links row — animated */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
          className="flex items-center gap-6"
        >
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-white/25 hover:text-[#CCFF00] font-mono text-xs tracking-[0.15em] uppercase transition-colors duration-500"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </div>

      {/* Bottom credits — animated */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6 }}
        className="w-full flex flex-col md:flex-row items-center justify-between gap-4 relative z-10"
      >
        {/* Navigation */}
        <div className="flex items-center gap-4">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-white/15 hover:text-white/40 font-mono text-[10px] tracking-[0.1em] uppercase transition-colors duration-500"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="flex items-center gap-4">
          <span className="text-white/10 font-mono text-[10px] tracking-[0.1em] uppercase">
            © {new Date().getFullYear()} T1GER Protocol
          </span>
          <span className="text-white/10 font-mono text-[10px]">
            All rights reserved
          </span>
        </div>
      </motion.div>
    </footer>
  );
}
