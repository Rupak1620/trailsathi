import { getPermitPriceSummary, getVerifiedTreks } from "@/lib/treks";

type TrekCandidate = {
  slug: string;
  name: string;
  region: string;
  duration_days: number | null;
  max_altitude: number | null;
  difficulty: string | null;
  description: string | null;
  best_seasons: string[] | null;
  permit_required: boolean;
  permit_summary: string;
};

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "around",
  "at",
  "budget",
  "days",
  "for",
  "from",
  "i",
  "in",
  "is",
  "me",
  "my",
  "nepal",
  "of",
  "on",
  "or",
  "the",
  "to",
  "trip",
  "want",
  "with",
]);

export async function buildRecommendationContext(userPrompt: string) {
  const treks = await getVerifiedTreks();
  const candidates = treks.map((trek) => ({
    slug: trek.slug,
    name: trek.name,
    region: trek.region,
    duration_days: trek.duration_days,
    max_altitude: trek.max_altitude,
    difficulty: trek.difficulty,
    description: trek.description,
    best_seasons: trek.best_seasons,
    permit_required: trek.permit_required,
    permit_summary: trek.permit_required
      ? getPermitPriceSummary(trek.permit_costs) || "Permit required"
      : "No permit required",
  }));

  const shortlisted = shortlistTreks(candidates, userPrompt);

  return {
    allCount: candidates.length,
    shortlist: shortlisted,
  };
}

function shortlistTreks(treks: TrekCandidate[], userPrompt: string) {
  const keywords = tokenize(userPrompt);

  const scored = treks
    .map((trek) => ({
      trek,
      score: scoreTrek(trek, keywords, userPrompt),
    }))
    .sort((a, b) => b.score - a.score || a.trek.name.localeCompare(b.trek.name));

  const positive = scored.filter((item) => item.score > 0).slice(0, 8);

  if (positive.length > 0) {
    return positive.map((item) => item.trek);
  }

  return scored.slice(0, 8).map((item) => item.trek);
}

function scoreTrek(trek: TrekCandidate, keywords: string[], prompt: string) {
  let score = 0;
  const haystack = `${trek.name} ${trek.region} ${trek.description ?? ""} ${(trek.best_seasons ?? []).join(" ")}`.toLowerCase();

  for (const keyword of keywords) {
    if (haystack.includes(keyword)) {
      score += 4;
    }
  }

  const lowerPrompt = prompt.toLowerCase();

  if (trek.duration_days && extractDayPreference(lowerPrompt) !== null) {
    const requestedDays = extractDayPreference(lowerPrompt);

    if (requestedDays !== null) {
      const difference = Math.abs(trek.duration_days - requestedDays);
      score += Math.max(0, 5 - difference);
    }
  }

  if (lowerPrompt.includes("easy") && trek.difficulty === "Easy") {
    score += 5;
  }
  if (lowerPrompt.includes("moderate") && trek.difficulty === "Moderate") {
    score += 5;
  }
  if ((lowerPrompt.includes("hard") || lowerPrompt.includes("challenging")) && trek.difficulty === "Hard") {
    score += 5;
  }

  return score;
}

function tokenize(prompt: string) {
  return prompt
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !stopWords.has(word));
}

function extractDayPreference(prompt: string) {
  const match = prompt.match(/(\d+)\s*(day|days)/);
  return match ? Number(match[1]) : null;
}
