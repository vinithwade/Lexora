-- =====================================================================
-- Lexora — fix script for "permission denied for table profiles"
--
-- Run this in Supabase Dashboard → SQL Editor → New query → Run.
-- Safe to re-run any number of times.
--
-- It assumes the main schema.sql has already been run. If you're not
-- sure, run schema.sql first (it's idempotent), then this file.
-- =====================================================================

-- 1. Make sure the basic GRANTs exist for the API roles.
-- Supabase normally sets these up automatically, but if they got revoked
-- or never applied, every query hits "permission denied".
grant usage on schema public to anon, authenticated, service_role;

grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.tasks    to authenticated;
grant select, insert, update, delete on public.meetings to authenticated;
grant select, insert, update, delete on public.streaks  to authenticated;
grant select, insert, update, delete on public.messages to authenticated;

-- service_role should have full access (bypasses RLS) for our admin client
grant all on public.profiles, public.tasks, public.meetings,
            public.streaks,  public.messages to service_role;

-- 2. Recreate the RLS policies with explicit WITH CHECK clauses
-- (some Postgres versions are stricter about UPDATE policies needing both).
drop policy if exists "profiles_select_own" on public.profiles;
drop policy if exists "profiles_update_own" on public.profiles;
drop policy if exists "profiles_insert_own" on public.profiles;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "streaks_select_own" on public.streaks;
drop policy if exists "streaks_update_own" on public.streaks;
drop policy if exists "streaks_insert_own" on public.streaks;

create policy "streaks_select_own" on public.streaks
  for select using (auth.uid() = user_id);
create policy "streaks_update_own" on public.streaks
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "streaks_insert_own" on public.streaks
  for insert with check (auth.uid() = user_id);

-- 3. Backfill profile + streak rows for any existing auth.users who don't
-- have them yet (e.g. a Google sign-up where the trigger didn't fire,
-- or accounts created before the trigger existed).
insert into public.profiles (id, email, full_name)
select u.id,
       u.email,
       coalesce(u.raw_user_meta_data->>'full_name',
                u.raw_user_meta_data->>'name',
                '')
from   auth.users u
left   join public.profiles p on p.id = u.id
where  p.id is null;

insert into public.streaks (user_id)
select u.id
from   auth.users u
left   join public.streaks s on s.user_id = u.id
where  s.user_id is null;

-- 4. Re-create the trigger (in case it got dropped).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id,
          new.email,
          coalesce(new.raw_user_meta_data->>'full_name',
                   new.raw_user_meta_data->>'name',
                   ''))
  on conflict (id) do nothing;

  insert into public.streaks (user_id) values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Tell PostgREST to reload its schema cache (so new GRANTs are picked up immediately).
notify pgrst, 'reload schema';
