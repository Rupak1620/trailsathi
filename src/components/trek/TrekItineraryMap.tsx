"use client";

import { useEffect, useMemo, useState, lazy, Suspense } from "react";
import {
  Map,
  Compass,
  TrendingUp,
  Info,
  ShieldCheck,
  Eye,
  ClipboardList,
  Mountain,
} from "lucide-react";
import type { TrekRoutePoint } from "@/types/database";

// Lazy-load the heavy Mapbox component so it doesn't bloat the initial bundle
const TrekMap3D = lazy(() =>
  import("@/components/trek/TrekMap3D").then((m) => ({ default: m.TrekMap3D }))
);

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
  region?: string | null;
  /** When provided, renders the full 3D Mapbox trail map instead of the OSM iframe */
  routePoints?: TrekRoutePoint[];
};

type RegionKey =
  | "everest"
  | "annapurna"
  | "manaslu"
  | "langtang"
  | "mustang"
  | "kanchenjunga"
  | "dolpo"
  | "rara"
  | "default";

const regionBboxes: Record<RegionKey, string> = {
  everest: "86.73,27.65,86.99,28.01",
  annapurna: "83.75,28.35,84.15,28.85",
  manaslu: "84.50,28.45,85.10,28.90",
  langtang: "85.40,28.10,85.75,28.30",
  mustang: "83.70,28.80,84.10,29.35",
  kanchenjunga: "87.85,27.45,88.25,27.95",
  dolpo: "82.70,29.05,83.40,29.65",
  rara: "82.00,29.45,82.30,29.65",
  default: "80.50,26.80,88.30,30.20", // Nepal bounding box
};

function detectRegion(trekName: string, region?: string | null): RegionKey {
  const haystack = `${trekName ?? ""} ${region ?? ""}`.toLowerCase();
  if (/(everest|khumbu|gokyo|ebc|lukla|kala\s*patthar)/.test(haystack)) return "everest";
  if (/(annapurna|mardi|poon|ghorepani|abc|pokhara)/.test(haystack)) return "annapurna";
  if (/(manaslu|tsum|larkya)/.test(haystack)) return "manaslu";
  if (/(langtang|gosaikunda|helambu)/.test(haystack)) return "langtang";
  if (/(mustang|jomsom|muktinath|lo\s*manthang)/.test(haystack)) return "mustang";
  if (/(kanchenjunga)/.test(haystack)) return "kanchenjunga";
  if (/(dolpo|phoksundo|shey)/.test(haystack)) return "dolpo";
  if (/(rara)/.test(haystack)) return "rara";
  return "default";
}

