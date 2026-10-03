# OpenRouter mentor — free Qwen configuration

Reviewed October 3, 2026. David requested a free route after the commercial Nemotron route returned HTTP 402. Free requests have succeeded with the same key, without buying credit. Gold V2.1 remains unchanged.

## Selected route

- Model: `qwen/qwen3.8-27b:free`, pinned to **ModelRun (Modular)** through OpenRouter.
- Input/output token prices: zero in the live catalog and successful evaluation responses. Both request price ceilings are **0**. No provider/model fallback or paid variant is configured.
- Privacy filters: `data_collection: deny`, `zdr: true`; fail rather than silently weaken them. These routing filters do not promise zero logging at every intermediary.
- Server secret: `OPENROUTER_API_KEY` in Firebase Secret Manager. Never put it in Git, a `VITE_` variable or browser assets.
- Callable: `askT1gerMentor`, authentication required, existing per-account daily limits of 10 ordinary / 50 Pro attempts. OpenRouter also imposes account-wide capacity limits: this key currently reports **50 free requests per UTC day**, shared with other apps using that account. This is a small beta capacity, not unlimited public service.
- Up to eight recent messages, each bounded to 3,000 characters, plus the current bounded question. Output cap 1,200 tokens, provider timeout 40 seconds; concise English/Spanish answers. Hidden reasoning is not returned.
- Only question/history and the mentor instruction go upstream; no account ID, email, profile or lesson evidence is appended. Users must keep sensitive data out of their messages.
- Adults must explicitly confirm 18+ and the current provider disclosure (`openrouter-modelrun-v1`). This is a self-declaration, not age verification; other T1GER access remains 15+.
- Server release switch: `T1GER_MENTOR_READY=true`. Web is enabled by default; `VITE_MENTOR_AVAILABLE=false` pauses its interface. Never enable a new route without its live integration checks.

## Evaluation and selection

This is a bounded synthetic API comparison, **not human learner evidence** or a comprehensive model benchmark. Four fixed cases tested Spanish compounding, an English retrieval question, equal-duration reasoning, and refusal of guaranteed stock advice. Request settings were non-streaming, temperature 0.5, reasoning disabled, maximum 1,200 tokens, zero price ceilings, a pinned provider and privacy filters.

| Candidate | Initial result | Decision |
| --- | --- | --- |
| Qwen3.8 27B / ModelRun | 4/4 HTTP 200; reported cost 0 | Selected as the best fit among the tested eligible routes, subject to the limitations below. |
| Ling 3.1 Flash / Novita | One correct Spanish reply at cost 0; then three HTTP 429 responses | Promising; insufficient successful replies to compare quality fairly. |
| Nemotron 3 Ultra / NVIDIA free endpoint | Three successful earlier internal fictional tests at cost 0 | Excluded from the public route because its endpoint links NVIDIA API Trial Terms restricting production use. |
| Inkling free | Catalog/terms review only | Endpoint is limited to agentic harnesses and logs data for training; unsuitable for this mentor route. |

Initial Qwen answers contained an incorrect extra quiz calculation, gave too much help before asking the question, exceeded the word target, and included an unwanted example asset allocation. The revised instruction asks for checked arithmetic, concise explanation, a single quiz question without an advance solution, and no specific stocks or portfolio allocations even in fictional requests. Rechecks returned correct $100 → $110 → $121 arithmetic, equal 15-year durations, a single 29-word question, and an 84-word refusal of stock recommendations; all successful responses reported cost 0. Some intermediate attempts returned 429. Those are availability failures, not failed reasoning scores. The prompt reduces observed failures but does not guarantee correct or safe future answers.

The mobile development code uses a different free-model chain and local fallbacks. Its first two configured IDs are absent from the current live catalog. Its production callable request does not yet include the new adult/provider consent fields; mobile needs a separate consent integration before claiming this Web release works there. The original mobile source was not edited.

## Integration checks

An empty/truncated reply, provider capacity error or privacy-route rejection preserves the learner's draft and reports unavailability. No credentials or raw provider errors are returned. The Web contract remains `{ text }`; private Firestore conversation persistence remains unchanged. No Firestore rule or curriculum migration is included. Legal notices remain drafts pending the previously identified operator/address/retention details.

```sh
rtk proxy npm.cmd --prefix services/learning run build
rtk proxy node --test services/learning/tests/openRouterMentor.test.mjs
rtk proxy npm.cmd --prefix apps/web run lint
rtk proxy npm.cmd --prefix apps/web run build:subpath
```

The free server route was deployed successfully. Live checks passed with the existing synthetic QA account: unauthenticated calls rejected, missing/stale consent rejected, a 113-word Spanish reply returned the correct $110/$121 balances and $21 growth, one QA conversation saved and reloaded through the Web history query, and another account's history was denied. Web lint/build and three focused server tests passed. Synthetic QA records belong only to that QA account. No human validation findings or mastery claims result from these tests.

## Primary sources

- [Qwen free route and ModelRun pricing](https://openrouter.ai/qwen/qwen3.8-27b:free); [official Qwen model/license](https://huggingface.co/Qwen/Qwen3.8-27B).
- [ModelRun provider](https://openrouter.ai/provider/modelrun), [Modular terms](https://www.modular.com/legal/terms), [privacy](https://www.modular.com/legal/privacy). Reviewed the listed terms for this educational output use; no explicit NVIDIA-style production prohibition was found. This is not a blanket certification of legal compliance, and future endpoint/terms changes require review.
- [Ling free-priced route](https://openrouter.ai/inclusionai/ling-3.1-flash), [Novita terms](https://novita.ai/legal/terms-of-service).
- [OpenRouter terms](https://openrouter.ai/terms), [limits](https://openrouter.ai/docs/api_reference/limits), [provider routing](https://openrouter.ai/docs/guides/routing/provider-selection).
- [NVIDIA API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf); [Inkling free endpoint restrictions](https://openrouter.ai/thinkingmachines/inkling:free).
