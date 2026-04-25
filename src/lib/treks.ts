import { supabase } from "@/lib/supabase";
import type { TrekPermit, TrekRow } from "@/types/database";

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

export function parsePermitCosts(value: TrekRow["permit_costs"]): TrekPermit[] {
  if (!value || !Array.isArray(value)) {
    return [];
  }

  return value as unknown as TrekPermit[];
}
