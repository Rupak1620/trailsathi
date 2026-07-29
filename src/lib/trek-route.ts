import { supabase } from "@/lib/supabase";
import type { TrekRoutePoint } from "@/types/database";

/**
 * Fetch all route waypoints for a trek, ordered by sequence.
 * Returns an empty array if the trek has no route points yet.
 */
export async function getTrekRoutePoints(
  trekId: string
): Promise<TrekRoutePoint[]> {
  const { data, error } = await supabase
    .from("trek_route_points")
    .select(
      `id, trek_id, sequence_order, day_number,
       name, latitude, longitude, altitude_m,
       point_type, is_overnight, is_acclimatization_day,
       description, special_notes,
       stay_type, stay_name,
       stay_price_usd_min, stay_price_usd_max,
       stay_facilities, image_url,
       created_at, updated_at`
    )
    .eq("trek_id", trekId)
    .order("sequence_order", { ascending: true });

  if (error) {
    console.error("[trek-route] Failed to load route points", { trekId, error });
    return [];
  }

  return (data ?? []) as TrekRoutePoint[];
}

/**
 * Convert an ordered array of TrekRoutePoints into a GeoJSON FeatureCollection
 * containing:
 *   - A LineString Feature representing the full trail route
 *   - A Point Feature per waypoint with all stop metadata as properties
 *
 * This is the format Mapbox GL JS consumes directly.
 */
export function toGeoJSON(points: TrekRoutePoint[]): GeoJSON.FeatureCollection {
  const coordinates = points.map((p) => [p.longitude, p.latitude, p.altitude_m]);

  const routeLine: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    properties: { type: "route" },
    geometry: {
      type: "LineString",
      coordinates,
    },
  };

  const stopPoints: GeoJSON.Feature<GeoJSON.Point>[] = points.map((p) => ({
    type: "Feature",
    properties: {
      id: p.id,
      name: p.name,
      altitude_m: p.altitude_m,
      point_type: p.point_type,
      is_overnight: p.is_overnight,
      is_acclimatization_day: p.is_acclimatization_day,
      day_number: p.day_number,
      description: p.description,
      special_notes: p.special_notes,
      stay_type: p.stay_type,
      stay_name: p.stay_name,
      stay_price_usd_min: p.stay_price_usd_min,
      stay_price_usd_max: p.stay_price_usd_max,
      stay_facilities: p.stay_facilities,
      image_url: p.image_url,
    },
    geometry: {
      type: "Point",
      coordinates: [p.longitude, p.latitude, p.altitude_m],
    },
  }));

  return {
    type: "FeatureCollection",
    features: [routeLine, ...stopPoints],
  };
}

/**
 * Compute bounding box [minLng, minLat, maxLng, maxLat] for a set of points.
 * Used to set the initial map viewport.
 */
export function routeBounds(
  points: TrekRoutePoint[]
): [number, number, number, number] | null {
  if (points.length === 0) return null;

  const lngs = points.map((p) => p.longitude);
  const lats = points.map((p) => p.latitude);

  // Add a small padding (0.05°) so the route doesn't touch the map edge
  const pad = 0.05;
  return [
    Math.min(...lngs) - pad,
    Math.min(...lats) - pad,
    Math.max(...lngs) + pad,
    Math.max(...lats) + pad,
  ];
}
