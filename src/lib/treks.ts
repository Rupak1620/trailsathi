import { supabase } from "@/lib/supabase";
import type {
  TrekItineraryRow,
  TrekPermit,
  TrekRow,
  TrekSourceRow,
} from "@/types/database";

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
  permit_cost,
  permit_costs,
  best_seasons,
  highlights,
  safety_notes,
  image_url,
  is_verified,
  last_verified_at
`;

export async function getVerifiedTreks(limit?: number): Promise<TrekRow[]> {
  let query = supabase
    .from("treks")
    .select(verifiedTrekSelect)
    .eq("is_verified", true)
    .order("name");

  if (typeof limit === "number") {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data ?? [];
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

export async function getVerifiedTrekBySlug(slug: string): Promise<TrekRow | null> {
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

export async function getTrekSources(trekId: string): Promise<TrekSourceRow[]> {
  const { data, error } = await supabase
    .from("trek_sources")
    .select("id, trek_id, source_name, source_url, source_type, checked_at, notes, created_at")
    .eq("trek_id", trekId)
    .order("checked_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getTrekItinerary(trekId: string): Promise<TrekItineraryRow[]> {
  const { data, error } = await supabase
    .from("trek_itineraries")
    .select("id, trek_id, day_number, title, summary, overnight_place, altitude_m, created_at")
    .eq("trek_id", trekId)
    .order("day_number");

  if (error) {
    throw error;
  }

  return data ?? [];
}

export function parsePermitCosts(value: TrekRow["permit_costs"]): TrekPermit[] {
  if (!value || !Array.isArray(value)) {
    return [];
  }

  return value as unknown as TrekPermit[];
}
