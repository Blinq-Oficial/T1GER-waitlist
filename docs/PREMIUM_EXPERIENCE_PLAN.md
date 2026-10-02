# T1GER Web — product parity and visual quality

## Outcome
Every live mobile product capability has a discoverable Web entry and uses the existing account and canonical data. No artificial community, XP, AI replies or payment success. The Web learns, applies, recalls and returns through a clear primary action.

## Evidence and references
- Native inventory: App.tsx, Coach.tsx, SquadTab.tsx, Profile.tsx, FocusPomodoro.tsx, achievements.ts, firestore.rules and functions/src/index.ts in T1GER APP. Native source is an integration reference.
- Apple: https://www.apple.com/iphone/ — short section headlines, generous section separation, product imagery with a purpose.
- Apple interface guidance: https://developer.apple.com/design/tips/ — legible hierarchy, alignment, contrast and usable touch controls.
- Apple fonts: https://developer.apple.com/fonts/ — system typography is a reference, not a font license for this website. T1GER keeps its existing self-hosted Outfit.
- Duolingo: https://blog.duolingo.com/hub/design/ and https://blog.duolingo.com/building-character/ — purposeful character feedback and consistent visual vocabulary.

## Gap assessment before implementation
The current Web has a working learning loop and character, but its screen hierarchy is crowded: repeated uppercase labels, small body copy, similar boxes around every item and competing next-step messages. The five destinations conceal mobile capabilities. Profile counts only brain history while Learn also considers completed mission documents.

## Design implementation plan
1. A single composition system: 8/16/24/32/48/64 spacing, content width up to 1120px, reading width 60 characters, 48px controls.
2. Outfit display headings 48–64px desktop and 32–40px mobile; body copy 16–18px with 1.5 line height. Mono reserved for numerical timers. Short labels in sentence case.
3. Clear visual priority: one hero and one main CTA per destination. Move supporting metrics into quiet rows. Glass only on navigation; content uses solid readable surfaces.
4. Own artwork: existing transparent T1GER mascot and original vector illustrations for each domain. No decorative stock-photo filler and no borrowed branded artwork.
5. Motion: 180–240ms control and entry transitions; character reacts to real results. No delayed continuation. Respect reduced motion and pause work outside view.
6. Mobile navigation: four learning destinations plus More; secondary tools accessible without a crowded eight-icon dock. Desktop keeps named entries.

## Capability matrix
| Mobile capability | Web integration / boundary |
| --- | --- |
| Account, onboarding, Learn, Apply, Master | Preserve shared Firebase and ordered 15-lesson release; restyle and regression check |
| AI mentor | askT1gerMentor, existing coachingSessions schema, history, retry, quota errors; no browser AI keys |
| Friends and squads | Existing public profiles, requests, circles, activity, reactions, comments, reporting and blocking |
| Leagues and challenges | Same LeagueService/SocialService; verified XP only; optional zero-coin challenges |
| Saved tools | Cloud learningArtifacts searchable and readable; resume original lessons |
| Focus | Wall-clock timer with pause/reset/break and explicit completion; personal focus record, no competitive XP |
| Weekly progress and achievements | Canonical completion sources and native badge identifiers; no fabricated metrics |
| Reflection | Owner-scoped dailyQuestions, user-written reflection; AI assistance through mentor |
| Profile, learning pace, preferences | Owner profile writes with save/error feedback; shared account export/legal/support |
| Virtual pet | Existing brain pet state and mascot; learning and focus actions; Android usage cannot be observed from Web |
| Shop / paid upgrade | Existing client coin mutation is denied by rules. Requires canonical server transaction before purchase can be offered. Founder payment remains paused |
| Push and device restrictions | Notification preferences can sync; native FCM/device control is not equivalent to browser permission. Do not claim active browser delivery |
| Other authored curricula | Existing release only has 15 approved Web Apply contracts. Keep extra domains unavailable until lesson/tool and server contracts are validated |

## Acceptance and review
- Verify mentor request and persisted history with isolated release QA account; a real service failure is displayed, never replaced with an invented answer.
- Compare before/after screenshots for Learn, Discover, coach, community, focus, profile and a lesson at 390px and desktop.
- No horizontal scrolling at 390px; main controls >=44px; secondary type readable; keyboard focus visible; reduced motion disables decorative animation.
- Lesson save, resume, completion and Master remain intact; revisits never grant duplicate completion rewards.
- No private keys in browser bundles; no changed authorization rules, waitlist or payment activation.
- Lint, meaningful integration logic tests and production build pass. Public deployment is checked through visible UI.
- The Apple/Duolingo comparison is a design review, not a claim of independently certified equivalent quality. Remaining feature blockers and observed gaps are recorded explicitly.

## Observed release review — October 2, 2026
- Apple reference reviewed in the browser. The final comparison uses hierarchy, section separation, image purpose and touch-control clarity; it does not assert independent equivalence to Apple or Duolingo.
- Learn mobile: 390px viewport, 375px document width (scrollbar), five visible navigation destinations with ~60px control height. First lesson CTA now fits above the dock; the initial larger illustration did not.
- Discover mobile light mode reviewed visually: original domain artwork, readable paragraphs and no horizontal overflow.
- Profile completion count now merges canonical mission documents and brain history, avoiding the former 2-versus-3 inconsistency.
- Focus wall-clock countdown survives reload and route changes. Completed sessions save idempotently; a new calendar day clears all personal daily pet counters.
- 19 Web logic tests and 3 cosmetic policy tests passed. Full waitlist + /app production build passed. Safety rules passed emulator owner access, self-block rejection, cross-account and anonymous denial, and report privacy.
- Server deployed: mentor callable, activity reactions/comments, cosmetic transactions, challenge acceptance, verified-score trigger and hourly settlement. The initial Eventarc propagation failure was resolved by retrying once propagation completed.
- Gemini connectivity was tested with an isolated synthetic learning question. Existing keys fail (invalid key / provider-reported leak). No real AI response or persisted reply has been verified.
- Google's current Gemini API and Google Cloud generative-AI service terms restrict use in services likely accessed by under-18 users: https://ai.google.dev/gemini-api/terms and https://cloud.google.com/terms/service-terms. T1GER's requested minimum age remains 15. Mentor requests are release-gated on the server and UI while the provider/age decision is pending; rotating a key alone is insufficient.
- Shop now uses a server-owned catalog, transaction, balance checks and idempotent ownership. Equipment shares the native fields. The Web 3D model retains its approved original look; equipped accessories display on mobile.
- Browser/mobile push delivery remains unavailable pending provider configuration. Preferences sync; encouragement is explicitly unavailable. Founder payment stays paused.
- The 15-lesson Web release remains the supported curriculum. Other authored domains need validated tools and Apply contracts before they can be represented as working Web paths.
- Legal pages remain drafts pending the actual legal operator, valid full postal address and publication review. The draft data inventory now includes the newly added companion features.
