import { useRef, useState } from 'react';
import { analyticsChoice, posthogConfigured, setAnalyticsChoice } from '../../lib/behaviorAnalytics';
import './analyticsPreferences.css';

export default function AnalyticsPreferences() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [choice, setChoice] = useState(analyticsChoice);
  const [error, setError] = useState('');
  return <>
    <button type="button" className="analytics-choice-link" onClick={() => { setChoice(analyticsChoice()); setError(''); dialog.current?.showModal(); }}>Privacy settings</button>
    <dialog ref={dialog} className="analytics-dialog ph-no-capture" data-lenis-prevent aria-labelledby="analytics-choice-title" aria-describedby="analytics-choice-description">
      <h2 id="analytics-choice-title">Your privacy settings</h2>
      <p id="analytics-choice-description">Choose what optional usage data you share with T1GER. Your learning works either way.</p>
      <label><span><strong>Help improve T1GER</strong><small>Share screens visited and feature use. Your email, name, answers and chat text are excluded.</small></span><input type="checkbox" checked={choice.events} onChange={event => setChoice({ events: event.target.checked, replay: event.target.checked && choice.replay })}/></label>
      <label><span><strong>Share masked interactions</strong><small>Help us spot confusing navigation. All text and inputs are masked. Account forms, chats, lessons, profiles and private work are excluded.</small></span><input type="checkbox" disabled={!choice.events} checked={choice.replay} onChange={event => setChoice({ ...choice, replay: event.target.checked })}/></label>
      <p className="analytics-status">{posthogConfigured ? 'PostHog processes optional usage data. Change your choice here at any time.' : 'Optional collection is not active yet. Your choices apply when PostHog is connected.'} Vercel also provides aggregate page counts.</p>
      {error && <p role="alert">{error}</p>}
      <div className="analytics-dialog-actions"><button type="button" onClick={() => dialog.current?.close()}>Cancel</button><button type="button" onClick={() => { if (setAnalyticsChoice(choice)) dialog.current?.close(); else setError('Your browser could not save this choice. Please try again.'); }}>Save settings</button></div>
    </dialog>
  </>;
}
