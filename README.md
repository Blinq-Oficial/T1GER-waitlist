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

The dev-only `?preview=1` query renders a labeled design preview without signing in. Open `http://127.0.0.1:5173/lesson/learn-money-02?preview=1` to explore all six stages of **Time is the Multiplier**. The preview lets you complete the lesson locally without writing to Firebase; it does not exercise persistence. Preview fixtures also cover a pending Apply mission (`/apply?preview=1&fixture=apply`), due reviews (`/master?preview=1&fixture=review`), onboarding (`/learn?preview=1&fixture=onboarding`), and a load error (`/learn?preview=1&fixture=error`). Deep links are handled by the Firebase Hosting rewrite in `firebase.json`; deployment has not been run.

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

The desktop shell and the five destinations have distinct layouts: Learn presents the next lesson and the path, Apply centers the active decision and its saved rule, and Master presents due retrieval rather than a synthetic score. The lesson player supports keyboard selection (number keys for choices), Enter to advance where offered, and 1–4 to rate a revealed memory card. The compounding chart has a keyboard-accessible year scrubber. Reduced-motion preferences are respected by the visual layer.

## Verification and deployment

`npm test` checks the compounding model and mobile progression/FSRS parity, including the next due review date. `npm run lint` checks TypeScript and ESLint; `npm run build` creates the production bundle. The design preview was visually checked at 360, 390, 430, 768, 1024, 1280, 1440, and 1920 pixels, and the full six-stage flagship lesson was completed in preview. A signed-in end-to-end run against a safe test account remains necessary before calling Web Alpha complete. The local machine has no JDK/Firebase Emulator CLI, and no authorized test account was provided. Use the existing Firebase test project/emulators or a disposable test account to verify the full sign-in → two lessons → Apply → Master → refresh path. Set `VITE_USE_FIREBASE_EMULATOR=true` only when Auth, Firestore, and Functions emulators are running locally.

For a deployment, provide the same Firebase browser configuration as environment variables and authorize the chosen web domain in Firebase Auth. Deploy only Hosting from this repo; never deploy rules or functions from the web project. Preview and production deploys require an explicit target decision because the mobile repository already has Hosting configuration for the same Firebase project.
