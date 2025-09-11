-- Fix security warning: set search_path for the function
create or replace function enforce_system_limit()
returns trigger as $$
begin
  if (select count(*) from public.systems where owner_id = new.owner_id) >= 10 then
    raise exception 'System limit exceeded (10 per user)';
  end if;
  return new;
end; $$ language plpgsql security definer set search_path = public;