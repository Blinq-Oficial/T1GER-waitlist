# T1GER Web

Landing page and mobile waitlist for [t1ger.app](https://t1ger.app/), plus the learning web app under `/app`. T1GER offers Investing, AI and Psychology through lessons, saved tools and memory reviews.

## Repository layout

- `/` is the existing Vite landing page and Vercel API. The waitlist remains in place; payment fulfillment needs the database RPCs listed in the integration audit.
- `apps/web/` is the learning app, imported with its Git history. It retains its own lockfile and tests.
- `npm run build` creates `dist/index.html` for the landing page and `dist/app/index.html` for the learning app. Vercel serves real `/app/assets/*` files and rewrites other `/app/*` routes to the learning app entry point.

The two frontends share a repository and domain, **not an account database**. The mobile waitlist uses Supabase; learning accounts use Firebase. Joining the waitlist is optional and does not create a learning account or Premium entitlement. Success links to Web and prefills the email through same-origin session storage, not a URL. Founder checkout remains paused. Both legal notices remain drafts pending review.

See [the current design and release review](docs/DESIGN_REVIEW.md), [the integration audit](docs/INTEGRATION_AUDIT.md) and [the earlier product sprint report](docs/PRODUCT_SPRINT_REPORT.md) for evidence and limits.

## Local development

```bash
npm install
npm ci --prefix apps/web
npm run dev
npm --prefix apps/web run dev
```

Copy `.env.example` to `.env.local` for server values and `apps/web/.env.example` to `apps/web/.env.local` for Firebase browser configuration. Root development proxies `/app` to local Web; set `T1GER_WEB_DEV_TARGET` if its port differs from 5174. `/api` is not proxied to production by default: use `T1GER_API_DEV_TARGET` with an isolated API for signup tests.

## Verification

```bash
npm test
npm run test:web
npm run lint
npm run lint:web
npm run build
npm audit
```

The waitlist test suite covers signup normalization, stable position fallbacks, and API rate limiting. The web suite checks projections and learning-state parity. Each frontend has its own lint command. The build installs the web dependencies with `npm ci --prefix apps/web` before compiling both sites.

## Production architecture

- React 19 + Vite frontend
- Vercel serverless functions under `api/`
- Supabase waitlist persistence
- Resend transactional email
- Stripe Payment Link + signed webhook fulfillment
- Vercel Web Analytics and Speed Insights

`/api/join` is the only public waitlist signup endpoint. Existing members are returned idempotently without sending duplicate welcome emails. Referral links can be shared, but the current database does not record referral attribution.

## Deployment

Vercel deploys from `main` with `npm run build` and output `dist`. Keep existing server-only waitlist variables in place. The public Firebase browser SDK config falls back to the pinned T1GER project only on `t1ger.app`; explicit `VITE_FIREBASE_*` values override it. Preview hosts require their own isolated configuration and do not default to production. Firebase Auth authorizes `t1ger.app`. The independent Web completion function and scoped rules are described in [services/learning](services/learning/README.md). Founder payments remain paused; do not reopen them until fulfillment and the existing Payment Link/webhook have been verified.

For the waitlist security migration, configure `SUPABASE_SECRET_KEY` for Production only, deploy the matching server API, verify that `/api/join` works, then apply `supabase/migrations/20260929_secure_waitlist.sql` and verify anonymous reads are denied. Configure a separate Supabase project and secret for Preview before testing signups there. Never publish the secret key or put it in a `VITE_` variable.

The Vercel project's **Build Command** must be `npm run build`, with **Output Directory** set to `dist`. Its previous `vite build` override built only the landing page, leaving `/app` unavailable. The existing project uses the combined Build Command. The release must be verified at both `/` and a directly opened `/app/*` route.
