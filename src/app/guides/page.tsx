import Link from "next/link";
import { BadgeCheck, MapPin, ShieldCheck, UserRound } from "lucide-react";
import { getActiveGuides } from "@/lib/guides";

export default async function GuidesPage() {
  const guides = await getActiveGuides();
  const approvedCount = guides.filter((guide) => guide.verification).length;

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Guide Trust System
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
              Verified local guides
            </h1>
            <p className="mt-4 text-lg leading-8 text-stone-600">
              TrailSathi guide profiles are built around identity, trekking expertise, and verification status before booking.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<UserRound size={18} />}
              label="Active guides"
              value={`${guides.length}`}
              detail="Only active profiles are shown publicly"
            />
            <SummaryCard
              icon={<ShieldCheck size={18} />}
              label="Approved profiles"
              value={`${approvedCount}`}
              detail="Verification is stored separately from profile text"
            />
            <SummaryCard
              icon={<MapPin size={18} />}
              label="Trek expertise"
              value="Mapped"
              detail="Guides can be connected to verified trek records"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-stone-900">Guide directory</h2>
            <p className="mt-2 text-sm text-stone-500">
              A quiet first version of the directory, ready for real verified guide data.
            </p>
          </div>
          <Link
            href="/guides/register"
            className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
          >
            Register as a guide
          </Link>
        </div>

        {guides.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <article key={guide.id} className="rounded-lg border border-stone-200 bg-white p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-stone-900">{guide.full_name}</h3>
                    <p className="mt-1 text-sm text-stone-500">
                      {guide.base_location || guide.home_region || "Location pending"}
                    </p>
                  </div>

                  {guide.verification ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      <BadgeCheck size={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-500">
                      Review
                    </span>
                  )}
                </div>

                <p className="mt-4 min-h-20 text-sm leading-6 text-stone-600">
                  {guide.bio || "Guide profile details are being verified before publication."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-lg bg-stone-50 p-3 text-sm">
                  <Metric
                    label="Experience"
                    value={
                      typeof guide.years_experience === "number"
                        ? `${guide.years_experience} years`
                        : "Pending"
                    }
                  />
                  <Metric
                    label="Trek links"
                    value={`${guide.trekLinks.length}`}
                  />
                </div>

                {guide.languages?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {guide.languages.map((language) => (
                      <span
                        key={language}
                        className="rounded-full border border-stone-200 px-3 py-1 text-xs font-medium text-stone-600"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8">
            <h3 className="text-lg font-semibold text-stone-900">No public guide profiles yet</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Once the guide tables are migrated and active guide rows are added in Supabase, approved profiles will appear here.
            </p>
          </div>
        )}
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
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-5">
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
      <p className="mt-1 font-medium text-stone-800">{value}</p>
    </div>
  );
}
