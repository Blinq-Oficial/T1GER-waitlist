begin;

create table if not exists public.waitlist_rate_limits (
  key text primary key,
  window_started timestamptz not null default now(),
  attempts integer not null default 1
);
create table if not exists public.waitlist_email_outbox (
  id bigint generated always as identity primary key,
  email text not null unique,
  position bigint not null,
  ref_code text not null,
  status text not null default 'pending' check (status in ('pending','sending','accepted','failed','ambiguous')),
  attempts integer not null default 0,
  first_attempt_at timestamptz,
  lease_until timestamptz,
  next_attempt_at timestamptz not null default now(),
  accepted_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.waitlist_rate_limits enable row level security;
alter table public.waitlist_email_outbox enable row level security;
revoke all on public.waitlist_rate_limits, public.waitlist_email_outbox from anon, authenticated;
grant all on public.waitlist_rate_limits, public.waitlist_email_outbox to service_role;
grant usage, select on sequence public.waitlist_email_outbox_id_seq to service_role;
create index if not exists waitlist_outbox_due on public.waitlist_email_outbox(status,next_attempt_at);

create or replace function public.consume_waitlist_limit(p_key text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare result integer;
begin
  if length(p_key) != 64 then raise exception 'Invalid limit key'; end if;
  insert into public.waitlist_rate_limits as r(key) values(p_key)
  on conflict(key) do update set
    attempts = case when r.window_started < now()-interval '10 minutes' then 1 else r.attempts+1 end,
    window_started = case when r.window_started < now()-interval '10 minutes' then now() else r.window_started end
  returning attempts into result;
  return result <= 10;
end;
$$;

create or replace function public.queue_waitlist_welcome()
returns trigger language plpgsql security definer set search_path = '' as $$
declare data jsonb := to_jsonb(new); pos bigint;
begin
  pos := coalesce(nullif(data->>'position',''),data->>'id')::bigint;
  insert into public.waitlist_email_outbox(email,position,ref_code)
    values(lower(trim(data->>'email')),pos,coalesce(nullif(data->>'ref_code',''),'T1GER-'||pos::text))
    on conflict(email) do nothing;
  return new;
end;
$$;
do $$ begin
  if not exists (select 1 from pg_trigger where tgname='t1ger_waitlist_welcome' and tgrelid='public.waitlist'::regclass) then
    create trigger t1ger_waitlist_welcome after insert on public.waitlist for each row execute function public.queue_waitlist_welcome();
  end if;
end $$;

create or replace function public.claim_waitlist_email(p_email text default null)
returns setof public.waitlist_email_outbox language plpgsql security definer set search_path = '' as $$
declare candidate public.waitlist_email_outbox;
begin
  select * into candidate from public.waitlist_email_outbox
  where (p_email is null or email=p_email) and status in ('pending','sending')
    and next_attempt_at<=now() and (lease_until is null or lease_until<now())
  order by next_attempt_at,id for update skip locked limit 1;
  if not found then return; end if;
  if candidate.first_attempt_at < now()-interval '23 hours' then
    update public.waitlist_email_outbox set status='ambiguous',lease_until=null where id=candidate.id;
    return;
  end if;
  return query update public.waitlist_email_outbox set status='sending',attempts=attempts+1,
    first_attempt_at=coalesce(first_attempt_at,now()),lease_until=now()+interval '2 minutes'
    where id=candidate.id returning *;
end;
$$;
create or replace function public.finish_waitlist_email(p_id bigint,p_accepted boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.waitlist_email_outbox set
    status=case when p_accepted then 'accepted' when attempts>=5 then 'failed' else 'pending' end,
    accepted_at=case when p_accepted then now() else accepted_at end,
    lease_until=null,next_attempt_at=now()+interval '15 minutes'
  where id=p_id and status='sending';
end;
$$;

revoke all on function public.consume_waitlist_limit(text), public.queue_waitlist_welcome(), public.claim_waitlist_email(text), public.finish_waitlist_email(bigint,boolean) from public,anon,authenticated;
grant execute on function public.consume_waitlist_limit(text), public.claim_waitlist_email(text), public.finish_waitlist_email(bigint,boolean) to service_role;
commit;
