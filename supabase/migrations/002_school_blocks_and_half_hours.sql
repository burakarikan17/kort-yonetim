alter table public.settings
  add column if not exists school_block_enabled boolean not null default true,
  add column if not exists school_block_days integer[] not null default array[1, 2, 3, 4, 5],
  add column if not exists school_block_start_time time not null default '07:00',
  add column if not exists school_block_end_time time not null default '17:00';

update public.settings
set
  school_block_enabled = coalesce(school_block_enabled, true),
  school_block_days = coalesce(school_block_days, array[1, 2, 3, 4, 5]),
  school_block_start_time = coalesce(school_block_start_time, '07:00'),
  school_block_end_time = coalesce(school_block_end_time, '17:00')
where id = 1;

create or replace function public.prevent_reservation_overlap()
returns trigger
language plpgsql
as $$
begin
  if exists (
    select 1
    from public.settings s
    where s.id = 1
      and s.school_block_enabled = true
      and extract(isodow from new.reservation_date)::integer = any(s.school_block_days)
      and new.start_time < s.school_block_end_time
      and new.end_time > s.school_block_start_time
  ) then
    raise exception 'Seçilen saat okul kullanımı için kapalıdır.';
  end if;

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
