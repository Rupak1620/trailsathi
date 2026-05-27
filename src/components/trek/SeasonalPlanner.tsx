"use client";

import { useState } from "react";
import {
  Sun,
  CloudRain,
  Snowflake,
  Flame,
  Thermometer,
  Sparkles,
  ClipboardList,
  CheckSquare,
  Square,
  FileDown,
  Info,
} from "lucide-react";

type SeasonKey = "spring" | "monsoon" | "autumn" | "winter";

type SeasonData = {
  name: string;
  months: string;
  rating: "Excellent" | "Good" | "Challenging" | "Difficult/Not Recommended";
  ratingColor: string;
  ratingBg: string;
  highAltitudeTemp: string;
  lowAltitudeTemp: string;
  overview: string;
  specialAdvice: string;
  extraGear: string[];
};

const seasonalInfo: Record<SeasonKey, SeasonData> = {
  spring: {
    name: "Spring",
    months: "March – May",
    rating: "Excellent",
    ratingColor: "text-emerald-700 border-emerald-200",
    ratingBg: "bg-emerald-50",
    highAltitudeTemp: "-5°C to 10°C",
    lowAltitudeTemp: "15°C to 25°C",
    overview: "One of the two peak seasons in Nepal. Clear mornings, warm trekking temperatures, and brilliant red and pink rhododendrons blooming across the forests.",
    specialAdvice: "Afternoon clouds can bring light rain or high-altitude snow. Start your daily trekking early (usually by 7:00 AM) to beat the clouds.",
    extraGear: ["UV-protected sunglasses (Category 3-4)", "Trekking poles (for snowmelt sections)", "Lightweight windbreaker", "Allergy medication (for pollen)"],
  },
  monsoon: {
    name: "Monsoon",
    months: "June – August",
    rating: "Challenging",
    ratingColor: "text-amber-700 border-amber-200",
    ratingBg: "bg-amber-50",
    highAltitudeTemp: "5°C to 15°C",
    lowAltitudeTemp: "20°C to 30°C",
    overview: "Characterized by heavy rainfall, wet trails, slippery rocks, and low visibility. Landslides often block roads and flights, but the countryside turns incredibly green and waterfalls are roaring.",
    specialAdvice: "Be prepared for leeches in forested trails and flight delays. Stick to rain-shadow regions like Upper Mustang or Manang which receive far less rainfall.",
    extraGear: ["Gore-Tex or high-rating waterproof hard shell", "Waterproof gaiters (stops mud & leeches)", "Salt or leech-repellent spray", "Dry bags / waterproof pack covers"],
  },
  autumn: {
    name: "Autumn",
    months: "September – November",
    rating: "Excellent",
    ratingColor: "text-emerald-700 border-emerald-200",
    ratingBg: "bg-emerald-50",
    highAltitudeTemp: "-10°C to 8°C",
    lowAltitudeTemp: "10°C to 20°C",
    overview: "The absolute best season for Nepalese trekking. Post-monsoon winds sweep away dust, providing crystal clear, razor-sharp views of the peaks. Highly stable atmospheric pressure reduces safety risks.",
    specialAdvice: "Teahouses get very crowded. Book flights/permits early. Nights get extremely cold above 3,500m, easily dipping below freezing.",
    extraGear: ["-10°C to -15°C rated sleeping bag", "Heavyweight down jacket (800+ fill power)", "Thermal base layers (merino wool)", "Good quality lip balm & moisturizer"],
  },
  winter: {
    name: "Winter",
    months: "December – February",
    rating: "Difficult/Not Recommended",
    ratingColor: "text-blue-700 border-blue-200",
    ratingBg: "bg-blue-50",
    highAltitudeTemp: "-22°C to 3°C",
    lowAltitudeTemp: "5°C to 15°C",
    overview: "Freezing temperatures and heavy snow. High-altitude passes (like Thorong La or Cho La) are often completely closed. However, lower trails are peaceful, empty, and skies are generally clear.",
    specialAdvice: "Ensure your gear is cold-certified. Many high-altitude teahouses close; confirm open accommodations beforehand. Keep daily stages shorter due to less daylight.",
    extraGear: ["Microspikes / crampons", "Balaclava & insulated neck gaiter", "Insulated winter trekking boots", "Rechargeable hand warmers (batteries drain fast in cold)"],
  },
};

const basePackingList = [
  { item: "Valid Passport & Permits", category: "Documents" },
  { item: "Cash (NPR) - ATM access is rare on trails", category: "Documents" },
  { item: "Sturdy hiking boots (broken-in)", category: "Clothing" },
  { item: "Moisture-wicking socks (3-4 pairs)", category: "Clothing" },
  { item: "First-aid kit with altitude medicine (Acetazolamide/Diamox)", category: "Safety" },
  { item: "Water purification tablets or filter bottle", category: "Gear" },
  { item: "LED Headlamp with spare batteries", category: "Gear" },
  { item: "Trekking towel & eco-friendly soap", category: "Personal" },
];

