"use client";

import { useState } from "react";
import {
  CloudSun,
  Wind,
  ThermometerSnowflake,
  ShieldAlert,
  Droplets,
  HeartPulse,
  Sparkles,
  Info,
  Calendar,
  AlertTriangle,
  Sun,
  CloudRain,
  Snowflake,
} from "lucide-react";

type AltitudeWeatherPanelProps = {
  trekName: string;
  maxAltitude: number; // e.g. 5416
};

type WeatherState = {
  temp: number;
  feelsLike: number;
  wind: number;
  humidity: number;
  oxygen: number;
  status: "Clear" | "Light Snow" | "High Winds" | "Blizzard" | "Overcast";
  amsRisk: "None" | "Mild" | "Severe";
  advice: string;
};

export function AltitudeWeatherPanel({ trekName, maxAltitude }: AltitudeWeatherPanelProps) {
  // Selectable altitude tiers based on max altitude
  const baseAlt = 2500;
  const midAlt = Math.round(baseAlt + (maxAltitude - baseAlt) * 0.45);
  const peakAlt = maxAltitude;

  const [currentAltitude, setCurrentAltitude] = useState<number>(midAlt);

  // Derive dynamic weather metrics based on selected altitude
  const weather: WeatherState = (() => {
    // Standard environmental lapse rate: ~6.5°C drop per 1000m altitude gain
    const baseTemp = 18; // base temperature at 2,500m in peak trekking months
    const altDiff = currentAltitude - 2500;
    const tempDrop = (altDiff / 1000) * 6.5;
    const temp = Math.round(baseTemp - tempDrop);

    // Wind increases with altitude
    const windBase = 12; // km/h
    const windMultiplier = 1 + (altDiff / 1000) * 1.5;
    const wind = Math.round(windBase * windMultiplier);

    // Humidity drops at high altitudes (dry air)
    const baseHumidity = 65;
    const humidity = Math.max(15, Math.round(baseHumidity - (altDiff / 1000) * 12));

    // Feels like takes wind chill into account
    // simplified wind chill formula
    const feelsLike = Math.round(temp - (wind * 0.15));

    // Oxygen percentage decreases exponentially with altitude (effective oxygen compared to sea level)
    // At sea level it's 100% relative.
    // 2500m -> ~74%
    // 3800m -> ~64%
    // 5000m -> ~53%
    const oxygen = Math.round(100 * Math.exp(-currentAltitude / 7990));

    let status: WeatherState["status"] = "Clear";
    let amsRisk: WeatherState["amsRisk"] = "None";
    let advice = "Perfect trekking conditions. Keep hydrated and follow your guide.";

    if (currentAltitude < 3000) {
      status = "Clear";
      amsRisk = "None";
      advice = "Safe acclimated zone. Great air density. Ensure standard hydration (~3L/day).";
    } else if (currentAltitude >= 3000 && currentAltitude < 4200) {
      status = "Overcast";
      amsRisk = "Mild";
      advice = "Ascent alert: Mild risk of Acute Mountain Sickness (AMS). Restrict ascent to 500m vertical climb per day. Sleep lower if possible.";
    } else {
      status = "Light Snow";
      amsRisk = "Severe";
      advice = "Extreme Zone: Severe altitude risk. Oxygen levels are extremely thin. Watch for headache, nausea, or loss of coordination. Descent immediately if symptoms worsen.";
    }

    // Special status on extreme wind
    if (wind > 40) {
      status = "High Winds";
    }

    return { temp, feelsLike, wind, humidity, oxygen, status, amsRisk, advice };
  })();

  // 5-day simulated forecast for chosen altitude
  const forecast = [
    { day: "Today", icon: <Sun className="h-5 w-5 text-amber-500" />, temp: weather.temp, desc: weather.status },
    { day: "Thu", icon: <CloudSun className="h-5 w-5 text-stone-500" />, temp: weather.temp - 1, desc: "Partly Cloudy" },
    { day: "Fri", icon: <CloudSun className="h-5 w-5 text-stone-500" />, temp: weather.temp - 2, desc: "Partly Cloudy" },
    { day: "Sat", icon: <Snowflake className="h-5 w-5 text-sky-400" />, temp: weather.temp - 4, desc: "Light Snow" },
    { day: "Sun", icon: <Sun className="h-5 w-5 text-amber-500" />, temp: weather.temp + 1, desc: "Sunny Morning" },
  ];

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <CloudSun className="h-5.5 w-5.5 text-emerald-700" />
            Altitude Microclimate &amp; Health Planner
          </h2>
          <p className="text-sm text-stone-500 mt-1">
            Mountain weather drops rapidly with height. Drag or toggle the altitude scale to analyze atmospheric changes.
          </p>
        </div>
      </div>

      {/* Interactive Slider */}
      <div className="bg-stone-50 rounded-xl p-5 border border-stone-150 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Select Trail Altitude</span>
          <span className="text-lg font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-100 font-mono">
            {currentAltitude.toLocaleString()} meters
          </span>
        </div>

        <input
          type="range"
          min={baseAlt}
          max={peakAlt}
          step="50"
          value={currentAltitude}
          onChange={(e) => setCurrentAltitude(Number(e.target.value))}
          className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-emerald-700 focus:outline-none"
        />

        {/* Quick altitude shortcuts */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            onClick={() => setCurrentAltitude(baseAlt)}
            className={`py-2 rounded-lg text-xs font-bold transition-all border ${
              currentAltitude === baseAlt
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-stone-600 hover:bg-stone-100 border-stone-200"
            }`}
          >
            Base: {baseAlt}m
          </button>
          <button
            onClick={() => setCurrentAltitude(midAlt)}
            className={`py-2 rounded-lg text-xs font-bold transition-all border ${
              currentAltitude === midAlt
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-stone-600 hover:bg-stone-100 border-stone-200"
            }`}
          >
            Midway: {midAlt}m
          </button>
          <button
            onClick={() => setCurrentAltitude(peakAlt)}
            className={`py-2 rounded-lg text-xs font-bold transition-all border ${
              currentAltitude === peakAlt
                ? "bg-emerald-700 text-white border-emerald-700"
                : "bg-white text-stone-600 hover:bg-stone-100 border-stone-200"
            }`}
          >
            Summit/Peak: {peakAlt}m
          </button>
        </div>
      </div>

      {/* Atmospheric metrics grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-stone-50/50 rounded-xl p-4 border border-stone-150 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Temperature</span>
            <ThermometerSnowflake className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-stone-900 font-mono">{weather.temp}°C</p>
            <p className="text-[10px] text-stone-400 mt-1">Windchill: {weather.feelsLike}°C</p>
          </div>
        </div>

        <div className="bg-stone-50/50 rounded-xl p-4 border border-stone-150 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Oxygen level</span>
            <HeartPulse className="h-4 w-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-rose-600 font-mono">{weather.oxygen}%</p>
            <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-rose-500 h-full transition-all duration-300"
                style={{ width: `${weather.oxygen}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-stone-50/50 rounded-xl p-4 border border-stone-150 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Wind Speed</span>
            <Wind className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-stone-900 font-mono">{weather.wind} <span className="text-xs">km/h</span></p>
            <p className="text-[10px] text-stone-400 mt-1">Status: {weather.status}</p>
          </div>
        </div>

        <div className="bg-stone-50/50 rounded-xl p-4 border border-stone-150 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Humidity</span>
            <Droplets className="h-4 w-4 text-blue-500" />
          </div>
          <div className="mt-2">
            <p className="text-2xl font-extrabold text-stone-900 font-mono">{weather.humidity}%</p>
            <p className="text-[10px] text-stone-400 mt-1">Thin, dry mountain air</p>
          </div>
        </div>
      </div>

      {/* Safety warnings panel */}
      <div className={`p-4 rounded-xl border mb-6 flex gap-3 items-start transition-all ${
        weather.amsRisk === "Severe"
          ? "bg-red-50 border-red-200 text-red-900"
          : weather.amsRisk === "Mild"
          ? "bg-amber-50 border-amber-200 text-amber-900"
          : "bg-emerald-50/60 border-emerald-200 text-emerald-950"
      }`}>
        {weather.amsRisk === "Severe" ? (
          <AlertTriangle className="h-5.5 w-5.5 text-red-600 shrink-0 mt-0.5" />
        ) : weather.amsRisk === "Mild" ? (
          <ShieldAlert className="h-5.5 w-5.5 text-amber-600 shrink-0 mt-0.5" />
        ) : (
          <Info className="h-5.5 w-5.5 text-emerald-600 shrink-0 mt-0.5" />
        )}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider block">
            {weather.amsRisk === "Severe" && "CRITICAL ACCLIMATIZATION ALERT (AMS RISK: SEVERE)"}
            {weather.amsRisk === "Mild" && "MODERATE ALTITUDE WARNING (AMS RISK: MILD)"}
            {weather.amsRisk === "None" && "SAFE ZONE (AMS RISK: NEGLIGIBLE)"}
          </span>
          <p className="text-xs mt-1 leading-5 opacity-90">{weather.advice}</p>
        </div>
      </div>

      {/* 5-Day Forecast Widget */}
      <div className="border-t border-stone-150 pt-5">
        <h3 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-stone-400" />
          Simulated Micro-Climate Forecast at {currentAltitude}m
        </h3>
        <div className="grid grid-cols-5 gap-2 text-center">
          {forecast.map((f, i) => (
            <div key={i} className="bg-stone-50 rounded-lg p-2.5 border border-stone-150/60">
              <p className="text-[10px] text-stone-500 font-bold uppercase">{f.day}</p>
              <div className="my-1.5 flex justify-center">{f.icon}</div>
              <p className="text-xs font-bold text-stone-900 font-mono">{f.temp}°C</p>
              <p className="text-[9px] text-stone-400 mt-0.5 leading-3 block truncate">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
