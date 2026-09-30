# T1GER Web

Landing page and mobile waitlist for [t1ger.app](https://t1ger.app/), plus the learning web app under `/app`. T1GER offers Investing, AI and Psychology through lessons, saved tools and memory reviews.

## Repository layout

- `/` is the existing Vite landing page and Vercel API. The waitlist remains in place; payment fulfillment needs the database RPCs listed in the integration audit.
- `apps/web/` is the learning app, imported with its Git history. It retains its own lockfile and tests.
- `npm run build` creates `dist/index.html` for the landing page and `dist/app/index.html` for the learning app. Vercel serves real `/app/assets/*` files and rewrites other `/app/*` routes to the learning app entry point.

The two frontends share a repository and domain, **not an account database**. The mobile waitlist uses Supabase; learning accounts use Firebase. Joining the waitlist is optional and does not create a learning account or Premium entitlement. Success links to Web and prefills the email through same-origin session storage, not a URL. Founder checkout remains paused. Both legal notices remain drafts pending review.

See [the integration audit](docs/INTEGRATION_AUDIT.md) and [the product sprint report](docs/PRODUCT_SPRINT_REPORT.md) for verified flows and release checks.

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

Vercel deploys the tracked application from `main`. Configure the server-only variables in `.env.example` and the browser Firebase variables in `apps/web/.env.example` on the existing Vercel project. Register `/api/stripe-webhook` as the Stripe webhook target, and keep the Payment Link return URL pointed at `/early-access/success`. The app requires the existing Firebase project's authorized `t1ger.app` domain for sign-in. Do not merge the `/app` route into production until Firebase sign-in, Apply persistence, legal text, and waitlist-to-account handoff have been verified on a safe test environment.

For the waitlist security migration, configure `SUPABASE_SECRET_KEY` for Production only, deploy the matching server API, verify that `/api/join` works, then apply `supabase/migrations/20260929_secure_waitlist.sql` and verify anonymous reads are denied. Configure a separate Supabase project and secret for Preview before testing signups there. Never publish the secret key or put it in a `VITE_` variable.

The Vercel project's **Build Command** must be `npm run build`, with **Output Directory** set to `dist`. Its previous `vite build` override built only the landing page, leaving `/app` unavailable. The existing project's Build Command was updated for preview deployments; the production deployment remains on `main` until this branch is merged.
