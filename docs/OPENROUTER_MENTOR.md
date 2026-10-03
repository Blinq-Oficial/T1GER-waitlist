# OpenRouter mentor — commercial Nemotron configuration

Prepared October 3, 2026. David selected a commercial provider after reviewing the free endpoint limitation. Gold V2.1 remains unchanged.

## Selected route

- Model: `nvidia/nemotron-3-ultra-550b-a55b`.
- Hosted provider: **DeepInfra**, pinned through OpenRouter. No provider or model fallback.
- Catalog price: **$0.50 per million input tokens / $2.20 per million output tokens**; input cache reads $0.10/M where applicable. Requests enforce the stated input/output price ceilings.
- Privacy filters: `data_collection: deny`, `zdr: true`. A provider that cannot satisfy them must fail instead of silently weakening the policy.
- Server secret: `OPENROUTER_API_KEY` in Firebase/Google Secret Manager. Never put the credential in a `VITE_` variable, Git or a browser bundle.
- Existing Firebase callable: `askT1gerMentor`, authentication required, 10 requests/day per ordinary account or 50 for an existing Pro account. This is not an aggregate project budget cap.
- Up to eight recent messages, each bounded to 3,000 characters, plus the current bounded question. Output cap 1,200 tokens, 40-second provider timeout, concise answers in English/Spanish.
- Only message/history and the mentor instruction go upstream. No account identifier, email, profile or lesson evidence is appended. User-entered personal data would still be content; the interface warns against it.
- Adult self-declaration and the current provider notice version are required by the server and recorded with daily usage. The checkbox is not verified age. Other T1GER access remains 15+.

## Readiness and outstanding activation

The commercial credit inspection returned zero purchased credits and existing usage. A bounded paid-route request returned **HTTP 402**: credit is required. A successful paid response has not yet been established. Keep `T1GER_MENTOR_READY` and the public `VITE_MENTOR_AVAILABLE` disabled until a controlled paid response and authenticated conversation persistence/reload check pass.

Do not purchase credits or enable automatic recharge on David's behalf. Loading credit or setting a key budget is an OpenRouter account action. The app does not purchase or replenish credit. Per-account quotas and price ceilings do not guarantee a fixed total monthly bill.

An empty/truncated response, exhausted balance, provider capacity error or privacy-route rejection must preserve the question and report unavailability; no credentials or raw provider errors are returned. Response reasoning fields are not sent to the client.

The existing Web contract remains `{ text }`. Client history persistence remains private Firestore `coachingSessions`; no Firestore rules, Gold lesson or curriculum migrations are part of this change. Full legal notices remain drafts pending the already identified operator/address/retention details.

## Evidence

- Live API catalog and key authentication verified; key is valid.
- The prior **free trial** evaluation returned three real API responses: English fictional compounding (145 words), Spanish one-question retrieval (23 words), and refusal to promise a specific investment return (66 words). These are synthetic integration prompts, not human learner evidence or a comprehensive safety evaluation.
- Those free responses do **not** verify the newly selected paid DeepInfra route.
- Commercial route: one bounded synthetic request, HTTP 402, no reply; recorded separately from successful free trial responses.
- The server build and focused checks cover readiness/adult consent, exact paid model/provider, bounded history, price/privacy filters, provider errors and empty/truncated outputs.

```sh
rtk proxy npm.cmd --prefix services/learning run build
rtk proxy node --test services/learning/tests/openRouterMentor.test.mjs
```

## Sources reviewed

- [Commercial model and pricing](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b).
- [Provider routing, privacy and price caps](https://openrouter.ai/docs/guides/routing/provider-selection).
- [DeepInfra terms](https://deepinfra.com/terms), commercial services and customer-data processing, including its retention commitment and listed exceptions.
- [DeepInfra privacy policy](https://deepinfra.com/privacy), including adult scope.
- [OpenRouter terms](https://openrouter.ai/terms), eligibility and model-term flow-down; OpenRouter processing still depends on its terms and account settings, not solely DeepInfra's retention policy.

The [free NVIDIA endpoint](https://openrouter.ai/nvidia/nemotron-3-ultra-550b-a55b:free) links [NVIDIA API Trial Terms](https://assets.ngc.nvidia.com/products/api-catalog/legal/NVIDIA%20API%20Trial%20Terms%20of%20Service.pdf) restricting internal trial use and logging inputs/outputs. It was used only for internal fictional API evaluation and is excluded from the selected commercial route.

No human validation findings, Gold changes or mastery claims result from this provider integration.
