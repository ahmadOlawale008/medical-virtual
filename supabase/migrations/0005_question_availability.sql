alter table public.questions
  add column if not exists availability_type text not null default 'all_time',
  add column if not exists available_from date,
  add column if not exists available_until date;

alter table public.questions
  drop constraint if exists questions_availability_type_check;

alter table public.questions
  add constraint questions_availability_type_check
  check (availability_type in ('all_time', 'date_range'));

alter table public.questions
  drop constraint if exists questions_availability_dates_check;

alter table public.questions
  add constraint questions_availability_dates_check
  check (
    availability_type = 'all_time'
    or (available_from is not null and available_until is not null and available_until >= available_from)
  );

create index if not exists questions_availability_idx
  on public.questions (availability_type, available_from, available_until);

drop policy if exists "Students read published questions" on public.questions;
create policy "Students read published questions"
  on public.questions for select
  using (
    public.is_admin()
    or (
      published = true
      and auth.uid() is not null
      and (
        availability_type = 'all_time'
        or (available_from <= current_date and available_until >= current_date)
      )
    )
  );

drop policy if exists "Users read options for visible questions" on public.question_options;
create policy "Users read options for visible questions"
  on public.question_options for select
  using (
    auth.uid() is not null
    and exists (
      select 1 from public.questions q
      where q.id = question_id
        and (
          public.is_admin()
          or (
            q.published = true
            and (
              q.availability_type = 'all_time'
              or (q.available_from <= current_date and q.available_until >= current_date)
            )
          )
        )
    )
  );
