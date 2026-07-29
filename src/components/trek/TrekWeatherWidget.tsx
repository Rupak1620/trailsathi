"use client";

import { useEffect, useState } from "react";
import {
  AlertTriangle,
  CloudSun,
  Droplets,
  HeartPulse,
  Info,
  Loader2,
  ShieldAlert,
  Snowflake,
  ThermometerSnowflake,
  Wind,
} from "lucide-react";
import type { TrekWeatherResponse, WeatherDay } from "@/app/api/weather/route";

// ── WMO code → icon label (keep lightweight, no external icon lib)
function wmoIcon(code: number): string {
  if (code === 0 || code === 1) return "☀️";
  if (code === 2) return "⛅";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (code >= 51 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 86) return "🌦️";
  if (code >= 95) return "⛈️";
  return "🌡️";
}

// Oxygen at altitude (barometric formula, effective O₂ relative to sea level)
function oxygenPct(altitudeM: number): number {
  return Math.round(100 * Math.exp(-altitudeM / 7990));
}

type AmsRisk = "None" | "Mild" | "Severe";

function amsRisk(altitudeM: number): AmsRisk {
  if (altitudeM < 3000) return "None";
  if (altitudeM < 4200) return "Mild";
  return "Severe";
}

function amsAdvice(risk: AmsRisk): string {
  if (risk === "None") return "Safe acclimated zone. Great air density. Ensure standard hydration (~3 L/day).";
  if (risk === "Mild") return "Mild AMS risk. Limit ascent to 500 m vertical per day. Sleep lower if possible.";
  return "Extreme altitude. Watch for headache, nausea, or loss of coordination. Descend immediately if symptoms worsen.";
}

type Props = {
  trekName: string;
  maxAltitude: number;
  latitude: number;
  longitude: number;
};

