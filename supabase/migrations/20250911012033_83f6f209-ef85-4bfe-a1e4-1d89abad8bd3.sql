-- Users are managed by Supabase auth; map auth.uid() to owner_id (uuid)

create table if not exists systems (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  created_at timestamptz default now()
);

create table if not exists devices (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  system_id uuid references systems(id) on delete cascade,
  status text check (status in ('online','offline')) default 'offline',
  last_seen bigint,
  secret text,
  metadata jsonb default '{}'::jsonb
);

create table if not exists datastreams (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete cascade,
  key text not null,
  type text not null,       -- number|string|bool
  unit text,
  dir text not null,        -- in|out|both
  meta jsonb default '{}'::jsonb,
  unique(system_id, key)
);

create table if not exists widgets (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete cascade,
  type text not null,       -- switch|slider|gauge|number|label|indicator|chart
  binding jsonb not null,   -- e.g. {"datastreamKey":"ldr"} or {"command":"relay.set"}
  options jsonb default '{}'::jsonb
);

create table if not exists dashboard_layout (
  id uuid primary key default gen_random_uuid(),
  system_id uuid references systems(id) on delete cascade,
  layout jsonb not null      -- react-grid-layout array
);

-- Hard limit: 10 systems per user
create or replace function enforce_system_limit()
returns trigger as $$
begin
  if (select count(*) from systems where owner_id = new.owner_id) >= 10 then
    raise exception 'System limit exceeded (10 per user)';
  end if;
  return new;
end; $$ language plpgsql;

drop trigger if exists trg_system_limit on systems;
create trigger trg_system_limit before insert on systems
  for each row execute function enforce_system_limit();

-- Enable Row Level Security
alter table systems enable row level security;
alter table devices enable row level security;
alter table datastreams enable row level security;
alter table widgets enable row level security;
alter table dashboard_layout enable row level security;

-- RLS Policies
create policy "Users can view their own systems" on systems
  for select using (owner_id = auth.uid());

create policy "Users can create their own systems" on systems
  for insert with check (owner_id = auth.uid());

create policy "Users can update their own systems" on systems
  for update using (owner_id = auth.uid());

create policy "Users can delete their own systems" on systems
  for delete using (owner_id = auth.uid());

-- Devices policies (through systems)
create policy "Users can view devices in their systems" on devices
  for select using (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can create devices in their systems" on devices
  for insert with check (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can update devices in their systems" on devices
  for update using (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can delete devices in their systems" on devices
  for delete using (system_id in (select id from systems where owner_id = auth.uid()));

-- Datastreams policies
create policy "Users can view datastreams in their systems" on datastreams
  for select using (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can create datastreams in their systems" on datastreams
  for insert with check (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can update datastreams in their systems" on datastreams
  for update using (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can delete datastreams in their systems" on datastreams
  for delete using (system_id in (select id from systems where owner_id = auth.uid()));

-- Widgets policies
create policy "Users can view widgets in their systems" on widgets
  for select using (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can create widgets in their systems" on widgets
  for insert with check (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can update widgets in their systems" on widgets
  for update using (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can delete widgets in their systems" on widgets
  for delete using (system_id in (select id from systems where owner_id = auth.uid()));

-- Dashboard layout policies
create policy "Users can view layouts in their systems" on dashboard_layout
  for select using (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can create layouts in their systems" on dashboard_layout
  for insert with check (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can update layouts in their systems" on dashboard_layout
  for update using (system_id in (select id from systems where owner_id = auth.uid()));

create policy "Users can delete layouts in their systems" on dashboard_layout
  for delete using (system_id in (select id from systems where owner_id = auth.uid()));