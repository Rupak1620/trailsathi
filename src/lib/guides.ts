import { supabase } from "@/lib/supabase";
import type { GuideRow, GuideTrekRow, GuideVerificationRow } from "@/types/database";

/** `updated_at` omitted from SELECT until all DBs run the guides migration. */
export type VerifiedGuide = Omit<GuideRow, "updated_at"> & {
  updated_at?: string;
  verification: GuideVerificationRow | null;
  trekLinks: GuideTrekRow[];
};

const guideSelect = `
  id,
  slug,
  full_name,
  home_region,
  base_location,
  bio,
  years_experience,
  languages,
  phone,
  whatsapp,
  email,
  avatar_url,
  is_active,
  created_at
`;

export async function getActiveGuides(): Promise<VerifiedGuide[]> {
  const { data: guides, error } = await supabase
    .from("guides")
    .select(guideSelect)
    .eq("is_active", true)
    .order("full_name");

  if (error) {
    console.error("Failed to load active guides", error);
    return [];
  }

  const guideRows = (guides ?? []) as Omit<GuideRow, "updated_at">[];

  if (!guideRows.length) {
    return [];
  }

  const guideIds = guideRows.map((guide) => guide.id);
  const [verifications, trekLinks] = await Promise.all([
    getApprovedGuideVerifications(guideIds),
    getGuideTrekLinks(guideIds),
  ]);

  return guideRows.map((guide) => ({
    ...guide,
    verification: verifications.find((item) => item.guide_id === guide.id) ?? null,
    trekLinks: trekLinks.filter((item) => item.guide_id === guide.id),
  }));
}

async function getApprovedGuideVerifications(guideIds: string[]) {
  const { data, error } = await supabase
    .from("guide_verifications")
    .select(
      "id, guide_id, verification_status, license_number, license_document_url, reviewed_by, verified_at, notes, created_at"
    )
    .in("guide_id", guideIds)
    .eq("verification_status", "approved");

  if (error) {
    console.error("Failed to load guide verifications", error);
    return [];
  }

  return (data ?? []) as GuideVerificationRow[];
}

async function getGuideTrekLinks(guideIds: string[]) {
  const { data, error } = await supabase
    .from("guide_treks")
    .select("id, guide_id, trek_id, years_guiding, is_primary, notes, created_at")
    .in("guide_id", guideIds)
    .order("is_primary", { ascending: false });

  if (error) {
    console.error("Failed to load guide trek links", error);
    return [];
  }

  return (data ?? []) as GuideTrekRow[];
}

export async function getGuidesForTrek(trekId: string): Promise<VerifiedGuide[]> {
  const { data: links, error: linksError } = await supabase
    .from("guide_treks")
    .select("id, guide_id, trek_id, years_guiding, is_primary, notes, created_at")
    .eq("trek_id", trekId);

  if (linksError || !links?.length) {
    if (linksError) {
      console.error("Failed to load guide trek links", linksError);
    }
    return [];
  }

  const guideTrekLinks = links as GuideTrekRow[];
  const guideIds = guideTrekLinks.map((l) => l.guide_id);

  const { data: guides, error: guidesError } = await supabase
    .from("guides")
    .select(guideSelect)
    .in("id", guideIds)
    .eq("is_active", true);

  if (guidesError || !guides?.length) {
    if (guidesError) {
      console.error("Failed to load guides for trek", guidesError);
    }
    return [];
  }

  const guideRows = guides as Omit<GuideRow, "updated_at">[];
  const verifications = await getApprovedGuideVerifications(guideIds);

  return guideRows.map((guide) => ({
    ...guide,
    verification: verifications.find((item) => item.guide_id === guide.id) ?? null,
    trekLinks: guideTrekLinks.filter((item) => item.guide_id === guide.id),
  }));
}

