# T1GER design and release review — September 30, 2026

This report supersedes the design and backend blockers in `PRODUCT_SPRINT_REPORT.md`. That report remains the record of the earlier product sprint. This release is a usable free learning beta, not a claim of Duolingo/Apple quality certification or complete legal readiness.

## References and decisions

- [Duolingo path design](https://blog.duolingo.com/new-duolingo-home-screen-design/): one ordered next step, explicit completed/current/locked states, review and learning in the same journey.
- [Duolingo reviews](https://blog.duolingo.com/how-to-review-lessons-on-duolingo/): clear review purpose and feedback.
- Official Duolingo anonymous onboarding inspected in the browser: a short prompt, progress, one decision, a clear Continue action.
- [Apple materials](https://developer.apple.com/design/human-interface-guidelines/materials) and [Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/liquid-glass): glass on navigation, quiet solid surfaces for reading and input, reduced-transparency fallback.
- [Screen library](https://screensdesign.com/apps/duolingo-language-lessons/): free onboarding examples and catalog inspected. Many of its 192 listed screens require Pro; they were not inspected or bypassed. No claim that every Duolingo screen was reviewed.

Original T1GER tiger artwork, course colors, tactile choices and ordered learning nodes replace the previous editorial dashboard. Glass is limited to navigation/header surfaces. Light/dark preference respects the operating system initially and persists after selection. No synthetic hearts, leaderboards, purchases or invented progress.

## Screen coverage

| Surface | New treatment and checks |
| --- | --- |
| Account | Tiger welcome, clear create/sign-in modes, labeled fields, password visibility, age/read-notice step, useful error messages |
| Onboarding | Companion prompt, interest cards, conditional primary path, learning loop, daily intention and first-lesson handoff |
| Learn | Three course units, five ordered nodes, actual progress, next lesson, review gate and desktop companion panel |
| Discover | Three course cards with identity, outcome and real path switch |
| Apply | Pending workbench, saved action, completed history and clear empty state |
| Master | Actual due queue, retrieval/reveal/self-rating and caught-up state with next review date |
| Profile | Actual XP/streak/intention, learning export, shared-account support request and sign-out |
| Lessons | Hook → Learn → Interact → Apply → Master → Reward; explicit checking, explanation, retry, tool and recall |
| System | Loading, connection error, locked/current/completed nodes, focus, disabled controls and public legal drafts |

The fifteen lesson contents and six-stage flows were exercised in the prior sprint. In this redesign, a fresh isolated account completed the new Psychology 01 flow including an incorrect choice, retry, saved tool, server completion, recall and Reward. Reload and sign-out/sign-in retained 170 XP, the saved action, the completed node and the next unlocked lesson. Apply history, Master caught-up state, Profile and export were inspected. The published Learn map was captured at actual viewport widths 360, 390, 430, 768, 1024, 1280, 1440 and 1920px with no horizontal overflow. Both themes, mobile lessons and desktop Discover/Master were inspected. These are representative checks, not every stage at every size.

## Functional fixes and production backend

- Future-due FSRS cards no longer block a lesson while Master shows an empty due queue. Only reviews due now gate progress.
- Psychology uses versioned `learn-psychology-v1-*` IDs; legacy mobile Stoic records remain untouched.
- Wrong answers require an explicit retry before continuing. A corrected answer does not retroactively become first-try success.
- `completeWebApplyMission` is deployed and ACTIVE in `us-central1`, independent of mobile function names. Authentication, onboarding, fifteen-ID whitelist, prerequisites, reflection length and idempotent rewards are enforced by the server.
- Production Firestore rules were fetched, amended only for Web completed missions, validated, exercised in local emulators and deployed. Clients cannot forge Web completion. Other rules and legacy mobile behavior were preserved.
- Firebase email/password and Google providers are enabled. `t1ger.app` was added to authorized domains without removing existing domains.
- The Firebase browser SDK configuration is public by design, uses the existing restricted Firebase key, and activates as a fallback only on `t1ger.app`. Explicit environment configuration takes precedence. Preview hosts do not default to production. No server credentials are committed.

A bounded production SDK check created one synthetic QA account (no waitlist row or welcome email). Production onboarding-profile write, client completion rejection, prerequisite rejection, first 170 XP reward, zero-XP duplicate retry, owner history and returning sign-in passed. In the deployed UI, that account then completed Money 02 through all six stages: saved simulated rule, server completion, retrieval/rating and Reward. The account reached 350 XP (170 SDK check + 180 for Money 02), unlocked Money 03, retained the saved rule after reload, and showed its real next review date. Changing to AI preserved the account and earlier progress. The QA account is retained; existing users were not altered. Google popup E2E and recovery delivery remain unverified; provider configuration alone is not an OAuth E2E result.

## Publication

The unified repository was published to GitHub `main`; PR #4 is merged. Vercel reported a successful deployment of `28e4ce6f6fc931e0137323dbc6fd1341d1394903`. The production waitlist links to `https://t1ger.app/app/`, and direct `/app/learn` and `/app/privacy` requests return the app entry. Firebase-backed sign-in and the lesson flow above were exercised from the deployed browser UI. A brief initial propagation 404 cleared; a transient browser connection error was followed by successful sign-in. The UI supports retry without inventing a successful save.

Final polish corrects the account illustration background and title contrast in light mode, resets scroll after authentication/onboarding, and updates the browser theme color with the selected appearance. A mobile Continue learning action opens the next available lesson without scrolling past completed units; the course selector now uses a clear chevron. Root waitlist validation still rejects a missing email with HTTP 400; the unsigned Stripe webhook fails closed. No live waitlist signup or payment was submitted in this design release.

## Verification and limits

Root unit tests 10/10, Web unit tests 12/12, TypeScript/ESLint and both frontend builds passed. Isolated backend contract passed against the amended production rules and deployed function source. Firebase remains a roughly 704kB raw shared chunk and triggers Vite's chunk-size warning. No slow-device timing, Core Web Vitals certification, exhaustive accessibility audit or conversion improvement is claimed.

Legal notices remain clearly labeled drafts: legal operator, valid full address, retention, teen handling and service-wide export/deletion operations need completion. Minimum age 15 is self-attested. Founder checkout remains paused. Web AI lessons produce prompts/workflows; they do not run paid external AI calls.
