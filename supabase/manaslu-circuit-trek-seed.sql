-- ============================================================================
-- TrailSathi — Manaslu Circuit Trek seed
-- ----------------------------------------------------------------------------
-- Safe to re-run: INSERT … ON CONFLICT refreshes the base row;
-- itineraries and sources are DELETE → re-INSERT.
-- Permit fees: 2025/2026 rates from Nepal Immigration / NTB official sources.
-- All descriptions are original, written for TrailSathi — not copied from any
-- third-party site. nepalhightrek.com used only as a factual reference.
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
  'manaslu-circuit',
  'Manaslu Circuit Trek',
  'Manaslu',
  'Moderate',
  14,
  5106,

  'The Manaslu Circuit is one of Nepal''s great restricted-area treks — a raw, deeply cultural loop around the world''s eighth-highest mountain, Mt. Manaslu (8,163 m). The trail follows the Budi Gandaki River upstream through Gurung, Sherpa, and Tibetan-heritage villages before crossing the spectacular Larkya La Pass (5,106 m) and descending into the Annapurna region. Far less crowded than the classic EBC or Annapurna Circuit, it rewards self-sufficient trekkers with dramatic gorges, ancient monasteries, mani walls, and unobstructed high-Himalayan panoramas.',

  'Kathmandu → (drive) Machha Khola → Jagat → Dyang → Namrung → Samagaon → Manaslu Base Camp acclimatization hike → Samdo → Dharmasala → Larkya La Pass (5,106 m) → Bimtang → Tilje → (drive) Besisahar → Kathmandu. The circuit is walked counter-clockwise so the Larkya La descent faces north, reducing afternoon avalanche exposure.',

  ARRAY[
    'Larkya La Pass (5,106 m) — one of the most dramatic high passes in the Himalaya',
    'Panoramic views of Mt. Manaslu (8,163 m), the world''s 8th-highest peak',
    'Acclimatization hike to Manaslu Base Camp (4,800 m) and glacial Birendra Lake',
    'Pungyen Gompa — an ancient monastery perched above Samagaon village',
    'Budi Gandaki River gorge — waterfalls, suspension bridges, and bamboo forest',
    'Nubri and Tsum cultural villages with active Tibetan-Buddhist monasteries',
    'Diverse terrain: subtropical forest to arctic tundra in 14 days',
    'Optional side-trip to the Tibet border viewpoint from Samdo village'
  ],

  ARRAY[
    'A minimum of two trekkers is required for the Restricted Area Permit; solo trekking is not permitted. A Nepal Government-licensed guide is mandatory.',
    'Acclimatize properly at Samagaon (3,530 m) with a full rest day and the Manaslu Base Camp hike before attempting Larkya La.',
    'Larkya La Pass day is long (8–9 hours). Start before dawn to avoid afternoon snowfall and high winds. Crampons and trekking poles are strongly recommended.',
    'The descent from Larkya La to Bimtang crosses active avalanche and landslide terrain — do not linger on exposed slopes.',
    'ATMs and card facilities are not available anywhere on the circuit. Carry sufficient Nepali rupees from Kathmandu.',
    'Mobile network coverage is patchy beyond Jagat. Download offline maps (Gaia GPS or Maps.me) before departure.',
    'Travel insurance with helicopter evacuation cover is mandatory. Leave a copy of your policy with a contact in Kathmandu.',
    'AMS risk is high from Samagaon onward. Monitor oxygen saturation daily and descend immediately if severe symptoms develop.'
  ],

  ARRAY['Autumn (Sep–Nov)', 'Spring (Mar–May)'],

  true,

  'Four permits required: (1) Special Restricted Area Permit (RAP) — issued by Nepal Immigration, Kathmandu only; costs vary by season. (2) Manaslu Conservation Area Project Permit (MCAP). (3) Annapurna Conservation Area Project Permit (ACAP) — required from Dharapani onward. (4) Tsum Nubri Rural Municipality Entrance Fee — purchased at Jagat checkpoint. All permits must be carried and shown at multiple checkpoints along the route.',

  '[
    {
      "permit_name": "Restricted Area Permit (RAP)",
      "required": true,
      "costs": [
        {"audience": "Foreigner (Autumn: Sep–Nov)", "amount_npr": 13500, "notes": "USD 100 for first 7 days + USD 15/day extra. Approx at 135 NPR/USD."},
        {"audience": "Foreigner (Other seasons)", "amount_npr": 10125, "notes": "USD 75 for first 7 days + USD 10/day extra. Approx at 135 NPR/USD."},
        {"audience": "SAARC", "amount_npr": 6750, "notes": "USD 50 for first 7 days."}
      ],
      "notes": "Issued only at Nepal Immigration offices in Kathmandu (Kalikasthan). Minimum group of 2 trekkers. Licensed guide required."
    },
    {
      "permit_name": "MCAP Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000},
        {"audience": "Nepali", "amount_npr": 100}
      ],
      "notes": "Manaslu Conservation Area Project. Issued at NTB Kathmandu or Pokhara. Carry two passport-size photos."
    },
    {
      "permit_name": "ACAP Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000},
        {"audience": "Nepali", "amount_npr": 100}
      ],
      "notes": "Annapurna Conservation Area Project. Required from Dharapani (circuit exit) onward. Issued at NTB Kathmandu or Pokhara."
    },
    {
      "permit_name": "Tsum Nubri Rural Municipality Fee",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 2000},
        {"audience": "SAARC", "amount_npr": 1000},
        {"audience": "Nepali", "amount_npr": 500}
      ],
      "notes": "Purchased at the Jagat checkpoint. Introduced in 2023. Payable in NPR cash only."
    }
  ]'::jsonb,

  true,
  timezone('utc', now())
)
ON CONFLICT (slug) DO UPDATE SET
  name                = EXCLUDED.name,
  region              = EXCLUDED.region,
  difficulty          = EXCLUDED.difficulty,
  duration_days       = EXCLUDED.duration_days,
  max_altitude        = EXCLUDED.max_altitude,
  description         = EXCLUDED.description,
  route_overview      = EXCLUDED.route_overview,
  highlights          = EXCLUDED.highlights,
  safety_notes        = EXCLUDED.safety_notes,
  best_seasons        = EXCLUDED.best_seasons,
  permit_required     = EXCLUDED.permit_required,
  permit_details      = EXCLUDED.permit_details,
  permit_costs        = EXCLUDED.permit_costs,
  is_verified         = EXCLUDED.is_verified,
  last_verified_at    = EXCLUDED.last_verified_at;


