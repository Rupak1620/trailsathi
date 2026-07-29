import { NextRequest, NextResponse } from "next/server";

// Open-Meteo WMO weather code → human-readable label
// https://open-meteo.com/en/docs#weathervariables
const WMO_LABELS: Record<number, string> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Icy fog",
  51: "Light drizzle",
  53: "Drizzle",
  55: "Heavy drizzle",
  61: "Light rain",
  63: "Rain",
  65: "Heavy rain",
  71: "Light snow",
  73: "Snow",
  75: "Heavy snow",
  77: "Snow grains",
  80: "Light showers",
  81: "Showers",
  82: "Heavy showers",
  85: "Light snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with hail",
  99: "Thunderstorm with heavy hail",
};

export type WeatherDay = {
  date: string;        // ISO date string e.g. "2026-07-29"
  weatherCode: number;
  label: string;
  tempMaxC: number;
  tempMinC: number;
  precipMm: number;
  windMaxKmh: number;
  snowfallCm: number;
};

export type TrekWeatherResponse = {
  latitude: number;
  longitude: number;
  timezone: string;
  current: {
    weatherCode: number;
    label: string;
    tempC: number;
    feelsLikeC: number;
    windKmh: number;
    humidity: number;
    precipMm: number;
  };
  daily: WeatherDay[];
  fetchedAt: string;
};

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";

// Cache responses for 30 minutes to avoid hammering the API on every page load
export const revalidate = 1800;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  if (!lat || !lon) {
    return NextResponse.json(
      { error: "Missing required query params: lat, lon" },
      { status: 400 }
    );
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return NextResponse.json(
      { error: "lat and lon must be valid numbers" },
      { status: 400 }
    );
  }

  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "precipitation",
      "wind_speed_10m",
      "weather_code",
    ].join(","),
    daily: [
      "weather_code",
      "temperature_2m_max",
      "temperature_2m_min",
      "precipitation_sum",
      "wind_speed_10m_max",
      "snowfall_sum",
    ].join(","),
    forecast_days: "7",
    timezone: "Asia/Kathmandu",
    wind_speed_unit: "kmh",
  });

  const url = `${OPEN_METEO_BASE}?${params.toString()}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json(
        { error: `Open-Meteo error: ${res.status}`, detail: text },
        { status: 502 }
      );
    }

    const raw = await res.json();

    const current = raw.current;
    const daily = raw.daily;

    const response: TrekWeatherResponse = {
      latitude: raw.latitude,
      longitude: raw.longitude,
      timezone: raw.timezone,
      current: {
        weatherCode: current.weather_code,
        label: WMO_LABELS[current.weather_code] ?? "Unknown",
        tempC: Math.round(current.temperature_2m),
        feelsLikeC: Math.round(current.apparent_temperature),
        windKmh: Math.round(current.wind_speed_10m),
        humidity: Math.round(current.relative_humidity_2m),
        precipMm: current.precipitation,
      },
      daily: (daily.time as string[]).map((date: string, i: number) => ({
        date,
        weatherCode: daily.weather_code[i],
        label: WMO_LABELS[daily.weather_code[i]] ?? "Unknown",
        tempMaxC: Math.round(daily.temperature_2m_max[i]),
        tempMinC: Math.round(daily.temperature_2m_min[i]),
        precipMm: daily.precipitation_sum[i] ?? 0,
        windMaxKmh: Math.round(daily.wind_speed_10m_max[i]),
        snowfallCm: daily.snowfall_sum[i] ?? 0,
      })),
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      },
    });
  } catch (err) {
    console.error("[weather-api] fetch failed", err);
    return NextResponse.json(
      { error: "Failed to fetch weather data" },
      { status: 500 }
    );
  }
}
