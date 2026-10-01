import { lazy, Suspense } from 'react';
import { Brain, Coins, Cpu } from 'lucide-react';
import './mascot.css';
import type { MascotAnimation } from './mascotMotion';

const Mascot3D = lazy(() => import('./Mascot3D'));

/** Uses the approved T1GER APP character, with a static fallback while 3D loads. */
export function Tiger({ mood = 'curious', animation = mood === 'happy' ? 'correct' : 'idle', replay = 0, className = '' }: { mood?: 'curious' | 'happy'; animation?: MascotAnimation; replay?: number; className?: string }) {
  return <div className={`tiger-companion ${className}`} aria-hidden="true"><Suspense fallback={<img className="mascot-poster" src={`${import.meta.env.BASE_URL}mascot/t1ger-avatar.png`} alt=""/>}><Mascot3D animation={animation} replay={replay}/></Suspense></div>;
}

export function DomainIcon({ domain, size = 30 }: { domain: string; size?: number }) {
  const Icon = domain === 'ai-automation' || domain === 'ai' ? Cpu : domain === 'mindset-stoic' || domain === 'mindset' ? Brain : Coins;
  return <span className={`domain-icon ${domain.includes('ai') ? 'ai' : domain.includes('mind') ? 'psychology' : 'investing'}`}><Icon size={size} strokeWidth={1.8}/></span>;
}
