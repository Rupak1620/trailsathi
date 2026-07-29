import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrekParallaxHero } from "@/components/trek/TrekParallaxHero";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { SeasonalPlanner } from "@/components/trek/SeasonalPlanner";
import { TrekWeatherWidget } from "@/components/trek/TrekWeatherWidget";
import { AltitudeSicknessSosPanel } from "@/components/trek/AltitudeSicknessSosPanel";
import { TrekGuidesSection } from "@/components/trek/TrekGuidesSection";
import { TrekItineraryMap } from "@/components/trek/TrekItineraryMap";
import { getGuidesForTrek } from "@/lib/guides";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  MapPin,
  MapPinned,
  Mountain,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import {
  getTrekItinerary,
  getTrekSources,
  getVerifiedTrekBySlug,
  parsePermitCosts,
} from "@/lib/treks";
import { getTrekRoutePoints } from "@/lib/trek-route";
import { getTrekImageWithFallback } from "@/lib/trek-images";

type TrekDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: TrekDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const trek = await getVerifiedTrekBySlug(slug);

  if (!trek) {
    return { title: "Trek not found — TrailSathi" };
  }

  const description =
    trek.description?.slice(0, 155) ??
    `${trek.name} — ${trek.duration_days ?? "?"} days, ${trek.max_altitude ?? "?"}m max altitude. Verified trek profile on TrailSathi.`;

  const image = getTrekImageWithFallback(trek.slug, trek.image_url);

  return {
    title: `${trek.name} — TrailSathi`,
    description,
    openGraph: {
      title: trek.name,
      description,
      images: [{ url: image, width: 1600, height: 900, alt: trek.name }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: trek.name,
      description,
      images: [image],
    },
  };
}

