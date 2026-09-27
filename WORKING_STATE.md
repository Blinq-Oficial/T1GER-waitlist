CURRENT_PHASE: Web Alpha verification

COMPLETED: New React/TypeScript web client; canonical mobile curriculum/progression snapshot; existing Firebase Auth/Firestore/Functions integration; responsive Learn, Discover, Apply, Master, Profile; Investing lessons 01 and 02 with six stages; full no-write flagship lesson preview; FSRS parity tests; build and visual checks at 320px and desktop.

BLOCKED: Signed-in end-to-end and cross-device verification need a safe T1GER test account or running Firebase emulators. No production user data was modified. Preview deployment target has not been selected.

NEXT: Run a test account through lesson 01 then “Time is the multiplier”; confirm mobile reads the resulting mission, reward, brain state, and FSRS card; add the remaining Investing players; then AI and Psychology players.

DECISIONS: Vite/React/TypeScript for a focused authenticated client; Firebase Hosting config prepared; mobile pure modules copied at `e7abadf96a9d636dd4ce2fe9c4b06ad72b7e77ad` rather than a risky mobile refactor; server callable remains the authority for Apply rewards; no AI or payment implementation added to the initial lesson loop.
