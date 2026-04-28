import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  ExternalLink,
  MapPinned,
  Mountain,
  ShieldAlert,
} from "lucide-react";
import {
  getTrekItinerary,
  getTrekSources,
  getVerifiedTrekBySlug,
  parsePermitCosts,
} from "@/lib/treks";

type TrekDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TrekDetailPage({ params }: TrekDetailPageProps) {
  const { slug } = await params;
  const trek = await getVerifiedTrekBySlug(slug);

  if (!trek) {
    notFound();
  }

  const permits = parsePermitCosts(trek.permit_costs);
  const sources = await getTrekSources(trek.id);
  const itinerary = await getTrekItinerary(trek.id);

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center px-4 py-4">
          <Link href="/treks" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900">
            <ArrowLeft size={16} />
            Back to treks
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
            <div className="relative h-72 w-full sm:h-96">
              <Image
                src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1600"
                alt={trek.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 70vw"
                priority
              />
            </div>

            <div className="space-y-5 p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-800">
                  {trek.region}
                </span>
                {trek.is_verified && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <BadgeCheck size={14} />
                    Verified
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold text-stone-900 sm:text-4xl">{trek.name}</h1>
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
                  value={trek.max_altitude ? `${trek.max_altitude} m` : "Pending verification"}
                />
                <InfoCard
                  icon={<MapPinned size={18} />}
                  label="Difficulty"
                  value={trek.difficulty || "Pending verification"}
                />
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-stone-900">Route Overview</h2>
            <p className="mt-3 leading-7 text-stone-600">
              {trek.route_overview || "Verified route overview coming soon."}
            </p>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
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
                <p className="text-stone-500">Highlights are still being verified.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-stone-900">Itinerary</h2>
              {itinerary.length > 0 ? (
                <span className="text-sm text-stone-500">{itinerary.length} verified day entries</span>
              ) : null}
            </div>

            {itinerary.length > 0 ? (
              <div className="mt-5 space-y-4">
                {itinerary.map((day) => (
                  <div key={day.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                          Day {day.day_number}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-stone-900">{day.title}</h3>
                      </div>

                      {day.altitude_m ? (
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-medium text-stone-700">
                          {day.altitude_m} m
                        </span>
                      ) : null}
                    </div>

                    {day.summary ? (
                      <p className="mt-3 leading-7 text-stone-600">{day.summary}</p>
                    ) : null}

                    {day.overnight_place ? (
                      <p className="mt-3 text-sm text-stone-500">Overnight: {day.overnight_place}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5">
                <p className="font-medium text-stone-800">Verified itinerary is still being prepared.</p>
                <p className="mt-2 text-sm leading-6 text-stone-600">
                  Add day-by-day entries in Supabase `trek_itineraries` when you are ready. This section will
                  automatically render them in order.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <ShieldAlert className="text-amber-600" size={20} />
              <h2 className="text-xl font-semibold text-stone-900">Safety Notes</h2>
            </div>
            {(trek.safety_notes ?? []).length > 0 ? (
              <ul className="mt-4 space-y-3 text-stone-600">
                {trek.safety_notes?.map((note) => (
                  <li key={note} className="rounded-xl bg-amber-50 px-4 py-3 leading-7">
                    {note}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-stone-500">Safety notes are still being verified.</p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">Permit Info</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              {trek.permit_details || "Permit notes are still being verified."}
            </p>

            {permits.length > 0 ? (
              <div className="mt-5 space-y-4">
                {permits.map((permit) => (
                  <div key={permit.permit_name} className="rounded-xl border border-stone-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-stone-900">{permit.permit_name}</h3>
                        <p className="mt-1 text-xs uppercase tracking-wide text-stone-400">
                          {permit.required ? "Required" : "Optional"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2">
                      {permit.costs.map((cost) => (
                        <div
                          key={`${permit.permit_name}-${cost.audience}`}
                          className="flex items-start justify-between gap-4 rounded-lg bg-stone-50 px-3 py-2 text-sm"
                        >
                          <span className="font-medium text-stone-700">{cost.audience}</span>
                          <div className="text-right">
                            <div className="font-semibold text-stone-900">NPR {cost.amount_npr}</div>
                            {cost.notes ? <div className="text-xs text-stone-500">{cost.notes}</div> : null}
                          </div>
                        </div>
                      ))}
                    </div>

                    {permit.notes ? (
                      <p className="mt-3 text-xs leading-5 text-stone-500">{permit.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-stone-500">Structured permit pricing has not been added yet.</p>
            )}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">Best Season</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {(trek.best_seasons ?? []).length > 0 ? (
                trek.best_seasons?.map((season) => (
                  <span key={season} className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    {season}
                  </span>
                ))
              ) : (
                <p className="text-sm text-stone-500">Season data is still being verified.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">Verification</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Status</dt>
                <dd className="font-medium text-stone-900">{trek.is_verified ? "Verified" : "Needs review"}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Last updated</dt>
                <dd className="font-medium text-stone-900">{formatVerifiedAt(trek.last_verified_at)}</dd>
              </div>
              <div className="flex items-center justify-between gap-3">
                <dt className="text-stone-500">Source count</dt>
                <dd className="font-medium text-stone-900">{sources.length}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-stone-900">Sources</h2>
            {sources.length > 0 ? (
              <div className="mt-4 space-y-4">
                {sources.map((source) => (
                  <div key={source.id} className="rounded-xl border border-stone-200 bg-stone-50 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-medium text-stone-900">{source.source_name}</h3>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                          {source.source_type ? (
                            <span className="rounded-full bg-white px-2 py-1 uppercase tracking-wide text-stone-500">
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
                          className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800"
                        >
                          Visit
                          <ExternalLink size={14} />
                        </a>
                      ) : null}
                    </div>

                    {source.notes ? (
                      <p className="mt-3 text-sm leading-6 text-stone-600">{source.notes}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-stone-500">Source records are still being added for this trek.</p>
            )}
          </section>
        </aside>
      </section>
    </main>
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
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4">
      <div className="flex items-center gap-2 text-stone-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-3 text-lg font-semibold text-stone-900">{value}</p>
    </div>
  );
}

function formatDuration(duration: number | null) {
  if (typeof duration === "number") {
    return `${duration} days`;
  }

  return "Pending verification";
}

function formatVerifiedAt(value: string | null) {
  if (!value) {
    return "Pending";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
