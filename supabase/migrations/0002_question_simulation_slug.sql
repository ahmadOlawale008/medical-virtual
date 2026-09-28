alter table public.questions
  add column if not exists simulation_slug text;

-- Preserve any questions created with the original category field.
update public.questions
set simulation_slug = category
where simulation_slug is null and category is not null;

create index if not exists questions_simulation_slug_idx
  on public.questions (simulation_slug);
