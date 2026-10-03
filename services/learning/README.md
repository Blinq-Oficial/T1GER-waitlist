# Web learning backend

`completeWebApplyMission` is an independent `web-learning` codebase in the existing `t1ger-69d6a` Firebase project. It accepts the fifteen Web lesson IDs, checks the authenticated learner and ordered reward records, and awards personal XP, coins and streak once per mission. Self-reported application is not verified evidence or competitive XP.

Psychology uses `learn-psychology-v1-01` through `05`; it does not replace the mobile Stoic `learn-mindset-*` records. Existing mobile function names are not changed.

```sh
npm ci --prefix services/learning
npm --prefix services/learning run build
npx firebase-tools deploy --only functions:web-learning:completeWebApplyMission --project t1ger-69d6a
```

The rules snapshot was fetched from production on September 30, 2026. Only the `missions` block was amended: clients cannot create or change a Web lesson into `completed`, or edit an already completed Web mission. All other production rules and legacy mobile mission behavior were preserved. Fetch the current production rules and compare them before any future rules release. Do not replace them with a stale snapshot.

For isolated testing, use `demo-t1ger-web`, never a production project:

```sh
npx firebase-tools emulators:start --project demo-t1ger-web --only auth,firestore,functions
npm --prefix apps/web run test:emulator-contract
```

The contract checks owner isolation, client reward/completion rejection, prerequisites, reflection validation, versioned Psychology identity and retry idempotency. Production function images use a 30-day Artifact Registry cleanup policy; this does not delete learner data.

## AI mentor

`askT1gerMentor` uses the server-only `OPENROUTER_API_KEY` secret and free Qwen3.8 27B pinned to ModelRun through OpenRouter. Both input/output price ceilings are zero; paid fallback is disabled. Set server `T1GER_MENTOR_READY=true` only after the free route, adult disclosure and authenticated conversation checks pass. Set Web `VITE_MENTOR_AVAILABLE=false` to pause its interface. See [provider configuration and evaluation](../../docs/OPENROUTER_MENTOR.md). The free NVIDIA trial endpoint is not used for public learners.
