"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";

type RecommendationResult = {
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

const promptSuggestions = [
  "7 days, moderate fitness, first time trekking",
  "budget under NPR 80,000, best spring trek",
  "high altitude experience, want a hard route",
];

export function RecommenderPlanner() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (!prompt.trim()) {
      setError("Tell TrailSathi what kind of trek you want.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult(null);
        setError(data.error || "Failed to get a recommendation.");
        return;
      }

      setResult(data);
    } catch {
      setResult(null);
      setError("Network error while contacting the recommender.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className="ai-planner-shell relative mx-auto max-w-2xl">
        <div
          className="pointer-events-none absolute -inset-3 rounded-[1.75rem] bg-gradient-to-br from-emerald-400/40 via-emerald-500/20 to-teal-400/30 blur-xl"
          aria-hidden
        />
        <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-left">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm shadow-emerald-600/40">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-900">Ask TrailSathi</p>
                <p className="text-xs text-stone-500">Grounded in verified trek data</p>
              </div>
            </div>
            <span className="hidden rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 sm:inline">
              AI planner
            </span>
          </div>

          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                void handleSubmit();
              }
            }}
            placeholder="e.g. 7 days in Nepal, moderate fitness, first time trekker, budget under NPR 80,000"
            rows={4}
            className="min-h-[7.5rem] w-full resize-none rounded-xl border-2 border-stone-200 bg-stone-50/80 px-4 py-3.5 text-[15px] leading-6 text-stone-800 placeholder:text-stone-400 transition-colors focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/15"
          />

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/30 transition-all hover:bg-emerald-500 hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Planning your trek…
              </>
            ) : (
              <>
                Get my trip plan
                <ArrowRight size={18} />
              </>
            )}
          </button>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {promptSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setPrompt(suggestion)}
                className="rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {error ? (
        <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <section
          key={result.summary}
          className="recommendation-enter mx-auto mt-10 max-w-5xl rounded-2xl bg-white/95 px-4 py-8 text-left text-stone-900 shadow-2xl"
        >
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
              Verified recommendation
            </p>
            <h2 className="mt-2 text-2xl font-bold">{result.summary}</h2>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {result.recommendations.map((recommendation, index) => (
                <Link
                  key={recommendation.slug}
                  href={`/treks/${recommendation.slug}`}
                  className="recommendation-card-enter rounded-2xl border border-stone-200 bg-stone-50 p-4 transition hover:border-emerald-200 hover:bg-white"
                  style={{ animationDelay: `${120 + index * 80}ms` }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-emerald-700">
                      {recommendation.region}
                    </span>
                    <span className="text-xs text-stone-400">
                      {recommendation.difficulty || "Pending"}
                    </span>
                  </div>

                  <h3 className="mt-3 text-lg font-semibold text-stone-900">
                    {recommendation.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-stone-600">
                    {recommendation.why_fit}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-stone-400">Duration</dt>
                      <dd className="font-medium text-stone-800">
                        {recommendation.duration_days
                          ? `${recommendation.duration_days} days`
                          : "Pending"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-stone-400">Altitude</dt>
                      <dd className="font-medium text-stone-800">
                        {recommendation.max_altitude
                          ? `${recommendation.max_altitude} m`
                          : "Pending"}
                      </dd>
                    </div>
                    <div className="col-span-2">
                      <dt className="text-stone-400">Permit</dt>
                      <dd className="font-medium text-stone-800">
                        {recommendation.permit_summary}
                      </dd>
                    </div>
                  </dl>
                </Link>
              ))}
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
                  Safety notes
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-stone-700">
                  {result.safety_notes.map((note) => (
                    <li key={note}>{note}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                  Next step
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-700">{result.follow_up}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
