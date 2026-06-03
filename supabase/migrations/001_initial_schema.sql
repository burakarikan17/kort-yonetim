create extension if not exists pgcrypto;
create extension if not exists pg_trgm;

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  phone text,
  reservation_date date not null,
  start_time time not null,
  end_time time not null,
  price numeric(12, 2) not null default 0 check (price >= 0),
  notes text,
  created_at timestamptz not null default now(),
  constraint reservations_time_order check (start_time < end_time)
);

create index if not exists reservations_date_time_idx
  on public.reservations (reservation_date, start_time, end_time);

create index if not exists reservations_customer_name_idx
  on public.reservations using gin (customer_name gin_trgm_ops);

alter table public.reservations
  alter column customer_name drop not null,
  alter column phone drop not null;

create table if not exists public.settings (
  id integer primary key default 1,
  hourly_price numeric(12, 2) not null default 0 check (hourly_price >= 0),
  constraint settings_single_row check (id = 1)
);

insert into public.settings (id, hourly_price)
values (1, 0)
on conflict (id) do nothing;

create or replace function public.prevent_reservation_overlap()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.reservations r
    where r.reservation_date = new.reservation_date
      and r.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
      and r.start_time < new.end_time
      and r.end_time > new.start_time
  ) then
    raise exception 'Bu saat aralığında mevcut bir rezervasyon var.';
  end if;

  return new;
end;
$$;

drop trigger if exists reservations_no_overlap on public.reservations;
create trigger reservations_no_overlap
before insert or update on public.reservations
for each row execute function public.prevent_reservation_overlap();

alter table public.reservations enable row level security;
alter table public.settings enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.reservations to authenticated;
grant select, insert, update, delete on public.settings to authenticated;

drop policy if exists "Authenticated users can manage reservations" on public.reservations;
create policy "Authenticated users can manage reservations"
on public.reservations
for all
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can manage settings" on public.settings;
create policy "Authenticated users can manage settings"
on public.settings
for all
to authenticated
using (true)
with check (true);
