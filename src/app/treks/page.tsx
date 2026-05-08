import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, Mountain, ShieldAlert } from "lucide-react";
import { getPermitPriceSummary, getVerifiedTreks } from "@/lib/treks";
import { getTrekImageWithFallback } from "@/lib/trek-images";

export default async function TreksPage() {
  const treks = await getVerifiedTreks();

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Verified Trek Library
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
              Treks in Nepal
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-600">
              Browse source-backed routes across Nepal with clear difficulty, altitude,
              permit, and seasonal guidance.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<Mountain size={18} />}
              label="Verified routes"
              value={`${treks.length}`}
              detail="Only database-backed treks appear here"
            />
            <SummaryCard
              icon={<BadgeCheck size={18} />}
              label="Trust-first"
              value="Source linked"
              detail="Every published trek should trace back to evidence"
            />
            <SummaryCard
              icon={<ShieldAlert size={18} />}
              label="Permit clarity"
              value="NPR first"
              detail="Permit notes and fees stay grounded in Nepal context"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">
              Verified trek collection
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              Clean, comparable cards for planning. Details open into the full trust page.
            </p>
          </div>
          <div className="text-sm text-stone-500">
            Showing {treks.length} verified {treks.length === 1 ? "trek" : "treks"}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {treks?.map((trek) => (
            <Link
              href={`/treks/${trek.slug}`}
              key={trek.id}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"
            >
              <div className="relative h-56 w-full overflow-hidden">
                <Image
                  src={getTrekImageWithFallback(trek.slug, trek.image_url)}
                  alt={trek.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
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

                <p className="mt-3 line-clamp-3 text-sm leading-7 text-stone-600">
                  {trek.description}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3 rounded-xl bg-stone-50 p-3 text-center">
                  <Metric label="Duration" value={formatDuration(trek.duration_days)} />
                  <Metric
                    label="Max altitude"
                    value={trek.max_altitude ? `${trek.max_altitude}m` : "Pending"}
                  />
                  <Metric
                    label="Permit"
                    value={
                      trek.permit_required
                        ? getPermitPriceSummary(trek.permit_costs) || "Required"
                        : "Not required"
                    }
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {trek.best_seasons?.map((season) => (
                    <span
                      key={season}
                      className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-600"
                    >
                      {season}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
      <div className="flex items-center gap-2 text-stone-500">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="mt-3 text-2xl font-semibold text-stone-900">{value}</p>
      <p className="mt-1 text-sm leading-6 text-stone-500">{detail}</p>
    </div>
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
  if (typeof duration === "number") {
    return `${duration} days`;
  }

  return "Pending";
}
