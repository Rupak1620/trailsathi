import { NextResponse } from "next/server";
import { buildRecommendationContext } from "@/lib/recommendation-context";

const recommendationSchema = {
  name: "trailsathi_recommendation",
  strict: true,
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["summary", "recommendations", "safety_notes", "follow_up"],
    properties: {
      summary: { type: "string" },
      recommendations: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "slug",
            "name",
            "region",
            "why_fit",
            "duration_days",
            "difficulty",
            "max_altitude",
            "permit_summary",
          ],
          properties: {
            slug: { type: "string" },
            name: { type: "string" },
            region: { type: "string" },
            why_fit: { type: "string" },
            duration_days: { type: ["integer", "null"] },
            difficulty: { type: ["string", "null"] },
            max_altitude: { type: ["integer", "null"] },
            permit_summary: { type: "string" },
          },
        },
      },
      safety_notes: {
        type: "array",
        items: { type: "string" },
      },
      follow_up: { type: "string" },
    },
  },
} as const;

export async function POST(request: Request) {
  try {
    const { prompt } = (await request.json()) as { prompt?: string };
    const trimmedPrompt = prompt?.trim();

    if (!trimmedPrompt) {
      return NextResponse.json({ error: "Please describe the kind of trek you want." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is missing from the server environment." },
        { status: 500 }
      );
    }

    const context = await buildRecommendationContext(trimmedPrompt);

    if (context.shortlist.length === 0) {
      return NextResponse.json({
        summary: "No verified trek is available in the current system.",
        recommendations: [],
        safety_notes: ["Expand the verified trek dataset before relying on AI recommendations."],
        follow_up: "Please review the trek library and add more verified entries.",
      });
    }

    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.OPENAI_RECOMMENDER_MODEL || "gpt-5-mini",
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You are TrailSathi's Nepal trekking recommendation assistant. Use only the verified trek data provided. Do not invent treks, seasons, permit facts, routes, or costs. If the best answer is uncertain, say so briefly and stay factual.",
              },
            ],
          },
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `User request: ${trimmedPrompt}\n\nVerified trek shortlist:\n${JSON.stringify(
                  context.shortlist,
                  null,
                  2
                )}\n\nReturn only recommendations from that shortlist.`,
              },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            ...recommendationSchema,
          },
        },
      }),
    });

    if (!openAiResponse.ok) {
      const errorText = await openAiResponse.text();
      return NextResponse.json(
        { error: "OpenAI request failed.", details: errorText },
        { status: 502 }
      );
    }

    const responsePayload = await openAiResponse.json();
    const outputText = extractOutputText(responsePayload);

    if (!outputText) {
      return NextResponse.json(
        { error: "OpenAI returned no structured recommendation text." },
        { status: 502 }
      );
    }

    return NextResponse.json(JSON.parse(outputText));
  } catch (error) {
    console.error("Recommendation route failed", error);

    return NextResponse.json(
      { error: "Something went wrong while building the trek recommendation." },
      { status: 500 }
    );
  }
}

function extractOutputText(payload: unknown) {
  if (
    typeof payload !== "object" ||
    payload === null ||
    !("output" in payload) ||
    !Array.isArray(payload.output)
  ) {
    return null;
  }

  for (const item of payload.output) {
    if (
      typeof item === "object" &&
      item !== null &&
      "content" in item &&
      Array.isArray(item.content)
    ) {
      for (const contentPart of item.content) {
        if (
          typeof contentPart === "object" &&
          contentPart !== null &&
          contentPart.type === "output_text" &&
          typeof contentPart.text === "string"
        ) {
          return contentPart.text;
        }
      }
    }
  }

  return null;
}
