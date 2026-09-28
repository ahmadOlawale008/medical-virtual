-- Case-study assessments. A case study is a patient vignette that groups a short
-- set of questions. The vignette is student-visible; the answer key is not.

create table if not exists public.case_studies (
  id uuid primary key default gen_random_uuid(),
  simulation_slug text not null,
  title text not null,
  patient_name text,
  patient_initials text,
  patient_identity text,
  scenario text not null,
  position integer not null default 0,
  published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Kept separate from case_studies so students cannot read the answers directly.
create table if not exists public.case_study_keys (
  case_study_id uuid primary key references public.case_studies(id) on delete cascade,
  hct_value numeric,
  classification text check (classification in ('low', 'normal', 'high')),
  diagnosis text,
  cause text,
  explanation text
);

alter table public.questions
  add column if not exists case_study_id uuid references public.case_studies(id) on delete set null;

alter table public.quizzes
  add column if not exists case_study_id uuid references public.case_studies(id) on delete set null;

create table if not exists public.quiz_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.quiz_attempts(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_option_id uuid references public.question_options(id) on delete set null,
  is_correct boolean not null default false,
  answered_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

alter table public.case_studies enable row level security;
alter table public.case_study_keys enable row level security;
alter table public.quiz_attempt_answers enable row level security;

-- Students may read a case study only when it is published and one of its
-- questions belongs to a published quiz. Mirrors the question visibility rules.
create policy "Students read published case studies"
  on public.case_studies for select using (
    public.is_admin()
    or (
      published = true
      and auth.uid() is not null
      and exists (
        select 1
        from public.questions q
        join public.quiz_questions qq on qq.question_id = q.id
        join public.quizzes qz on qz.id = qq.quiz_id
        where q.case_study_id = case_studies.id and qz.published = true
      )
    )
  );

create policy "Admins manage case studies"
  on public.case_studies for all using (public.is_admin()) with check (public.is_admin());

-- No student policy: the answer key is admin-only by omission.
create policy "Admins manage case study keys"
  on public.case_study_keys for all using (public.is_admin()) with check (public.is_admin());

create policy "Students record answers for own attempts"
  on public.quiz_attempt_answers for insert with check (
    student_id = auth.uid()
    and exists (
      select 1 from public.quiz_attempts a
      where a.id = attempt_id and a.student_id = auth.uid()
    )
  );

create policy "Students read own attempt answers"
  on public.quiz_attempt_answers for select using (student_id = auth.uid() or public.is_admin());

create index if not exists case_studies_simulation_idx
  on public.case_studies (simulation_slug, position);

create index if not exists questions_case_study_idx
  on public.questions (case_study_id);

create index if not exists quizzes_case_study_idx
  on public.quizzes (case_study_id);

create index if not exists quiz_attempt_answers_attempt_idx
  on public.quiz_attempt_answers (attempt_id);

create index if not exists quiz_attempt_answers_question_idx
  on public.quiz_attempt_answers (question_id);
