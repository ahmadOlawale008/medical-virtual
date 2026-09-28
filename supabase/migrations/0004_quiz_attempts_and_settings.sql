create table if not exists public.simulation_quiz_settings (
  simulation_slug text primary key,
  time_limit_seconds integer,
  updated_by uuid references public.profiles(id),
  updated_at timestamptz not null default now(),
  constraint quiz_time_limit_valid check (time_limit_seconds is null or time_limit_seconds between 30 and 7200)
);

create table if not exists public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  simulation_slug text not null,
  score integer not null default 0,
  total_questions integer not null default 0,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  duration_seconds integer,
  created_at timestamptz not null default now()
);

alter table public.simulation_quiz_settings enable row level security;
alter table public.quiz_attempts enable row level security;

create policy "Authenticated users read quiz settings"
  on public.simulation_quiz_settings for select
  using (auth.uid() is not null);

create policy "Admins manage quiz settings"
  on public.simulation_quiz_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Students create own quiz attempts"
  on public.quiz_attempts for insert
  with check (student_id = auth.uid());

create policy "Students update own quiz attempts"
  on public.quiz_attempts for update
  using (student_id = auth.uid())
  with check (student_id = auth.uid());

create policy "Students read own quiz attempts"
  on public.quiz_attempts for select
  using (student_id = auth.uid() or public.is_admin());

create policy "Admins read all quiz attempts"
  on public.quiz_attempts for select
  using (public.is_admin());

create index if not exists quiz_attempts_simulation_idx
  on public.quiz_attempts (simulation_slug);

create index if not exists quiz_attempts_student_idx
  on public.quiz_attempts (student_id);
