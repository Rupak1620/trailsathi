create extension if not exists pgcrypto;

create table if not exists public.treks (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  region text not null,
  duration_days_min integer,
  duration_days_max integer,
  max_altitude_m integer,
  difficulty text check (difficulty in ('Easy', 'Moderate', 'Hard', 'Technical')),
  description text,
  route_overview text,
  permit_required boolean not null default false,
  permit_details text,
  permit_costs jsonb,
  best_season text[] not null default '{}',
  highlights text[] not null default '{}',
  safety_notes text[] not null default '{}',
  image_url text,
  is_verified boolean not null default false,
  last_verified_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists treks_region_idx on public.treks (region);
create index if not exists treks_verified_idx on public.treks (is_verified);
create index if not exists treks_slug_idx on public.treks (slug);

create table if not exists public.trek_sources (
  id uuid primary key default gen_random_uuid(),
  trek_id uuid not null references public.treks(id) on delete cascade,
  source_name text not null,
  source_url text,
  source_type text,
  checked_at timestamptz not null default timezone('utc', now()),
  notes text,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists trek_sources_trek_id_idx on public.trek_sources (trek_id);
create index if not exists trek_sources_checked_at_idx on public.trek_sources (checked_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_treks_updated_at on public.treks;

create trigger set_treks_updated_at
before update on public.treks
for each row
execute function public.set_updated_at();
