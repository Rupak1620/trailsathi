-- ============================================================================
-- TrailSathi — Trek Coordinates Migration
-- ----------------------------------------------------------------------------
-- Adds latitude / longitude columns to public.treks.
-- These are used to fetch real weather data from Open-Meteo (free, no API key).
-- Coordinates represent the most-photographed / highest-traffic point on each
-- trek (usually the summit viewpoint or base camp), used for weather context.
--
-- SAFE TO RE-RUN — uses ALTER TABLE IF NOT EXISTS logic.
-- ============================================================================

ALTER TABLE public.treks
  ADD COLUMN IF NOT EXISTS latitude  double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

COMMENT ON COLUMN public.treks.latitude  IS 'WGS-84 latitude of the trek''s primary weather reference point (summit/high camp).';
COMMENT ON COLUMN public.treks.longitude IS 'WGS-84 longitude of the trek''s primary weather reference point (summit/high camp).';

-- Index for potential geo queries
CREATE INDEX IF NOT EXISTS treks_coordinates_idx
  ON public.treks (latitude, longitude)
  WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================================
-- Seed coordinates for all currently verified treks
-- Reference points are summit viewpoints / high camps / base camps.
-- ============================================================================

-- Everest Base Camp Trek  →  Kala Patthar (5,545m) — the iconic viewpoint
UPDATE public.treks
SET latitude = 27.9943, longitude = 86.8330
WHERE slug IN ('everest-base-camp', 'everest-base-camp-trek', 'ebc');

-- Annapurna Circuit Trek  →  Thorong La Pass (5,416m)
UPDATE public.treks
SET latitude = 28.7966, longitude = 83.9376
WHERE slug IN ('annapurna-circuit', 'annapurna-circuit-trek');

-- Annapurna Base Camp Trek  →  Annapurna Base Camp (4,130m)
UPDATE public.treks
SET latitude = 28.5308, longitude = 83.8767
WHERE slug IN ('annapurna-base-camp', 'annapurna-base-camp-trek', 'abc');

-- Langtang Valley Trek  →  Kyanjin Ri viewpoint (4,773m)
UPDATE public.treks
SET latitude = 28.2116, longitude = 85.5681
WHERE slug IN ('langtang-valley', 'langtang-valley-trek', 'langtang');

-- Gokyo Lakes Trek  →  Gokyo Ri (5,357m)
UPDATE public.treks
SET latitude = 27.9621, longitude = 86.6861
WHERE slug IN ('gokyo-lakes', 'gokyo-lakes-trek', 'gokyo');

-- Mardi Himal Trek  →  Mardi Himal High Camp (4,500m)
UPDATE public.treks
SET latitude = 28.4567, longitude = 83.9156
WHERE slug IN ('mardi-himal', 'mardi-himal-trek');

-- Upper Mustang Trek  →  Lo Manthang (3,840m)
UPDATE public.treks
SET latitude = 29.1833, longitude = 83.9667
WHERE slug IN ('upper-mustang', 'upper-mustang-trek');

-- Kanchenjunga Base Camp Trek  →  Kanchenjunga North Base Camp (5,143m)
UPDATE public.treks
SET latitude = 27.7019, longitude = 87.9892
WHERE slug IN ('kanchenjunga-base-camp', 'kanchenjunga-base-camp-trek', 'kanchenjunga');

-- Manaslu Circuit Trek  →  Larkya La Pass (5,106m)
UPDATE public.treks
SET latitude = 28.6877, longitude = 84.5564
WHERE slug IN ('manaslu-circuit', 'manaslu-circuit-trek');

-- Tilicho Lake Trek  →  Tilicho Lake (4,919m)
UPDATE public.treks
SET latitude = 28.6938, longitude = 83.8427
WHERE slug IN ('tilicho-lake', 'tilicho-lake-trek');
