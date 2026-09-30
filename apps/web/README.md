# T1GER Web

Responsive web client for the existing T1GER learning product. The mobile repository remains the product reference: [T1GER-APP](https://github.com/dddavet/T1GER-APP), snapshot `e7abadf96a9d636dd4ce2fe9c4b06ad72b7e77ad`.

## Run

Use Node 22 or newer. Copy `.env.example` to `.env.local` and fill in the **browser Firebase configuration for the existing T1GER project**. This repo does not commit a production configuration or provider secrets.

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
```

The dev-only `?preview=1` query renders a labeled design preview without signing in. Open `http://127.0.0.1:5173/lesson/learn-money-02?preview=1` to explore all six stages of **Time is the Multiplier**. The preview lets you complete the lesson locally without writing to Firebase; it does not exercise persistence. Preview fixtures also cover a pending Apply mission (`/apply?preview=1&fixture=apply`), due reviews (`/master?preview=1&fixture=review`), onboarding (`/?preview=1&fixture=onboarding`), and a load error (`/learn?preview=1&fixture=error`). Deep links are handled by the Firebase Hosting rewrite in `firebase.json`; deployment has not been run.

## Account entry and legal release

Account creation, returning sign-in, Google entry, password visibility and reset requests are implemented. Onboarding has five screens for a single interest or six for multiple interests, three domains, a primary path and a saved daily intention. Per-user drafts survive reload; completion opens the selected first lesson. Light/dark preference persists locally.

Public `/app/privacy` and `/app/terms` remain labeled drafts. Supplied facts: minimum age 15; Plymouth, Michigan, United States; contact este.t1ger.oficial.app@gmail.com. Legal operator, complete postal address, retention, teen handling and service-wide export/deletion operations still require review. Profile exports Web learning JSON and offers a support request, not automatic account deletion. Set legal publication flags only after reviewing facts and operations.

## Mobile architecture map

| Concern | Canonical mobile source | Web use |
| --- | --- | --- |
| Account | Firebase Auth; `users/{uid}` | Same Firebase project and UID; Google and email/password sign in |
| Curriculum | Pinned snapshot plus Web teaching refinements | Stable identifiers/state, not identical lesson content: reconcile Psychology/legacy Stoic identities before sharing live recall history |
| Journey | `learningJourney.ts` | Same ordered Apply gate |
| Progress | `brainService.ts`, `BrainContext.tsx` | Same `brainState` shape and `processMissionResult` transactions |
| Apply | `fieldMissionService.ts`, `fieldMissionCatalog.ts`, `completeApplyMission` callable | Same `missions/{uid}_field-{lessonId}` and server completion function |
| Master | `masteryService.ts`, `ts-fsrs` | Same FSRS cards and `processMissionReview`; no fabricated reviews |
| Rewards | `completeApplyMission` callable | Server awards XP, coins, and streak; client does not award them |
| Artifacts | Existing local key and mission payload | Additive users.learningArtifacts preserves tools after callable replacement of mission document |
| Subscription | RevenueCat mobile entitlement | Read-only `isPro` profile display in this build |
| AI | Authenticated mobile functions | Web exercises build prompts and workflows; they do not execute an external AI request |

The mobile repository was not edited or deployed. Web retains contract identifiers and copied state/FSRS logic, with explicit teaching refinements. Web Psychology now covers biases, evidence and retrieval, while the inspected mobile snapshot remains Stoic: reconcile topic/card identities and any necessary migration before the shared public release. Passing progression tests is not content parity.

## Current alpha scope

All fifteen lessons are playable in Web: five Investing, five AI and five Psychology. Learn, Discover, Apply, Master and Profile use real account state. Sequential Apply prerequisites remain enforced by the existing completion callable. Profile displays actual server XP/streak; clients do not award rewards. Saved tools remain in the profile after server completion.

The first two web lessons save progress to the same `users/{uid}.brainState`, `missions`, and server reward records as mobile. Master reads and writes the same FSRS card IDs. A saved tool's browser-local details do not yet travel between devices after its mission is completed; meaningful lesson, Apply, reward, and review progress does.

The desktop shell and the five destinations have distinct layouts: Learn presents the next lesson and the path, Apply centers the active decision and its saved rule, and Master presents due retrieval rather than a synthetic score. The lesson player supports keyboard selection (number keys for choices), Enter to advance where offered, and 1–4 to rate a revealed memory card. The compounding chart has a keyboard-accessible year scrubber. Reduced-motion preferences are respected by the visual layer.

The first two web lessons have source-checked educational briefs with primary sources, assumptions and retrieval prompts in `src/education.ts`. See [the education audit](docs/EDUCATION_AUDIT.md) for the specific fixes and remaining curriculum gates. The web hook for lesson 02 compares equal total deposits to isolate timing; these teaching refinements should be reconciled with the mobile curriculum before a shared release.

## Verification and deployment

Root and Web lint/tests and both builds passed. All fifteen distinct six-stage lesson flows reached Reward in rendered UI; the first lessons of the three domains also completed against isolated local Firebase. Waitlist-to-Web, persisted multiselect onboarding and returning sign-in passed locally. Learn and landing were checked at 360, 390, 430, 768, 1024, 1280, 1440 and 1920 pixels. Google OAuth, real email delivery and production-domain configuration remain unverified. See the root product sprint report for exact evidence and limits.

For a deployment, provide the same Firebase browser configuration as environment variables and authorize the chosen web domain in Firebase Auth. Deploy only Hosting from this repo; never deploy rules or functions from the web project. Preview and production deploys require an explicit target decision because the mobile repository already has Hosting configuration for the same Firebase project.

## Repeatable isolated backend check

`npm run test:emulator-contract` targets demo-t1ger-web only (Auth 9099, Firestore 8080, Functions 5001). It checks owner isolation, client reward-write rejection, prerequisites, completion, artifact retention and retry idempotency using the existing mobile rules/functions. The script creates disposable local emulator data and cannot contact production.
