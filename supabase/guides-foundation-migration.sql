create extension if not exists pgcrypto;

create table if not exists public.guides (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  home_region text,
  base_location text,
  bio text,
  years_experience integer check (years_experience is null or years_experience >= 0),
  languages text[] not null default '{}',
  phone text,
  whatsapp text,
  email text,
  avatar_url text,
  is_active boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists guides_slug_idx on public.guides (slug);
create index if not exists guides_home_region_idx on public.guides (home_region);
create index if not exists guides_is_active_idx on public.guides (is_active);

create table if not exists public.guide_verifications (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  verification_status text not null default 'pending'
    check (verification_status in ('pending', 'approved', 'rejected', 'suspended')),
  license_number text,
  license_document_url text,
  reviewed_by text,
  verified_at timestamptz,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists guide_verifications_guide_id_idx
  on public.guide_verifications (guide_id);
create index if not exists guide_verifications_status_idx
  on public.guide_verifications (verification_status);

create table if not exists public.guide_treks (
  id uuid primary key default gen_random_uuid(),
  guide_id uuid not null references public.guides(id) on delete cascade,
  trek_id uuid not null references public.treks(id) on delete cascade,
  years_guiding integer check (years_guiding is null or years_guiding >= 0),
  is_primary boolean not null default false,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  unique (guide_id, trek_id)
);

create index if not exists guide_treks_guide_id_idx on public.guide_treks (guide_id);
create index if not exists guide_treks_trek_id_idx on public.guide_treks (trek_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists set_guides_updated_at on public.guides;
create trigger set_guides_updated_at
before update on public.guides
for each row
execute function public.set_updated_at();

drop trigger if exists set_guide_verifications_updated_at on public.guide_verifications;
create trigger set_guide_verifications_updated_at
before update on public.guide_verifications
for each row
execute function public.set_updated_at();

alter table public.guides enable row level security;
alter table public.guide_verifications enable row level security;
alter table public.guide_treks enable row level security;

drop policy if exists "Public can read active guides" on public.guides;
create policy "Public can read active guides"
on public.guides
for select
to anon
using (is_active = true);

drop policy if exists "Public can read approved guide verification summaries" on public.guide_verifications;
create policy "Public can read approved guide verification summaries"
on public.guide_verifications
for select
to anon
using (verification_status = 'approved');

drop policy if exists "Public can read guide trek mappings" on public.guide_treks;
create policy "Public can read guide trek mappings"
on public.guide_treks
for select
to anon
using (true);
