-- Quiz availability is now authoritative. Keep question visibility limited to
-- published questions that are attached to a published quiz.
drop policy if exists "Students read published questions" on public.questions;
create policy "Students read published questions"
  on public.questions for select using (
    public.is_admin()
    or (
      published = true
      and auth.uid() is not null
      and exists (
        select 1
        from public.quiz_questions qq
        join public.quizzes qz on qz.id = qq.quiz_id
        where qq.question_id = questions.id and qz.published = true
      )
    )
  );

drop policy if exists "Users read options for visible questions" on public.question_options;
create policy "Users read options for visible questions"
  on public.question_options for select using (
    auth.uid() is not null
    and exists (
      select 1
      from public.questions q
      where q.id = question_id
        and (
          public.is_admin()
          or (
            q.published = true
            and exists (
              select 1
              from public.quiz_questions qq
              join public.quizzes qz on qz.id = qq.quiz_id
              where qq.question_id = q.id and qz.published = true
            )
          )
        )
    )
  );

drop index if exists public.questions_availability_idx;
alter table public.questions
  drop constraint if exists questions_availability_dates_check,
  drop constraint if exists questions_availability_type_check,
  drop column if exists availability_type,
  drop column if exists available_from,
  drop column if exists available_until;
