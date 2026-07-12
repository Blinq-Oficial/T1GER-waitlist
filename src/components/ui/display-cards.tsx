import type { ReactNode } from 'react';
import { BookOpen, Mic2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DisplayCardData = {
  icon: ReactNode;
  title: string;
  description: string;
  label: string;
  className: string;
};

const DEFAULT_CARDS: DisplayCardData[] = [
  {
    icon: <BookOpen className="h-4 w-4" aria-hidden="true" />,
    title: 'Books',
    description: 'Timeless frameworks',
    label: 'Distilled daily',
    className: '[grid-area:stack] -translate-x-12 -translate-y-12 rotate-[-5deg] hover:-translate-y-16',
  },
  {
    icon: <Mic2 className="h-4 w-4" aria-hidden="true" />,
    title: 'Podcasts',
    description: 'Operator insights',
    label: 'Made actionable',
    className: '[grid-area:stack] translate-x-2 translate-y-2 rotate-[2deg] hover:-translate-y-2',
  },
  {
    icon: <Sparkles className="h-4 w-4" aria-hidden="true" />,
    title: 'Case Studies',
    description: 'Real-world patterns',
    label: 'Built into missions',
    className: '[grid-area:stack] translate-x-16 translate-y-16 rotate-[6deg] hover:translate-y-12',
  },
];

export default function DisplayCards({ cards = DEFAULT_CARDS }: { cards?: DisplayCardData[] }) {
  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {cards.map((card) => (
        <article
          key={card.title}
          className={cn(
            'relative flex h-28 w-[17rem] select-none flex-col justify-between overflow-hidden rounded-[8px] border border-white/15 bg-black/75 px-4 py-3 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition-transform duration-500 hover:border-[#FF6B00]/60',
            card.className,
          )}
        >
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-[5px] bg-[#FF6B00] text-black">{card.icon}</span>
            <h3 className="font-outfit text-sm font-black uppercase">{card.title}</h3>
          </div>
          <p className="text-xs font-semibold text-white/65">{card.description}</p>
          <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#CCFF00]">{card.label}</p>
        </article>
      ))}
    </div>
  );
}
