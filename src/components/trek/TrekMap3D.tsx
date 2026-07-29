"use client";

/**
 * TrekMap3D — Interactive 3D terrain map for trail routes.
 *
 * Uses MapLibre GL (open-source, no API key / payment method) with:
 *  • Free Esri satellite imagery + AWS Terrarium DEM for 3D terrain
 *  • Trek route as a glowing LineString
 *  • Clickable stop markers + React stop detail card (hotels, facilities, AMS)
 *  • Fly-to, 2D/3D toggle, overnight quick-nav
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  ScaleControl,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {
  Mountain,
  Bed,
  Wifi,
  Zap,
  Droplets,
  ShowerHead,
  Utensils,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  X,
  MapPin,
  Tent,
  Star,
  Navigation,
} from "lucide-react";
import type { TrekRoutePoint, RoutePointType } from "@/types/database";
import { routeBounds, toGeoJSON } from "@/lib/trek-route";

type Props = {
  trekName: string;
  points: TrekRoutePoint[];
};

/** Free satellite + DEM style — no token required */
function buildBaseStyle(): StyleSpecification {
  return {
    version: 8,
    name: "TrailSathi Satellite Terrain",
    sources: {
      satellite: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        attribution:
          'Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics',
        maxzoom: 19,
      },
      terrain: {
        type: "raster-dem",
        tiles: [
          "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
        ],
        encoding: "terrarium",
        tileSize: 256,
        maxzoom: 15,
        attribution: "Elevation © Mapzen / AWS Terrain Tiles",
      },
    },
    layers: [
      {
        id: "satellite",
        type: "raster",
        source: "satellite",
        minzoom: 0,
        maxzoom: 22,
      },
      {
        id: "hillshade",
        type: "hillshade",
        source: "terrain",
        paint: {
          "hillshade-shadow-color": "#000000",
          "hillshade-highlight-color": "#ffffff",
          "hillshade-exaggeration": 0.35,
        },
      },
    ],
  };
}

const POINT_COLORS: Record<RoutePointType, string> = {
  start: "#10b981",
  end: "#6b7280",
  village: "#f59e0b",
  teahouse: "#f97316",
  camp: "#8b5cf6",
  viewpoint: "#06b6d4",
  pass: "#ef4444",
  base_camp: "#dc2626",
  lake: "#3b82f6",
  monastery: "#a855f7",
};

const POINT_ICONS: Record<RoutePointType, string> = {
  start: "▶",
  end: "⬛",
  village: "🏘",
  teahouse: "🍵",
  camp: "⛺",
  viewpoint: "👁",
  pass: "⛰",
  base_camp: "🏔",
  lake: "💧",
  monastery: "🏯",
};

const FACILITY_ICONS: Record<string, React.ReactNode> = {
  "Wi-Fi": <Wifi size={12} />,
  Charging: <Zap size={12} />,
  "Hot shower": <ShowerHead size={12} />,
  Restaurant: <Utensils size={12} />,
  "Western toilet": <Droplets size={12} />,
  "Yak-dung heating": <span className="text-[10px]">🔥</span>,
  "ATM nearby": <span className="text-[10px]">💳</span>,
  "Monastery views": <span className="text-[10px]">🏯</span>,
  "Manaslu views": <Mountain size={12} />,
};

