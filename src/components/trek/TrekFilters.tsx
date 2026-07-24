"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";

export const trekDifficulties = ["All", "Easy", "Moderate", "Hard", "Technical"] as const;
export type TrekDifficultyFilter = (typeof trekDifficulties)[number];

type TrekFiltersProps = {
  query: string;
  difficulty: TrekDifficultyFilter;
  totalCount: number;
  filteredCount: number;
  onQueryChange: (value: string) => void;
  onDifficultyChange: (value: TrekDifficultyFilter) => void;
  onClear: () => void;
};

export function TrekFilters({
  query,
  difficulty,
  totalCount,
  filteredCount,
  onQueryChange,
  onDifficultyChange,
  onClear,
}: TrekFiltersProps) {
  const hasActiveFilters = query.trim().length > 0 || difficulty !== "All";

  return (
    <div className="mb-8 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
      <div className="flex items-center gap-2 border-b border-stone-100 bg-stone-50/80 px-4 py-3 sm:px-5">
        <SlidersHorizontal size={16} className="text-emerald-700" />
        <p className="text-sm font-semibold text-stone-800">Filter treks</p>
        <span className="ml-auto text-xs font-medium text-stone-500">
          {filteredCount} of {totalCount}
        </span>
      </div>

      <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
        <div className="relative min-w-0 flex-1">
          <label htmlFor="trek-search" className="sr-only">
            Search treks
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-stone-400" />
          <input
            id="trek-search"
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search by name, region, or keyword…"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 py-3 pl-10 pr-10 text-sm text-stone-900 transition-shadow placeholder:text-stone-400 focus:border-emerald-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
          {query ? (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-2">
          {trekDifficulties.map((level) => {
            const active = difficulty === level;
            return (
              <button
                key={level}
                type="button"
                onClick={() => onDifficultyChange(level)}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/25"
                    : "border border-stone-200 bg-white text-stone-600 hover:border-emerald-300 hover:text-emerald-800"
                }`}
              >
                {level}
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters ? (
        <div className="flex items-center justify-between gap-3 border-t border-stone-100 bg-emerald-50/40 px-4 py-2.5 sm:px-5">
          <p className="text-xs text-stone-600">
            {filteredCount === 0
              ? "No matches for current filters"
              : `Showing ${filteredCount} matching ${filteredCount === 1 ? "trek" : "treks"}`}
          </p>
          <button
            type="button"
            onClick={onClear}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800"
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}
