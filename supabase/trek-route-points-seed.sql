-- ============================================================================
-- TrailSathi — Trek Route Points Seed
-- ----------------------------------------------------------------------------
-- Accurate GPS waypoints, altitudes, and stay info for:
--   1. Everest Base Camp Trek (16 waypoints)
--   2. Manaslu Circuit Trek   (17 waypoints)
--
-- Coordinates sourced from published GPS tracks and trekking guides.
-- Prices are 2024 approximate USD per person per night (room only).
-- SAFE TO RE-RUN — deletes then re-inserts per trek.
-- ============================================================================

-- ── Helper: delete existing points for a trek before re-inserting ─────────────
DELETE FROM public.trek_route_points
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('everest-base-camp','everest-base-camp-trek','ebc')
);

DELETE FROM public.trek_route_points
WHERE trek_id IN (
  SELECT id FROM public.treks
  WHERE slug IN ('manaslu-circuit','manaslu-circuit-trek')
);

-- ============================================================================
-- 1. EVEREST BASE CAMP TREK
-- ============================================================================
INSERT INTO public.trek_route_points (
  trek_id, sequence_order, day_number,
  name, latitude, longitude, altitude_m,
  point_type, is_overnight, is_acclimatization_day,
  description, special_notes,
  stay_type, stay_name, stay_price_usd_min, stay_price_usd_max,
  stay_facilities
)
SELECT
  t.id,
  d.seq, d.day_no,
  d.name, d.lat, d.lon, d.alt,
  d.ptype::public.route_point_type,
  d.overnight, d.accli,
  d.descr, d.notes,
  d.stype::public.stay_type, d.sname, d.pmin, d.pmax,
  d.facilities
