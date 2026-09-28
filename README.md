# T1GER Web

Production landing page and waitlist flow for [t1ger.app](https://t1ger.app/), plus the learning web app under `/app`. T1GER turns investing lessons into daily real-world missions, proof of work, and consistent action.

## Repository layout

- `/` is the existing Vite landing page and Vercel API. Its waitlist, payment, and email flows remain in place.
- `apps/web/` is the learning app, imported with its Git history. It retains its own lockfile and tests.
- `npm run build` creates `dist/index.html` for the landing page and `dist/app/index.html` for the learning app. Vercel serves real `/app/assets/*` files and rewrites other `/app/*` routes to the learning app entry point.

The two frontends share a repository and domain, **not an account database**. The waitlist uses Supabase and Stripe; the learning app uses Firebase Auth, Firestore, and the existing T1GER mobile backend. An email on the waitlist is not automatically a Firebase account or a Premium entitlement. A verified invitation and entitlement sync must be designed before claiming one unified member journey. The two legal notices also cover different data flows and need joint review before public launch.

## Local development

```bash
npm install
npm ci --prefix apps/web
npm run dev
npm --prefix apps/web run dev
```

Copy `.env.example` to `.env.local` and provide the server-side values needed for waitlist email and Stripe fulfillment.

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

`/api/join` is the only public waitlist signup endpoint. Existing members are returned idempotently without sending duplicate welcome emails. Referral links currently record attribution and do not change waitlist position.

## Deployment

Vercel deploys the tracked application from `main`. Configure the server-only variables in `.env.example` and the browser Firebase variables in `apps/web/.env.example` on the existing Vercel project. Register `/api/stripe-webhook` as the Stripe webhook target, and keep the Payment Link return URL pointed at `/early-access/success`. The app requires the existing Firebase project's authorized `t1ger.app` domain for sign-in. Do not merge the `/app` route into production until Firebase sign-in, Apply persistence, legal text, and waitlist-to-account handoff have been verified on a safe test environment.

The Vercel project's **Build Command** must be `npm run build`, with **Output Directory** set to `dist`. Its previous `vite build` override built only the landing page, leaving `/app` unavailable. The existing project's Build Command was updated for preview deployments; the production deployment remains on `main` until this branch is merged.
