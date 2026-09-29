# Waitlist + Web integration audit

Reviewed 2026-09-28 on `codex/web-waitlist-monorepo`. This review covers repository code, the Vercel preview, and the visible Stripe checkout. It does not include a real signup or payment.

## Keep these boundaries

- The waitlist, its legal pages, Stripe return page, and `/api/*` stay at the domain root. T1GER Web is built into `dist/app` and served at `/app/*`.
- Waitlist membership lives in Supabase. Web accounts and learning progress live in Firebase. A waitlist email or Stripe payment is not yet a Firebase account or Premium entitlement.
- The production Vercel deployment continues to use `main`. This integration stays in a draft PR until the release checks below pass.

## Verified

- The Vercel project had a `vite build` override that omitted the app. Its Build Command is now `npm run build`; the preview serves `/`, `/terms`, `/privacy`, `/early-access/success?demo=1`, `/app/`, and a directly opened `/app/privacy` route.
- The root build emits both `dist/index.html` and `dist/app/index.html`; app assets use `/app/assets/*`.
- The waitlist rejects an invalid email in the browser before submission. No real address was submitted during this audit.
- The Stripe checkout displays a $5 minimum validation. No payment was made.
- Waitlist tests cover signup input, position, and rate limiting. Added checks reject unsigned preview payment events and accept signed Stripe events for verification. Root and web builds, lint, and tests pass locally.

## Changes made in this branch

- Removed an unsigned demo-payment path from the Stripe webhook. Previously, a public preview request could reach the purchase RPC and email flow without a Stripe signature. The static confirmation preview remains available.
- Corrected the purchase email so it distinguishes the first $5 of access from the intended net conservation contribution, and displays cents accurately.
- When Firebase is unavailable in a deployed app, the account screen points visitors back to the waitlist instead of exposing local developer setup instructions.
- Clarified the Founder modal copy: $5 reserves benefits; it does not immediately open the beta.

## Release checks still needed

1. **Isolated test data.** Vercel currently scopes `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `RESEND_API_KEY` to all environments. Use a separate Supabase project and email sandbox for Preview before testing real signup or webhook fulfillment there. The preview has its own `EARLY_ACCESS_DB_TOKEN`, but that alone does not establish data isolation.
2. **Checkout language.** The Stripe Payment Link description promises direct donation of all extra money, guaranteed priority beta entry, and an unconditional refund. The site terms describe net proceeds above $5, priority consideration, and refunds before global launch. Align the Stripe description and reviewed legal terms before launch.
3. **Invite and entitlement handoff.** Verify a waitlist address before granting Firebase signup access. Map Stripe purchases to the verified Firebase user and grant Premium/Founder benefits idempotently. Keep the waitlist path available until this is tested.
4. **Firebase and legal publication.** Configure the browser Firebase values and authorized domain; test sign-in, onboarding, saved progress, and account recovery. Finalize the web privacy/terms drafts and the joint waitlist-to-app data notice.
5. **Safe end-to-end checks.** In isolated Preview, test a new and returning signup, referral attribution, Stripe test-mode payment, signed webhook retry, Resend delivery, and the return page. The Supabase schema and RPC definitions are not in this repository, so idempotency and entitlements cannot be confirmed from code alone.

## Existing limitations to track

- The signup rate limiter uses an in-memory map inside a serverless function; it is not a shared limit across instances.
- An email lookup returns the existing member's position and referral link. Review whether that disclosure is acceptable before expanding the waitlist.
- The app's Firebase bundle is about 701 kB before gzip. Measure actual mobile load time before broad release.

## Database handoff follow-up (2026-09-29)

- Production waitlist grants and policies need tightening before this branch can be released. The repository includes a staged migration; no customer rows were queried during this follow-up.
- The table has only `id`, `created_at`, and `email`; it has unique indexes on `id` and `email`. Referral attribution and stored position are not present.
- Purchase fulfillment depends on database RPCs that were not present in the inspected project. Confirm the Stripe endpoint and fulfillment path before promising automatic Founder delivery.
- The PR now prepares server-only Supabase access for `/api/join` and a versioned migration to remove anonymous table access. Configure a project-specific `SUPABASE_SECRET_KEY` in Vercel, deploy the matching API, and only then apply the migration. Never set a production secret in Preview; isolate Preview first. Verify signup and anonymous denial immediately after migration.
