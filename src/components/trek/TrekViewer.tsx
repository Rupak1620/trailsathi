"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  type StyleSpecification,
} from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Play, Square } from "lucide-react";
import type { TrekRoutePoint } from "@/types/database";
import { routeBounds } from "@/lib/trek-route";

type Props = {
  trekName: string;
  points: TrekRoutePoint[];
};

function satelliteStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {
      satellite: {
        type: "raster",
        tiles: [
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        ],
        tileSize: 256,
        maxzoom: 18,
        attribution: "Tiles © Esri",
      },
    },
    layers: [
      {
        id: "satellite",
        type: "raster",
        source: "satellite",
      },
    ],
  };
}

export default function TrekViewer({ trekName, points }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const flyToken = useRef(0);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const [flying, setFlying] = useState(false);

  const flyTo = useCallback((index: number, duration = 2200) => {
    const map = mapRef.current;
    const point = points[index];
    if (!map || !point) return;
    setActive(index);
    map.flyTo({
      center: [point.longitude, point.latitude],
      zoom: 12.4,
      pitch: 68,
      bearing: (index * 28) % 360,
      duration,
      essential: true,
    });
  }, [points]);

  const stopFly = useCallback(() => {
    flyToken.current += 1;
    setFlying(false);
  }, []);

  const flyTrail = useCallback(async () => {
    if (points.length === 0) return;
    const token = flyToken.current + 1;
    flyToken.current = token;
    setFlying(true);

    for (let i = 0; i < points.length; i++) {
      if (flyToken.current !== token) return;
      flyTo(i, 2600);
      await new Promise((resolve) => window.setTimeout(resolve, 2800));
    }

    if (flyToken.current === token) setFlying(false);
  }, [flyTo, points.length]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current || points.length === 0) return;

    const bounds = routeBounds(points);
    const map = new MapLibreMap({
      container: containerRef.current,
      style: satelliteStyle(),
      pitch: 62,
      bearing: -20,
      maxPitch: 75,
      fadeDuration: 0,
      ...(bounds
        ? {
            bounds: [
              [bounds[0], bounds[1]],
              [bounds[2], bounds[3]],
            ] as [[number, number], [number, number]],
            fitBoundsOptions: { padding: 48, pitch: 62, maxZoom: 11 },
          }
        : {
            center: [points[0].longitude, points[0].latitude] as [number, number],
            zoom: 11,
          }),
    });

    mapRef.current = map;
    map.addControl(new NavigationControl({ visualizePitch: true }), "top-right");

    const reveal = () => {
      setReady(true);
      requestAnimationFrame(() => map.resize());
    };

    map.once("style.load", () => {
      const coordinates = points.map((p) => [p.longitude, p.latitude]);
      map.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "LineString", coordinates },
        },
      });
      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#86efac",
          "line-width": 8,
          "line-opacity": 0.35,
          "line-blur": 2,
        },
      });
      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#15803d",
          "line-width": 3,
          "line-opacity": 0.95,
        },
      });

      points.forEach((point, index) => {
        const el = document.createElement("button");
        el.type = "button";
        el.textContent = String(index + 1);
        el.className = "trek-viewer-pin";
        el.addEventListener("click", (event) => {
          event.stopPropagation();
          flyToken.current += 1;
          setFlying(false);
          flyTo(index);
        });
        markersRef.current.push(
          new Marker({ element: el, anchor: "center" })
            .setLngLat([point.longitude, point.latitude])
            .addTo(map)
        );
      });

      try {
        map.addSource("terrain", {
          type: "raster-dem",
          tiles: [
            "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
          ],
          encoding: "terrarium",
          tileSize: 256,
          maxzoom: 12,
        });
        map.setTerrain({ source: "terrain", exaggeration: 1.7 });
      } catch (err) {
        console.warn("[TrekViewer] terrain skipped", err);
      }

      reveal();
      window.setTimeout(() => flyTo(0, 1600), 400);
    });

    const failsafe = window.setTimeout(reveal, 1800);

    return () => {
      window.clearTimeout(failsafe);
      flyToken.current += 1;
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, [flyTo, points]);

  const current = points[active];

  return (
    <div className="relative grid h-[640px] overflow-hidden rounded-2xl border border-stone-800 bg-[#0b1220] shadow-xl md:grid-cols-[300px_1fr]">
      <aside className="flex min-h-0 flex-col border-b border-white/10 md:border-b-0 md:border-r">
        <div className="px-4 pb-3 pt-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-300/80">
            Explore the trail
          </p>
          <h3 className="mt-1 text-base font-semibold text-white">{trekName}</h3>
          <p className="mt-1 text-xs text-white/45">
            {points.length} checkpoints · click or fly the route
          </p>
        </div>

        <div className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
          {points.map((point, index) => {
            const selected = index === active;
            return (
              <button
                key={point.id}
                type="button"
                onClick={() => {
                  stopFly();
                  flyTo(index);
                }}
                className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                  selected
                    ? "bg-white/10 ring-1 ring-emerald-400/40"
                    : "hover:bg-white/5"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    selected
                      ? "bg-emerald-500 text-white"
                      : "bg-white/10 text-white/70"
                  }`}
                >
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-white">
                    {point.name}
                  </span>
                  <span className="mt-0.5 block text-[11px] text-white/45">
                    {point.day_number ? `Day ${point.day_number} · ` : ""}
                    {point.altitude_m.toLocaleString()} m
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="border-t border-white/10 p-3">
          {current ? (
            <p className="mb-3 line-clamp-3 text-xs leading-5 text-white/60">
              {current.description || current.stay_name || "Trail checkpoint"}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => (flying ? stopFly() : void flyTrail())}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500"
          >
            {flying ? <Square size={14} /> : <Play size={14} />}
            {flying ? "Stop flyover" : "Fly the trail"}
          </button>
        </div>
      </aside>

      <div className="relative min-h-[320px]">
        <div ref={containerRef} className="absolute inset-0" />
        {!ready ? (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0b1220]">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
