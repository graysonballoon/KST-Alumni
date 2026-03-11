-- Run this entire file in Supabase > SQL Editor > New Query

-- PROFILES TABLE
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text,
  first_name text,
  last_name text,
  class_year integer,
  status text default 'Active',
  major text,
  employer text,
  title text,
  location text,
  linkedin text,
  bio text,
  role text default 'member',
  created_at timestamp with time zone default now()
);

-- JOBS TABLE
create table if not exists jobs (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  company text not null,
  location text,
  type text default 'Full-time',
  description text,
  link text,
  posted_by uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- EVENTS TABLE
create table if not exists events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  event_date timestamp with time zone not null,
  location text,
  color text default '#0f1f3d',
  created_by uuid references profiles(id) on delete set null,
  created_at timestamp with time zone default now()
);

-- DONATIONS TABLE
create table if not exists donations (
  id uuid default gen_random_uuid() primary key,
  donor_id uuid references profiles(id) on delete set null,
  amount integer not null,
  message text,
  created_at timestamp with time zone default now()
);

-- ROW LEVEL SECURITY
alter table profiles enable row level security;
alter table jobs enable row level security;
alter table events enable row level security;
alter table donations enable row level security;

-- POLICIES: logged-in users can read everything
create policy "Members can view profiles" on profiles for select using (auth.role() = 'authenticated');
create policy "Members can view jobs" on jobs for select using (auth.role() = 'authenticated');
create policy "Members can view events" on events for select using (auth.role() = 'authenticated');
create policy "Members can view donations" on donations for select using (auth.role() = 'authenticated');

-- POLICIES: users can insert/update their own profile
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- POLICIES: any member can post jobs
create policy "Members can post jobs" on jobs for insert with check (auth.role() = 'authenticated');
create policy "Owners can delete jobs" on jobs for delete using (auth.uid() = posted_by);

-- POLICIES: any member can post donations
create policy "Members can donate" on donations for insert with check (auth.role() = 'authenticated');

-- POLICIES: admins can manage events (insert/delete)
create policy "Admins can insert events" on events for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete events" on events for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- POLICIES: admins can update/delete any profile
create policy "Admins can update profiles" on profiles for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Admins can delete profiles" on profiles for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
