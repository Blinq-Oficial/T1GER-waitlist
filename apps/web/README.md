# T1GER Web

Responsive web client for the existing T1GER learning product. The mobile repository remains the product reference: [T1GER-APP](https://github.com/dddavet/T1GER-APP), snapshot `e7abadf96a9d636dd4ce2fe9c4b06ad72b7e77ad`.

## Run

Use Node 22 or newer. For local account development, copy `.env.example` to `.env.local` and supply an explicit Firebase browser configuration. The public browser SDK fallback in `firebasePublicConfig.ts` activates only on `t1ger.app`; other hosts require their own configuration. It contains no server/provider secrets. See the root [design and release review](../../docs/DESIGN_REVIEW.md) for current verification and limitations.

```sh
npm install
npm run dev
npm run lint
npm test
npm run build
```

The dev-only `?preview=1` query renders a labeled design preview without signing in. Open `http://127.0.0.1:5173/lesson/learn-money-02?preview=1` to explore all six stages of **Time is the Multiplier**. It does not write to Firebase or exercise persistence. Fixtures cover pending Apply (`/apply?preview=1&fixture=apply`), due reviews (`/master?preview=1&fixture=review`), onboarding (`/?preview=1&fixture=onboarding`) and load errors (`/learn?preview=1&fixture=error`). The unified Vercel build serves the production app under `/app` through root `vercel.json`.

## Account entry and legal release

Account creation, returning sign-in, Google entry, password visibility and reset requests are implemented. Onboarding has five screens for a single interest or six for multiple interests, three domains, a primary path and a saved daily intention. Per-user drafts survive reload; completion opens the selected first lesson. Light/dark preference persists locally.

Public `/app/privacy` and `/app/terms` remain labeled drafts. Supplied facts: minimum age 15; Plymouth, Michigan, United States; contact este.t1ger.oficial.app@gmail.com. Legal operator, complete postal address, retention, teen handling and service-wide export/deletion operations still require review. Profile exports Web learning JSON and offers a support request, not automatic account deletion. Set legal publication flags only after reviewing facts and operations.

## Mobile architecture map

| Concern | Canonical mobile source | Web use |
| --- | --- | --- |
| Account | Firebase Auth; `users/{uid}` | Same Firebase project and UID; Google and email/password sign in |
| Curriculum | Pinned snapshot plus Web teaching refinements | Web Psychology uses versioned `learn-psychology-v1-*` IDs, distinct from legacy mobile Stoic records |
| Journey | `learningJourney.ts` | Same ordered Apply gate |
| Progress | `brainService.ts`, `BrainContext.tsx` | Same `brainState` shape and `processMissionResult` transactions |
| Apply | `fieldMissionService.ts`, `fieldMissionCatalog.ts`, `completeApplyMission` callable | Same mission shape; independent deployed `completeWebApplyMission` callable accepts only Web lessons |
| Master | `masteryService.ts`, `ts-fsrs` | Same FSRS cards and `processMissionReview`; no fabricated reviews |
| Rewards | Server reward transactions | Web server awards personal XP, coins and streak once; does not award competitive verified XP |
| Artifacts | Existing local key and mission payload | Additive users.learningArtifacts preserves tools after callable replacement of mission document |
| Subscription | RevenueCat mobile entitlement | Read-only `isPro` profile display in this build |
| AI | Authenticated mobile functions | Web exercises build prompts and workflows; they do not execute an external AI request |

The mobile repository was not edited or deployed. Shared account/state shapes remain compatible. Web Psychology covers biases, evidence and retrieval using new IDs; legacy Stoic records remain intact. Passing progression tests is not content parity. Other Web teaching refinements remain distinct from the pinned mobile snapshot.

## Current alpha scope

All fifteen lessons are playable: five Investing, five AI and five Psychology. Learn, Discover, Apply, Master and Profile use real account state. The deployed Web callable enforces sequential Apply prerequisites. Profile displays actual server XP/streak; clients do not award rewards. Saved tools remain in the profile after server completion.

Lessons save state in `users/{uid}.brainState`, owned `missions` and server reward events. Master uses actual FSRS cards, with versioned Psychology identities. Saved tools have an authoritative cloud copy in the profile plus a local fallback.

The desktop sidebar and mobile bottom navigation expose all five destinations. Learn presents an ordered map and next action, Apply centers saved decisions, and Master shows actual due retrieval. Native exercise controls support keyboard operation; 1–4 rate a revealed memory card. The compounding chart has a keyboard-accessible year scrubber. Reduced-motion and reduced-transparency preferences are respected.

The first two web lessons have source-checked educational briefs with primary sources, assumptions and retrieval prompts in `src/education.ts`. See [the education audit](docs/EDUCATION_AUDIT.md) for the specific fixes and remaining curriculum gates. The web hook for lesson 02 compares equal total deposits to isolate timing; these teaching refinements should be reconciled with the mobile curriculum before a shared release.

## Verification and deployment

See the root [design and release review](../../docs/DESIGN_REVIEW.md) for the latest visual, local-account and production SDK checks. The earlier product report records fifteen lesson flows and waitlist-to-Web tests. Google popup E2E and real password-recovery delivery are not established by provider configuration.

Vercel deploys both frontends from the repository root. Do not deploy the legacy `apps/web/firebase.json` Hosting configuration. The separate root `services/learning` codebase owns the Web completion function; use its documented targeted command. Firebase Auth authorizes `t1ger.app`, and Preview requires isolated configuration.

## Repeatable isolated backend check

`npm run test:emulator-contract` targets demo-t1ger-web only (Auth 9099, Firestore 8080, Functions 5001). It checks owner isolation, client reward/completion rejection, prerequisites, versioned IDs, reflection validation and retry idempotency against the Web backend and the scoped production-rules snapshot. It creates disposable local data and cannot contact production.
