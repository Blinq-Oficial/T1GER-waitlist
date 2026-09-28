# T1GER web product audit — 2026-09-28

## Scope and evidence

Reviewed the account entry and onboarding code, Learn, Discover, Apply, Master, Profile, the two available web lessons, light and dark themes, and the progress and save paths. Ran the preview at 390 × 844 and 1280 × 720, completed lesson 01 from prediction through reward, and completed a due Master review. Build, lint, and five unit tests pass. These checks do not verify production Firebase writes or a real user's retention.

The useful comparison with Duolingo is the learning loop: a clear next action, an active decision, immediate feedback, and later retrieval. T1GER already has that structure. The audit focused on making it reliable and understandable rather than adding decorative points or streaks. Duolingo describes its own [path](https://blog.duolingo.com/putting-in-work-the-habit-of-language-learning/), [spaced practice](https://blog.duolingo.com/spaced-repetition-for-learning/), and [streak feedback](https://blog.duolingo.com/streak-milestone-design-animation/) in those terms.

## Findings addressed

| Priority | Finding | Change and verification |
| --- | --- | --- |
| Critical | Starting a Master session placed the review in a zero-width grid column on desktop. | The session now uses a full-width shell. Verified at 1280 px and 390 px. |
| High | A rule could appear saved locally even if its Firestore write failed. | Local artifact storage now follows the Firestore write. The lesson also requires the remote mission when restoring a saved state. |
| High | A successful Apply server call followed by a failed progress update could leave a retry blocked. | Retry checks whether the mission is already complete before calling the server again; the idempotent progress update still runs. Live Firebase verification is pending. |
| High | Learn could offer “Start lesson” for lesson 03, which has no web player. | Learn and Discover now distinguish the two web lessons from the mobile curriculum; unavailable lessons have no web launch control. |
| Medium | The Master memory list repeated an outdated and overly broad financial claim. | It now uses the reviewed educational model. Lesson 01's objective and concept text also distinguish emergency liquidity from long-term investing. |
| Medium | Keyboard guidance did not work inside the answer field; answer feedback was not announced. | Enter reveals a non-empty answer in both review flows; answer feedback has a live status. Tested in the browser. |
| Low | Saved rules could be submitted repeatedly; the light-theme review label was faint. | Save disables until inputs change; the label uses the theme's readable secondary text. |

## Remaining release gates

1. **Real account journey:** test email and Google signup, onboarding, Firestore writes, Apply completion, review scheduling, logout, and return on an authorized Firebase test project or account. Preview deliberately does not persist progress.
2. **Curriculum coverage:** only Smart Money lessons 01 and 02 have web players. The other Smart Money lessons and the AI and Psychology paths are presented as mobile content. Reaching a full web learning experience requires building and testing those lessons.
3. **Legal publication:** the Privacy and Terms pages are marked as drafts. Confirm the operator's legal identity, contact details, data practices, and jurisdiction with the product owner and legal reviewer before treating them as final notices.
4. **Performance and user evidence:** the production build warns about a 701 kB Firebase chunk (173 kB gzip). Measure startup on representative phones and connections, then test comprehension and task completion with real learners before assigning a “10/10” quality score.

## Verification

`npm run lint`, `npm test` (5 tests), `npm run build`, and `git diff --check` pass. Browser checks found no horizontal overflow at 390 px across the five main pages and the lesson, and no runtime errors during the tested flows.
