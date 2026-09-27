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

The dev-only `?preview=1` query renders a labeled, read-only design preview without signing in. It does not exercise persistence. Deep links are handled by the Firebase Hosting rewrite in `firebase.json`; deployment has not been run.

## Mobile architecture map

| Concern | Canonical mobile source | Web use |
| --- | --- | --- |
| Account | Firebase Auth; `users/{uid}` | Same Firebase project and UID; Google and email/password sign in |
| Curriculum | `interactiveCurriculum.ts`, `orbLearningDesign.ts`, `missionBank.ts` | Source snapshot in `src/product/`; stable IDs and lesson content |
| Journey | `learningJourney.ts` | Same ordered Apply gate |
| Progress | `brainService.ts`, `BrainContext.tsx` | Same `brainState` shape and `processMissionResult` transactions |
| Apply | `fieldMissionService.ts`, `fieldMissionCatalog.ts`, `completeApplyMission` callable | Same `missions/{uid}_field-{lessonId}` and server completion function |
| Master | `masteryService.ts`, `ts-fsrs` | Same FSRS cards and `processMissionReview`; no fabricated reviews |
| Rewards | `completeApplyMission` callable | Server awards XP, coins, and streak; client does not award them |
| Artifacts | `learningArtifactService.ts` | Same browser-local key and mission support payload while pending |
| Subscription | RevenueCat mobile entitlement | Read-only `isPro` profile display in this build |
| AI | Authenticated functions in mobile | Not required for the two web lessons |

The web app copies the listed pure mobile modules at the pinned commit and leaves the mobile repository untouched. This avoids an early shared-package refactor that could destabilize the mobile release. When the mobile curriculum changes, refresh the snapshot and rerun parity tests.

## Current alpha scope

Learn, Discover, Apply, Master, and Profile use real account and learning state. Investing lessons 01 and 02 have a six-stage web player. Lesson 01 is required before lesson 02 because the existing `completeApplyMission` function requires the previous Apply reward event. AI and Psychology are visible as curriculum previews; their lesson players are not yet available on web. Remaining Investing lessons show an explicit mobile availability state.

The first two web lessons save progress to the same `users/{uid}.brainState`, `missions`, and server reward records as mobile. Master reads and writes the same FSRS card IDs. A saved tool's browser-local details do not yet travel between devices after its mission is completed; meaningful lesson, Apply, reward, and review progress does.

## Verification and deployment

`npm test` checks the compounding model and mobile progression/FSRS parity. `npm run build` performs TypeScript checking and creates the production bundle. A signed-in end-to-end run against a safe test account remains necessary before calling Web Alpha complete. The local machine has no JDK/Firebase Emulator CLI, and no authorized test account was provided. Use the existing Firebase test project/emulators or a disposable test account to verify the full sign-in → two lessons → Apply → Master → refresh path. Set `VITE_USE_FIREBASE_EMULATOR=true` only when Auth, Firestore, and Functions emulators are running locally.

For a deployment, provide the same Firebase browser configuration as environment variables and authorize the chosen web domain in Firebase Auth. Deploy only Hosting from this repo; never deploy rules or functions from the web project. Preview and production deploys require an explicit target decision because the mobile repository already has Hosting configuration for the same Firebase project.
