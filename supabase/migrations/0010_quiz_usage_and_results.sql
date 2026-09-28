alter table public.quizzes
  add column if not exists one_time_use boolean not null default false,
  add column if not exists show_result_after_submit boolean not null default true;
