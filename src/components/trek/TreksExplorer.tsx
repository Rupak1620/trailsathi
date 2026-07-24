"use client";

import { useEffect, useMemo, useState } from "react";
import { Compass, Mountain } from "lucide-react";
import { TrekCard, type TrekCardData } from "@/components/trek/TrekCard";
import {
  TrekFilters,
  type TrekDifficultyFilter,
} from "@/components/trek/TrekFilters";

type TreksExplorerProps = {
  treks: TrekCardData[];
};

export function TreksExplorer({ treks }: TreksExplorerProps) {
  const [query, setQuery] = useState("");
  const [difficulty, setDifficulty] = useState<TrekDifficultyFilter>("All");
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

  function clearFilters() {
    setQuery("");
    setDifficulty("All");
  }

  if (treks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
        <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Mountain size={28} />
        </span>
        <h3 className="mt-5 text-lg font-semibold text-stone-900">No verified treks yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-stone-500">
          Trek profiles will appear here once they are added and verified in Supabase.
        </p>
      </div>
    );
  }

  return (
    <>
      <TrekFilters
        query={query}
        difficulty={difficulty}
        totalCount={treks.length}
        filteredCount={filtered.length}
        onQueryChange={setQuery}
        onDifficultyChange={setDifficulty}
        onClear={clearFilters}
      />

      {filtered.length > 0 ? (
        <div key={gridKey} className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((trek, index) => (
            <TrekCard key={trek.id} trek={trek} enterDelayMs={index * 55} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
          <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-100 text-stone-500">
            <Compass size={28} />
          </span>
          <h3 className="mt-5 text-lg font-semibold text-stone-900">
            No treks match your filters
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-stone-500">
            Try a different search term or difficulty level — or clear filters to see the full
            verified collection.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
