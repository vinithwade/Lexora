-- =====================================================================
-- Lexora — full Supabase schema
-- Paste this entire file into Supabase Dashboard → SQL Editor → "+ New
-- query", then click Run. Safe to re-run (uses IF NOT EXISTS).
-- =====================================================================

-- Required extensions
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- profiles  (1:1 with auth.users — onboarding state, meeting times, TZ)
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  full_name       text,
  email           text,
  timezone        text not null default 'UTC',          -- IANA, e.g. Asia/Kolkata
  morning_time    time not null default '09:00',        -- local time
  evening_time    time not null default '19:00',        -- local time
  notif_email     boolean not null default true,
  push_subscription jsonb,                              -- web push (later)
  onboarded       boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- meetings  (one row per AI meet — morning or evening)
-- ---------------------------------------------------------------------
create table if not exists public.meetings (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  type            text not null check (type in ('morning','evening')),
  status          text not null default 'in_progress'
                    check (status in ('in_progress','completed','abandoned')),
  meeting_date    date not null,                        -- the user's local date
  started_at      timestamptz not null default now(),
  ended_at        timestamptz,
  transcript      text,                                 -- final transcript
  summary         text,                                 -- AI summary
  completion_pct  int                                   -- 0–100, evening only
);
create index if not exists meetings_user_date_idx on public.meetings(user_id, meeting_date);

-- ---------------------------------------------------------------------
-- tasks  (created in morning meet, updated in evening meet)
-- ---------------------------------------------------------------------
create table if not exists public.tasks (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  meeting_id      uuid references public.meetings(id) on delete set null,
  task_date       date not null,                        -- the day this task is for
  title           text not null,
  notes           text,
  status          text not null default 'pending'
                    check (status in ('pending','done','skipped')),
  created_at      timestamptz not null default now(),
  completed_at    timestamptz
);
create index if not exists tasks_user_date_idx on public.tasks(user_id, task_date);

-- ---------------------------------------------------------------------
-- streaks  (1:1 with user)
-- ---------------------------------------------------------------------
create table if not exists public.streaks (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  current_streak      int not null default 0,
  longest_streak      int not null default 0,
  last_completed_date date,
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- messages  (turn-by-turn transcript inside a meeting)
-- ---------------------------------------------------------------------
create table if not exists public.messages (
  id              uuid primary key default uuid_generate_v4(),
  meeting_id      uuid not null references public.meetings(id) on delete cascade,
  role            text not null check (role in ('user','assistant','system')),
  content         text not null,
  created_at      timestamptz not null default now()
);
create index if not exists messages_meeting_idx on public.messages(meeting_id, created_at);

-- =====================================================================
-- Trigger: auto-create profile + streak row when a user signs up
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
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

-- =====================================================================
-- Row-Level Security — every table is per-user
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.meetings enable row level security;
alter table public.tasks    enable row level security;
alter table public.streaks  enable row level security;
alter table public.messages enable row level security;

-- profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- meetings
drop policy if exists "meetings_all_own" on public.meetings;
create policy "meetings_all_own" on public.meetings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- tasks
drop policy if exists "tasks_all_own" on public.tasks;
create policy "tasks_all_own" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- streaks
drop policy if exists "streaks_select_own" on public.streaks;
create policy "streaks_select_own" on public.streaks
  for select using (auth.uid() = user_id);
drop policy if exists "streaks_update_own" on public.streaks;
create policy "streaks_update_own" on public.streaks
  for update using (auth.uid() = user_id);

-- messages — readable if you own the parent meeting
drop policy if exists "messages_select_own" on public.messages;
create policy "messages_select_own" on public.messages
  for select using (
    exists (select 1 from public.meetings m
            where m.id = messages.meeting_id and m.user_id = auth.uid())
  );
drop policy if exists "messages_insert_own" on public.messages;
create policy "messages_insert_own" on public.messages
  for insert with check (
    exists (select 1 from public.meetings m
            where m.id = messages.meeting_id and m.user_id = auth.uid())
  );
