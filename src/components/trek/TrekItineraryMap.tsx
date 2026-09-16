"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Compass,
  TrendingUp,
  ShieldCheck,
  ClipboardList,
  Mountain,
} from "lucide-react";
import type { TrekRoutePoint } from "@/types/database";

const EBC_FALLBACK: TrekRoutePoint[] = [
  ["Lukla", 86.7294, 27.6868, 2860, "Starting point — Tenzing-Hillary Airport."],
  ["Namche Bazaar", 86.7139, 27.8063, 3440, "Sherpa capital and first acclimatization stop."],
  ["Tengboche", 86.7642, 27.8362, 3860, "Monastery with views of Ama Dablam and Everest."],
  ["Dingboche", 86.8321, 27.894, 4410, "Second rest day before the high camps."],
  ["Lobuche", 86.8085, 27.9503, 4940, "Last village before Gorak Shep."],
  ["Everest Base Camp", 86.8516, 27.9997, 5364, "The foot of the Khumbu Icefall."],
].map(([name, longitude, latitude, altitude_m, description], index) => ({
  id: `ebc-fallback-${index + 1}`,
  trek_id: "fallback",
  sequence_order: index + 1,
  day_number: index + 1,
  name: String(name),
  latitude: Number(latitude),
  longitude: Number(longitude),
  altitude_m: Number(altitude_m),
  point_type: index === 0 ? "start" : index === 5 ? "base_camp" : "village",
  is_overnight: index !== 5,
  is_acclimatization_day: index === 1 || index === 3,
  description: String(description),
  special_notes: null,
  stay_type: "teahouse",
  stay_name: null,
  stay_price_usd_min: null,
  stay_price_usd_max: null,
  stay_facilities: [],
  image_url: null,
  created_at: "",
  updated_at: "",
}));

const TrekViewer = dynamic(() => import("@/components/trek/TrekViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[640px] items-center justify-center rounded-2xl bg-[#0b1220]">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
    </div>
  ),
});

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
  trekSlug?: string;
  itinerary: ItineraryDay[];
  region?: string | null;
  routePoints?: TrekRoutePoint[];
};