export function TrekItineraryMap({ trekName, itinerary, region, routePoints = [] }: TrekItineraryMapProps) {
  const has3DRoute = routePoints.length > 0;
  const hasItinerary = itinerary.length > 0;
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"elevation" | "terrain" | "3d">(
    has3DRoute ? "3d" : "elevation"
  );

  useEffect(() => {
    setActiveDayIndex(0);
  }, [itinerary]);

  const regionKey = useMemo(() => detectRegion(trekName, region), [trekName, region]);
  const mapIframeUrl = useMemo(() => {
    const bbox = regionBboxes[regionKey];
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=cyclemap`;
  }, [regionKey]);

  const altitudes = hasItinerary
    ? itinerary
        .map((s) => s.altitude_m)
        .filter((v): v is number => typeof v === "number")
    : [];
  const minAlt = altitudes.length ? Math.min(...altitudes) : 0;
  const maxAlt = altitudes.length ? Math.max(...altitudes) : 0;

  const svgWidth = 600;
  const svgHeight = 180;
  const padding = 35;

  const points = hasItinerary
    ? itinerary.map((stop, i) => {
        const denom = Math.max(itinerary.length - 1, 1);
        const x = padding + (i / denom) * (svgWidth - padding * 2);
        const alt = stop.altitude_m ?? minAlt;
        const range = Math.max(maxAlt - minAlt, 1);
        const y =
          svgHeight -
          padding -
          ((alt - minAlt) / range) * (svgHeight - padding * 2);
        return {
          x,
          y,
          alt,
          day: stop.day_number,
          label: stop.overnight_place || `Day ${stop.day_number}`,
        };
      })
    : [];

  const pathD = points.reduce((acc, p, i) => {
    return acc + `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`;
  }, "");

  const areaD =
    points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`
      : "";

  const activeDay = hasItinerary ? itinerary[activeDayIndex] : null;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <Compass className="h-5 w-5 text-emerald-700" />
            Trail Map &amp; Elevation Profile
          </h2>
          <p className="text-sm text-stone-500 mt-1 max-w-prose">
            Day-by-day altitude, overnight stops, and safety notes from the verified itinerary.
          </p>
        </div>

        <div className="flex bg-stone-100 p-1 rounded-xl self-start">
          {has3DRoute && (
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "3d"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Mountain className="h-3.5 w-3.5" />
              3D Map
            </button>
          )}
          {hasItinerary && (
            <button
              type="button"
              onClick={() => setViewMode("elevation")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === "elevation"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Altitude
            </button>
          )}
          <button
            type="button"
            onClick={() => setViewMode("terrain")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === "terrain"
                ? "bg-white text-stone-900 shadow-sm"
                : "text-stone-600 hover:text-stone-900"
            }`}
          >
            <Map className="h-3.5 w-3.5" />
            Topo
          </button>
        </div>
      </div>

      {viewMode === "3d" && has3DRoute ? (
        <Suspense
          fallback={
            <div className="flex h-[520px] items-center justify-center rounded-2xl bg-stone-900">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
          }
        >
          <TrekMap3D trekName={trekName} points={routePoints} />
        </Suspense>
      ) : !hasItinerary ? (
        <div className="grid gap-4 md:grid-cols-[1fr_0.9fr] items-stretch">
          <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-2 text-stone-500">
              <ClipboardList className="h-5 w-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Itinerary pending</span>
            </div>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              A verified day-by-day itinerary for{" "}
              <span className="font-semibold text-stone-900">{trekName}</span> is being prepared.
            </p>
            <p className="mt-2 text-xs leading-5 text-stone-500">
              Once entries are added in Supabase <code className="rounded bg-stone-100 px-1 py-0.5 font-mono text-[11px]">trek_itineraries</code>,
              the elevation chart, day cards, and acclimatization warnings will render here automatically.
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-inner h-64 md:h-auto min-h-56 bg-stone-100">
            <iframe
              title={`${trekName} regional map`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={mapIframeUrl}
              className="brightness-[0.98] contrast-[1.02]"
            />
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-stone-200 text-[10px] font-semibold text-stone-600 flex items-center gap-1.5 shadow-sm">
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
              <span>Regional view</span>
            </div>
          </div>
        </div>
      ) : viewMode === "elevation" ? (
        <div className="space-y-6">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 overflow-x-auto select-none">
            <div className="min-w-[550px] relative">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto">
                <defs>
                  <linearGradient id="elevationGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#e5e5e5" strokeDasharray="3 3" />
                <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#d4d4d4" />

                {areaD && <path d={areaD} fill="url(#elevationGrad)" />}
                {pathD && <path d={pathD} fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />}

                {points.map((p, idx) => {
                  const active = idx === activeDayIndex;
                  return (
                    <g key={idx} className="cursor-pointer" onClick={() => setActiveDayIndex(idx)}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={active ? 7 : 5}
                        fill={active ? "#047857" : "#ffffff"}
                        stroke="#059669"
                        strokeWidth={active ? 3.5 : 2}
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

          {activeDay ? (
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr] items-start">
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center font-mono">
                    {activeDay.day_number}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-bold">
                    Active segment
                  </span>
                </div>

                <div>
                  <h4 className="font-extrabold text-stone-900 text-base">{activeDay.title}</h4>
                  <p className="text-xs text-stone-500 mt-1">
                    Overnight:{" "}
                    <span className="font-semibold text-stone-800">
                      {activeDay.overnight_place || "Not specified"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <span className="text-[9px] font-bold text-stone-400 uppercase">Elevation</span>
                    <p className="text-sm font-extrabold text-emerald-700 font-mono mt-0.5">
                      {activeDay.altitude_m ? `${activeDay.altitude_m}m` : "Pending"}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-stone-200">
                    <span className="text-[9px] font-bold text-stone-400 uppercase">AMS risk</span>
                    <p
                      className={`text-sm font-extrabold font-mono mt-0.5 ${
                        (activeDay.altitude_m || 0) >= 4200
                          ? "text-red-600"
                          : (activeDay.altitude_m || 0) >= 3000
                          ? "text-amber-600"
                          : "text-emerald-700"
                      }`}
                    >
                      {(activeDay.altitude_m || 0) >= 4200
                        ? "Severe"
                        : (activeDay.altitude_m || 0) >= 3000
                        ? "Moderate"
                        : "Safe"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
                    Day summary
                  </h4>
                  <p className="text-xs text-stone-600 leading-6 mt-2">
                    {activeDay.summary ||
                      "No specific summary recorded yet. Confirm details with your registered guide before departure."}
                  </p>
                </div>

                {(activeDay.altitude_m || 0) >= 3500 && (
                  <div className="rounded-xl bg-amber-50/60 border border-amber-100 p-3.5 text-xs text-amber-900 flex gap-2.5">
                    <ShieldCheck className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-950 block">
                        High-altitude safety guideline
                      </span>
                      <p className="text-[11px] opacity-90 mt-0.5 leading-5">
                        You are sleeping at{" "}
                        <span className="font-bold font-mono">{activeDay.altitude_m}m</span>.
                        Ascend slowly, hydrate generously, and flag any persistent headache or
                        nausea to your guide.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-1.5 pt-3">
                  <span className="text-[10px] uppercase font-bold text-stone-400">Jump to:</span>
                  <div className="flex flex-wrap gap-1">
                    {itinerary.map((_, i) => (
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
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-stone-200 shadow-inner h-80 w-full bg-stone-100">
            <iframe
              title={`${trekName} route map`}
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={mapIframeUrl}
              className="brightness-[0.98] contrast-[1.02]"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-2.5 py-1.5 rounded-lg border border-stone-200 text-[10px] font-semibold text-stone-600 flex items-center gap-1.5 shadow-sm">
              <Eye className="h-3.5 w-3.5 text-emerald-600" />
              <span>OpenStreetMap cycle layer</span>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 flex gap-3">
            <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-5 text-stone-600">
              <strong>Map data:</strong> OpenStreetMap contributors. The cycle layer renders trail
              contours, suspension bridges, teahouses, and water points. Always carry an offline
              map (Maps.me, Gaia, or downloaded OSM tiles) on the trail.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