FROM public.treks t
CROSS JOIN (VALUES
  -- seq, day,  name,                          lat,       lon,       alt,    ptype,       overnight, accli, description,                                                          notes,                                                    stype,          sname,                         pmin, pmax, facilities
  (1,  1,  'Lukla (Tenzing-Hillary Airport)',   27.6868,  86.7294,   2860,   'start',     true,  false, 'Gateway to Everest. 35-minute mountain flight from Kathmandu. Trek begins immediately after landing.', 'Flights frequently cancelled — keep 2 extra buffer days.', 'teahouse', 'Lukla Lodge',               5,   15, ARRAY['Restaurant','Charging','Wi-Fi']),
  (2,  1,  'Phakding',                          27.7388,  86.7122,   2610,   'village',   true,  false, 'Gentle first-day walk alongside the Dudh Koshi river. Good acclimatization stop at lower altitude.', NULL, 'teahouse', 'River View Guesthouse',      5,   12, ARRAY['Restaurant','Charging']),
  (3,  2,  'Monjo (Sagarmatha NP Gate)',         27.7742,  86.7222,   2835,   'village',   false, false, 'National Park entrance checkpoint. Permits verified here.',                                            'Sagarmatha NP permit checked here.', 'none', NULL, NULL, NULL, ARRAY[]::text[]),
  (4,  2,  'Namche Bazaar',                      27.8063,  86.7139,   3440,   'village',   true,  true,  'The Sherpa capital and main trading hub of Khumbu. Bustling Saturday market, ATMs, bakeries, and gear shops.', 'Two nights here mandatory for acclimatization.', 'lodge', 'Hotel Everest View Namche',  15,  40, ARRAY['Wi-Fi','Hot shower','Charging','Restaurant','Western toilet','ATM nearby']),
  (5,  3,  'Namche Bazaar (Acclimatization)',    27.8063,  86.7139,   3440,   'village',   true,  true,  'Rest day. Hike up to Everest View Hotel (3,880m) for first views of Everest and Ama Dablam.', 'Do NOT ascend above 3,900m today. Return to sleep at 3,440m.', 'lodge', 'Hotel Everest View Namche', 15,  40, ARRAY['Wi-Fi','Hot shower','Charging','Restaurant','Western toilet','ATM nearby']),
  (6,  4,  'Tengboche',                          27.8362,  86.7642,   3860,   'monastery', true,  false, 'Site of the famous Tengboche Monastery, framed by Ama Dablam and Everest. One of the great views on earth.', NULL, 'teahouse', 'Tashi Delek Lodge',         8,   20, ARRAY['Restaurant','Charging','Monastery views']),
  (7,  5,  'Dingboche',                          27.8940,  86.8321,   4410,   'village',   true,  true,  'High alpine plateau with wide-open views of Lhotse and Island Peak. Treeline ends here.',               'Two nights for acclimatization above 4,000m.', 'teahouse', 'Himalayan Hotel Dingboche',  8,   18, ARRAY['Restaurant','Charging','Yak-dung heating']),
  (8,  6,  'Dingboche (Acclimatization)',        27.8940,  86.8321,   4410,   'village',   true,  true,  'Acclimatization hike to Nangkartshang Ridge (5,083m) for panoramic Makalu and Island Peak views.',     'Sleep at 4,410m after hiking to 5,083m — classic "climb high, sleep low".', 'teahouse', 'Himalayan Hotel Dingboche', 8, 18, ARRAY['Restaurant','Charging','Yak-dung heating']),
  (9,  7,  'Lobuche',                            27.9503,  86.8085,   4940,   'village',   true,  false, 'Scattered teahouses on the Khumbu Glacier moraine. Pass Thukla climbers memorial chortens on the way up.', 'Very cold at night. Facilities basic.', 'teahouse', 'Lobuche Guest House',       10,  20, ARRAY['Restaurant','Charging','Basic heating']),
  (10, 8,  'Gorak Shep',                         27.9800,  86.8247,   5164,   'village',   true,  false, 'Last stop before EBC. A flat sandy plain with a few teahouses. Altitude effects felt strongly here.',   'Expect poor sleep, headaches, and reduced appetite.', 'teahouse', 'Gorak Shep Lodge',          12,  25, ARRAY['Restaurant','Basic heating','Charging (limited)']),
  (11, 8,  'Everest Base Camp',                  27.9997,  86.8516,   5364,   'base_camp', false, false, 'The iconic Base Camp at the foot of the Khumbu Icefall. Crowded with expedition tents in season.', 'Day visit only — return to Gorak Shep to sleep.', 'none', NULL, NULL, NULL, ARRAY[]::text[]),
  (12, 9,  'Kala Patthar',                       27.9943,  86.8330,   5545,   'viewpoint', false, false, 'The finest close-up panorama of Everest on the planet. Summit at dawn for windless skies and perfect light.', 'Start before 4 am for pre-sunrise colours. Wind can be extreme.', 'none', NULL, NULL, NULL, ARRAY[]::text[]),
  (13, 9,  'Pheriche',                           27.8940,  86.8100,   4280,   'village',   true,  false, 'Descent day stop with the Himalayan Rescue Association (HRA) clinic — excellent trekkers'' medical post.',  'HRA clinic holds free altitude-sickness lectures each afternoon.', 'teahouse', 'Trekkers Inn Pheriche',     8,   18, ARRAY['Restaurant','Charging','HRA clinic nearby']),
  (14, 10, 'Namche Bazaar',                      27.8063,  86.7139,   3440,   'village',   true,  false, 'Return to Namche. Knees take the strain on the long descent from high camp.',                           NULL, 'lodge', 'Hotel Everest View Namche',  15,  40, ARRAY['Wi-Fi','Hot shower','Charging','Restaurant','ATM nearby']),
  (15, 11, 'Lukla',                              27.6868,  86.7294,   2860,   'village',   true,  false, 'Final night in Lukla. Celebratory dinner with your guide team.',                                       'Confirm return flight the evening before.', 'teahouse', 'Lukla Lodge',               5,   15, ARRAY['Restaurant','Charging','Wi-Fi']),
  (16, 12, 'Lukla (Departure)',                  27.6868,  86.7294,   2860,   'end',       false, false, 'Return flight to Kathmandu (or continue to Ramechhap in bad weather).',                               NULL, 'none', NULL, NULL, NULL, ARRAY[]::text[])
) AS d(seq, day_no, name, lat, lon, alt, ptype, overnight, accli, descr, notes, stype, sname, pmin, pmax, facilities)
WHERE t.slug IN ('everest-base-camp','everest-base-camp-trek','ebc');


