"use client";

import { useState } from "react";
import {
  Map,
  Compass,
  TrendingUp,
  MapPin,
  Activity,
  Award,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronRight,
  Eye,
} from "lucide-react";

type ItineraryDay = {
  id: string;
  day_number: number;
  title: string;
  overnight_place: string | null;
  altitude_m: number | null;
  summary: string | null;
};

type TrekItineraryMapProps = {
  trekName: string;
  itinerary: ItineraryDay[];
};

export function TrekItineraryMap({ trekName, itinerary }: TrekItineraryMapProps) {
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"elevation" | "terrain">("elevation");

  // Filter out days without altitudes or overnight places to map properly
  const stops = itinerary.length > 0 ? itinerary : [
    { id: "1", day_number: 1, title: "Start Point", overnight_place: "Lukla", altitude_m: 2860, summary: "Initial ascent and gear checks." },
    { id: "2", day_number: 2, title: "Phakding to Namche", overnight_place: "Namche Bazaar", altitude_m: 3440, summary: "Cross high suspension bridges into the Sherpa capital." },
    { id: "3", day_number: 3, title: "Acclimatization Day", overnight_place: "Namche Bazaar", altitude_m: 3440, summary: "Hike to Everest View Hotel to acclimate." },
    { id: "4", day_number: 4, title: "Namche to Tengboche", overnight_place: "Tengboche", altitude_m: 3860, summary: "Visit the iconic Tengboche Monastery with mountain backdrops." },
    { id: "5", day_number: 5, title: "Tengboche to Dingboche", overnight_place: "Dingboche", altitude_m: 4410, summary: "Enter the high alpine shrublands." },
    { id: "6", day_number: 6, title: "Dingboche to Lobuche", overnight_place: "Lobuche", altitude_m: 4940, summary: "Trek past the climber memorials." },
    { id: "7", day_number: 7, title: "Lobuche to Everest Base Camp", overnight_place: "Gorak Shep", altitude_m: 5364, summary: "Stand at the base of the world's highest peak." },
  ];

  const activeDay = stops[activeDayIndex] || stops[0];

  // Calculate ascent & statistics
  const altitudes = stops.map((s) => s.altitude_m || 2500);
  const minAlt = Math.min(...altitudes);
  const maxAlt = Math.max(...altitudes);
  const netAscent = maxAlt - minAlt;

  // Render SVG height coordinates dynamically
  const svgWidth = 600;
  const svgHeight = 180;
  const padding = 35;

  const points = stops.map((stop, i) => {
    const x = padding + (i / (stops.length - 1)) * (svgWidth - padding * 2);
    const alt = stop.altitude_m || 2500;
    // inverse Y because SVG (0,0) is top-left
    const y = svgHeight - padding - ((alt - minAlt) / (maxAlt - minAlt || 1)) * (svgHeight - padding * 2);
    return { x, y, alt, day: stop.day_number, label: stop.overnight_place || `Day ${stop.day_number}` };
  });

  // Create SVG path string
  const pathD = points.reduce((acc, p, i) => {
    return acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
  }, "");

  // Create gradient area path string (extends path to bottom of chart)
  const areaD = stops.length > 0 ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z` : "";

  // Derive dynamic map coordinates based on trek region
  const getMapIframeUrl = () => {
    let bbox = "86.73,27.65,86.99,28.01"; // Default Everest region box
    const nameLower = trekName.toLowerCase();
    if (nameLower.includes("annapurna") || nameLower.includes("mardi") || nameLower.includes("poon")) {
      bbox = "83.75,28.35,84.15,28.85"; // Annapurna
    } else if (nameLower.includes("manaslu")) {
      bbox = "84.50,28.45,85.10,28.90"; // Manaslu
    } else if (nameLower.includes("langtang")) {
      bbox = "85.40,28.10,85.75,28.30"; // Langtang
    } else if (nameLower.includes("mustang")) {
      bbox = "83.70,28.80,84.10,29.35"; // Mustang
    }
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=cyclemap&marker=${stops[activeDayIndex]?.altitude_m ? "27.8,86.9" : "28.5,83.9"}`;
  };

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Compass className="h-5.5 w-5.5 text-emerald-700 animate-spin-slow" />
            Interactive Trail Map &amp; Elevation Profile
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Tap stops along the route to inspect day-by-day altitude, overnight rest places, and safety warnings.
          </p>
        </div>
        <div className="flex bg-stone-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("elevation")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === "elevation" ? "bg-white text-stone-900 shadow-sm font-extrabold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            Altitude Profile
          </button>
          <button
            type="button"
            onClick={() => setViewMode("terrain")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              viewMode === "terrain" ? "bg-white text-stone-900 shadow-sm font-extrabold" : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            Topo map (Beta)
          </button>
        </div>
      </div>

      {viewMode === "elevation" ? (
        /* ELEVATION CHART & DAY DETAILS DUAL PANEL */
        <div className="space-y-6">
          {/* SVG Profile Chart */}
          <div className="bg-stone-50 border border-stone-150 rounded-xl p-4 overflow-x-auto select-none">
            <div className="min-w-[550px] relative">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                <defs>
                  <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#e5e5e5" strokeDasharray="3 3" />
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#d4d4d4" />

                {/* Chart Area */}
                {areaD && <path d={areaD} fill="url(#elevationGrad)" />}
                {pathD && <path d={pathD} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />}

                {/* Day Nodes */}
                {points.map((p, idx) => {
                  const active = idx === activeDayIndex;
                  return (
                    <g key={idx} className="cursor-pointer" onClick={() => setActiveDayIndex(idx)}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={active ? "7" : "5"}
                        fill={active ? "#047857" : "#ffffff"}
                        stroke="#059669"
                        strokeWidth={active ? "3.5" : "2"}
                        className="transition-all duration-300 hover:scale-125"
                      />
                      <text
                        x={p.x}
                        y={svgHeight - 12}
                        textAnchor="middle"
                        className={`text-[9px] font-mono tracking-tight ${active ? "font-bold fill-emerald-800" : "fill-stone-400"}`}
                      >
                        D{p.day}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Float Altitude Banner on selected node */}
              {points[activeDayIndex] && (
                <div
                  className="absolute pointer-events-none bg-emerald-700 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded shadow-md transform -translate-x-1/2 -translate-y-8 flex items-center gap-1 transition-all duration-300"
                  style={{
                    left: `${(points[activeDayIndex].x / svgWidth) * 100}%`,
                    top: `${(points[activeDayIndex].y / svgHeight) * 100}%`,
                  }}
                >
                  <TrendingUp className="h-2.5 w-2.5" />
                  {points[activeDayIndex].alt}m
                </div>
              )}
            </div>
          </div>

          {/* Connected Node Details Page */}
          <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] items-start animate-in fade-in duration-300">
            <div className="bg-stone-50 border border-stone-150 rounded-xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                  {activeDay.day_number}
                </span>
                <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">Active Segment Details</span>
              </div>

              <div>
                <h4 className="font-extrabold text-stone-900 text-base">{activeDay.title}</h4>
                <p className="text-xs text-stone-500 mt-1">Rest Stop: <span className="font-bold text-stone-800">{activeDay.overnight_place || "Camping"}</span></p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-white rounded-lg p-3 border border-stone-150">
                  <span className="text-[9px] font-bold text-stone-400 uppercase">Elevation</span>
                  <p className="text-sm font-extrabold text-emerald-700 font-mono mt-0.5">{activeDay.altitude_m ? `${activeDay.altitude_m}m` : "Pending"}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-stone-150">
                  <span className="text-[9px] font-bold text-stone-400 uppercase">AMS Danger</span>
                  <p className={`text-sm font-extrabold font-mono mt-0.5 ${(activeDay.altitude_m || 0) >= 4200 ? "text-red-600" : (activeDay.altitude_m || 0) >= 3000 ? "text-amber-600" : "text-emerald-700"}`}>
                    {(activeDay.altitude_m || 0) >= 4200 ? "Severe" : (activeDay.altitude_m || 0) >= 3000 ? "Moderate" : "Safe"}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">Day Schedule Summary</h4>
                <p className="text-xs text-stone-600 leading-6 mt-2">
                  {activeDay.summary || "No specific day segment summary written. Consult your registered guide before departure."}
                </p>
              </div>

              {/* Smart Acclimatization Note */}
              {(activeDay.altitude_m || 0) >= 3500 && (
                <div className="rounded-xl bg-amber-50/50 border border-amber-100 p-3.5 text-xs text-amber-900 flex gap-2.5">
                  <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-amber-950 block">High-Altitude Safety Guidelines</span>
                    <p className="text-[11px] opacity-90 mt-0.5 leading-5">
                      You are sleeping at <span className="font-bold font-mono">{activeDay.altitude_m}m</span>. Ascend slowly, drink ample garlic soup or water, and avoid sleeping immediately if you feel light headaches. Inform your guide.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation timeline triggers */}
              <div className="flex items-center gap-1.5 pt-3">
                <span className="text-[10px] uppercase font-bold text-stone-400">Step Timeline:</span>
                <div className="flex flex-wrap gap-1">
                  {stops.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveDayIndex(i)}
                      className={`h-6 w-6 rounded-md text-[10px] font-bold transition-all border ${
                        i === activeDayIndex
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-500 hover:bg-stone-100 border-stone-200"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* MAPS EMBED OR SATELLITE (IFRAME OPEN STREET MAP) */
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-stone-150 shadow-inner h-80 w-full bg-stone-100">
            <iframe
              title="Trek Route Embed Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              marginHeight={0}
              marginWidth={0}
              src={getMapIframeUrl()}
              className="grayscale-[10%] brightness-[0.98] contrast-[1.02]"
            />
            {/* Compass rose decoration overlay */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-stone-200 text-[10px] font-bold text-stone-600 flex items-center gap-1.5 shadow">
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
              <span>Hydraulic Cycle Map Grid</span>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-150 rounded-xl p-4 flex gap-3">
            <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-5 text-stone-600">
              <strong>Offline GPS Mapping Notice:</strong> This topological Cycle Map renders contours, suspension bridges, and safe drinking water refill spots. To download our full vector maps for offline GPS tracking, purchase a Premium Offline Permit Pack on our mobile application.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