-- ----------------------------------------------------------------------------
-- 2) ITINERARY  (14 days)
-- ----------------------------------------------------------------------------
DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks WHERE slug = 'manaslu-circuit'
);

INSERT INTO public.trek_itineraries
  (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1,
   'Arrive Kathmandu — permits and preparation',
   'Arrive at Tribhuvan International Airport. Your guide meets you for a permit briefing. Collect the Restricted Area Permit (RAP) from Nepal Immigration and the MCAP/ACAP cards from the Nepal Tourism Board. Check and supplement gear — especially crampons, trekking poles, and a warm sleeping bag.',
   'Kathmandu', 1365),

  (2,
   'Drive Kathmandu → Machha Khola (157 km, 7–9 hrs)',
   'An early-morning departure by private 4WD along the Prithvi Highway, then north via Arughat Bazaar on rough mountain road to Machha Khola. The drive follows the Trishuli and Budi Gandaki river valleys through terraced farmland and oak-forested ridges. Overnight at a local teahouse.',
   'Machha Khola', 890),

  (3,
   'Trek Machha Khola → Jagat (13.5 km, 7–8 hrs)',
   'The first trekking day follows the Budi Gandaki upstream through subtropical jungle and small farm settlements. Pass the natural hot springs at Tatopani (time permitting for a soak), cross several suspension bridges, and climb to Jagat — the first official checkpoint where the Tsum Nubri municipality fee is collected.',
   'Jagat', 1410),

  (4,
   'Trek Jagat → Dyang (20 km, 8–9 hrs)',
   'A long, varied day through forested ridges and bamboo groves. After Jagat the trail climbs to Sirdibas Bazaar, crosses the river to Nagjet, then gains altitude through the large village of Philim with its wheat and barley terraces. The route ends at Dyang, a quiet Gurung settlement.',
   'Dyang', 1860),

  (5,
   'Trek Dyang → Namrung (19 km, 7–8 hrs)',
   'Enter the true high-mountain zone. The trail threads between towering canyon walls past intricate Tibetan mani walls and prayer flags, then rises through fir and rhododendron forest. By Namrung you have left the subtropical belt entirely — the peaks above 6,000 m become visible for the first time.',
   'Namrung', 2660),

  (6,
   'Trek Namrung → Shyala via Lho Village (18 km, 7–8 hrs)',
   'A gradual ascent through Lho, the largest village in the circuit, home to a giant white chorten, active monastery, and the first close-up views of Manaslu''s ice-clad north face. Continue to Shyala, a smaller village set on an open plateau with sweeping Himalayan panoramas.',
   'Shyala', 3500),

  (7,
   'Trek Shyala → Samagaon via Pungyen Gompa (17 km, 6–7 hrs)',
   'A short detour to Pungyen Gompa, a 500-year-old monastery perched on a ridge above the valley, is the cultural highlight of the whole circuit. Lamas chant in the butter-lamp-lit shrine room beneath ancient thangka paintings. Descend to Samagaon, the main hub of the upper circuit, with good teahouses and mountain views.',
   'Samagaon', 3530),

  (8,
   'Acclimatization — Manaslu Base Camp hike (13.5 km round-trip, 7–8 hrs)',
   'A mandatory rest-and-acclimatization day is best spent on the Base Camp hike (4,800 m). The trail climbs steeply past Birendra Lake — a moraine-dammed turquoise lake — to the lateral moraine above Manaslu''s Naike Glacier. The round-trip takes 7–8 hours from Samagaon. Afternoon is free for recovery.',
   'Samagaon', 3530),

  (9,
   'Trek Samagaon → Samdo (8.5 km, 4–5 hrs)',
   'A short day to allow gradual altitude gain. The route crosses the Budi Gandaki on a suspension bridge and climbs to Samdo — a Tibetan-heritage village of flat-roofed stone houses close to the Nepal-Tibet border. Many teahouses stock Chinese goods from cross-border trade. Afternoon walk up toward the Tibet viewpoint is recommended.',
   'Samdo', 3860),

  (10,
   'Trek Samdo → Dharmasala / Larkya La Phedi (9 km, 4–5 hrs)',
   'Another short day, critical for acclimatization before the pass. Cross an icy glacial stream, traverse a barren plateau, and climb to Dharmasala (also called Larkya La Phedi, meaning "foot of the pass"). Facilities are basic — a single stone teahouse. Go to bed early: the pass day starts before dawn.',
   'Dharmasala', 4460),

  (11,
   'Cross Larkya La Pass (5,106 m) → Bimtang (16 km, 8–9 hrs)',
   'The climax of the trek. Leave at 04:00–05:00 before winds build. The first hour is a steep moraine climb in the dark; crampons are often needed. Dawn breaks over Manaslu, Larke Peak, Naike Peak, and Himalchuli as you approach the prayer-flag-strewn summit of Larkya La (5,106 m). The descent to Bimtang is long and technical in places — icy slopes give way to boulder fields and then meadows. Bimtang is a beautiful alpine bowl surrounded by Manaslu, Himlung, and Cheo Himal.',
   'Bimtang', 3720),

  (12,
   'Trek Bimtang → Tilje village → drive Besisahar (13 km trek + 3 hrs drive)',
   'A pleasant downhill through rhododendron forest, Gho village, and the Phurke Khola valley back to the Marsyangdi River. At Tilje the route joins the Annapurna Circuit trail. Take a shared jeep from Tilje or Dharapani to Besisahar (ACAP permit checked at Dharapani checkpoint).',
   'Besisahar', 760),

  (13,
   'Drive Besisahar → Kathmandu (175 km, 7–8 hrs)',
   'An early-morning departure by local bus or private vehicle back to Kathmandu via the Prithvi Highway. Arrive late afternoon with time to celebrate, clean up, and rest.',
   'Kathmandu', 1365),

  (14,
   'Departure day',
   'Free morning in Kathmandu. Your guide arranges airport transfer. Final permit paperwork is complete — no further action required before flying.',
   'Kathmandu / Departure', 1365)

) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug = 'manaslu-circuit';


