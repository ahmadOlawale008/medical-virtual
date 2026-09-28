-- Create profiles for auth users that existed before the profile trigger was installed.
insert into public.profiles (id, full_name)
select
  id,
  raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (id) do update
set full_name = coalesce(public.profiles.full_name, excluded.full_name);
