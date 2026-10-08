import { ArrowRight, BookOpen, RotateCcw, Target } from 'lucide-react';
import type { ReactNode } from 'react';
import { Tiger } from './Visual';
import DomainArtwork from './DomainArtwork';
import { appHref } from './basePath';
import AnalyticsPreferences from '../../../src/components/analytics/AnalyticsPreferences';

export default function Welcome({ themeAction, start, signIn }: { themeAction: ReactNode; start: () => void; signIn: () => void }) {
  return <main className="welcome-page">
    <header className="welcome-head"><a className="brand" href="/"><span>T1GER</span></a><div>{themeAction}<button className="text-link" onClick={signIn}>Sign in</button></div></header>
    <section className="welcome-hero">
      <div className="welcome-copy"><p className="eyebrow">A little curiosity. A useful new skill.</p><h1>Learn something<br/>you can <em>use.</em></h1><p>Explore money, AI, and the way you think. Short lessons. Real applications. Ideas that stay with you.</p>
        <button className="button primary large" onClick={start}>Build my path <ArrowRight size={20}/></button><span className="welcome-reassurance">Choose your path first. Your first lesson is free.</span>
      </div>
      <div className="welcome-scene" aria-hidden="true"><div className="welcome-orbit"/><span className="welcome-bubble">Let's make curiosity count.</span><Tiger animation="welcome"/><div className="welcome-subject money"><DomainArtwork domain="smart-money"/><span>Money</span></div><div className="welcome-subject ai"><DomainArtwork domain="ai-automation"/><span>AI</span></div><div className="welcome-subject mind"><DomainArtwork domain="mindset-stoic"/><span>Mind</span></div></div>
    </section>
    <section className="welcome-loop" aria-label="How learning works"><div><span><BookOpen size={22}/></span><strong>Learn an idea</strong><p>Predict, explore, and understand.</p></div><div><span><Target size={22}/></span><strong>Make it useful</strong><p>Leave with a tool or decision.</p></div><div><span><RotateCcw size={22}/></span><strong>Make it stick</strong><p>Recall it when a review is due.</p></div></section>
    <footer className="welcome-foot"><span>Learn it. Apply it. Master it.</span><div><a href={appHref('/privacy')}>Privacy</a><a href={appHref('/terms')}>Terms</a><AnalyticsPreferences/></div></footer>
  </main>;
}