-- ----------------------------------------------------------------------------
-- 3) SOURCES
-- ----------------------------------------------------------------------------
DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks WHERE slug = 'manaslu-circuit'
);

INSERT INTO public.trek_sources
  (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  (
    'Nepal Immigration Department — Restricted Area Permits',
    'https://www.nepalimmigration.gov.np/',
    'official',
    'Official source for Restricted Area Permit (RAP) fees, group-size requirements, and the licensed-guide mandate for the Manaslu region.'
  ),
  (
    'NTNC — Manaslu Conservation Area Project (MCAP)',
    'https://ntnc.org.np/project/manaslu-conservation-area-project-mcap',
    'official',
    'MCAP boundaries, entry permit fees, and conservation regulations for the Manaslu region.'
  ),
  (
    'NTNC — Annapurna Conservation Area Project (ACAP)',
    'https://ntnc.org.np/project/annapurna-conservation-area-project-acap',
    'official',
    'ACAP boundaries and entry permit fees applicable from Dharapani onward.'
  ),
  (
    'Nepal Tourism Board — Trekking Permits',
    'https://ntb.gov.np/plan-your-trip/trekking-and-mountaineering',
    'official',
    'MCAP and ACAP permit issuance at NTB counters in Kathmandu and Pokhara.'
  ),
  (
    'Himalayan Rescue Association (HRA)',
    'https://himalayanrescue.org.np/',
    'medical',
    'AMS prevention guidelines, altitude illness recognition, and emergency helicopter rescue protocols for high-altitude trekking in Nepal.'
  ),
  (
    'OpenStreetMap — Manaslu Circuit route data',
    'https://www.openstreetmap.org/',
    'mapping',
    'Trail waypoints, teahouse locations, suspension bridge positions, and route topology used in the elevation profile.'
  )
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug = 'manaslu-circuit';


-- ============================================================================
-- DONE. Re-run anytime to refresh Manaslu Circuit content.
-- Sources: Nepal Immigration, NTNC, NTB, HRA, OSM.
-- All prose is original — nepalhightrek.com used as a factual reference only.
-- ============================================================================
