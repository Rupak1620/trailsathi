import { unstable_cache } from "next/cache";
import { supabase } from "@/lib/supabase";
import type {
  TrekItineraryRow,
  TrekPermit,
  TrekRow,
  TrekSourceRow,
} from "@/types/database";

const TREK_CACHE_SECONDS = 3600;

const verifiedTrekSelect = `
  id,
  slug,
  name,
  region,
  duration_days,
  max_altitude,
  difficulty,
  description,
  route_overview,
  permit_required,
  permit_details,
  permit_costs,
  best_seasons,
  highlights,
  safety_notes,
  image_url,
  latitude,
  longitude,
  is_verified,
  last_verified_at
`;

async function loadVerifiedTreks(limit: number): Promise<TrekRow[]> {
  let query = supabase
    .from("treks")
    .select(verifiedTrekSelect)
    .eq("is_verified", true)
    .order("name");

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
}

export function getVerifiedTreks(limit?: number): Promise<TrekRow[]> {
  const bounded = typeof limit === "number" ? limit : 0;
  return unstable_cache(
    () => loadVerifiedTreks(bounded),
    ["verified-treks", String(bounded)],
    { revalidate: TREK_CACHE_SECONDS, tags: ["treks"] }
  )();
}

export async function searchVerifiedTreks(searchText: string): Promise<TrekRow[]> {
  const trimmed = searchText.trim();

  if (!trimmed) {
    return [];
  }

  const { data, error } = await supabase
    .from("treks")
    .select(verifiedTrekSelect)
    .eq("is_verified", true)
    .or(`name.ilike.%${trimmed}%,region.ilike.%${trimmed}%`)
    .order("name");

  if (error) {
    throw error;
  }

  return data ?? [];
}

async function loadVerifiedTrekBySlug(slug: string): Promise<TrekRow | null> {
  const { data, error } = await supabase
    .from("treks")
    .select(verifiedTrekSelect)
    .eq("is_verified", true)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export function getVerifiedTrekBySlug(slug: string): Promise<TrekRow | null> {
  return unstable_cache(
    () => loadVerifiedTrekBySlug(slug),
    ["verified-trek", slug],
    { revalidate: TREK_CACHE_SECONDS, tags: ["treks", `trek:${slug}`] }
  )();
}

async function loadTrekSources(trekId: string): Promise<TrekSourceRow[]> {
  const { data, error } = await supabase
    .from("trek_sources")
    .select("id, trek_id, source_name, source_url, source_type, checked_at, notes, created_at")
    .eq("trek_id", trekId)
    .order("checked_at", { ascending: false });

  if (error) {
    console.error("Failed to load trek sources", { trekId, error });
    return [];
  }

  return data ?? [];
}

export function getTrekSources(trekId: string): Promise<TrekSourceRow[]> {
  return unstable_cache(
    () => loadTrekSources(trekId),
    ["trek-sources", trekId],
    { revalidate: TREK_CACHE_SECONDS, tags: ["treks", `trek-id:${trekId}`] }
  )();
}

async function loadTrekItinerary(trekId: string): Promise<TrekItineraryRow[]> {
  const { data, error } = await supabase
    .from("trek_itineraries")
    .select("id, trek_id, day_number, title, summary, overnight_place, altitude_m, created_at")
    .eq("trek_id", trekId)
    .order("day_number");

  if (error) {
    console.error("Failed to load trek itinerary", { trekId, error });
    return [];
  }

  return data ?? [];
}

export function getTrekItinerary(trekId: string): Promise<TrekItineraryRow[]> {
  return unstable_cache(
    () => loadTrekItinerary(trekId),
    ["trek-itinerary", trekId],
    { revalidate: TREK_CACHE_SECONDS, tags: ["treks", `trek-id:${trekId}`] }
  )();
}

export function parsePermitCosts(value: TrekRow["permit_costs"]): TrekPermit[] {
  if (!value || !Array.isArray(value)) {
    return [];
  }

  return value as unknown as TrekPermit[];
}

export function getPermitPriceSummary(value: TrekRow["permit_costs"]) {
  const permits = parsePermitCosts(value);
  const amounts = permits.flatMap((permit) => permit.costs.map((cost) => cost.amount_npr));

  if (amounts.length === 0) {
    return null;
  }

  const nonZeroAmounts = amounts.filter((amount) => amount > 0);

  if (nonZeroAmounts.length === 0) {
    return "No fee";
  }

  return `From NPR ${Math.min(...nonZeroAmounts)}`;
}
