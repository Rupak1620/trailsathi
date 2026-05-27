-- ============================================================================
-- TrailSathi - Verified trek content seed
-- ----------------------------------------------------------------------------
-- This script populates verified trek content (descriptions, highlights,
-- safety notes, permits, itinerary, sources) for 8 popular Nepal treks.
--
-- It is SAFE to re-run. It will:
--   * UPDATE the matching `treks` row only if a slug variant exists.
--   * DELETE then re-INSERT `trek_itineraries` for each trek.
--   * DELETE then re-INSERT `trek_sources` for each trek.
--
-- Treks not present in your DB are silently skipped.
-- Permit fees use widely-cited 2024 NPR rates; verify before printing.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) EVEREST BASE CAMP TREK
-- ----------------------------------------------------------------------------
UPDATE public.treks SET
  region = 'Khumbu / Solukhumbu',
  difficulty = 'Hard',
  duration_days = 14,
  max_altitude = 5545,
  description = 'The classic high-altitude trek to the foot of Mount Everest (Sagarmatha). Begins with a mountain flight to Lukla and follows the Dudh Koshi valley through Sherpa villages, monasteries, and the high glaciated terrain of Khumbu to Everest Base Camp (5,364m) and the Kala Patthar viewpoint (5,545m).',
  route_overview = 'Lukla (2,860m) → Phakding → Namche Bazaar → Tengboche → Dingboche → Lobuche → Gorak Shep → Everest Base Camp (5,364m) → Kala Patthar (5,545m) → return via the same route.',
  highlights = ARRAY[
    'Stand at Everest Base Camp (5,364m)',
    'Sunrise from Kala Patthar (5,545m)',
    'Tengboche Monastery views of Ama Dablam',
    'Namche Bazaar Saturday market',
    'Sagarmatha National Park (UNESCO)'
  ],
  safety_notes = ARRAY[
    'Two acclimatization days are mandatory (Namche & Dingboche).',
    'Maximum 500m sleeping-altitude gain per day above 3,000m.',
    'Carry travel insurance covering helicopter evacuation up to 6,000m.',
    'Lukla flights frequently delay or divert to Ramechhap — keep buffer days.',
    'Drink 3-4L per day; avoid alcohol above 3,500m.'
  ],
  best_seasons = ARRAY['Spring (Mar-May)', 'Autumn (Sep-Nov)'],
  permit_required = true,
  permit_details = 'Two permits are required: Sagarmatha National Park entry permit and Khumbu Pasang Lhamu Rural Municipality entrance fee. There is NO TIMS card for the Everest region.',
  permit_costs = '[
    {
      "permit_name": "Sagarmatha National Park Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1500},
        {"audience": "Nepali", "amount_npr": 100}
      ],
      "notes": "Issued at Nepal Tourism Board (Kathmandu) or Monjo entry gate."
    },
    {
      "permit_name": "Khumbu Pasang Lhamu Rural Municipality Entrance Fee",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 2000},
        {"audience": "SAARC", "amount_npr": 2000},
        {"audience": "Nepali", "amount_npr": 0}
      ],
      "notes": "Collected at Lukla. Replaced the TIMS card for the EBC region in 2018."
    }
  ]'::jsonb,
  is_verified = true,
  last_verified_at = timezone('utc', now())
WHERE slug IN ('everest-base-camp', 'everest-base-camp-trek', 'ebc');

DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('everest-base-camp', 'everest-base-camp-trek', 'ebc')
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Fly Kathmandu → Lukla, trek to Phakding', 'A 35-minute mountain flight to Lukla, then a gentle descending walk along the Dudh Koshi to Phakding to start acclimatizing low.', 'Phakding', 2610),
  (2, 'Phakding to Namche Bazaar', 'Cross several suspension bridges over the Dudh Koshi, enter Sagarmatha National Park at Monjo, then climb steeply to the Sherpa capital, Namche Bazaar.', 'Namche Bazaar', 3440),
  (3, 'Acclimatization day in Namche', 'Day hike to Everest View Hotel (3,880m) for first views of Everest, Lhotse, and Ama Dablam. Visit the Sherpa Culture Museum.', 'Namche Bazaar', 3440),
  (4, 'Namche to Tengboche', 'Traverse to Phunki Tenga then climb through rhododendron forest to Tengboche and its famous monastery.', 'Tengboche', 3860),
  (5, 'Tengboche to Dingboche', 'Descend to Debuche, cross the Imja Khola, and climb to the high alpine plateau of Dingboche. Treeline ends here.', 'Dingboche', 4410),
  (6, 'Acclimatization day in Dingboche', 'Day hike up Nangkartshang Ridge (5,083m) for panoramic views of Makalu and Island Peak.', 'Dingboche', 4410),
  (7, 'Dingboche to Lobuche', 'Climb to Thukla Pass and the climbers'' memorial chortens, then continue along the Khumbu Glacier moraine to Lobuche.', 'Lobuche', 4940),
  (8, 'Lobuche to Gorak Shep, then EBC', 'Trek along the Khumbu Glacier to Gorak Shep, drop your pack, then continue to Everest Base Camp (5,364m). Return to Gorak Shep to sleep.', 'Gorak Shep', 5164),
  (9, 'Kala Patthar sunrise, descend to Pheriche', 'Pre-dawn climb of Kala Patthar (5,545m) for the highest viewpoint of the trek, then long descent to Pheriche.', 'Pheriche', 4240),
  (10, 'Pheriche to Namche Bazaar', 'Retrace your steps through Tengboche and back down to Namche.', 'Namche Bazaar', 3440),
  (11, 'Namche to Lukla', 'Final long descent along the Dudh Koshi back to Lukla.', 'Lukla', 2860),
  (12, 'Fly Lukla → Kathmandu', 'Morning mountain flight back to Kathmandu (weather permitting).', 'Kathmandu', 1400)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug IN ('everest-base-camp', 'everest-base-camp-trek', 'ebc');

DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('everest-base-camp', 'everest-base-camp-trek', 'ebc')
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('Nepal Tourism Board – Trekking Permits', 'https://ntb.gov.np/plan-your-trip/trekking-and-mountaineering', 'official', 'Authoritative reference for park fees and TIMS rules.'),
  ('Department of National Parks & Wildlife Conservation', 'https://www.dnpwc.gov.np/', 'official', 'Sagarmatha National Park entry fees.'),
  ('Himalayan Rescue Association – AMS guidance', 'https://himalayanrescue.org.np/', 'medical', 'Recommended acclimatization protocol.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug IN ('everest-base-camp', 'everest-base-camp-trek', 'ebc');

-- ----------------------------------------------------------------------------
-- 2) ANNAPURNA BASE CAMP TREK
-- ----------------------------------------------------------------------------
UPDATE public.treks SET
  region = 'Annapurna / Gandaki',
  difficulty = 'Moderate',
  duration_days = 10,
  max_altitude = 4130,
  description = 'A bucket-list trek into the Annapurna Sanctuary — a glacial amphitheatre ringed by Annapurna I (8,091m), Annapurna South, Machhapuchhre (Fishtail), Hiunchuli, and Gangapurna. Lower starting altitudes and a moderate profile make it accessible to most fit trekkers.',
  route_overview = 'Pokhara → Nayapul/Ghandruk → Chhomrong → Bamboo → Deurali → Machhapuchhre Base Camp (3,700m) → Annapurna Base Camp (4,130m) → return via Jhinu (hot springs) → Pokhara.',
  highlights = ARRAY[
    'Annapurna Sanctuary 360° amphitheatre',
    'Sunrise at Annapurna Base Camp (4,130m)',
    'Machhapuchhre (Fishtail) close-up views',
    'Gurung & Magar village culture (Ghandruk, Chhomrong)',
    'Jhinu Danda natural hot springs'
  ],
  safety_notes = ARRAY[
    'Avalanche risk on the Deurali–MBC section in late winter and early spring.',
    'The sanctuary is a closed valley; descend immediately if weather closes in.',
    'Watch for AMS above Deurali (3,200m).',
    'Carry ACAP permit at all times; checkposts at Birethanti and Chhomrong.'
  ],
  best_seasons = ARRAY['Spring (Mar-May)', 'Autumn (Sep-Nov)'],
  permit_required = true,
  permit_details = 'Two permits: Annapurna Conservation Area Project (ACAP) entry permit and TIMS card. Both available at Nepal Tourism Board (Kathmandu or Pokhara).',
  permit_costs = '[
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
  is_verified = true,
  last_verified_at = timezone('utc', now())
WHERE slug IN ('annapurna-base-camp', 'annapurna-base-camp-trek', 'abc');

DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('annapurna-base-camp', 'annapurna-base-camp-trek', 'abc')
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Pokhara → Nayapul → Ghandruk', 'Drive to Nayapul (1-1.5h), then climb stone steps through Gurung villages to Ghandruk for first Annapurna South views.', 'Ghandruk', 1940),
  (2, 'Ghandruk to Chhomrong', 'Traverse via Komrong Danda, drop into the Modi Khola valley, and climb to Chhomrong, the gateway to the sanctuary.', 'Chhomrong', 2170),
  (3, 'Chhomrong to Bamboo', 'Descend stone steps to the Chhomrong Khola, cross the bridge, and walk through bamboo and rhododendron forest to Bamboo.', 'Bamboo', 2310),
  (4, 'Bamboo to Deurali', 'Steady climb through Dovan and Himalaya Hotel to Deurali. Watch for avalanche tracks on the cliffs above.', 'Deurali', 3200),
  (5, 'Deurali to Annapurna Base Camp via MBC', 'Enter the sanctuary, cross the avalanche zone in the morning, reach Machhapuchhre Base Camp (3,700m), then push on to ABC for sunset.', 'Annapurna Base Camp', 4130),
  (6, 'ABC sunrise, descend to Bamboo', 'Sunrise on the Annapurna amphitheatre, then a long descent back through MBC and Deurali to Bamboo.', 'Bamboo', 2310),
  (7, 'Bamboo to Jhinu Danda', 'Climb back to Chhomrong and descend to Jhinu Danda for hot springs by the river.', 'Jhinu Danda', 1780),
  (8, 'Jhinu to Nayapul, drive to Pokhara', 'Short trek out via Siwai or New Bridge, then drive back to Pokhara.', 'Pokhara', 820)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug IN ('annapurna-base-camp', 'annapurna-base-camp-trek', 'abc');

DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('annapurna-base-camp', 'annapurna-base-camp-trek', 'abc')
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('Annapurna Conservation Area Project (NTNC)', 'https://ntnc.org.np/project/annapurna-conservation-area-project-acap', 'official', 'ACAP boundaries, permits, conservation rules.'),
  ('Nepal Tourism Board – Trekking', 'https://ntb.gov.np/plan-your-trip/trekking-and-mountaineering', 'official', 'TIMS card issuance and fees.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug IN ('annapurna-base-camp', 'annapurna-base-camp-trek', 'abc');

-- ----------------------------------------------------------------------------
-- 3) ANNAPURNA CIRCUIT TREK
-- ----------------------------------------------------------------------------
UPDATE public.treks SET
  region = 'Annapurna / Manang / Mustang',
  difficulty = 'Hard',
  duration_days = 16,
  max_altitude = 5416,
  description = 'A classic circumnavigation of the Annapurna massif crossing the Thorong La pass (5,416m). Combines subtropical valleys, alpine deserts, Tibetan-influenced villages, and one of the most scenic high passes in the world.',
  route_overview = 'Besisahar/Chame → Pisang → Manang (acclimatization) → Yak Kharka → Thorong Phedi → Thorong La Pass (5,416m) → Muktinath → Jomsom → Pokhara.',
  highlights = ARRAY[
    'Cross Thorong La Pass (5,416m)',
    'Muktinath sacred temple complex',
    'Manang Tibetan-style village',
    'Tilicho Lake side-trek option (4,919m)',
    'Dramatic landscape transition: forest → desert'
  ],
  safety_notes = ARRAY[
    'Spend 2 nights in Manang (3,540m) for acclimatization before pushing toward Thorong La.',
    'Cross Thorong La before 10am to avoid afternoon winds and snow.',
    'Carry Diamox; consult a doctor before the trek.',
    'October 2014 avalanche killed 43 — weather forecasting and turn-back discipline are essential.',
    'Restricted Manang/Mustang sections need permits beyond ACAP.'
  ],
  best_seasons = ARRAY['Spring (Mar-May)', 'Autumn (Sep-Nov)'],
  permit_required = true,
  permit_details = 'ACAP permit + TIMS card. Restricted-area permits apply if you side-trip into Upper Mustang or Nar Phu.',
  permit_costs = '[
    {
      "permit_name": "ACAP Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000},
        {"audience": "Nepali", "amount_npr": 100}
      ],
      "notes": "Carry two passport-size photos."
    },
    {
      "permit_name": "TIMS Card",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 2000},
        {"audience": "SAARC", "amount_npr": 1000}
      ],
      "notes": "Issued via NTB or registered trekking agency."
    }
  ]'::jsonb,
  is_verified = true,
  last_verified_at = timezone('utc', now())
WHERE slug IN ('annapurna-circuit', 'annapurna-circuit-trek');

DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('annapurna-circuit', 'annapurna-circuit-trek')
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Kathmandu → Besisahar → Chame', 'Long drive (jeep) up the Marsyangdi valley to Chame, headquarters of Manang district.', 'Chame', 2710),
  (2, 'Chame to Pisang', 'Trek through apple orchards and pine forest with first views of Paungda Danda rock face.', 'Pisang', 3200),
  (3, 'Pisang to Manang (upper route)', 'Upper route via Ghyaru and Ngawal offers stunning Annapurna II views before dropping to Manang.', 'Manang', 3540),
  (4, 'Acclimatization day in Manang', 'Day hike to Gangapurna Lake or Ice Lake (4,600m). Attend the HRA altitude sickness lecture.', 'Manang', 3540),
  (5, 'Manang to Yak Kharka', 'Short ascent to begin altitude gain. Watch for blue sheep and yaks.', 'Yak Kharka', 4050),
  (6, 'Yak Kharka to Thorong Phedi', 'Climb to the base of the pass. Optional push to High Camp depending on group strength.', 'Thorong Phedi', 4525),
  (7, 'Cross Thorong La (5,416m) to Muktinath', 'Pre-dawn start, ~4-5h to the pass, then long descent to the sacred temple complex of Muktinath.', 'Muktinath', 3760),
  (8, 'Muktinath to Jomsom', 'Visit Muktinath temple, then descend via Kagbeni or jeep road to Jomsom.', 'Jomsom', 2720),
  (9, 'Fly Jomsom → Pokhara', 'Morning flight back to Pokhara (subject to wind delays). Alternative: jeep drive (9-10h).', 'Pokhara', 820)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug IN ('annapurna-circuit', 'annapurna-circuit-trek');

DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('annapurna-circuit', 'annapurna-circuit-trek')
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('NTNC – Annapurna Conservation Area', 'https://ntnc.org.np/project/annapurna-conservation-area-project-acap', 'official', 'ACAP boundaries and entry fees.'),
  ('Himalayan Rescue Association – Manang', 'https://himalayanrescue.org.np/', 'medical', 'HRA runs the daily altitude sickness lecture in Manang.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug IN ('annapurna-circuit', 'annapurna-circuit-trek');

-- ----------------------------------------------------------------------------
-- 4) LANGTANG VALLEY TREK
-- ----------------------------------------------------------------------------
UPDATE public.treks SET
  region = 'Langtang / Rasuwa',
  difficulty = 'Moderate',
  duration_days = 8,
  max_altitude = 4984,
  description = 'A short, rewarding trek into the Langtang Valley, the closest high-mountain trekking region to Kathmandu. The valley was devastated by the 2015 earthquake but has been thoughtfully rebuilt by local communities. Trekking here directly supports Tamang heritage and recovery.',
  route_overview = 'Syabrubesi → Lama Hotel → Langtang Village → Kyanjin Gompa → Tserko Ri (4,984m) day-climb → return via the same route.',
  highlights = ARRAY[
    'Day-climb Tserko Ri (4,984m) viewpoint',
    'Kyanjin Gompa monastery and cheese factory',
    'Tamang Heritage culture and homestays',
    'Langtang Lirung (7,234m) close-up',
    'Direct community impact post-2015'
  ],
  safety_notes = ARRAY[
    'Some landslide-prone sections between Lama Hotel and Langtang Village — stay on the marked trail.',
    'Tserko Ri is a high-altitude day climb; turn back if symptoms appear.',
    'Helicopter rescue costs less here than Khumbu due to proximity to Kathmandu, but ensure insurance covers it.',
    'Carry warm gear year-round; valley winds get sharp in afternoons.'
  ],
  best_seasons = ARRAY['Spring (Mar-May)', 'Autumn (Sep-Nov)'],
  permit_required = true,
  permit_details = 'Langtang National Park entry permit + TIMS card. Available at Nepal Tourism Board (Kathmandu).',
  permit_costs = '[
    {
      "permit_name": "Langtang National Park Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1500},
        {"audience": "Nepali", "amount_npr": 100}
      ],
      "notes": "Issued by NTB Kathmandu or at Dhunche entry gate."
    },
    {
      "permit_name": "TIMS Card",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 2000},
        {"audience": "SAARC", "amount_npr": 1000}
      ],
      "notes": "Free for Nepali nationals."
    }
  ]'::jsonb,
  is_verified = true,
  last_verified_at = timezone('utc', now())
WHERE slug IN ('langtang-valley', 'langtang-valley-trek', 'langtang');

DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('langtang-valley', 'langtang-valley-trek', 'langtang')
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Drive Kathmandu → Syabrubesi', '7-8h scenic but bumpy drive through Trishuli and Dhunche to the trailhead at Syabrubesi.', 'Syabrubesi', 1550),
  (2, 'Syabrubesi to Lama Hotel', 'Follow the Langtang Khola through subtropical forest. Watch for langur monkeys.', 'Lama Hotel', 2470),
  (3, 'Lama Hotel to Langtang Village', 'Climb steadily out of forest into the open valley. Pass the 2015 landslide memorial before reaching the rebuilt Langtang Village.', 'Langtang Village', 3430),
  (4, 'Langtang to Kyanjin Gompa', 'Short, scenic day to Kyanjin Gompa surrounded by 7,000m peaks. Visit the cheese factory and monastery.', 'Kyanjin Gompa', 3870),
  (5, 'Acclimatize: climb Tserko Ri (4,984m)', 'Pre-dawn climb to Tserko Ri viewpoint for sunrise over Langtang Lirung, Yala Peak, and Naya Kanga. Return for lunch.', 'Kyanjin Gompa', 3870),
  (6, 'Kyanjin Gompa to Lama Hotel', 'Long descent back through Langtang Village and forest to Lama Hotel.', 'Lama Hotel', 2470),
  (7, 'Lama Hotel to Syabrubesi', 'Final descent to the trailhead.', 'Syabrubesi', 1550),
  (8, 'Drive Syabrubesi → Kathmandu', 'Return drive to Kathmandu.', 'Kathmandu', 1400)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug IN ('langtang-valley', 'langtang-valley-trek', 'langtang');

DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('langtang-valley', 'langtang-valley-trek', 'langtang')
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('Department of National Parks & Wildlife Conservation', 'https://www.dnpwc.gov.np/en/conservation-area-detail/72/', 'official', 'Langtang National Park entry fees and rules.'),
  ('Nepal Tourism Board – Trekking', 'https://ntb.gov.np/plan-your-trip/trekking-and-mountaineering', 'official', 'TIMS issuance.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug IN ('langtang-valley', 'langtang-valley-trek', 'langtang');

-- ----------------------------------------------------------------------------
-- 5) MARDI HIMAL TREK
-- ----------------------------------------------------------------------------
UPDATE public.treks SET
  region = 'Annapurna / Gandaki',
  difficulty = 'Moderate',
  duration_days = 5,
  max_altitude = 4500,
  description = 'A short and scenic ridge trek climbing the southern flank of Machhapuchhre to Mardi Himal Base Camp. Less crowded than ABC, with broad rhododendron forests and a dramatic high-camp ridgeline.',
  route_overview = 'Pokhara → Kande → Pothana → Forest Camp → Low Camp → High Camp → Upper View Point/Mardi Himal Base Camp (4,500m) → Sidhing → Pokhara.',
  highlights = ARRAY[
    'Upper View Point at 4,250m',
    'Mardi Himal Base Camp at 4,500m',
    'Machhapuchhre south face from High Camp',
    'Quieter alternative to ABC',
    'Rhododendron forest in spring'
  ],
  safety_notes = ARRAY[
    'High Camp (3,580m) → Upper View Point is a 1,000m altitude gain — go slow.',
    'No retail oxygen above Low Camp.',
    'Trail is exposed on the ridge; check weather before pushing to UVP/BC.',
    'Carry cash; ATMs not available beyond Pokhara.'
  ],
  best_seasons = ARRAY['Spring (Mar-May)', 'Autumn (Sep-Nov)', 'Winter (Dec-Feb, low camp only)'],
  permit_required = true,
  permit_details = 'ACAP permit + TIMS card. Both available at Nepal Tourism Board (Pokhara office is most convenient).',
  permit_costs = '[
    {
      "permit_name": "ACAP Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000},
        {"audience": "Nepali", "amount_npr": 100}
      ],
      "notes": "Carry two passport-size photos."
    },
    {
      "permit_name": "TIMS Card",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 2000},
        {"audience": "SAARC", "amount_npr": 1000}
      ],
      "notes": "Free for Nepali nationals."
    }
  ]'::jsonb,
  is_verified = true,
  last_verified_at = timezone('utc', now())
WHERE slug IN ('mardi-himal', 'mardi-himal-trek');

DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('mardi-himal', 'mardi-himal-trek')
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Pokhara → Kande → Forest Camp', '30-min drive to Kande, then a forested climb via Pothana and Deurali to Forest Camp.', 'Forest Camp', 2550),
  (2, 'Forest Camp to Low Camp', 'Climb through dense rhododendron forest with occasional ridge views.', 'Low Camp', 2970),
  (3, 'Low Camp to High Camp', 'Forest gives way to alpine meadows; the ridge opens up to Annapurna South and Machhapuchhre.', 'High Camp', 3580),
  (4, 'High Camp → Upper View Point / Base Camp → Sidhing', 'Pre-dawn ridge climb to Upper View Point (4,250m); fit groups continue to Mardi Himal Base Camp (4,500m). Return, then descend steeply to Sidhing.', 'Sidhing', 1700),
  (5, 'Sidhing → Lumre → Pokhara', 'Short walk to Lumre, then drive back to Pokhara (~2-3h).', 'Pokhara', 820)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug IN ('mardi-himal', 'mardi-himal-trek');

DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('mardi-himal', 'mardi-himal-trek')
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('NTNC – Annapurna Conservation Area', 'https://ntnc.org.np/project/annapurna-conservation-area-project-acap', 'official', 'ACAP boundaries and rules.'),
  ('Nepal Tourism Board – Trekking', 'https://ntb.gov.np/plan-your-trip/trekking-and-mountaineering', 'official', 'TIMS issuance.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug IN ('mardi-himal', 'mardi-himal-trek');

-- ----------------------------------------------------------------------------
-- 6) MANASLU CIRCUIT TREK
-- ----------------------------------------------------------------------------
UPDATE public.treks SET
  region = 'Manaslu / Gorkha',
  difficulty = 'Hard',
  duration_days = 14,
  max_altitude = 5106,
  description = 'A restricted-area trek circling Mount Manaslu (8,163m), crossing the Larkya La pass (5,106m). Combines remote Tibetan-Buddhist villages, narrow river gorges, and high alpine passes. Now considered the wilder alternative to the Annapurna Circuit.',
  route_overview = 'Soti Khola → Machha Khola → Jagat → Deng → Namrung → Samagaun (acclimatization) → Samdo → Dharamsala → Larkya La (5,106m) → Bimthang → Dharapani.',
  highlights = ARRAY[
    'Cross Larkya La (5,106m)',
    'Manaslu (8,163m) close-up from Samagaun',
    'Pungyen Gompa and Birendra Tal',
    'Remote Tibetan-Buddhist villages',
    'Manaslu Conservation Area wildlife'
  ],
  safety_notes = ARRAY[
    'Restricted area: a licensed guide and a group of at least 2 trekkers are mandatory.',
    'Larkya La is long (10-12h) and exposed to wind — start before 4am.',
    'Limited evacuation infrastructure — comprehensive insurance is essential.',
    'Limited connectivity above Namrung.'
  ],
  best_seasons = ARRAY['Spring (Mar-May)', 'Autumn (Sep-Nov)'],
  permit_required = true,
  permit_details = 'Three permits: Manaslu Restricted Area Permit (RAP), Manaslu Conservation Area Permit (MCAP), and Annapurna Conservation Area Permit (ACAP, for the final stage after Larkya La). RAP must be arranged via a registered Nepali agency.',
  permit_costs = '[
    {
      "permit_name": "Manaslu Restricted Area Permit (Sep-Nov)",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 13300, "notes": "USD 100 first 7 days + USD 15/day after"}
      ],
      "notes": "Must be arranged via a registered trekking agency. Rates shown in NPR are approximate (USD-pegged)."
    },
    {
      "permit_name": "Manaslu Restricted Area Permit (Dec-Aug)",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 9975, "notes": "USD 75 first 7 days + USD 10/day after"}
      ],
      "notes": "Off-season rate."
    },
    {
      "permit_name": "MCAP (Manaslu Conservation Area)",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000}
      ]
    },
    {
      "permit_name": "ACAP (final stage)",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000}
      ],
      "notes": "Required for the descent through Dharapani."
    }
  ]'::jsonb,
  is_verified = true,
  last_verified_at = timezone('utc', now())
WHERE slug IN ('manaslu-circuit', 'manaslu-circuit-trek', 'manaslu');

DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('manaslu-circuit', 'manaslu-circuit-trek', 'manaslu')
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Kathmandu → Soti Khola', 'Long drive (8-9h) via Arughat to Soti Khola at the trailhead.', 'Soti Khola', 700),
  (2, 'Soti Khola to Machha Khola', 'Follow the Budhi Gandaki river through subtropical hillsides.', 'Machha Khola', 870),
  (3, 'Machha Khola to Jagat', 'Cross hot springs at Tatopani; enter the restricted area zone at Jagat.', 'Jagat', 1340),
  (4, 'Jagat to Deng', 'Narrow gorge sections through Sirdibas and Philim.', 'Deng', 1860),
  (5, 'Deng to Namrung', 'Tibetan-Buddhist culture begins; mani walls and prayer wheels appear.', 'Namrung', 2630),
  (6, 'Namrung to Samagaun', 'Lho village views of Manaslu; arrive in Samagaun, the cultural heart of the trek.', 'Samagaun', 3530),
  (7, 'Acclimatization in Samagaun', 'Side hike to Pungyen Gompa or Birendra Tal at the foot of Manaslu.', 'Samagaun', 3530),
  (8, 'Samagaun to Samdo', 'Short ascent toward the Tibet border to Samdo, the last village before the pass.', 'Samdo', 3875),
  (9, 'Samdo to Dharamsala (Larkya Phedi)', 'Push to high camp at the foot of Larkya La.', 'Dharamsala', 4460),
  (10, 'Cross Larkya La (5,106m) to Bimthang', 'Long, cold pass day starting before dawn; descend dramatically into Bimthang basin.', 'Bimthang', 3590),
  (11, 'Bimthang to Tilije', 'Long descent through pine forests.', 'Tilije', 2300),
  (12, 'Tilije to Dharapani', 'Join the Annapurna Circuit trail at Dharapani.', 'Dharapani', 1860),
  (13, 'Dharapani → Besisahar → Kathmandu', 'Jeep then bus back to Kathmandu.', 'Kathmandu', 1400)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug IN ('manaslu-circuit', 'manaslu-circuit-trek', 'manaslu');

DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('manaslu-circuit', 'manaslu-circuit-trek', 'manaslu')
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('Department of Immigration – Restricted Area Permits', 'https://immigration.gov.np/', 'official', 'Issuing authority for the Manaslu RAP.'),
  ('NTNC – Manaslu Conservation Area Project', 'https://ntnc.org.np/project/manaslu-conservation-area-project-mcap', 'official', 'MCAP entry fee reference.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug IN ('manaslu-circuit', 'manaslu-circuit-trek', 'manaslu');

-- ----------------------------------------------------------------------------
-- 7) UPPER MUSTANG TREK
-- ----------------------------------------------------------------------------
UPDATE public.treks SET
  region = 'Mustang / Trans-Himalaya',
  difficulty = 'Moderate',
  duration_days = 12,
  max_altitude = 3840,
  description = 'A culturally rich trek into the once-forbidden Kingdom of Lo, a Tibetan-Buddhist enclave in Nepal''s trans-Himalayan rain shadow. Dramatic eroded canyons, cave monasteries, and the walled capital Lo Manthang.',
  route_overview = 'Jomsom → Kagbeni → Chele → Syangboche → Ghami → Charang → Lo Manthang (3,840m) → return via Drakmar/Ghar Gompa → Jomsom.',
  highlights = ARRAY[
    'Walled capital of Lo Manthang',
    'Ghar Gompa (8th-century monastery)',
    'Sky caves of Chhoser',
    'Trans-Himalayan desert landscapes',
    'Trekkable through monsoon (rain shadow)'
  ],
  safety_notes = ARRAY[
    'Restricted area: licensed guide and a group of at least 2 trekkers required.',
    'Strong afternoon winds from 11am — start daily walks early.',
    'Dry, dusty terrain; carry SPF, lip balm, and 3-4L water per day.',
    'Limited medical facilities; carry a comprehensive first-aid kit.'
  ],
  best_seasons = ARRAY['Spring (Mar-May)', 'Summer (Jun-Aug, rain shadow)', 'Autumn (Sep-Nov)'],
  permit_required = true,
  permit_details = 'Upper Mustang Restricted Area Permit + ACAP. RAP must be arranged via a registered Nepali agency.',
  permit_costs = '[
    {
      "permit_name": "Upper Mustang Restricted Area Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 66500, "notes": "USD 500 for first 10 days + USD 50/day after"}
      ],
      "notes": "Must be arranged via a registered trekking agency. Rate shown in NPR is approximate (USD-pegged)."
    },
    {
      "permit_name": "ACAP Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000},
        {"audience": "Nepali", "amount_npr": 100}
      ]
    }
  ]'::jsonb,
  is_verified = true,
  last_verified_at = timezone('utc', now())
WHERE slug IN ('upper-mustang', 'upper-mustang-trek', 'mustang');

DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('upper-mustang', 'upper-mustang-trek', 'mustang')
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Pokhara → Jomsom → Kagbeni', 'Morning flight to Jomsom, then walk up the Kali Gandaki to Kagbeni — the gateway to Upper Mustang.', 'Kagbeni', 2810),
  (2, 'Kagbeni to Chele', 'Restricted-area checkpost. Cross the river and climb to Chele.', 'Chele', 3050),
  (3, 'Chele to Syangboche', 'Cross Taklam La and Dajori La passes for striking eroded-canyon views.', 'Syangboche', 3800),
  (4, 'Syangboche to Ghami', 'Pass through Geling, visit Ghar Gompa if time permits.', 'Ghami', 3520),
  (5, 'Ghami to Charang', 'Cross the longest mani wall in Nepal; arrive in Charang, the medieval royal village.', 'Charang', 3560),
  (6, 'Charang to Lo Manthang', 'Cross Lo La pass into the walled capital city, founded in 1380.', 'Lo Manthang', 3840),
  (7, 'Exploration day in Lo Manthang', 'Visit Jampa, Thubchen, and Choede monasteries inside the walls; side trip to Chhoser sky caves.', 'Lo Manthang', 3840),
  (8, 'Lo Manthang to Drakmar', 'Return via the western route through Ghar Gompa.', 'Drakmar', 3820),
  (9, 'Drakmar to Ghiling', 'Steep canyon trail back to Ghiling.', 'Ghiling', 3570),
  (10, 'Ghiling to Chhusang', 'Long descent back to the Kali Gandaki.', 'Chhusang', 2980),
  (11, 'Chhusang to Jomsom', 'Final walk via Kagbeni to Jomsom.', 'Jomsom', 2720),
  (12, 'Fly Jomsom → Pokhara', 'Morning flight back (wind delays possible).', 'Pokhara', 820)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug IN ('upper-mustang', 'upper-mustang-trek', 'mustang');

DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('upper-mustang', 'upper-mustang-trek', 'mustang')
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('Department of Immigration – Restricted Area Permits', 'https://immigration.gov.np/', 'official', 'Upper Mustang RAP authority.'),
  ('NTNC – Annapurna Conservation Area', 'https://ntnc.org.np/project/annapurna-conservation-area-project-acap', 'official', 'ACAP fees and rules.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug IN ('upper-mustang', 'upper-mustang-trek', 'mustang');

-- ----------------------------------------------------------------------------
-- 8) GHOREPANI POON HILL TREK
-- ----------------------------------------------------------------------------
UPDATE public.treks SET
  region = 'Annapurna / Gandaki',
  difficulty = 'Easy',
  duration_days = 4,
  max_altitude = 3210,
  description = 'A short and approachable trek through Magar and Gurung villages culminating in a sunrise from Poon Hill — one of Nepal''s most famous viewpoints. Perfect for first-time trekkers or shorter trips.',
  route_overview = 'Pokhara → Nayapul → Tikhedhunga → Ghorepani → Poon Hill (3,210m) at sunrise → Tadapani → Ghandruk → Nayapul → Pokhara.',
  highlights = ARRAY[
    'Sunrise from Poon Hill (3,210m)',
    'Sweeping Annapurna & Dhaulagiri panorama',
    'Magar and Gurung village culture',
    'Rhododendron forest (spring)',
    'Beginner-friendly altitude and duration'
  ],
  safety_notes = ARRAY[
    'Stone steps are steep both directions — sturdy boots and trekking poles strongly recommended.',
    'Trail can be slippery during and after monsoon.',
    'Watch for leeches in summer.',
    'Crowded in October-November — book teahouses ahead.'
  ],
  best_seasons = ARRAY['Spring (Mar-May)', 'Autumn (Sep-Nov)', 'Winter (Dec-Feb)'],
  permit_required = true,
  permit_details = 'ACAP permit + TIMS card. Both available at Nepal Tourism Board Pokhara.',
  permit_costs = '[
    {
      "permit_name": "ACAP Entry Permit",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 3000},
        {"audience": "SAARC", "amount_npr": 1000},
        {"audience": "Nepali", "amount_npr": 100}
      ]
    },
    {
      "permit_name": "TIMS Card",
      "required": true,
      "costs": [
        {"audience": "Foreigner", "amount_npr": 2000},
        {"audience": "SAARC", "amount_npr": 1000}
      ]
    }
  ]'::jsonb,
  is_verified = true,
  last_verified_at = timezone('utc', now())
WHERE slug IN ('poon-hill', 'ghorepani-poon-hill', 'ghorepani-poon-hill-trek');

DELETE FROM public.trek_itineraries
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('poon-hill', 'ghorepani-poon-hill', 'ghorepani-poon-hill-trek')
);

INSERT INTO public.trek_itineraries (trek_id, day_number, title, summary, overnight_place, altitude_m)
SELECT t.id, d.day_number, d.title, d.summary, d.overnight_place, d.altitude_m
FROM public.treks t
CROSS JOIN (VALUES
  (1, 'Pokhara → Nayapul → Tikhedhunga', 'Drive to Nayapul, then a 3-4h walk along the Bhurungdi Khola to Tikhedhunga.', 'Tikhedhunga', 1480),
  (2, 'Tikhedhunga to Ghorepani', 'The famous 3,200+ stone steps of Ulleri, then forest trail to Ghorepani.', 'Ghorepani', 2860),
  (3, 'Poon Hill sunrise → Tadapani', 'Pre-dawn climb to Poon Hill (3,210m) for sunrise over Dhaulagiri and Annapurna, then traverse to Tadapani via Deurali.', 'Tadapani', 2630),
  (4, 'Tadapani → Ghandruk → Pokhara', 'Descend through Ghandruk village (Gurung cultural museum) and on to Nayapul to drive back to Pokhara.', 'Pokhara', 820)
) AS d(day_number, title, summary, overnight_place, altitude_m)
WHERE t.slug IN ('poon-hill', 'ghorepani-poon-hill', 'ghorepani-poon-hill-trek');

DELETE FROM public.trek_sources
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('poon-hill', 'ghorepani-poon-hill', 'ghorepani-poon-hill-trek')
);

INSERT INTO public.trek_sources (trek_id, source_name, source_url, source_type, notes)
SELECT t.id, s.source_name, s.source_url, s.source_type, s.notes
FROM public.treks t
CROSS JOIN (VALUES
  ('NTNC – Annapurna Conservation Area', 'https://ntnc.org.np/project/annapurna-conservation-area-project-acap', 'official', 'ACAP fees and boundaries.'),
  ('Nepal Tourism Board – Trekking', 'https://ntb.gov.np/plan-your-trip/trekking-and-mountaineering', 'official', 'TIMS issuance.')
) AS s(source_name, source_url, source_type, notes)
WHERE t.slug IN ('poon-hill', 'ghorepani-poon-hill', 'ghorepani-poon-hill-trek');

-- ============================================================================
-- DONE. Re-run anytime to refresh content.
-- Treks with slugs not listed above are untouched.
-- ============================================================================
