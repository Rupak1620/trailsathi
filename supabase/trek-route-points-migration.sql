-- ============================================================================
-- TrailSathi — Trek Route Points Migration
-- ----------------------------------------------------------------------------
-- Creates the trek_route_points table that powers the 3D interactive trail map.
-- Each row is a named waypoint on a trek (start, village, camp, pass, viewpoint,
-- base camp, end). The ordered set of points forms the trek's GeoJSON LineString.
--
-- SAFE TO RE-RUN — all statements are idempotent.
-- ============================================================================

-- ── 1. Enum: point type ───────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.route_point_type AS ENUM (
    'start',       -- trailhead / first town
    'village',     -- inhabited village / town
    'teahouse',    -- standalone teahouse / lodge stop
    'camp',        -- designated campsite
    'viewpoint',   -- scenic viewpoint (not overnight)
    'pass',        -- mountain pass
    'base_camp',   -- expedition / trekking base camp
    'lake',        -- high-altitude lake
    'monastery',   -- religious site of significance
    'end'          -- final point (usually back to road-head)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

-- ── 2. Enum: stay type ────────────────────────────────────────────────────────
DO $$ BEGIN
  CREATE TYPE public.stay_type AS ENUM (
    'teahouse',    -- basic guesthouse on trail (most common)
    'lodge',       -- mid-range lodge
    'luxury_lodge',-- high-end lodge (e.g. Yak & Yeti, Everest View Hotel)
    'camping',     -- tent only
    'homestay',    -- local family homestay
    'none'         -- no overnight (day stop / pass)
  );
EXCEPTION WHEN duplicate_object THEN NULL; END; $$;

-- ── 3. Main table ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.trek_route_points (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  trek_id          uuid        NOT NULL REFERENCES public.treks(id) ON DELETE CASCADE,

  -- Position on route
  sequence_order   integer     NOT NULL,          -- 1-based, determines drawing order
  day_number       integer,                        -- links to trek_itineraries.day_number (nullable for non-overnight)

  -- Geography
  name             text        NOT NULL,           -- "Namche Bazaar", "Thorong La Pass"
  latitude         double precision NOT NULL,
  longitude        double precision NOT NULL,
  altitude_m       integer     NOT NULL,

  -- Classification
  point_type       public.route_point_type NOT NULL DEFAULT 'village',
  is_overnight     boolean     NOT NULL DEFAULT true,  -- does the itinerary sleep here?
  is_acclimatization_day boolean NOT NULL DEFAULT false,

  -- Narrative
  description      text,                           -- 1–2 sentence stop description
  special_notes    text,                           -- safety / permit note for this stop

  -- Stay / accommodation
  stay_type        public.stay_type DEFAULT 'teahouse',
  stay_name        text,                           -- "Yak & Yeti Guesthouse"
  stay_price_usd_min  integer,                     -- approx min USD per night (2024)
  stay_price_usd_max  integer,
  stay_facilities  text[]      NOT NULL DEFAULT '{}',
  -- e.g. ARRAY['Wi-Fi','Hot shower','Charging','Restaurant','Western toilet']

  -- Media
  image_url        text,                           -- hero photo for this stop

  -- Metadata
  created_at       timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at       timestamptz NOT NULL DEFAULT timezone('utc', now()),

  -- A trek cannot have two points with the same sequence number
  UNIQUE (trek_id, sequence_order)
);

-- ── 4. Indexes ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS route_points_trek_id_idx
  ON public.trek_route_points (trek_id);

CREATE INDEX IF NOT EXISTS route_points_trek_seq_idx
  ON public.trek_route_points (trek_id, sequence_order);

-- ── 5. Auto-update trigger ────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS set_trek_route_points_updated_at ON public.trek_route_points;
CREATE TRIGGER set_trek_route_points_updated_at
  BEFORE UPDATE ON public.trek_route_points
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── 6. Row-level security (public read, no auth write) ────────────────────────
ALTER TABLE public.trek_route_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read trek route points" ON public.trek_route_points;
CREATE POLICY "Public can read trek route points"
  ON public.trek_route_points
  FOR SELECT TO anon
  USING (true);

-- ── 7. Comments ───────────────────────────────────────────────────────────────
COMMENT ON TABLE  public.trek_route_points IS
  'Ordered waypoints forming each trek route. Used by the 3D interactive trail map.';
COMMENT ON COLUMN public.trek_route_points.sequence_order IS
  '1-based integer. Points are drawn in this order to form the route line.';
COMMENT ON COLUMN public.trek_route_points.stay_facilities IS
  'Array of facility strings, e.g. ARRAY[''Wi-Fi'',''Hot shower'',''Charging'',''Restaurant'']';
COMMENT ON COLUMN public.trek_route_points.stay_price_usd_min IS
  'Approximate minimum USD per night (2024 rates). NULL if no overnight stay.';
