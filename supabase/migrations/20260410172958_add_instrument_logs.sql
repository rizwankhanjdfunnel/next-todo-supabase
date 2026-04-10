create table if not exists instrument_logs (
  id bigint primary key generated always as identity,
  instrument_id bigint references instruments(id) on delete cascade,
  action_type text not null, -- 'INSERT', 'UPDATE', 'DELETE'
  old_name text,
  new_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table instrument_logs enable row level security;

-- Public read access so our UI can fetch the logs freely
create policy "Allow public read access" on instrument_logs for select using (true);
-- Note: We don't need an INSERT policy because the Trigger inserts bypassing RLS.

-- Create the trigger function
create or replace function log_instrument_changes()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    insert into instrument_logs(instrument_id, action_type, new_name)
    values (NEW.id, 'INSERT', NEW.name);
    return NEW;
  elsif (TG_OP = 'UPDATE') then
    -- Only log if the name actually changed
    if (OLD.name is distinct from NEW.name) then
      insert into instrument_logs(instrument_id, action_type, old_name, new_name)
      values (NEW.id, 'UPDATE', OLD.name, NEW.name);
    end if;
    return NEW;
  elsif (TG_OP = 'DELETE') then
    insert into instrument_logs(instrument_id, action_type, old_name)
    -- OLD.id is kept in logs but not referenced strictly via foreign key since instrument is deleted 
    -- wait, if instrument_id has "on delete cascade", the log gets deleted! 
    -- So for DELETE actions we must leave instrument_id as NULL to keep the log history.
    values (NULL, 'DELETE', OLD.name);
    return OLD;
  end if;
  return null;
end;
$$ language plpgsql security definer;

-- In order to keep history of deleted items, drop the foreign key constraint
alter table instrument_logs drop constraint instrument_logs_instrument_id_fkey;

-- Attach trigger
drop trigger if exists instrument_audit_trigger on instruments;
create trigger instrument_audit_trigger
after insert or update or delete on instruments
for each row execute function log_instrument_changes();
