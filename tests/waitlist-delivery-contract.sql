-- Run after the migration. Fixtures roll back; the real waitlist and its ID sequence are untouched.
begin;
create temporary table t1ger_queue_fixture(id bigint, email text, created_at timestamptz);
alter table t1ger_queue_fixture enable row level security;
create trigger fixture_queue after insert on t1ger_queue_fixture for each row execute function public.queue_waitlist_welcome();
insert into t1ger_queue_fixture values(987654321,'outbox-contract@example.invalid',now());
do $$
declare job public.waitlist_email_outbox; count_claims integer; limited boolean;
begin
  if has_table_privilege('anon','public.waitlist_email_outbox','SELECT')
    or has_table_privilege('authenticated','public.waitlist_email_outbox','SELECT')
    or has_function_privilege('anon','public.claim_waitlist_email(text)','EXECUTE') then
    raise exception 'Outbox permissions are public';
  end if;
  select * into job from public.claim_waitlist_email('outbox-contract@example.invalid');
  if job.position != 987654321 or job.attempts != 1 then raise exception 'Job was not queued and claimed'; end if;
  select count(*) into count_claims from public.claim_waitlist_email('outbox-contract@example.invalid');
  if count_claims != 0 then raise exception 'Concurrent claim succeeded'; end if;
  perform public.finish_waitlist_email(job.id,false);
  if (select status from public.waitlist_email_outbox where id=job.id) != 'pending' then raise exception 'Retry was lost'; end if;
  update public.waitlist_email_outbox set next_attempt_at=now() where id=job.id;
  select * into job from public.claim_waitlist_email('outbox-contract@example.invalid');
  perform public.finish_waitlist_email(job.id,true);
  if (select status from public.waitlist_email_outbox where id=job.id) != 'accepted' then raise exception 'Acceptance was not recorded'; end if;
  for i in 1..10 loop
    limited:=public.consume_waitlist_limit(repeat('f',64));
    if not limited then raise exception 'Limit blocked before ten requests'; end if;
  end loop;
  if public.consume_waitlist_limit(repeat('f',64)) then raise exception 'Eleventh request accepted'; end if;
end $$;
rollback;
select 'PASS: queued, exclusive claim, retry, acceptance, private permissions and shared rate limit; fixtures rolled back' as result;
