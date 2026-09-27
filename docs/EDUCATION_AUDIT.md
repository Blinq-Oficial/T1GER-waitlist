# T1GER Web education audit — 2026-09-27

## Scope and finding

The web player currently teaches Smart Money lessons 01 and 02. Later Smart Money lessons and the AI/Psychology paths appear in navigation but their web players are unavailable. The mobile curriculum snapshot is a product reference, not proof of independent source review. Its broad source records and `factualReview: approved` flag do not identify which source supports which claim or when it was checked.

The largest gaps found were:

1. **A misleading first tool:** “potential growth not captured” used an unexplained fixed 8% investment return to teach cash and inflation. The web tool now models purchasing power at an explicit 3% inflation and 0% cash interest assumption. It does not assert an investment opportunity cost.
2. **A confounded flagship comparison:** $100 monthly for 20 years versus $200 monthly for 8 years changed both timing and total deposits. The web hook now compares $100 for 20 years with $250 for 8 years: each deposits $24,000. The difference isolates timing inside the stated fixed-rate model.
3. **Invisible evidence and limits:** the lessons had source metadata but no source-specific, learner-visible explanation. Each web lesson now exposes primary sources, the concept they support, model limits, a misconception, and a verification/review date.
4. **Retrieval aimed at slogans:** the first review asked about portfolio performance, which the cited material cannot establish. The web retrieval prompts now test the actual distinction between liquidity and long-term capital, and between timing and total deposits.

## Initial learning graph

| Sequence | Capability | Prerequisite | Evidence | Apply | Retrieve |
| --- | --- | --- | --- | --- | --- |
| 01 Cash loses too | Separate emergency liquidity from long-term goals; estimate buying power under an assumption | None | SEC inflation risk; CFPB emergency reserve guidance | Record a two-purpose cash rule, without moving money | Explain why accessible emergency cash can still be useful |
| 02 Time is the multiplier | Isolate deposit timing in a constant-rate model; state its limits | 01 | SEC compounding calculator and investing introduction | Save a sustainable simulated contribution and review date | Explain why earlier equal-total deposits can model a higher balance |

Machine-readable briefs, source URLs, caveats and dates are in `src/education.ts`. Source wording is not copied into lesson prose. The web layer keeps existing lesson IDs and progress records so it can be reconciled with mobile later.

## Quality gate status

| Gate | 01 | 02 |
| --- | --- | --- |
| Importance and sequence | Pass: liquidity before long-term projection | Pass: follows liquidity decision |
| Source quality and traceability | Two primary public sources checked | Two primary public sources checked |
| Accuracy and uncertainty | 3% inflation / 0% interest explicitly hypothetical | Equal deposits; 8% constant return explicitly hypothetical; fees, taxes, inflation and losses excluded |
| Clarity and interaction | Estimate before reveal; scrub purchasing power by year | Predict before reveal; scrub compounding by year |
| Application | Write a cash-purpose rule | Save a model and review rule |
| Mastery | Explain the distinct job of emergency cash | Explain the effect of timing under controlled assumptions |
| Originality | Original T1GER model and explanation | Original T1GER comparison and explanation |

This is a **curriculum QA pass for the two web lessons**, not proof that investing content is ready for public financial education. Before public release, an independent subject-matter reviewer should check the complete English and Spanish paths, the model math, and real-user comprehension. Signed-in Firebase and mobile parity testing also remains outstanding.

## Next curriculum work

Research risk, diversification, indexing, fees, recurring contributions, and allocation before enabling their web players. Give each concept claim-level sources, prerequisites, model limits, misconceptions, an Apply task and a retrieval item. Repeat for AI and Psychology with source review dates appropriate to those fields. Avoid treating the existing lesson count or ingestion flag as a quality gate.
