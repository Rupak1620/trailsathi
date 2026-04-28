create table if not exists public.trek_itineraries (
  id uuid primary key default gen_random_uuid(),
  trek_id uuid not null references public.treks(id) on delete cascade,
  day_number integer not null,
  title text not null,
  summary text,
  overnight_place text,
  altitude_m integer,
  created_at timestamptz not null default timezone('utc', now()),
  unique (trek_id, day_number)
);

create index if not exists trek_itineraries_trek_id_idx on public.trek_itineraries (trek_id);
create index if not exists trek_itineraries_day_idx on public.trek_itineraries (trek_id, day_number);
