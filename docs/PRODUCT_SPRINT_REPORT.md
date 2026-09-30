# T1GER product sprint — September 30, 2026

## STATUS
**Alpha**, not a verified public release or a 10/10 claim. Existing production waitlist data was not changed by this product sprint. The integration stays in draft PR #4.

## LANDING
Primary Web entry, Investing/AI/Psychology positioning, working inflation example, corrected FAQ/protocol/footer. Existing hero identity retained; no invented launch dates or guaranteed learning outcomes.

## MOBILE WAITLIST
Explicit iOS/Android list, optional for Web. Signup success links to Web and prefills email through same-origin session storage, not a URL. Welcome email copy distinguishes mobile updates and Web access. Founder checkout stays paused; previously shared payment links need separate remediation. No database schema changes.

## ONBOARDING
Five screens for one interest, six for multiple: welcome → interests → primary (conditional) → learning loop → daily intention → ready. Investing, AI and Psychology are selectable. One primary and 5/10/15 minute intention are persisted in canonical Firebase profile fields; Learn uses the intention. Per-user draft survives reload; completion opens the selected first lesson.

## AUTH
Local Firebase email signup/sign-in and returning session passed. Duplicate-email action, password visibility and reset request implemented. Minimum age 15 is self-attested before signup and every Google entry path, not identity/age verified. Deployed Google OAuth, real recovery delivery and reset-link completion remain unverified.

## DESIGN
Dark/light themes, readable hierarchy, responsive lesson tools, three-section journeys, native labeled controls, loading/error/empty states and actual progress. Closed mobile Web navigation is inert; open navigation isolates background and handles focus/Escape. More than twenty rendered states inspected/captured across onboarding, account, Learn, Apply, Master, Profile and lessons. Settled screenshots were inspected separately from viewport transitions.

## LEARN
Fifteen playable lessons, five per domain, sequential Apply prerequisites, real next action and preserved progress on path change. Daily intention is shown without enforcing a time promise.

## APPLY
Authored range/select/text widgets produce usable outputs. Profile artifacts survive the completion callable replacing the mission document. Fixed owner-rule denial on nonexistent mission reads by using the existing owner query pattern. Reflections are self-reported application, not externally verified proof.

## MASTER
Existing FSRS, real due cards, answer reveal/self-rating and honest caught-up state. Three first-domain completions created three actual recall cards in local Firebase.

## LESSON EXPERIENCE
All fifteen distinct lessons reached Reward through six rendered stages. First Investing, AI and Psychology lessons used actual local Firebase writes. The remaining twelve used labeled DEV preview: matching, ordering, error detection, tools and retrieval passed, but persistence was not separately verified for those twelve. Money 02's displayed return range is 3–10%; no 0% UI scenario is claimed.

## E2E
| Check | Result and boundary |
| --- | --- |
| New learner | Local Firebase signup → onboarding → first Investing lesson → saved tool → Apply → Master → refresh passed |
| Three domains | First lessons persisted; profile showed 3 completed, 510 XP, streak 1; artifacts survived server overwrite/reload |
| Multi-interest | All three interests, Psychology primary, 15 minutes; reload retained selection; correct first lesson opened |
| Waitlist → Web | Actual `/api/join` handler plus in-memory Supabase adapter returned position 1; success linked to Web; same email prefilled and local Firebase account created |
| Returning account | Sign-out/sign-in returned without repeating onboarding |
| Duplicate/recovery | Useful existing-email sign-in action and local reset confirmation passed; delivery/password change not tested |
| Export | Visible JSON included real profile, missions, tools, 510 XP; copy fallback verified, native download completion not confirmed in in-app browser |
| Backend | Existing mobile rules/functions: owner query, foreign-read rejection, client reward rejection, prerequisite rejection, first completion and duplicate retry passed |

The local waitlist adapter rejected external network calls: no Supabase Production or Resend delivery. Local credentials/logs are ignored and not committed. No production learning-account E2E, payment transaction, live fulfillment or automatic account deletion was performed.

## RESPONSIVE QA
Learn and landing: **360, 390, 430, 768, 1024, 1280, 1440, 1920 px**, actual widths recorded, no horizontal overflow. Mobile auth/onboarding/Master/Profile exercised at 390. Fifteen lessons exercised at desktop width. These are representative routes, not every stage at every width.

## PERFORMANCE
Final build sizes (kB, raw / gzip): landing main JS **423.93 / 134.50**, CSS **68.37 / 13.20**; Web main JS **272.15 / 83.77**, curriculum **383.51 / 133.47**, Firebase **703.72 / 173.49**, CSS **80.58 / 16.26**. Firebase triggers the Vite chunk warning. Lesson/review players are lazy loaded; existing compressed hero images total about 182 kB. No mobile-network, Lighthouse/Core Web Vitals or slow-device timing was measured; these are bundle sizes, not load-time results.

## REMAINING BLOCKERS
1. Production-domain Firebase configuration, Google provider/callbacks, recovery delivery and deployed completion functions; Preview data must be isolated.
2. **Curriculum identity:** Web Psychology teaches biases/evidence/retrieval using legacy `mindset` IDs; inspected mobile snapshot still teaches Stoicism. Reconcile shared lesson/card identities and migration before live shared recall history. State/parity tests do not establish content parity. Investing teaching refinements also need reconciliation.
3. Legal operator/full postal address, retention, 15–17 handling and operational service-wide export/deletion. The provided location/contact are used; `4885-8` is not treated as a verified address.
4. Founder paid flow remains intentionally paused: absent purchase RPCs, entitlement mapping and conflicting Stripe copy need resolution before reopening; this does not block free Web learning.

## NEEDS DAVID
- Legal operator name and complete valid postal address.
- Reviewed policy/operational owner for teen accounts, retention and deletion requests.
- Shared Psychology/mobile curriculum decision before public account rollout.

Technical configuration and release verification remain engineering work, not a request to repeat QA.

## Verification
Root tests **10/10**; Web tests **9/9**; root ESLint and Web TypeScript/ESLint passed. `npm run build:waitlist` then `npm run build:web` passed. Separate commands avoid reinstalling Web dependencies while Vite runs. `npm --prefix apps/web run test:emulator-contract` repeats the isolated contract check against **demo-t1ger-web only**, with Auth 9099, Firestore 8080 and Functions 5001 using the existing mobile rules/functions.

Legal review reference: [FTC COPPA guidance](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions). A minimum-age checkbox alone does not resolve audience classification or every youth privacy requirement.
