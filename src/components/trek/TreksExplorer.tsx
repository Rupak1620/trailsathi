"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { TrekCard, type TrekCardData } from "@/components/trek/TrekCard";

type TreksExplorerProps = {
  treks: TrekCardData[];
};

const difficulties = ["All", "Easy", "Moderate", "Hard", "Technical"] as const;

export function TreksExplorer({ treks }: TreksExplorerProps) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<(typeof difficulties)[number]>("All");
  const [gridKey, setGridKey] = useState(0);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return treks.filter((trek) => {
      const matchesDifficulty = difficulty === "All" || trek.difficulty === difficulty;
      const matchesQuery =
        !q ||
        trek.name.toLowerCase().includes(q) ||
        trek.region.toLowerCase().includes(q) ||
        (trek.description?.toLowerCase().includes(q) ?? false);
      return matchesDifficulty && matchesQuery;
    });
  }, [treks, query, difficulty]);

  const filteredSignature = filtered.map((t) => t.id).join(",");

  useEffect(() => {
    setGridKey((k) => k + 1);
  }, [filteredSignature]);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md flex-1">
          <label htmlFor="trek-search" className="sr-only">
            Search treks
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
            <input
              id="trek-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, region…"
              className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 transition-shadow focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {difficulties.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => setDifficulty(level)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                difficulty === level
                  ? "bg-emerald-700 text-white shadow-sm"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-emerald-200 hover:text-emerald-800"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 text-sm text-stone-500">
        Showing {filtered.length} of {treks.length} verified {treks.length === 1 ? "trek" : "treks"}
      </div>

      {filtered.length > 0 ? (
        <div key={gridKey} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((trek, index) => (
            <TrekCard key={trek.id} trek={trek} enterDelayMs={index * 55} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
          <p className="font-medium text-stone-800">No treks match your filters</p>
          <p className="mt-2 text-sm text-stone-500">Try a different search term or difficulty level.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setDifficulty("All");
            }}
            className="mt-4 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
