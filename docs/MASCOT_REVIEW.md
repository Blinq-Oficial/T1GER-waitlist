# T1GER mascot — celebration study 01

## Character provenance

The Web companion now uses the existing T1GER APP character, replacing the separately drawn Web SVG. Model and static fallback are copied unchanged from `dddavet/T1GER-APP`, asset commit `680168b`:

- `public/mascot/t1ger-head-v1.glb` (870,208 bytes)
- `public/mascot/t1ger-avatar.png`

The source mobile repository and its runtime are not modified. The model has independent eye, eyebrow, ear and smile nodes; this is a volumetric character rendered with Three.js, not an image rotated with CSS.

## One animation for review

Public review route: `/app/mascot`. No account is required. Replay and half-speed controls demonstrate one 3.2-second celebration: anticipation, launch, full turn, compressed landing, rebound and settling. Eyes, brows and ears move with the shot; warm star accents fan out after landing and the contact shadow responds to height. The same shot is used by existing happy/reward companion placements. Additional reactions await the owner's review.

Reference inspected: [Duolingo's official streak animation breakdown and animated comparison](https://blog.duolingo.com/streak-milestone-design-animation/). Its emphasis on timing, energy and readable milestone poses informs this shot. No Duolingo artwork, animation file or runtime is bundled. This is a candidate for visual review, not a claim of independent quality certification.

## Runtime and checks

- Three.js loads as a separate chunk; no React state update runs per animation frame.
- Rendering pauses offscreen and while the document is hidden; resources are disposed on unmount.
- Reduced motion suppresses autoplay and idle movement. On the review page, an explicit Replay requests one shot and then stops.
- Static fallback and a visible load-failure message are available on the review page.
- Pixel ratio is capped at 1.5. The extra renderer chunk is about 636 kB raw / 164 kB gzip, plus the model; this is a real download cost. No slow-device performance rating is claimed.
- Web tests 13/13, TypeScript/ESLint and subpath production build pass. The animation test checks finite values, interpolation continuity, anticipation/lift/landing and settled bounds.
- Browser review covered normal playback through completion, half-speed controls, reduced-motion manual replay, sampled mobile jump framing, 360px layout without horizontal overflow, desktop display, and the actual Master integration. Existing progression and account APIs are unchanged.

Only one new shot is authored in this iteration. Accounts, XP, reviews, backend rules and the root waitlist are not modified by it.
