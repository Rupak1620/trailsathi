import { NextResponse } from "next/server";
import { buildRecommendationContext } from "@/lib/recommendation-context";

type RecommendationPayload = {
  summary: string;
  recommendations: Array<{
    slug: string;
    name: string;
    region: string;
    why_fit: string;
    duration_days: number | null;
    difficulty: string | null;
    max_altitude: number | null;
    permit_summary: string;
  }>;
  safety_notes: string[];
  follow_up: string;
};

export async function POST(request: Request) {
  try {
    const { prompt } = (await request.json()) as { prompt?: string };
    const trimmedPrompt = prompt?.trim();

    if (!trimmedPrompt) {
      return NextResponse.json({ error: "Please describe the kind of trek you want." }, { status: 400 });
    }

    const context = await buildRecommendationContext(trimmedPrompt);

    if (context.shortlist.length === 0) {
      return NextResponse.json({
        summary: "No verified trek is available in the current system.",
        recommendations: [],
        safety_notes: ["Expand the verified trek dataset before relying on trip recommendations."],
        follow_up: "Please review the trek library and add more verified entries.",
      } satisfies RecommendationPayload);
    }

    const recommendations = context.shortlist.slice(0, 3).map((trek) => ({
      slug: trek.slug,
      name: trek.name,
      region: trek.region,
      why_fit: buildWhyFit(trimmedPrompt, trek),
      duration_days: trek.duration_days,
      difficulty: trek.difficulty,
      max_altitude: trek.max_altitude,
      permit_summary: trek.permit_summary,
    }));

    const payload: RecommendationPayload = {
      summary: buildSummary(trimmedPrompt, recommendations.length),
      recommendations,
      safety_notes: buildSafetyNotes(trimmedPrompt, recommendations),
      follow_up: buildFollowUp(trimmedPrompt, recommendations),
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Recommendation route failed", error);

    return NextResponse.json(
      { error: "Something went wrong while building the trek recommendation." },
      { status: 500 }
    );
  }
}

type RecommendationItem = RecommendationPayload["recommendations"][number];

function buildSummary(prompt: string, count: number) {
  if (count === 1) {
    return `Here is the strongest verified trek match for "${prompt}".`;
  }

  return `Here are ${count} verified trek options that best match "${prompt}".`;
}

function buildWhyFit(
  prompt: string,
  trek: {
    duration_days: number | null;
    difficulty: string | null;
    description: string | null;
    best_seasons: string[] | null;
    region: string;
  }
) {
  const reasons: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  if (trek.duration_days) {
    const requestedDays = extractDayPreference(lowerPrompt);
    if (requestedDays !== null && Math.abs(trek.duration_days - requestedDays) <= 2) {
      reasons.push(`its ${trek.duration_days}-day length is close to your requested timeframe`);
    }
  }

  if (trek.difficulty) {
    if (lowerPrompt.includes("easy") && trek.difficulty === "Easy") {
      reasons.push("the difficulty matches an easier trekking preference");
    } else if (lowerPrompt.includes("moderate") && trek.difficulty === "Moderate") {
      reasons.push("the difficulty fits a moderate trekking plan");
    } else if (
      (lowerPrompt.includes("hard") || lowerPrompt.includes("challenging")) &&
      trek.difficulty === "Hard"
    ) {
      reasons.push("the route suits a harder trekking goal");
    }
  }

  if (trek.best_seasons?.length) {
    const matchedSeason = trek.best_seasons.find((season) =>
      lowerPrompt.includes(season.toLowerCase())
    );
    if (matchedSeason) {
      reasons.push(`${matchedSeason} is already listed as a strong season for this route`);
    }
  }

  if (reasons.length === 0 && trek.description) {
    return trek.description;
  }

  if (reasons.length === 0) {
    return `It is one of the stronger verified matches in the ${trek.region} region.`;
  }

  return `This looks like a good fit because ${joinReasons(reasons)}.`;
}

function buildSafetyNotes(prompt: string, recommendations: RecommendationItem[]) {
  const notes = new Set<string>();
  const highestAltitude = Math.max(
    ...recommendations.map((recommendation) => recommendation.max_altitude ?? 0)
  );
  const lowerPrompt = prompt.toLowerCase();

  if (highestAltitude >= 4000) {
    notes.add("Several matching routes reach high altitude, so acclimatization planning matters.");
  }

  if (recommendations.some((recommendation) => recommendation.difficulty === "Hard")) {
    notes.add("Hard routes need a realistic fitness check before you commit.");
  }

  if (lowerPrompt.includes("first time") || lowerPrompt.includes("beginner")) {
    notes.add("As a first-time trekker, compare route length, altitude, and recovery days carefully.");
  }

  if (notes.size === 0) {
    notes.add("Review permit rules, weather window, and route safety notes before finalizing.");
  }

  return Array.from(notes);
}

function buildFollowUp(prompt: string, recommendations: RecommendationItem[]) {
  const top = recommendations[0];

  if (!top) {
    return "Add more verified treks to improve recommendation quality.";
  }

  const requestedDays = extractDayPreference(prompt.toLowerCase());

  if (requestedDays !== null) {
    return `Open ${top.name}, review the itinerary and permit section, and check whether ${top.duration_days ?? "the"} days work for your schedule.`;
  }

  return `Open ${top.name} first, then compare its route, permits, and safety notes with the other shortlisted options.`;
}

function extractDayPreference(prompt: string) {
  const match = prompt.match(/(\d+)\s*(day|days)/);
  return match ? Number(match[1]) : null;
}

function joinReasons(reasons: string[]) {
  if (reasons.length === 1) {
    return reasons[0];
  }

  if (reasons.length === 2) {
    return `${reasons[0]} and ${reasons[1]}`;
  }

  return `${reasons.slice(0, -1).join(", ")}, and ${reasons[reasons.length - 1]}`;
}
