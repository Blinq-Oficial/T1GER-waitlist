-- Apply only after /api/join uses a server-only SUPABASE_SECRET_KEY in production.
-- The prior anonymous REST lookup and insert will fail after this migration.
begin;

alter table public.waitlist enable row level security;
drop policy if exists "Allow public select" on public.waitlist;
drop policy if exists "Allow public insert" on public.waitlist;
revoke all on table public.waitlist from public, anon, authenticated;
grant select, insert on table public.waitlist to service_role;

commit;