export function TrekItineraryMap({
  trekName,
  trekSlug,
  itinerary,
  routePoints = [],
}: TrekItineraryMapProps) {
  const viewerPoints =
    routePoints.length > 0
      ? routePoints
      : trekSlug === "everest-base-camp" ||
          trekSlug === "everest-base-camp-trek" ||
          trekSlug === "ebc"
        ? EBC_FALLBACK
        : [];
  const has3DRoute = viewerPoints.length > 0;
  const hasItinerary = itinerary.length > 0;
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [viewMode, setViewMode] = useState<"elevation" | "3d">(
    has3DRoute ? "3d" : "elevation"
  );

  useEffect(() => {
    setActiveDayIndex(0);
  }, [itinerary]);

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
  const showTabs = has3DRoute && hasItinerary;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900">
            <Compass className="h-5 w-5 text-emerald-700" />
            {has3DRoute ? "3D Trail Map & Elevation" : "Elevation Profile"}
          </h2>
          <p className="mt-1 max-w-prose text-sm text-stone-500">
            {has3DRoute
              ? "Interactive 3D route with stop details, plus day-by-day altitude from the verified itinerary."
              : "Day-by-day altitude, overnight stops, and safety notes from the verified itinerary."}
          </p>
        </div>

        {showTabs ? (
          <div className="flex self-start rounded-xl bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode("3d")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "3d"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <Mountain className="h-3.5 w-3.5" />
              3D Map
            </button>
            <button
              type="button"
              onClick={() => setViewMode("elevation")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                viewMode === "elevation"
                  ? "bg-white text-stone-900 shadow-sm"
                  : "text-stone-600 hover:text-stone-900"
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              Altitude
            </button>
          </div>
        ) : null}
      </div>

      {viewMode === "3d" && has3DRoute ? (
        <TrekViewer trekName={trekName} points={viewerPoints} />
      ) : !hasItinerary ? (
        <div className="rounded-xl border border-dashed border-stone-300 bg-stone-50/60 p-6">
          <div className="flex items-center gap-2 text-stone-500">
            <ClipboardList className="h-5 w-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Itinerary pending
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-stone-700">
            A verified day-by-day itinerary for{" "}
            <span className="font-semibold text-stone-900">{trekName}</span> is
            being prepared.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="select-none overflow-x-auto rounded-xl border border-stone-200 bg-stone-50 p-4">
            <div className="relative min-w-[550px]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="h-auto w-full"
              >
                <defs>
                  <linearGradient
                    id="elevationGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <line
                  x1={padding}
                  y1={padding}
                  x2={svgWidth - padding}
                  y2={padding}
                  stroke="#e5e5e5"
                  strokeDasharray="3 3"
                />
                <line
                  x1={padding}
                  y1={svgHeight - padding}
                  x2={svgWidth - padding}
                  y2={svgHeight - padding}
                  stroke="#d4d4d4"
                />

                {areaD ? <path d={areaD} fill="url(#elevationGrad)" /> : null}
                {pathD ? (
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#059669"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                ) : null}

                {points.map((p, idx) => {
                  const active = idx === activeDayIndex;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onClick={() => setActiveDayIndex(idx)}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={active ? 7 : 5}
                        fill={active ? "#047857" : "#ffffff"}
                        stroke="#059669"
                        strokeWidth={active ? 3.5 : 2}
                      />
                      <text
                        x={p.x}
                        y={svgHeight - 12}
                        textAnchor="middle"
                        className={`text-[9px] font-mono tracking-tight ${
                          active
                            ? "fill-emerald-800 font-bold"
                            : "fill-stone-400"
                        }`}
                      >
                        D{p.day}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {points[activeDayIndex] ? (
                <div
                  className="pointer-events-none absolute flex -translate-x-1/2 -translate-y-8 items-center gap-1 rounded bg-emerald-700 px-2 py-0.5 font-mono text-[9px] font-bold text-white shadow-md transition-all duration-300"
                  style={{
                    left: `${(points[activeDayIndex].x / svgWidth) * 100}%`,
                    top: `${(points[activeDayIndex].y / svgHeight) * 100}%`,
                  }}
                >
                  <TrendingUp className="h-2.5 w-2.5" />
                  {points[activeDayIndex].alt}m
                </div>
              ) : null}
            </div>
          </div>

          {activeDay ? (
            <div className="grid items-start gap-6 md:grid-cols-[0.8fr_1.2fr]">
              <div className="space-y-4 rounded-xl border border-stone-200 bg-stone-50 p-5">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 font-mono text-xs font-bold text-emerald-800">
                    {activeDay.day_number}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Active segment
                  </span>
                </div>

                <div>
                  <h4 className="text-base font-extrabold text-stone-900">
                    {activeDay.title}
                  </h4>
                  <p className="mt-1 text-xs text-stone-500">
                    Overnight:{" "}
                    <span className="font-semibold text-stone-800">
                      {activeDay.overnight_place || "Not specified"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg border border-stone-200 bg-white p-3">
                    <span className="text-[9px] font-bold uppercase text-stone-400">
                      Elevation
                    </span>
                    <p className="mt-0.5 font-mono text-sm font-extrabold text-emerald-700">
                      {activeDay.altitude_m
                        ? `${activeDay.altitude_m}m`
                        : "Pending"}
                    </p>
                  </div>
                  <div className="rounded-lg border border-stone-200 bg-white p-3">
                    <span className="text-[9px] font-bold uppercase text-stone-400">
                      AMS risk
                    </span>
                    <p
                      className={`mt-0.5 font-mono text-sm font-extrabold ${
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
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Day summary
                  </h4>
                  <p className="mt-2 text-xs leading-6 text-stone-600">
                    {activeDay.summary ||
                      "No specific summary recorded yet. Confirm details with your registered guide before departure."}
                  </p>
                </div>

                {(activeDay.altitude_m || 0) >= 3500 ? (
                  <div className="flex gap-2.5 rounded-xl border border-amber-100 bg-amber-50/60 p-3.5 text-xs text-amber-900">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                    <div>
                      <span className="block font-bold text-amber-950">
                        High-altitude safety guideline
                      </span>
                      <p className="mt-0.5 text-[11px] leading-5 opacity-90">
                        You are sleeping at{" "}
                        <span className="font-mono font-bold">
                          {activeDay.altitude_m}m
                        </span>
                        . Ascend slowly, hydrate generously, and flag any
                        persistent headache or nausea to your guide.
                      </p>
                    </div>
                  </div>
                ) : null}

                <div className="flex items-center gap-1.5 pt-3">
                  <span className="text-[10px] font-bold uppercase text-stone-400">
                    Jump to:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {itinerary.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveDayIndex(i)}
                        className={`h-6 w-6 rounded-md border text-[10px] font-bold transition-all ${
                          i === activeDayIndex
                            ? "border-stone-900 bg-stone-900 text-white"
                            : "border-stone-200 bg-white text-stone-500 hover:bg-stone-100"
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
      )}
    </section>
  );
}
