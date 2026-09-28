alter table public.quiz_attempts
  add column if not exists status text not null default 'in_progress',
  add column if not exists exit_reason text,
  add column if not exists left_at timestamptz;

alter table public.quiz_attempts
  drop constraint if exists quiz_attempts_status_check;

alter table public.quiz_attempts
  add constraint quiz_attempts_status_check
  check (status in ('in_progress', 'completed', 'left_page'));

update public.quiz_attempts
set status = 'completed'
where submitted_at is not null and status = 'in_progress';

create index if not exists quiz_attempts_status_idx
  on public.quiz_attempts (status);
