alter table public.treks
  add column if not exists permit_costs jsonb;