export function SeasonalPlanner() {
  const [selectedSeason, setSelectedSeason] = useState<SeasonKey>("autumn");
  const [packingItems, setPackingList] = useState<Array<{ item: string; checked: boolean; category: string }>>(() => {
    // initialize packing list with baseline items
    return basePackingList.map((p) => ({ ...p, checked: false }));
  });

  const activeSeason = seasonalInfo[selectedSeason];

  // Dynamic packing list combining base items and seasonal gear
  const displayPackingList = [
    ...packingItems,
    ...activeSeason.extraGear.map((g) => ({
      item: `${g} (Season Essential)`,
      checked: false,
      category: "Seasonal",
    })),
  ];

  const [toggledStates, setToggledStates] = useState<Record<string, boolean>>({});

  const handleToggle = (itemText: string) => {
    setToggledStates((prev) => ({
      ...prev,
      [itemText]: !prev[itemText],
    }));
  };

  const completedCount = Object.values(toggledStates).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / displayPackingList.length) * 100);

  const getSeasonIcon = (season: SeasonKey) => {
    switch (season) {
      case "spring":
        return <Flame className="h-5 w-5 text-orange-500" />;
      case "monsoon":
        return <CloudRain className="h-5 w-5 text-blue-500" />;
      case "autumn":
        return <Sun className="h-5 w-5 text-amber-500" />;
      case "winter":
        return <Snowflake className="h-5 w-5 text-sky-500" />;
    }
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900">Seasonal Weather &amp; Smart Gear Planner</h2>
          <p className="text-sm text-stone-500 mt-1">Select your planned trekking season to generate custom safety tips and packing list.</p>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-100 shrink-0 self-start sm:self-auto">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Interactive Tool</span>
        </div>
      </div>

      {/* Season Selector Tabs */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {(Object.keys(seasonalInfo) as SeasonKey[]).map((key) => {
          const active = selectedSeason === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setSelectedSeason(key);
                setToggledStates({}); // reset checkboxes on season change
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                active
                  ? "border-stone-900 bg-stone-900 text-white shadow-md scale-[1.02]"
                  : "border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100/65"
              }`}
            >
              <div className="mb-1.5">{getSeasonIcon(key)}</div>
              <span className="text-xs font-bold block">{seasonalInfo[key].name}</span>
              <span className={`text-[10px] block mt-0.5 ${active ? "text-stone-300" : "text-stone-400"}`}>
                {seasonalInfo[key].months.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detailed Weather Cards */}
      <div className="grid gap-6 md:grid-cols-[1fr_0.9fr] mb-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-stone-400">Trek Window Status:</span>
            <span className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${activeSeason.ratingBg} ${activeSeason.ratingColor}`}>
              {activeSeason.rating}
            </span>
          </div>

          <p className="text-sm leading-7 text-stone-600 font-medium">
            {activeSeason.overview}
          </p>

          <div className="rounded-xl bg-stone-50 border p-4 flex gap-3">
            <Info className="h-5 w-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-stone-800 block">TrailSathi Expert Advice:</span>
              <p className="text-xs text-stone-600 mt-1 leading-5">{activeSeason.specialAdvice}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 p-5 space-y-4 bg-stone-50/50">
          <h3 className="text-sm font-bold text-stone-800 flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-emerald-600" />
            Altitude Temperatures
          </h3>

          <div className="divide-y divide-stone-100">
            <div className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">Lower Trail Valley (e.g. Lukla/Besisahar)</span>
              <span className="font-bold text-stone-800">{activeSeason.lowAltitudeTemp}</span>
            </div>
            <div className="py-2.5 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-medium">High Passes / Base Camps (above 4,500m)</span>
              <span className="font-bold text-stone-800 text-emerald-700">{activeSeason.highAltitudeTemp}</span>
            </div>
          </div>

          <div className="text-[10px] text-stone-400 leading-4">
            * Temperatures are typical averages. Mountain microclimates can change drastically within hours. Always monitor local forecasts before leaving.
          </div>
        </div>
      </div>

      {/* Checklist section */}
      <div className="border-t border-stone-100 pt-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <ClipboardList className="h-4 w-4 text-emerald-600" />
            Interactive Packing Checklist ({completedCount}/{displayPackingList.length} packed)
          </h3>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs font-semibold text-stone-600 bg-white hover:bg-stone-50 transition-colors"
          >
            <FileDown className="h-3.5 w-3.5" /> Print Checklist
          </button>
        </div>

        {/* Packing list progress bar */}
        <div className="mb-4 h-2 w-full rounded-full bg-stone-100 overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1 p-0.5">
          {displayPackingList.map((item, idx) => {
            const checked = !!toggledStates[item.item];
            return (
              <div
                key={`${item.item}-${idx}`}
                onClick={() => handleToggle(item.item)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer select-none transition-all ${
                  checked
                    ? "border-emerald-200 bg-emerald-50/30 text-stone-500 line-through"
                    : "border-stone-200 bg-white hover:border-emerald-200 text-stone-800"
                }`}
              >
                <div className="mt-0.5 shrink-0 text-emerald-600">
                  {checked ? <CheckSquare className="h-4.5 w-4.5" /> : <Square className="h-4.5 w-4.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{item.item}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    item.category === "Seasonal"
                      ? "bg-amber-100 text-amber-800"
                      : "bg-stone-100 text-stone-500"
                  }`}>
                    {item.category}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