export function TrekWeatherWidget({ trekName, maxAltitude, latitude, longitude }: Props) {
  const [weather, setWeather] = useState<TrekWeatherResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Altitude slider (keeps the interactive AMS planner from the old component)
  const baseAlt = 2500;
  const midAlt = Math.round(baseAlt + (maxAltitude - baseAlt) * 0.45);
  const [selectedAlt, setSelectedAlt] = useState<number>(midAlt);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetch(`/api/weather?lat=${latitude}&lon=${longitude}`, {
      signal: controller.signal,
    })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TrekWeatherResponse>;
      })
      .then((data) => {
        setWeather(data);
        setLoading(false);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setError("Could not load weather data. Check your connection.");
          setLoading(false);
        }
      });

    return () => controller.abort();
  }, [latitude, longitude]);

  // Derived altitude metrics for the interactive slider
  const altDiff = selectedAlt - 2500;
  const baseTemp = weather ? weather.current.tempC - (maxAltitude - 2500) / 1000 * 6.5 : 18;
  const sliderTemp = Math.round(baseTemp - (altDiff / 1000) * 6.5);
  const sliderWind = Math.round(12 * (1 + (altDiff / 1000) * 1.5));
  const sliderHumidity = Math.max(15, Math.round(65 - (altDiff / 1000) * 12));
  const sliderO2 = oxygenPct(selectedAlt);
  const sliderRisk = amsRisk(selectedAlt);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short", month: "short", day: "numeric",
  });

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-stone-900">
            <CloudSun className="h-5 w-5 text-emerald-700" />
            Real-time Weather & Health Planner
          </h2>
          <p className="mt-1 text-sm text-stone-500">
            Live data from Open-Meteo · Updated every 30 min · {today}
          </p>
        </div>
        {weather && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live · {trekName.split(" ").slice(0, 3).join(" ")}
          </div>
        )}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-14 text-stone-400">
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm">Fetching mountain weather…</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
          <AlertTriangle className="mb-2 h-5 w-5 text-amber-600" />
          {error}
        </div>
      )}

      {/* Weather loaded */}
      {weather && !loading && (
        <>
          {/* Current conditions */}
          <div className="mb-6 overflow-hidden rounded-2xl border border-stone-100 bg-gradient-to-br from-stone-50 to-emerald-50/30">
            <div className="border-b border-stone-100 px-5 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Current conditions at trek reference point ({maxAltitude.toLocaleString()} m)
              </p>
            </div>
            <div className="grid grid-cols-2 gap-0 divide-x divide-y divide-stone-100 sm:grid-cols-4">
              <CurrentMetric
                icon={<ThermometerSnowflake className="h-4 w-4 text-emerald-600" />}
                label="Temperature"
                value={`${weather.current.tempC}°C`}
                sub={`Feels ${weather.current.feelsLikeC}°C`}
              />
              <CurrentMetric
                icon={<Wind className="h-4 w-4 text-emerald-600" />}
                label="Wind"
                value={`${weather.current.windKmh} km/h`}
                sub={weather.current.label}
              />
              <CurrentMetric
                icon={<Droplets className="h-4 w-4 text-blue-500" />}
                label="Humidity"
                value={`${weather.current.humidity}%`}
                sub={`Precip ${weather.current.precipMm} mm`}
              />
              <CurrentMetric
                icon={<HeartPulse className="h-4 w-4 text-rose-500" />}
                label="Oxygen"
                value={`${oxygenPct(maxAltitude)}%`}
                sub="of sea-level O₂"
              />
            </div>
          </div>

          {/* 7-day forecast strip */}
          <div className="mb-6">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-stone-400">
              7-Day Mountain Forecast
            </p>
            <div className="grid grid-cols-7 gap-1.5">
              {weather.daily.map((day, i) => (
                <DayCard key={day.date} day={day} isToday={i === 0} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── Interactive altitude slider (always shown) ── */}
      <div className="mb-6 rounded-xl border border-stone-200 bg-stone-50 p-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Altitude Health Simulator
          </span>
          <span className="rounded border border-emerald-100 bg-emerald-50 px-3 py-1 font-mono text-lg font-extrabold text-emerald-700">
            {selectedAlt.toLocaleString()} m
          </span>
        </div>

        <input
          type="range"
          min={baseAlt}
          max={maxAltitude}
          step={50}
          value={selectedAlt}
          onChange={(e) => setSelectedAlt(Number(e.target.value))}
          className="w-full cursor-pointer appearance-none rounded-lg bg-stone-200 accent-emerald-700 focus:outline-none"
          style={{ height: "8px" }}
        />

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            { label: `Base: ${baseAlt}m`, val: baseAlt },
            { label: `Mid: ${midAlt}m`, val: midAlt },
            { label: `Peak: ${maxAltitude}m`, val: maxAltitude },
          ].map(({ label, val }) => (
            <button
              key={val}
              onClick={() => setSelectedAlt(val)}
              className={`rounded-lg border py-2 text-xs font-bold transition-all ${
                selectedAlt === val
                  ? "border-emerald-700 bg-emerald-700 text-white"
                  : "border-stone-200 bg-white text-stone-600 hover:bg-stone-100"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Altitude-derived metrics */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <SliderMetric label="Est. Temp" value={`${sliderTemp}°C`} sub="Lapse-rate calc" />
          <SliderMetric label="Est. Wind" value={`${sliderWind} km/h`} sub="Increases w/ altitude" />
          <SliderMetric label="Humidity" value={`${sliderHumidity}%`} sub="Dry mountain air" />
          <SliderMetric
            label="Oxygen"
            value={`${sliderO2}%`}
            sub="Of sea-level O₂"
            accent="rose"
          />
        </div>
      </div>

      {/* AMS Risk banner */}
      <div
        className={`flex items-start gap-3 rounded-xl border p-4 ${
          sliderRisk === "Severe"
            ? "border-red-200 bg-red-50 text-red-900"
            : sliderRisk === "Mild"
            ? "border-amber-200 bg-amber-50 text-amber-900"
            : "border-emerald-200 bg-emerald-50/60 text-emerald-950"
        }`}
      >
        {sliderRisk === "Severe" ? (
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        ) : sliderRisk === "Mild" ? (
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        ) : (
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
        )}
        <div>
          <span className="block text-xs font-bold uppercase tracking-wider">
            {sliderRisk === "Severe" && "Critical Acclimatization Alert — AMS Risk: Severe"}
            {sliderRisk === "Mild" && "Moderate Altitude Warning — AMS Risk: Mild"}
            {sliderRisk === "None" && "Safe Zone — AMS Risk: Negligible"}
          </span>
          <p className="mt-1 text-xs leading-5 opacity-90">{amsAdvice(sliderRisk)}</p>
        </div>
      </div>

      {/* Attribution */}
      <p className="mt-4 text-center text-[10px] text-stone-400">
        Weather data by{" "}
        <a
          href="https://open-meteo.com/"
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-stone-600"
        >
          Open-Meteo
        </a>{" "}
        · Free &amp; open source · Reference point: {latitude.toFixed(4)}°N, {longitude.toFixed(4)}°E
      </p>
    </section>
  );
}

/* ── Sub-components ── */

function CurrentMetric({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex flex-col justify-between p-4">
      <div className="mb-1 flex items-center justify-between text-stone-400">
        <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
        {icon}
      </div>
      <p className="font-mono text-2xl font-extrabold text-stone-900">{value}</p>
      <p className="mt-1 text-[10px] text-stone-400">{sub}</p>
    </div>
  );
}

function DayCard({ day, isToday }: { day: WeatherDay; isToday: boolean }) {
  const date = new Date(day.date + "T00:00:00");
  const weekday = date.toLocaleDateString("en-US", { weekday: "short" });

  return (
    <div
      className={`flex flex-col items-center gap-1 rounded-xl border p-2 text-center ${
        isToday
          ? "border-emerald-300 bg-emerald-50"
          : "border-stone-100 bg-stone-50"
      }`}
    >
      <span className={`text-[10px] font-bold uppercase ${isToday ? "text-emerald-700" : "text-stone-400"}`}>
        {isToday ? "Today" : weekday}
      </span>
      <span className="text-lg leading-none">{wmoIcon(day.weatherCode)}</span>
      <span className="font-mono text-xs font-bold text-stone-900">{day.tempMaxC}°</span>
      <span className="font-mono text-[10px] text-stone-400">{day.tempMinC}°</span>
      {day.snowfallCm > 0 && (
        <span className="flex items-center gap-0.5 text-[9px] font-semibold text-blue-600">
          <Snowflake className="h-2.5 w-2.5" />
          {day.snowfallCm.toFixed(1)}cm
        </span>
      )}
      {day.precipMm > 0 && day.snowfallCm === 0 && (
        <span className="text-[9px] font-semibold text-blue-500">
          {day.precipMm.toFixed(1)}mm
        </span>
      )}
    </div>
  );
}

function SliderMetric({
  label,
  value,
  sub,
  accent = "stone",
}: {
  label: string;
  value: string;
  sub: string;
  accent?: "stone" | "rose";
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
      <p className={`mt-1 font-mono text-xl font-extrabold ${accent === "rose" ? "text-rose-600" : "text-stone-900"}`}>
        {value}
      </p>
      <p className="text-[10px] text-stone-400">{sub}</p>
    </div>
  );
}