export default async function TrekDetailPage({ params }: TrekDetailPageProps) {
  const { slug } = await params;
  const trek = await getVerifiedTrekBySlug(slug);

  if (!trek) notFound();

  const permits = parsePermitCosts(trek.permit_costs);
  const [sources, itinerary, guides, routePoints] = await Promise.all([
    getTrekSources(trek.id),
    getTrekItinerary(trek.id),
    getGuidesForTrek(trek.id),
    getTrekRoutePoints(trek.id),
  ]);

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Breadcrumb bar */}
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft size={16} />
            Back to treks
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-6xl gap-8 px-4 py-10 lg:flex lg:items-start">
        {/* ── LEFT COLUMN (main content) ── */}
        <div className="min-w-0 flex-1 space-y-8">
          {/* Hero + quick facts */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <TrekParallaxHero
              src={getTrekImageWithFallback(trek.slug, trek.image_url)}
              alt={trek.name}
            />

            <ScrollReveal className="space-y-5 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  {trek.region}
                </span>
                {trek.difficulty ? (
                  <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-semibold text-stone-700">
                    {trek.difficulty}
                  </span>
                ) : null}
                {trek.is_verified && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck size={14} />
                    Verified
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">
                  {trek.name}
                </h1>
                <p className="mt-3 max-w-3xl text-base leading-7 text-stone-600">
                  {trek.description || "Verified trek profile in progress."}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <InfoCard
                  icon={<CalendarDays size={18} />}
                  label="Duration"
                  value={formatDuration(trek.duration_days)}
                />
                <InfoCard
                  icon={<Mountain size={18} />}
                  label="Max altitude"
                  value={
                    trek.max_altitude
                      ? `${trek.max_altitude} m`
                      : "Pending verification"
                  }
                />
                <InfoCard
                  icon={<MapPinned size={18} />}
                  label="Difficulty"
                  value={trek.difficulty || "Pending verification"}
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Route overview */}
          <ScrollReveal className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-stone-900">
              Route Overview
            </h2>
            <p className="mt-3 leading-7 text-stone-600">
              {trek.route_overview || "Verified route overview coming soon."}
            </p>
          </ScrollReveal>

          {/* Highlights */}
          <ScrollReveal
            delayMs={80}
            className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
          >
            <h2 className="text-xl font-semibold text-stone-900">Highlights</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {(trek.highlights ?? []).length > 0 ? (
                trek.highlights?.map((highlight) => (
                  <span
                    key={highlight}
                    className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2 text-sm text-stone-700"
                  >
                    {highlight}
                  </span>
                ))
              ) : (
                <p className="text-stone-500">
                  Highlights are still being verified.
                </p>
              )}
            </div>
          </ScrollReveal>

          {/* 3D Route Map + elevation profile */}
          <ScrollReveal delayMs={110}>
            <TrekItineraryMap
              trekName={trek.name}
              itinerary={itinerary}
              region={trek.region}
              routePoints={routePoints}
            />
          </ScrollReveal>

          {/* Day-by-day itinerary */}
          <ScrollReveal
            delayMs={120}
            className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-stone-900">
                Itinerary
              </h2>
              {itinerary.length > 0 ? (
                <span className="text-sm text-stone-500">
                  {itinerary.length} verified day entries
                </span>
              ) : null}
            </div>

            {itinerary.length > 0 ? (
              <div className="mt-5 space-y-4">
                {itinerary.map((day) => (
                  <div
                    key={day.id}
                    className="rounded-xl border border-stone-200 bg-stone-50 p-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                          Day {day.day_number}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-stone-900">
                          {day.title}
                        </h3>
                      </div>
                      {day.altitude_m ? (
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-stone-700">
                          {day.altitude_m} m
                        </span>
                      ) : null}
                    </div>
                    {day.summary ? (
                      <p className="mt-3 leading-7 text-stone-600">
                        {day.summary}
                      </p>
                    ) : null}
                    {day.overnight_place ? (
                      <p className="mt-3 text-sm text-stone-500">
                        Overnight:{" "}
                        <span className="font-medium text-stone-700">
                          {day.overnight_place}
                        </span>
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5">
                <p className="font-medium text-stone-800">
                  Verified itinerary is still being prepared.
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Add day-by-day entries in Supabase{" "}
                  <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">
                    trek_itineraries
                  </code>{" "}
                  when you are ready.
                </p>
              </div>
            )}
          </ScrollReveal>

          {/* Altitude & weather — shows real data when coordinates exist */}
          {trek.max_altitude ? (
            <ScrollReveal delayMs={140}>
              {trek.latitude && trek.longitude ? (
                <TrekWeatherWidget
                  trekName={trek.name}
                  maxAltitude={trek.max_altitude}
                  latitude={trek.latitude}
                  longitude={trek.longitude}
                />
              ) : (
                <AltitudeHealthPlaceholder
                  trekName={trek.name}
                  maxAltitude={trek.max_altitude}
                />
              )}
            </ScrollReveal>
          ) : null}

          {/* AMS + SOS */}
          <ScrollReveal delayMs={148}>
            <AltitudeSicknessSosPanel
              trekName={trek.name}
              region={trek.region}
            />
          </ScrollReveal>

          {/* Guides */}
          <ScrollReveal delayMs={155}>
            <TrekGuidesSection
              trekName={trek.name}
              trekId={trek.id}
              region={trek.region}
              guides={guides}
            />
          </ScrollReveal>

          {/* Seasonal planner */}
          <ScrollReveal delayMs={170}>
            <SeasonalPlanner />
          </ScrollReveal>

          {/* Safety notes */}
          <ScrollReveal
            delayMs={160}
            className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8"
          >
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-amber-600" size={20} />
              <h2 className="text-xl font-semibold text-stone-900">
                Safety Notes
              </h2>
            </div>
            {(trek.safety_notes ?? []).length > 0 ? (
              <ul className="mt-4 space-y-3 text-stone-600">
                {trek.safety_notes?.map((note) => (
                  <li
                    key={note}
                    className="rounded-xl bg-amber-50 px-4 py-3 leading-7"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-stone-500">
                Safety notes are still being verified.
              </p>
            )}
          </ScrollReveal>

          {/* Sources (also in sidebar — shown here for mobile) */}
          <ScrollReveal
            delayMs={180}
            className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8 lg:hidden"
          >
            <h2 className="text-xl font-semibold text-stone-900">Sources</h2>
            <SourcesList sources={sources} />
          </ScrollReveal>
        </div>

        {/* ── RIGHT COLUMN (sticky sidebar) ── */}
        <aside className="mt-8 w-full shrink-0 space-y-6 lg:mt-0 lg:w-[340px] lg:sticky lg:top-[4.5rem] lg:self-start">
          {/* Quick-facts CTA card */}
          <ScrollReveal className="overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-700 to-emerald-900 p-6 text-white shadow-lg">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-200">
              Plan this trek
            </p>
            <h3 className="mt-2 text-xl font-bold">
              {trek.name}
            </h3>

            <dl className="mt-5 space-y-3 text-sm">
              <SidebarFact
                label="Duration"
                value={formatDuration(trek.duration_days)}
                icon={<CalendarDays size={15} />}
              />
              <SidebarFact
                label="Max altitude"
                value={
                  trek.max_altitude ? `${trek.max_altitude} m` : "Pending"
                }
                icon={<Mountain size={15} />}
              />
              <SidebarFact
                label="Difficulty"
                value={trek.difficulty ?? "Pending"}
                icon={<MapPin size={15} />}
              />
              <SidebarFact
                label="Region"
                value={trek.region}
                icon={<MapPinned size={15} />}
              />
              {trek.best_seasons?.length ? (
                <SidebarFact
                  label="Best season"
                  value={trek.best_seasons.join(", ")}
                  icon={<CalendarDays size={15} />}
                />
              ) : null}
            </dl>

            <div className="mt-6 space-y-3">
              <Link
                href="/guides"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
              >
                <Users size={16} />
                Find a guide for this trek
              </Link>
              <Link
                href="/"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/20"
              >
                <Sparkles size={16} />
                Ask AI trip planner
                <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          {/* Permit summary */}
          <ScrollReveal delayMs={60} className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-base font-semibold text-stone-900">
              Permit Info
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {trek.permit_details ||
                "Permit notes are still being verified."}
            </p>

            {permits.length > 0 ? (
              <div className="mt-5 space-y-4">
                {permits.map((permit) => (
                  <div
                    key={permit.permit_name}
                    className="rounded-xl border border-stone-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold text-stone-900">
                          {permit.permit_name}
                        </h3>
                        <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                          {permit.required ? "Required" : "Optional"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      {permit.costs.map((cost) => (
                        <div
                          key={`${permit.permit_name}-${cost.audience}`}
                          className="flex items-start justify-between gap-4 rounded-lg bg-stone-50 px-3 py-2 text-sm"
                        >
                          <span className="text-stone-600">{cost.audience}</span>
                          <div className="text-right">
                            <div className="font-semibold text-stone-900">
                              NPR {cost.amount_npr.toLocaleString()}
                            </div>
                            {cost.notes ? (
                              <div className="text-[10px] text-stone-500">
                                {cost.notes}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>

                    {permit.notes ? (
                      <p className="mt-3 text-xs leading-5 text-stone-500">
                        {permit.notes}
                      </p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-stone-500">
                Structured permit pricing has not been added yet.
              </p>
            )}
          </ScrollReveal>

          {/* Best season */}
          <ScrollReveal delayMs={80} className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-base font-semibold text-stone-900">
              Best Season
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(trek.best_seasons ?? []).length > 0 ? (
                trek.best_seasons?.map((season) => (
                  <span
                    key={season}
                    className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700"
                  >
                    {season}
                  </span>
                ))
              ) : (
                <p className="text-sm text-stone-500">
                  Season data is still being verified.
                </p>
              )}
            </div>
          </ScrollReveal>

          {/* Verification */}
          <ScrollReveal delayMs={100} className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-base font-semibold text-stone-900">
              Verification
            </h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Status</dt>
                <dd className="font-medium text-stone-900">
                  {trek.is_verified ? (
                    <span className="inline-flex items-center gap-1 text-emerald-700">
                      <BadgeCheck size={14} /> Verified
                    </span>
                  ) : (
                    "Needs review"
                  )}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Last updated</dt>
                <dd className="font-medium text-stone-900">
                  {formatVerifiedAt(trek.last_verified_at)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Source count</dt>
                <dd className="font-medium text-stone-900">{sources.length}</dd>
              </div>
            </dl>
          </ScrollReveal>

          {/* Sources — desktop only (also shown in main column on mobile) */}
          <ScrollReveal
            delayMs={120}
            className="hidden rounded-2xl border border-stone-200 bg-white p-6 lg:block"
          >
            <h2 className="text-base font-semibold text-stone-900">Sources</h2>
            <SourcesList sources={sources} />
          </ScrollReveal>

          {/* AI planner nudge */}
          <ScrollReveal delayMs={140} className="rounded-2xl border border-stone-200 bg-stone-50 p-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  Not sure if this trek suits you?
                </p>
                <p className="mt-1 text-xs leading-5 text-stone-500">
                  Tell TrailSathi your fitness, budget, and time — get verified
                  recommendations in seconds.
                </p>
                <Link
                  href="/"
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
                >
                  Open AI planner
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </aside>
      </div>
    </main>
  );
}

/* ── Sub-components ── */

function SourcesList({
  sources,
}: {
  sources: {
    id: string;
    source_name: string;
    source_url: string | null;
    source_type: string | null;
    checked_at: string;
    notes: string | null;
  }[];
}) {
  if (sources.length === 0) {
    return (
      <p className="mt-4 text-sm text-stone-500">
        Source records are still being added for this trek.
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {sources.map((source) => (
        <div
          key={source.id}
          className="rounded-xl border border-stone-200 bg-stone-50 p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-stone-900">
                {source.source_name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                {source.source_type ? (
                  <span className="rounded-full bg-white px-2 py-0.5 uppercase tracking-wide text-stone-500">
                    {source.source_type}
                  </span>
                ) : null}
                <span>Checked {formatVerifiedAt(source.checked_at)}</span>
              </div>
            </div>
            {source.source_url ? (
              <a
                href={source.source_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-emerald-700 hover:text-emerald-800"
              >
                Visit
                <ExternalLink size={14} />
              </a>
            ) : null}
          </div>
          {source.notes ? (
            <p className="mt-2 text-xs leading-5 text-stone-600">
              {source.notes}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function SidebarFact({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-3 last:border-0 last:pb-0">
      <dt className="flex items-center gap-1.5 text-emerald-200/80">
        {icon}
        {label}
      </dt>
      <dd className="text-right font-semibold text-white">{value}</dd>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          {label}
        </span>
      </div>
      <p className="mt-3 text-lg font-bold text-stone-900">{value}</p>
    </div>
  );
}

function formatDuration(duration: number | null) {
  if (typeof duration === "number") return `${duration} days`;
  return "Pending verification";
}

function formatVerifiedAt(value: string | null) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

/** Shown for treks that don't yet have GPS coordinates in the DB */
function AltitudeHealthPlaceholder({
  trekName,
  maxAltitude,
}: {
  trekName: string;
  maxAltitude: number;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-semibold text-stone-700">{trekName}</p>
      <p className="mt-1 text-sm text-stone-500">
        Max altitude: {maxAltitude.toLocaleString()} m. GPS coordinates not yet
        set — run <code className="rounded bg-stone-100 px-1 font-mono text-xs">trek-coordinates-migration.sql</code> in
        Supabase to enable real weather data.
      </p>
    </div>
  );
}
