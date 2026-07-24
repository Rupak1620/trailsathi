-- ============================================================================
-- TrailSathi - Tilicho Lake Trek seed (NEW trek)
-- ----------------------------------------------------------------------------
-- Unlike verified-trek-content-seed.sql (which only UPDATEs existing rows),
-- this script INSERTs the Tilicho Lake base row first, then fills in the
-- itinerary and sources. It is SAFE to re-run:
--   * INSERT ... ON CONFLICT (slug) DO UPDATE refreshes the base row.
--   * trek_itineraries / trek_sources are DELETEd then re-INSERTed.
-- Permit fees use widely-cited 2024 NPR rates; verify before printing.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) BASE ROW
-- ----------------------------------------------------------------------------
INSERT INTO public.treks (
  slug, name, region, difficulty, duration_days, max_altitude,
  description, route_overview, highlights, safety_notes, best_seasons,
  permit_required, permit_details, permit_costs, is_verified, last_verified_at
)
VALUES (
  'tilicho-lake',
  'Tilicho Lake Trek',
  'Annapurna / Manang',
  'Hard',
  10,
  4919,
  'A high-altitude trek to Tilicho Lake (4,919m), one of the highest large lakes in the world, set in a glacial basin beneath the Tilicho and Khangsar Kang peaks. Branching off the Annapurna Circuit at Manang, it crosses the notorious Khangsar–Tilicho Base Camp landslide traverse before reaching the turquoise lake. Often combined with the Thorong La crossing for a longer circuit.',
  'Besisahar/Chame → Pisang → Manang (acclimatization) → Khangsar → Tilicho Base Camp → Tilicho Lake (4,919m) → Shree Kharka → Manang → return. Can be linked to Thorong La / Annapurna Circuit.',
  ARRAY[
    'Stand at Tilicho Lake (4,919m), among the highest lakes on Earth',
    'Cross the dramatic Khangsar–Tilicho Base Camp landslide traverse',
    'Manang Tibetan-style village and Ice Lake acclimatization hike',
    'Turquoise glacial water beneath Tilicho Peak (7,134m)',
    'Optional link-up with the Thorong La pass (5,416m)'
  ],
  ARRAY[
    'Spend at least 2 nights around Manang (3,540m) before heading to Tilicho Base Camp.',
    'Cross the Khangsar–Tilicho Base Camp landslide/scree section early morning before winds and rockfall pick up.',
    'Tilicho Lake is a high day-climb from base camp — turn back if AMS symptoms appear.',
    'Tilicho Base Camp lodges fill fast in peak season; start early to secure a bed.',
    'The lake can be frozen or snow-covered outside the main seasons; check conditions.'
  ],
  ARRAY['Spring (Mar-May)', 'Autumn (Sep-Nov)'],
  true,
  'Two permits: Annapurna Conservation Area Project (ACAP) entry permit and TIMS card. Both available at Nepal Tourism Board (Kathmandu or Pokhara).',
  '[
    {
      "permit_name": "ACAP Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000},
        {"audience": "Nepali", "amount_npr": 100}
      ],
      "notes": "Issued by NTB. Carry two passport-size photos."
    },
    {
      "permit_name": "TIMS Card",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 2000},
        {"audience": "SAARC", "amount_npr": 1000}
      ],
      "notes": "Free of charge for Nepali nationals."
    }
  ]'::jsonb,
  true,
  timezone('utc', now())
)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  region = EXCLUDED.region,
  difficulty = EXCLUDED.difficulty,
  duration_days = EXCLUDED.duration_days,
  max_altitude = EXCLUDED.max_altitude,
  description = EXCLUDED.description,
  route_overview = EXCLUDED.route_overview,
  highlights = EXCLUDED.highlights,
  safety_notes = EXCLUDED.safety_notes,
  best_seasons = EXCLUDED.best_seasons,
  permit_required = EXCLUDED.permit_required,
  permit_details = EXCLUDED.permit_details,
  permit_costs = EXCLUDED.permit_costs,
  is_verified = EXCLUDED.is_verified,
  last_verified_at = EXCLUDED.last_verified_at;

-- ----------------------------------------------------------------------------
-- 2) ITINERARY
-- ----------------------------------------------------------------------------
DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks WHERE slug = 'tilicho-lake'
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Kathmandu → Besisahar → Chame', 'Long jeep drive up the Marsyangdi valley to Chame, the headquarters of Manang district.', 'Chame', 2710),
  (2, 'Chame to Pisang', 'Trek through pine forest and apple orchards with first views of the Paungda Danda rock face.', 'Pisang', 3200),
  (3, 'Pisang to Manang (upper route)', 'Take the high route via Ghyaru and Ngawal for sweeping Annapurna II and IV views, then drop to Manang.', 'Manang', 3540),
  (4, 'Acclimatization day in Manang', 'Day hike to Ice Lake (4,600m) or Gangapurna Lake. Attend the HRA altitude-sickness talk.', 'Manang', 3540),
  (5, 'Manang to Khangsar', 'Short ascent to Khangsar, the last permanent village before Tilicho, for further acclimatization.', 'Khangsar', 3734),
  (6, 'Khangsar to Tilicho Base Camp', 'Cross the exposed landslide and scree traverse early in the day to reach the lodges at Tilicho Base Camp.', 'Tilicho Base Camp', 4150),
  (7, 'Tilicho Lake (4,919m), descend to Shree Kharka', 'Pre-dawn climb to Tilicho Lake for clear, calm views, then descend back past base camp to Shree Kharka.', 'Shree Kharka', 4050),
  (8, 'Shree Kharka to Manang', 'Return traverse to Manang, completing the out-and-back to the lake.', 'Manang', 3540),
  (9, 'Manang to Chame', 'Long descent (or staged jeep) back down the valley to Chame.', 'Chame', 2710),
  (10, 'Drive Chame → Kathmandu', 'Return jeep and bus to Kathmandu.', 'Kathmandu', 1400)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug = 'tilicho-lake';

-- ----------------------------------------------------------------------------
-- 3) SOURCES
-- ----------------------------------------------------------------------------
DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks WHERE slug = 'tilicho-lake'
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('NTNC – Annapurna Conservation Area', 'https://ntnc.org.np/project/annapurna-conservation-area-project-acap', 'official', 'ACAP boundaries and entry fees.'),
  ('Nepal Tourism Board – Trekking', 'https://ntb.gov.np/plan-your-trip/trekking-and-mountaineering', 'official', 'TIMS card issuance and fees.'),
  ('Himalayan Rescue Association – Manang', 'https://himalayanrescue.org.np/', 'medical', 'HRA runs the daily altitude-sickness lecture in Manang.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug = 'tilicho-lake';

-- ============================================================================
-- DONE. Re-run anytime to refresh Tilicho Lake content.
-- ============================================================================
