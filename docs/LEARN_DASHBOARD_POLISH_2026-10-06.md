# Learn dashboard — October 6, 2026

## Customer request

- Keep the T1GER wordmark; remove the temporary orange square containing “1”.
- Correct the displaced 3D mascot on Learn.
- Make the current stage, lesson path, daily challenges and supporting progress easier to distinguish.

## Changes

- Removed the temporary mark from navigation, sign-in, loading, recovery, onboarding and legal headers. The existing T1GER text remains.
- Reframed the Learn mascot in a centered canvas, aligned its halo, and removed overlapping floating badges. The existing 3D model, reactions, reduced-motion behavior and image fallback remain.
- Added a current-stage banner derived from the existing curriculum sections. It displays the learner’s actual stage, never a hardcoded stage number.
- Organized desktop Learn into a main lesson/path column and a separate daily progress column. Phones and tablets use a single column with challenges before the path.
- Added two daily goals: complete a lesson and complete an Apply step. Completion comes from persisted mission history or completed mission timestamps, in the learner’s timezone. Pending work, future records and earlier days do not count. The display grants no extra XP and does not change progression rules.
- Gave the current path section a distinct header and adapted XP, streak and saved-tool cards to the narrower rail.

## Verification

- Web lint and TypeScript checks pass.
- Web tests: 42 pass; 3 existing emulator tests skipped because no emulator is running.
- Browser checks at 320, 390, 768, 1280 and 1440 pixels: no horizontal page overflow; mascot and scene share the same horizontal center.
- Inspected light and dark themes with the actual loaded WebGL model.
- Inspected new learner (0/2) and completed-day/review-due (2/2) fixtures. The required-review CTA remains “Review first”. Locked lesson previews still explain prerequisites and do not bypass them.
- No backend, authentication, payment, learning evidence or Gold lesson changes.

These checks cover the reported dashboard issues, not every browser/device combination or educational efficacy.
