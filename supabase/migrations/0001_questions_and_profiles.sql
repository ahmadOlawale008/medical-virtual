create table if not exists public.profiles (id uuid primary key references auth.users(id) on delete cascade, full_name text, role text not null default 'student' check (role in ('student', 'admin')), created_at timestamptz not null default now());
create table if not exists public.questions (id uuid primary key default gen_random_uuid(), text text not null, explanation text, category text, created_by uuid references public.profiles(id), published boolean not null default false, created_at timestamptz not null default now());
create table if not exists public.question_options (id uuid primary key default gen_random_uuid(), question_id uuid not null references public.questions(id) on delete cascade, option_text text not null, is_correct boolean not null default false);
create table if not exists public.student_answers (id uuid primary key default gen_random_uuid(), student_id uuid not null references public.profiles(id) on delete cascade, question_id uuid not null references public.questions(id) on delete cascade, selected_option_id uuid references public.question_options(id), is_correct boolean not null default false, answered_at timestamptz not null default now(), unique (student_id, question_id));

alter table public.profiles enable row level security;
alter table public.questions enable row level security;
alter table public.question_options enable row level security;
alter table public.student_answers enable row level security;

create or replace function public.is_admin() returns boolean language sql security definer set search_path = public stable as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'); $$;
create policy "Users read own profile" on public.profiles for select using (id = auth.uid());
create policy "Students read published questions" on public.questions for select using (published = true and auth.uid() is not null or public.is_admin());
create policy "Admins manage questions" on public.questions for all using (public.is_admin()) with check (public.is_admin());
create policy "Users read options for visible questions" on public.question_options for select using (auth.uid() is not null and exists (select 1 from public.questions q where q.id = question_id and (q.published = true or public.is_admin())));
create policy "Admins manage options" on public.question_options for all using (public.is_admin()) with check (public.is_admin());
create policy "Students manage own answers" on public.student_answers for all using (student_id = auth.uid()) with check (student_id = auth.uid());
create policy "Admins read answers" on public.student_answers for select using (public.is_admin());

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id, full_name) values (new.id, new.raw_user_meta_data ->> 'full_name'); return new; end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
