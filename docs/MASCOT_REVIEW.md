# T1GER mascot — learning reactions

## Character provenance

Web uses the existing T1GER APP character. The model and static fallback were copied unchanged from `dddavet/T1GER-APP`, asset commit `680168b`:

- `public/mascot/t1ger-head-v1.glb` (870,208 bytes)
- `public/mascot/t1ger-avatar.png`

The native repository is not modified. Eyes, eyebrows, ears and smile have independent nodes in a volumetric model rendered with Three.js. The owner approved the first celebration before this expansion.

## Reactions and actual triggers

Public review: [t1ger.app/app/mascot](https://t1ger.app/app/mascot). No account required. Eight scene buttons, replay and half-speed controls show the same clips used in the product.

| Reaction | Duration | Product trigger |
|---|---:|---|
| Welcome | 1.6 s | Auth entry, onboarding welcome, lesson Hook |
| Thinking | 0.9 s, then held pose | Onboarding choices, challenge, Apply preparation, retrieval |
| Correct | 0.95 s | Correct challenge answer, onboarding ready |
| Retry | 1.1 s | Incorrect challenge answer or failed save/review |
| Saved | 1.4 s | Apply save resolves successfully; includes a wink and small accents |
| Recall | 1.25 s | Reveal the core idea, or finish a review session |
| Lesson complete | 3.2 s | Enter Reward after the review save resolves |
| Path milestone | 3.8 s | Reward for the fifth idea in a path; larger accents and a proud settling pose |

No animation delays progression, auto-advances a lesson, or awards XP. Existing asynchronous save gates are retained. DEV previews remain explicitly unsaved; their companion copy says the preview tool is ready. Opening an empty review queue uses a quiet idle character, not an achievement celebration.

Primary references: Duolingo's [character reactions](https://blog.duolingo.com/building-character/), [state machine and blended expressions](https://blog.duolingo.com/world-character-visemes/), and [milestone timing breakdown](https://blog.duolingo.com/streak-milestone-design-animation/). They inform contextual reactions, readable poses and celebration energy. No Duolingo artwork, animation file or runtime is bundled. This is not an independent certification of equivalent quality.

## Runtime

- Reactions blend from the currently rendered pose over 180 ms. Switching after a full turn normalizes the yaw so the character does not unwind through another revolution.
- The shared challenge and gallery keep their renderer mounted while changing clips. Per-frame work does not update React state.
- Rendering pauses offscreen and while the document is hidden; resources are disposed on unmount.
- Reduced motion suppresses autoplay and idle movement. Explicit gallery selection/replay requests a single clip and then stops.
- Static fallback is available during load or without WebGL; the gallery reports load failure visibly.
- Pixel ratio is capped at 1.5. The renderer chunk is about 638 kB raw / 165 kB gzip plus the model. Eight clips reuse one model. No slow-device frame-rate benchmark is claimed.

## Verification

- Web tests: 15/15. Motion tests cover finite values, continuity, camera bounds, squash/stretch, settling, asymmetric wink and interrupted-pose blending.
- TypeScript, ESLint and production subpath build pass.
- Local DEV browser walkthrough: psychology lesson 05, prediction → concept → incorrect answer → retry → correct answer → Apply tool → save → reflection → retrieval/reveal → rating → Reward. Buttons remain available at the expected state gates.
- Local review fixture: start → answer → reveal → rating → session complete. Onboarding: welcome → interests → learning loop → intention → ready.
- Gallery: saved wink and accents sampled in rendered frames; milestone playback through completion; 360 px mobile viewport has no horizontal overflow and sampled airborne framing stays inside the canvas. Reduced-motion manual replay is tested.
- Proof frames are kept in ignored `.codex/qa/mascot-events/`, including `review-complete.png` and mobile milestone samples. Production is checked separately after deployment.

Account APIs, XP logic, backend rules, root waitlist and payment flow are unchanged by this iteration.
