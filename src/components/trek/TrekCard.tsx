import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPermitPriceSummary } from "@/lib/treks";
import { getTrekImageWithFallback } from "@/lib/trek-images";
import type { TrekRow } from "@/types/database";

export type TrekCardData = {
  id: string;
  slug: string;
  name: string;
  region: string;
  description: string | null;
  duration_days: number | null;
  max_altitude: number | null;
  difficulty: string | null;
  image_url: string | null;
  permit_required: boolean;
  permit_costs: TrekRow["permit_costs"];
  best_seasons: string[] | null;
};

type TrekCardProps = {
  trek: TrekCardData;
  variant?: "compact" | "full";
  enterDelayMs?: number;
  className?: string;
};

export function TrekCard({ trek, variant = "full", enterDelayMs, className = "" }: TrekCardProps) {
  const enterStyle = enterDelayMs !== undefined ? { animationDelay: `${enterDelayMs}ms` } : undefined;
  const enterClass = enterDelayMs !== undefined ? "trek-card-enter" : "";

  if (variant === "compact") {
    return (
      <Link
        href={`/treks/${trek.slug}`}
        className={`trek-card group overflow-hidden rounded-2xl border border-stone-200 bg-white ${enterClass} ${className}`.trim()}
        style={enterStyle}
      >
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={getTrekImageWithFallback(trek.slug, trek.image_url)}
            alt={trek.name}
            width={640}
            height={384}
            className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
              {trek.region}
            </span>
            {trek.difficulty ? (
              <span className="rounded-full bg-stone-900/65 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                {trek.difficulty}
              </span>
            ) : null}
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700">
            {trek.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-500">
            {trek.description}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs font-medium text-stone-500">
            <span>{formatDuration(trek.duration_days)}</span>
            <span className="h-1 w-1 rounded-full bg-stone-300" />
            <span>{trek.max_altitude ? `${trek.max_altitude}m` : "Altitude pending"}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/treks/${trek.slug}`}
      className={`trek-card group overflow-hidden rounded-2xl border border-stone-200 bg-white ${enterClass} ${className}`.trim()}
      style={enterStyle}
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={getTrekImageWithFallback(trek.slug, trek.image_url)}
          alt={trek.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
          <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            {trek.region}
          </span>
          <span className="rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white">
            {trek.difficulty || "Pending"}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold leading-7 text-stone-900 group-hover:text-emerald-700">
            {trek.name}
          </h3>
          <ArrowRight
            size={18}
            className="mt-1 shrink-0 text-stone-300 transition-colors group-hover:text-emerald-600"
          />
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-600">{trek.description}</p>

        <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-stone-50 p-3 text-center">
          <Metric label="Duration" value={formatDuration(trek.duration_days)} />
          <Metric label="Max altitude" value={trek.max_altitude ? `${trek.max_altitude}m` : "Pending"} />
          <Metric
            label="Permit"
            value={
              trek.permit_required
                ? getPermitPriceSummary(trek.permit_costs) || "Required"
                : "Not required"
            }
          />
        </div>

        {trek.best_seasons?.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {trek.best_seasons.map((season) => (
              <span
                key={season}
                className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600"
              >
                {season}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </Link>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-stone-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-stone-800">{value}</p>
    </div>
  );
}

function formatDuration(duration: number | null) {
  if (typeof duration === "number") return `${duration} days`;
  return "Pending";
}