export function TrekMap3D({ trekName, points }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<TrekRoutePoint | null>(
    null
  );
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(true);

  const overnightPoints = points.filter((p) => p.is_overnight);

  const flyToPoint = useCallback(
    (point: TrekRoutePoint) => {
      if (!mapRef.current) return;
      mapRef.current.flyTo({
        center: [point.longitude, point.latitude],
        zoom: 13,
        pitch: is3D ? 60 : 0,
        bearing: 20,
        duration: 1800,
        essential: true,
      });
    },
    [is3D]
  );

  const selectPoint = useCallback(
    (point: TrekRoutePoint, index: number) => {
      setSelectedPoint(point);
      setSelectedIndex(index);
      flyToPoint(point);
    },
    [flyToPoint]
  );

  const closeCard = useCallback(() => {
    setSelectedPoint(null);
    setSelectedIndex(-1);
  }, []);

  const navigateStop = useCallback(
    (direction: 1 | -1) => {
      const nextIndex = selectedIndex + direction;
      if (nextIndex < 0 || nextIndex >= overnightPoints.length) return;
      selectPoint(overnightPoints[nextIndex], nextIndex);
    },
    [selectedIndex, overnightPoints, selectPoint]
  );

  const toggle3D = useCallback(() => {
    if (!mapRef.current) return;
    const next = !is3D;
    setIs3D(next);
    mapRef.current.easeTo({ pitch: next ? 55 : 0, duration: 700 });
  }, [is3D]);

  const fitRoute = useCallback(() => {
    if (!mapRef.current || points.length === 0) return;
    const bounds = routeBounds(points);
    if (!bounds) return;
    mapRef.current.fitBounds(
      [
        [bounds[0], bounds[1]],
        [bounds[2], bounds[3]],
      ],
      { padding: 60, pitch: is3D ? 55 : 0, duration: 1200 }
    );
  }, [points, is3D]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || points.length === 0) return;

    const bounds = routeBounds(points);

    const map = new MapLibreMap({
      container: containerRef.current,
      style: buildBaseStyle(),
      pitch: 55,
      bearing: 0,
      maxPitch: 70,
      ...(bounds
        ? {
            bounds: [
              [bounds[0], bounds[1]],
              [bounds[2], bounds[3]],
            ] as [[number, number], [number, number]],
            fitBoundsOptions: { padding: 80, pitch: 55 },
          }
        : { center: [85.3, 28.0] as [number, number], zoom: 7 }),
    });

    mapRef.current = map;

    map.addControl(
      new NavigationControl({ visualizePitch: true }),
      "top-right"
    );
    map.addControl(new ScaleControl({ unit: "metric" }), "bottom-right");

    map.on("load", () => {
      map.setTerrain({ source: "terrain", exaggeration: 1.8 });

      try {
        map.setSky({
          "sky-color": "#1a2a4a",
          "sky-horizon-blend": 0.5,
          "horizon-color": "#f8c37b",
          "horizon-fog-blend": 0.5,
          "fog-color": "#c8d5e8",
          "fog-ground-blend": 0.9,
        });
      } catch {
        // Older MapLibre builds may not support setSky — terrain still works
      }

      const geojson = toGeoJSON(points);
      const routeFeature = geojson.features.find(
        (f) => f.geometry.type === "LineString"
      ) as GeoJSON.Feature<GeoJSON.LineString> | undefined;

      if (routeFeature) {
        map.addSource("trek-route", {
          type: "geojson",
          data: routeFeature,
        });

        map.addLayer({
          id: "trek-route-glow",
          type: "line",
          source: "trek-route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#34d399",
            "line-width": 10,
            "line-opacity": 0.25,
            "line-blur": 4,
          },
        });

        map.addLayer({
          id: "trek-route-line",
          type: "line",
          source: "trek-route",
          layout: { "line-join": "round", "line-cap": "round" },
          paint: {
            "line-color": "#10b981",
            "line-width": 3.5,
            "line-opacity": 0.92,
          },
        });
      }

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      points.forEach((point, idx) => {
        const el = document.createElement("div");
        el.className = "trek-marker";
        el.setAttribute("data-type", point.point_type);

        const color = POINT_COLORS[point.point_type];
        const icon = POINT_ICONS[point.point_type];
        const isOvernightIdx = overnightPoints.indexOf(point);

        el.innerHTML = `
          <div class="trek-marker__pin" style="background:${color}; box-shadow: 0 0 0 3px white, 0 0 0 5px ${color}40;">
            <span class="trek-marker__icon">${icon}</span>
          </div>
          ${
            point.is_overnight
              ? `<div class="trek-marker__label" style="background:${color}">${
                  point.day_number ? `D${point.day_number}` : ""
                }</div>`
              : ""
          }
        `;

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (isOvernightIdx >= 0) {
            selectPoint(point, isOvernightIdx);
          } else {
            selectPoint(point, idx);
          }
        });

        const marker = new Marker({ element: el, anchor: "bottom" })
          .setLngLat([point.longitude, point.latitude])
          .addTo(map);

        markersRef.current.push(marker);
      });

      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach((m) => m.remove());
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-stone-200 shadow-lg">
      <div ref={containerRef} className="h-[520px] w-full bg-stone-900" />

      {!mapLoaded && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          <p className="mt-4 text-sm font-medium text-stone-300">
            Loading 3D terrain…
          </p>
        </div>
      )}

      <div className="absolute left-4 top-4 flex flex-col gap-2">
        <button
          type="button"
          onClick={toggle3D}
          title={is3D ? "Switch to 2D" : "Switch to 3D"}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
        >
          <Mountain size={16} />
        </button>
        <button
          type="button"
          onClick={fitRoute}
          title="Fit route"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-black/50 text-white backdrop-blur-sm transition hover:bg-black/70"
        >
          <Navigation size={16} />
        </button>
      </div>

      <div className="pointer-events-none absolute bottom-8 left-4 flex items-center gap-2 rounded-xl border border-white/15 bg-black/55 px-3 py-1.5 backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="text-xs font-semibold text-white">{trekName}</span>
        <span className="text-[10px] text-white/50">
          · {points.length} waypoints
        </span>
      </div>

      {selectedPoint && (
        <StopDetailCard
          point={selectedPoint}
          index={selectedIndex}
          total={overnightPoints.length}
          onClose={closeCard}
          onPrev={() => navigateStop(-1)}
          onNext={() => navigateStop(1)}
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 overflow-x-auto">
        <div className="flex gap-1.5 px-4 pb-3 pt-1">
          {overnightPoints.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => selectPoint(p, i)}
              className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold transition-all ${
                selectedIndex === i
                  ? "border-emerald-400 bg-emerald-500 text-white"
                  : "border-white/20 bg-black/50 text-white/80 hover:bg-black/70"
              }`}
            >
              {p.day_number ? `D${p.day_number}` : ""}{" "}
              {p.name.split(" ").slice(0, 2).join(" ")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StopDetailCard({
  point,
  index,
  total,
  onClose,
  onPrev,
  onNext,
}: {
  point: TrekRoutePoint;
  index: number;
  total: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const amsRisk =
    point.altitude_m >= 4200
      ? "Severe"
      : point.altitude_m >= 3000
        ? "Moderate"
        : "Safe";

  const priceLabel =
    point.stay_price_usd_min && point.stay_price_usd_max
      ? `$${point.stay_price_usd_min}–$${point.stay_price_usd_max}/night`
      : point.stay_price_usd_min
        ? `From $${point.stay_price_usd_min}/night`
        : null;

  const stayIcon =
    point.stay_type === "luxury_lodge" ? (
      <Star size={13} />
    ) : point.stay_type === "camping" ? (
      <Tent size={13} />
    ) : (
      <Bed size={13} />
    );

  return (
    <div className="absolute right-4 top-4 z-10 w-72 overflow-hidden rounded-2xl border border-white/15 bg-black/75 shadow-2xl backdrop-blur-md sm:w-80">
      <div
        className="flex items-start justify-between gap-2 p-4"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="shrink-0 rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
              style={{
                background: POINT_COLORS[point.point_type] + "33",
                color: POINT_COLORS[point.point_type],
                border: `1px solid ${POINT_COLORS[point.point_type]}44`,
              }}
            >
              {point.point_type.replace("_", " ")}
            </span>
            {point.day_number ? (
              <span className="text-[9px] font-bold text-white/40">
                Day {point.day_number}
              </span>
            ) : null}
          </div>
          <h3 className="mt-1.5 truncate text-sm font-bold text-white">
            {point.name}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-white/60">
            <span className="flex items-center gap-1 font-mono font-semibold text-emerald-400">
              <Mountain size={11} />
              {point.altitude_m.toLocaleString()} m
            </span>
            <span
              className={`font-semibold ${
                amsRisk === "Severe"
                  ? "text-red-400"
                  : amsRisk === "Moderate"
                    ? "text-amber-400"
                    : "text-emerald-400"
              }`}
            >
              AMS: {amsRisk}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-0.5 shrink-0 rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
        >
          <X size={15} />
        </button>
      </div>

      {point.description ? (
        <div className="px-4 pt-3 text-[11px] leading-5 text-white/70">
          {point.description}
        </div>
      ) : null}

      {point.special_notes ? (
        <div className="mx-4 mt-3 flex gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3">
          <AlertTriangle size={12} className="mt-0.5 shrink-0 text-amber-400" />
          <p className="text-[11px] leading-5 text-amber-200">
            {point.special_notes}
          </p>
        </div>
      ) : null}

      {point.is_acclimatization_day ? (
        <div className="mx-4 mt-3 flex items-center gap-2 rounded-xl border border-blue-400/20 bg-blue-400/10 px-3 py-2">
          <span className="text-sm">🏕</span>
          <p className="text-[11px] font-semibold text-blue-200">
            Acclimatization day — rest & short hike
          </p>
        </div>
      ) : null}

      {point.stay_type && point.stay_type !== "none" ? (
        <div className="mt-3 border-t border-white/8 px-4 pb-1 pt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] text-white/80">
              {stayIcon}
              <span className="font-semibold capitalize">
                {point.stay_type.replace("_", " ")}
                {point.stay_name ? ` — ${point.stay_name}` : ""}
              </span>
            </div>
            {priceLabel ? (
              <span className="shrink-0 rounded-lg bg-white/10 px-2 py-0.5 text-[10px] font-bold text-white/70">
                {priceLabel}
              </span>
            ) : null}
          </div>

          {point.stay_facilities.length > 0 ? (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {point.stay_facilities.map((f) => (
                <span
                  key={f}
                  className="flex items-center gap-1 rounded-full border border-white/10 bg-white/8 px-2 py-0.5 text-[10px] text-white/60"
                >
                  {FACILITY_ICONS[f] ?? <MapPin size={10} />}
                  {f}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="mt-3 flex items-center justify-between border-t border-white/8 px-4 py-3">
        <button
          type="button"
          onClick={onPrev}
          disabled={index === 0}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
        >
          <ChevronLeft size={14} />
          Prev stop
        </button>
        <span className="text-[10px] text-white/30">
          {index + 1} / {total}
        </span>
        <button
          type="button"
          onClick={onNext}
          disabled={index === total - 1}
          className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:pointer-events-none disabled:opacity-30"
        >
          Next stop
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}
