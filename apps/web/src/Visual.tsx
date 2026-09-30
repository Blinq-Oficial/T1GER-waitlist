import { useId } from 'react';
import { Brain, Coins, Cpu } from 'lucide-react';

/** Original T1GER companion artwork. Decorative, not a virtual-pet feature. */
export function Tiger({ mood = 'curious', className = '' }: { mood?: 'curious' | 'happy'; className?: string }) {
  const id = useId();
  return <svg className={`tiger-companion ${className}`} viewBox="0 0 240 220" aria-hidden="true">
    <defs><linearGradient id={id} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#ffbe6a"/><stop offset="1" stopColor="#ff822e"/></linearGradient></defs>
    <ellipse cx="120" cy="200" rx="75" ry="10" fill="currentColor" opacity=".06"/>
    <path d="M53 61C27 53 25 16 47 13c24-4 39 15 37 35M156 48c-2-33 29-45 44-29 18 19 7 42-16 45" fill={`url(#${id})`} stroke="#c66626" strokeWidth="3"/>
    <path d="M49 48C39 44 38 26 49 24c11-2 19 8 20 20M168 43c1-15 14-23 23-15 9 10 3 21-10 23" fill="#9c5128"/>
    <path d="M39 96C39 48 71 37 120 37s81 17 81 63c0 62-28 93-81 93S39 158 39 96Z" fill={`url(#${id})`}/>
    <path d="m94 41 7 29 12-5 3-28M135 38l-6 27 13 5 9-27M41 94l32 12-4 12-28-6M199 94l-32 12 4 12 28-6M44 125l23 6-4 12-17-5M196 125l-23 6 4 12 17-5" fill="#583927"/>
    <path d="M68 128c-15 30 6 53 30 53h44c28 0 44-25 29-52-18-16-33-8-51-6-17-2-33-10-52 5Z" fill="#fff3df"/>
    <ellipse cx="82" cy="105" rx="19" ry="25" fill="#fffaf1"/><ellipse cx="158" cy="105" rx="19" ry="25" fill="#fffaf1"/>
    {mood === 'happy' ? <g fill="none" stroke="#302e2c" strokeWidth="7" strokeLinecap="round"><path d="M72 105q10-13 20 0M148 105q10-13 20 0"/></g> : <g fill="#302e2c"><ellipse cx="87" cy="107" rx="9" ry="14"/><ellipse cx="153" cy="107" rx="9" ry="14"/><circle cx="90" cy="102" r="3" fill="white"/><circle cx="156" cy="102" r="3" fill="white"/></g>}
    <path d="M107 137q13-8 26 0l-13 11Z" fill="#67412f"/>
    <path d="M120 148v8m-14-1q14 17 28 0" fill="none" stroke="#67412f" strokeWidth="3" strokeLinecap="round"/>
    <g stroke="#67412f" strokeWidth="2" opacity=".45"><path d="m80 146-31-4m31 14-27 7m107-17 31-4m-31 14 27 7"/></g>
    <path d="M68 177q-16 4-15 16q19 10 34-3M153 190q17 12 34 3 1-12-15-16" fill="#ffa044"/>
  </svg>;
}

export function DomainIcon({ domain, size = 30 }: { domain: string; size?: number }) {
  const Icon = domain === 'ai-automation' || domain === 'ai' ? Cpu : domain === 'mindset-stoic' || domain === 'mindset' ? Brain : Coins;
  return <span className={`domain-icon ${domain.includes('ai') ? 'ai' : domain.includes('mind') ? 'psychology' : 'investing'}`}><Icon size={size} strokeWidth={1.8}/></span>;
}