-- ============================================================================
-- 2. MANASLU CIRCUIT TREK
-- ============================================================================
INSERT INTO public.trek_route_points (
  trek_id, sequence_order, day_number,
  name, latitude, longitude, altitude_m,
  point_type, is_overnight, is_acclimatization_day,
  description, special_notes,
  stay_type, stay_name, stay_price_usd_min, stay_price_usd_max,
  stay_facilities
)
SELECT
  t.id,
  d.seq, d.day_no,
  d.name, d.lat, d.lon, d.alt,
  d.ptype::public.route_point_type,
  d.overnight, d.accli,
  d.descr, d.notes,
  d.stype::public.stay_type, d.sname, d.pmin, d.pmax,
  d.facilities
FROM public.treks t
CROSS JOIN (VALUES
  -- seq, day,  name,                        lat,       lon,       alt,  ptype,       overnight, accli, description,                                                             notes,                                                      stype,         sname,                         pmin, pmax, facilities
  (1,  1,  'Soti Khola',                    28.3461,  84.7497,   710,   'start',     true,  false, 'Dusty roadhead trailhead on the Budhi Gandaki. Trek begins amid subtropical jungle.', 'Drive from Kathmandu (7–8 hrs) or overnight bus.', 'teahouse', 'Manaslu Guest House',    3,   8,  ARRAY['Restaurant','Charging']),
  (2,  2,  'Machha Khola',                  28.4003,  84.7236,   869,   'village',   true,  false, 'Small village at river confluence. Views of waterfalls and terraced farmland begin here.', NULL, 'teahouse', 'Riverside Lodge',         3,   8,  ARRAY['Restaurant','Charging']),
  (3,  3,  'Jagat',                          28.4583,  84.6931,   1340,  'village',   true,  false, 'First checkpoint for Manaslu restricted area permits. Tibetan cultural influences begin.', 'Manaslu Restricted Area Permit checked here.', 'teahouse', 'Hotel Mountain View',    4,   10, ARRAY['Restaurant','Charging','Permit checkpoint']),
  (4,  4,  'Deng',                           28.5106,  84.6469,   1860,  'village',   true,  false, 'Mixed Gurung-Tibetan village. Dramatic gorge narrows here with cliffs on both sides.', NULL, 'teahouse', 'Manaslu View Guest House',4,   10, ARRAY['Restaurant','Charging']),
  (5,  5,  'Namrung',                        28.5786,  84.6097,   2630,  'village',   true,  false, 'First Tibetan-style village with mani walls and prayer flags. Views of Sringi Himal.',  NULL, 'teahouse', 'Himalayan Lodge',         4,   10, ARRAY['Restaurant','Charging','Local brewery']),
  (6,  6,  'Lho',                            28.6067,  84.5878,   3180,  'village',   true,  false, 'Spectacular village with the first full face-on view of Mt. Manaslu (8,163m).',           NULL, 'teahouse', 'Manaslu View Lodge',      5,   12, ARRAY['Restaurant','Charging','Manaslu views']),
  (7,  7,  'Sama Gaun',                      28.6461,  84.5650,   3450,  'village',   true,  true,  'Largest village on the circuit. Tibetan monastery, yak pastures, and acclimatization hike to Manaslu Base Camp available.', 'Spend 2 nights here for acclimatization before Larkya La.', 'teahouse', 'Sama Lodge',             5,   15, ARRAY['Restaurant','Charging','Wi-Fi (limited)','Monastery nearby']),
  (8,  8,  'Sama Gaun (Acclimatization)',    28.6461,  84.5650,   3450,  'village',   true,  true,  'Acclimatization day — day hike toward Manaslu Base Camp (4,480m) or Birendra Lake (3,500m).', 'Sleep low at Sama Gaun.', 'teahouse', 'Sama Lodge', 5, 15, ARRAY['Restaurant','Charging','Wi-Fi (limited)','Monastery nearby']),
  (9,  9,  'Samdo',                          28.6719,  84.5281,   3690,  'village',   true,  false, 'Final village before Larkya La. Ancient salt-trade route crossed into Tibet here.', 'Last proper phone signal. Cold nights.', 'teahouse', 'Samdo Guest House',       5,   12, ARRAY['Restaurant','Charging','Yak-dung heating']),
  (10, 10, 'Dharmasala (Larkya Base Camp)',  28.6783,  84.5028,   4460,  'camp',      true,  false, 'Basic stone shelters and tents at the foot of Larkya La. Very cold and windy.',           'Start for the pass crossing is 2–3 am. Sleep early. Bring warm layers.', 'teahouse', 'Larkya Tea House',        6,   12, ARRAY['Restaurant','Yak-dung heating','Basic only']),
  (11, 11, 'Larkya La Pass',                 28.6877,  84.5564,   5106,  'pass',      false, false, 'The dramatic 5,106m high point of the circuit with views of Himlung, Cheo, and Annapurna II.', 'Narrow trail, steep descent on far side. Not attempted in bad weather.', 'none', NULL, NULL, NULL, ARRAY[]::text[]),
  (12, 11, 'Bimthang',                       28.6528,  84.4822,   3720,  'village',   true,  false, 'Green valley on the far side of Larkya La. The altitude drop and vegetation feel euphoric after the pass.', NULL, 'teahouse', 'Bimthang Guest House',    5,   12, ARRAY['Restaurant','Charging','Hot shower']),
  (13, 12, 'Gho / Tilije',                   28.5956,  84.4394,   2300,  'village',   true,  false, 'Dramatic descent through rhododendron and pine forest into a warmer lower valley.',              NULL, 'teahouse', 'Tilije Lodge',            4,   10, ARRAY['Restaurant','Charging']),
  (14, 13, 'Tal',                             28.5378,  84.3972,   1700,  'village',   true,  false, 'Wide flat valley floor — the bed of an ancient glacial lake. Waterfalls cascading off the cliffs.', NULL, 'teahouse', 'Tal Guest House',         4,   10, ARRAY['Restaurant','Charging']),
  (15, 14, 'Dharapani',                       28.5000,  84.3692,   1920,  'village',   false, false, 'Junction with the Annapurna Circuit trail. Permits checked on exit.',                          'Manaslu permit checked on exit here.', 'none', NULL, NULL, NULL, ARRAY[]::text[]),
  (16, 14, 'Besisahar / Beshishahar',        28.2342,  84.3844,   760,   'village',   true,  false, 'Road-head town. Drive from Dharapani (~2 hrs) or continue trekking.',                         NULL, 'lodge', 'Hotel Mountain View Besi', 5,   15, ARRAY['Restaurant','Hot shower','Charging','Wi-Fi']),
  (17, 14, 'Kathmandu (Drive back)',          27.7172,  85.3240,   1400,  'end',       false, false, 'Return to Kathmandu by bus or jeep via Besisahar (7–8 hrs).',                                  NULL, 'none', NULL, NULL, NULL, ARRAY[]::text[])
) AS d(seq, day_no, name, lat, lon, alt, ptype, overnight, accli, descr, notes, stype, sname, pmin, pmax, facilities)
WHERE t.slug IN ('manaslu-circuit','manaslu-circuit-trek');
