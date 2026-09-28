import type { ReactNode } from 'react';
import { appHref } from './basePath';

const operator = import.meta.env.VITE_LEGAL_OPERATOR?.trim();
const contact = import.meta.env.VITE_LEGAL_CONTACT_EMAIL?.trim();
const location = import.meta.env.VITE_LEGAL_LOCATION?.trim();
const effectiveDate = import.meta.env.VITE_LEGAL_EFFECTIVE_DATE?.trim();

// Legal publication requires review of the real operator, data practices and jurisdictions.
export const legalDraft = !operator || !contact || !location || !effectiveDate || import.meta.env.VITE_LEGAL_PUBLISHED !== 'true';

function Contact() {
  return <>{operator || '[Legal operator to be confirmed]'}{location && <> · {location}</>}{contact ? <> · <a href={`mailto:${contact}`}>{contact}</a></> : <> · [Privacy contact to be confirmed]</>}</>;
}

export default function LegalPage({ kind, themeAction }: { kind: 'privacy' | 'terms'; themeAction?: ReactNode }) {
  const privacy = kind === 'privacy';
  return <main className="legal-page"><header className="legal-head"><a className="brand" href={appHref('/')}><span className="brand-mark">1</span><span>T1GER</span></a><div className="legal-actions"><nav aria-label="Legal pages"><a href={appHref('/privacy')} aria-current={privacy ? 'page' : undefined}>Privacy</a><a href={appHref('/terms')} aria-current={!privacy ? 'page' : undefined}>Terms</a></nav>{themeAction}</div></header>
    <article className="legal-content"><p className="eyebrow">T1GER / {privacy ? 'PRIVACY' : 'TERMS'}</p><h1>{privacy ? 'Privacy notice' : 'Terms of use'}</h1>
      {legalDraft && <div className="legal-draft" role="status"><strong>Draft for product review.</strong> The operator, contact, retention schedule, audience and applicable jurisdictions must be confirmed before public release. This page is not a final legal notice.</div>}
      <p className="legal-updated">{effectiveDate ? `Effective ${effectiveDate}` : 'Effective date to be confirmed'} · Operator: <Contact/></p>
      {privacy ? <>
        <section><h2>What this web app handles</h2><p>To create and use an account, T1GER handles your email address, account identifier and the name you choose to provide. Sign-in with Google may provide basic account details. The app stores learning path, lesson and review progress, Apply submissions and reflections, and any simulation rules you save. Some lesson artifacts are also kept in this browser’s local storage.</p></section>
        <section><h2>Why and where</h2><p>These details support authentication, learning progress across web and mobile, review scheduling, saved exercises, account support and security. The web code uses Firebase Authentication, Firestore and Cloud Functions operated by Google. Google sign-in is optional. This web build does not include an advertising or analytics SDK; a separate inventory is still needed for the mobile app and any future integrations.</p><p>Authentication and technical service logs may include device, browser and network information processed by Google. Processing regions and any cross-border transfer details must be confirmed against the deployed Firebase configuration.</p></section>
        <section><h2>Storage on your device</h2><p>Authentication uses browser storage needed to keep you signed in. Saved lesson artifacts and your light or dark preference can be stored locally in this browser. Clearing browser storage may remove those local details. No optional advertising tracker is included in this web build.</p></section>
        <section><h2>Retention and your choices</h2><p>Account and learning data remain while the service needs them to provide your account, subject to a retention and deletion schedule that must be finalized before publication. You can sign out at any time. An account data export and deletion process, including data shared with the mobile app, is still being defined; the contact route below must be active before launch.</p><p>For access, correction, export or deletion requests, contact <Contact/>. The rights and legal basis that apply depend on your location and must be specified in the final policy.</p></section>
        <section><h2>Children and updates</h2><p>The intended age range and any parental-consent process have not yet been finalized. Do not create an account for a child until those rules are published. T1GER will show an updated date when this notice changes.</p></section>
      </> : <>
        <section><h2>Service and accounts</h2><p>T1GER offers short learning experiences, exercises and memory reviews. A web account can share progress with the T1GER mobile app. Keep your sign-in details secure and provide accurate account information. Availability of particular paths can differ by platform.</p></section>
        <section><h2>Educational content</h2><p>Financial examples are educational simulations, not individualized investment advice, a recommendation to buy or sell, or a promise of future returns. Model assumptions, fees, taxes, inflation and investment risk matter. Do not use an example result as the sole basis for a financial decision.</p></section>
        <section><h2>Your work and T1GER content</h2><p>You keep responsibility for the reflections and rules you enter. Do not submit sensitive financial information or content you do not have the right to use. T1GER’s original lesson design, text and visual presentation remain its content unless otherwise stated. External source links lead to their respective publishers.</p></section>
        <section><h2>Payments, changes and contact</h2><p>This web build does not take payments. Subscription status may be displayed from your existing T1GER account. Terms for paid products, account termination, governing law and dispute resolution require review before a public release. For questions, contact <Contact/>.</p></section>
      </>}
      <footer className="legal-foot"><a href={appHref('/')}>Return to T1GER</a><a href={appHref(privacy ? '/terms' : '/privacy')}>{privacy ? 'Read terms' : 'Read privacy notice'}</a></footer>
    </article>
  </main>;
}
