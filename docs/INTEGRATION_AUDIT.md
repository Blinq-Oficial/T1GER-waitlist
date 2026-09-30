# Waitlist + Web integration audit

Reviewed 2026-09-29 on `codex/web-waitlist-monorepo`. This review covers repository code, Vercel deployments, production waitlist permissions, and the visible Stripe checkout. No payment was made.

## Keep these boundaries

- The waitlist, its legal pages, Stripe return page, and `/api/*` stay at the domain root. T1GER Web is built into `dist/app` and served at `/app/*`.
- Waitlist membership lives in Supabase. Web accounts and learning progress live in Firebase. A waitlist email or Stripe payment is not yet a Firebase account or Premium entitlement.
- The production Vercel deployment continues to use `main`. This integration stays in a draft PR until the release checks below pass.

## Verified

- The Vercel project had a `vite build` override that omitted the app. Its Build Command is now `npm run build`; the preview serves `/`, `/terms`, `/privacy`, `/early-access/success?demo=1`, `/app/`, and a directly opened `/app/privacy` route.
- The root build emits both `dist/index.html` and `dist/app/index.html`; app assets use `/app/assets/*`.
- The waitlist rejects an invalid email in the browser before submission. A controlled synthetic signup succeeded in Production before the security migration; the same address was recognized after it. The synthetic row was then deleted.
- The Stripe checkout displays a $5 minimum validation. No payment was made.
- Waitlist tests cover signup input, position, and rate limiting. Added checks reject unsigned preview payment events and accept signed Stripe events for verification. Root and web builds, lint, and tests pass locally.

## Changes made in this branch

- Removed an unsigned demo-payment path from the Stripe webhook. Previously, a public preview request could reach the purchase RPC and email flow without a Stripe signature. The static confirmation preview remains available.
- Corrected the purchase email so it distinguishes the first $5 of access from the intended net conservation contribution, and displays cents accurately.
- When Firebase is unavailable, account access fails gracefully. The mobile waitlist is optional, not a Web invitation gate. Local developer setup instructions are not exposed in deployed builds.
- Paused the public Founder checkout CTA because the required purchase RPCs are absent in the inspected production Supabase project. The modal now sends visitors to the free waitlist. A previously shared direct Stripe Payment Link may remain usable.

## Release checks still needed

1. **Isolated test data.** Vercel currently scopes `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `RESEND_API_KEY` to all environments. Use a separate Supabase project and email sandbox for Preview before testing real signup or webhook fulfillment there. The preview has its own `EARLY_ACCESS_DB_TOKEN`, but that alone does not establish data isolation.
2. **Checkout language.** The Stripe Payment Link description promises direct donation of all extra money, guaranteed priority beta entry, and an unconditional refund. The site terms describe net proceeds above $5, priority consideration, and refunds before global launch. Align the Stripe description and reviewed legal terms before launch.
3. **Separate accounts and paid entitlements.** Web signup must not require waitlist membership. Waitlist success links to Web with same-origin email prefill. Before reopening paid checkout, map verified Stripe purchases to Firebase users and grant Premium/Founder benefits idempotently.
4. **Firebase and legal publication.** Configure the browser Firebase values and authorized domain; test sign-in, onboarding, saved progress, and account recovery. Finalize the web privacy/terms drafts and the joint waitlist-to-app data notice.
5. **Safe end-to-end checks.** In isolated Preview, test a new and returning signup, referral attribution, Stripe test-mode payment, signed webhook retry, Resend delivery, and the return page. The Supabase schema and RPC definitions are not in this repository, so idempotency and entitlements cannot be confirmed from code alone.

## Existing limitations to track

- The signup rate limiter uses an in-memory map inside a serverless function; it is not a shared limit across instances.
- An email lookup returns the existing member's position and referral link. Review whether that disclosure is acceptable before expanding the waitlist.
- The app's Firebase bundle is about 701 kB before gzip. Measure actual mobile load time before broad release.

## Production security follow-up (2026-09-29)

- The server-only `/api/join` hotfix was merged to `main`, and `SUPABASE_SECRET_KEY` was added to Vercel Production only. The versioned migration was applied after a controlled signup. The public key now gets HTTP 401 when reading `public.waitlist`; the endpoint still recognizes existing signups.
- SQL metadata confirms `anon` has neither SELECT nor INSERT, `service_role` has both, and the table has zero policies. No customer email values were queried or displayed. The synthetic signup row was deleted, with exactly one row returned.
- The table has only `id`, `created_at`, and `email`; it has unique indexes on `id` and `email`. Referral attribution and stored position are not present.
- Purchase fulfillment depends on database RPCs that were not present in the inspected project. Keep checkout paused until the Stripe endpoint, RPCs, entitlement handoff, and signed test payment are verified.
- Keep the production secret out of Preview and isolate Preview before write tests there. The Web integration PR remains a draft.

## Product sprint follow-up (2026-09-30)

The complete local Web flow, all fifteen lesson players, multi-interest onboarding, themes and mobile-waitlist bridge are implemented. Root/Web lint, tests and builds pass. Actual mobile rules/functions were checked in local Firebase emulators, including owner isolation, reward-write rejection, prerequisites and idempotency. The waitlist bridge used the real API handler with an in-memory adapter, not production Supabase or email delivery. See [the product sprint report](PRODUCT_SPRINT_REPORT.md) for exact test scope.

Before shared public accounts, reconcile Web Psychology's bias/retrieval topics with the mobile snapshot's Stoic curriculum: legacy IDs and state parity do not prove content parity. Confirm production Firebase configuration/provider callbacks/recovery, then finish legal operator/address, retention and teen account handling. Minimum age is 15; supplied contact is `este.t1ger.oficial.app@gmail.com`; Plymouth, Michigan, US is a location, not a complete verified postal address. Keep both legal notices drafts until reviewed.
