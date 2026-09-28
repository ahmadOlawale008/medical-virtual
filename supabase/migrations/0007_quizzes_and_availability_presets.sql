create table if not exists public.availability_presets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  simulation_slug text,
  availability_type text not null default 'all_time',
  available_from date,
  available_until date,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  constraint availability_presets_type_check check (availability_type in ('all_time', 'date_range')),
  constraint availability_presets_dates_check check (
    availability_type = 'all_time'
    or (available_from is not null and available_until is not null and available_until >= available_from)
  )
);

create table if not exists public.quizzes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  simulation_slug text not null,
  description text,
  availability_preset_id uuid references public.availability_presets(id) on delete set null,
  time_limit_seconds integer,
  published boolean not null default false,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quizzes_time_limit_check check (time_limit_seconds is null or time_limit_seconds between 30 and 7200)
);

create table if not exists public.quiz_questions (
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  position integer not null default 0,
  primary key (quiz_id, question_id)
);

alter table public.quiz_attempts
  add column if not exists quiz_id uuid references public.quizzes(id) on delete set null;

alter table public.availability_presets enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;

create policy "Authenticated users read availability presets"
  on public.availability_presets for select using (auth.uid() is not null);
create policy "Admins manage availability presets"
  on public.availability_presets for all using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated users read published quizzes"
  on public.quizzes for select using (
    public.is_admin() or (
      auth.uid() is not null and published = true and (
        availability_preset_id is null or exists (
          select 1 from public.availability_presets p
          where p.id = availability_preset_id
            and (p.availability_type = 'all_time' or (p.available_from <= current_date and p.available_until >= current_date))
        )
      )
    )
  );
create policy "Admins manage quizzes"
  on public.quizzes for all using (public.is_admin()) with check (public.is_admin());
create policy "Authenticated users read questions in published quizzes"
  on public.quiz_questions for select using (
    auth.uid() is not null and exists (
      select 1 from public.quizzes q
      where q.id = quiz_id and (public.is_admin() or q.published = true)
    )
  );
create policy "Admins manage quiz questions"
  on public.quiz_questions for all using (public.is_admin()) with check (public.is_admin());

-- A published question attached to an active quiz is visible even if it uses the
-- legacy question-level availability fields. Quiz availability is now authoritative.
drop policy if exists "Students read published questions" on public.questions;
create policy "Students read published questions"
  on public.questions for select using (
    public.is_admin()
    or (
      published = true and auth.uid() is not null and (
        availability_type = 'all_time'
        or (available_from <= current_date and available_until >= current_date)
        or exists (
          select 1 from public.quiz_questions qq
          join public.quizzes qz on qz.id = qq.quiz_id
          where qq.question_id = questions.id and qz.published = true
        )
      )
    )
  );

drop policy if exists "Users read options for visible questions" on public.question_options;
create policy "Users read options for visible questions"
  on public.question_options for select using (
    auth.uid() is not null and exists (
      select 1 from public.questions q
      where q.id = question_id and (
        public.is_admin() or (
          q.published = true and (
            q.availability_type = 'all_time'
            or (q.available_from <= current_date and q.available_until >= current_date)
            or exists (
              select 1 from public.quiz_questions qq
              join public.quizzes qz on qz.id = qq.quiz_id
              where qq.question_id = q.id and qz.published = true
            )
          )
        )
      )
    )
  );

create index if not exists quizzes_simulation_idx on public.quizzes (simulation_slug);
create index if not exists quiz_questions_question_idx on public.quiz_questions (question_id);
create index if not exists quiz_attempts_quiz_idx on public.quiz_attempts (quiz_id);

-- Preserve the current question-bank experience by creating one draft quiz per simulation.
with simulations as (
  select distinct simulation_slug from public.questions where simulation_slug is not null
), inserted as (
  insert into public.quizzes (title, simulation_slug, published)
  select 'General quiz', simulation_slug, true from simulations
  where not exists (
    select 1 from public.quizzes q
    where q.simulation_slug = simulations.simulation_slug and q.title = 'General quiz'
  )
  returning id, simulation_slug
)
insert into public.quiz_questions (quiz_id, question_id, position)
select qz.id, q.id, row_number() over (partition by qz.id order by q.created_at) - 1
from public.quizzes qz
join public.questions q on q.simulation_slug = qz.simulation_slug
where qz.title = 'General quiz'
on conflict (quiz_id, question_id) do nothing;
