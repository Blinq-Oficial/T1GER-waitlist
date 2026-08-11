# T1GER Waitlist

Production landing page and waitlist flow for [t1ger.app](https://t1ger.app/). T1GER turns investing lessons into daily real-world missions, proof of work, and consistent action.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide the server-side values needed for waitlist email and Stripe fulfillment.

## Verification

```bash
npm test
npm run lint
npm run build
npm audit
```

The test suite covers signup normalization, stable position fallbacks, and API rate limiting. ESLint checks both the React application and Vercel serverless API files.

## Production architecture

- React 19 + Vite frontend
- Vercel serverless functions under `api/`
- Supabase waitlist persistence
- Resend transactional email
- Stripe Payment Link + signed webhook fulfillment
- Vercel Web Analytics and Speed Insights

`/api/join` is the only public waitlist signup endpoint. Existing members are returned idempotently without sending duplicate welcome emails. Referral links currently record attribution and do not change waitlist position.

## Deployment

Vercel deploys the tracked application from `main`. Configure the variables in `.env.example`, register `/api/stripe-webhook` as the Stripe webhook target, and keep the Payment Link return URL pointed at `/early-access/success`.
