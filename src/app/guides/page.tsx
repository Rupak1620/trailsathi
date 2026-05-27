import Link from "next/link";
import { BadgeCheck, MapPin, ShieldCheck, UserRound, ArrowRight } from "lucide-react";
import { getActiveGuides } from "@/lib/guides";

export default async function GuidesPage() {
  const guides = await getActiveGuides();
  const approvedCount = guides.filter((guide) => guide.verification).length;

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="relative overflow-hidden border-b border-stone-200 bg-white">
        <div
          className="absolute inset-x-0 top-0 h-64 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 30%, #047857 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Guide trust system
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Verified local guides
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
              TrailSathi guide profiles are built around identity, trekking expertise, and
              license verification before any booking — no agency middleman, no commission cuts.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<UserRound size={20} />}
              label="Active guides"
              value={`${guides.length}`}
              detail="Only active profiles are shown publicly."
            />
            <SummaryCard
              icon={<ShieldCheck size={20} />}
              label="Approved"
              value={`${approvedCount}`}
              detail="Verification is stored separately from profile content."
            />
            <SummaryCard
              icon={<MapPin size={20} />}
              label="Trek expertise"
              value="Mapped"
              detail="Guides are linked to the trek routes they know."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold text-stone-900">Guide directory</h2>
            <p className="mt-2 text-sm leading-6 text-stone-500">
              A quiet first version of the directory — built to grow with verified guide data
              entered through the registration flow.
            </p>
          </div>
          <Link
            href="/guides/register"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
          >
            Register as a guide
            <ArrowRight size={14} />
          </Link>
        </div>

        {guides.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {guides.map((guide) => (
              <article
                key={guide.id}
                className="group flex flex-col rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-base font-bold uppercase text-emerald-700 ring-1 ring-emerald-100">
                      {guide.full_name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-stone-900 group-hover:text-emerald-700">
                        {guide.full_name}
                      </h3>
                      <p className="mt-0.5 text-sm text-stone-500">
                        {guide.base_location || guide.home_region || "Location pending"}
                      </p>
                    </div>
                  </div>

                  {guide.verification ? (
                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      <BadgeCheck size={14} />
                      Verified
                    </span>
                  ) : (
                    <span className="shrink-0 rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-500">
                      In review
                    </span>
                  )}
                </div>

                <p className="mt-4 min-h-[3.75rem] text-sm leading-6 text-stone-600">
                  {guide.bio || "Guide profile details are being verified before publication."}
                </p>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl bg-stone-50 p-3">
                  <Metric
                    label="Experience"
                    value={
                      typeof guide.years_experience === "number"
                        ? `${guide.years_experience} yrs`
                        : "—"
                    }
                  />
                  <Metric label="Trek routes" value={`${guide.trekLinks.length}`} />
                </div>

                {guide.languages?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {guide.languages.map((language) => (
                      <span
                        key={language}
                        className="rounded-full border border-stone-200 px-2.5 py-1 text-xs font-medium text-stone-600"
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
          <div className="rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
            <UserRound className="mx-auto h-10 w-10 text-stone-300" strokeWidth={1.5} />
            <h3 className="mt-4 text-lg font-semibold text-stone-900">
              No public guide profiles yet
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">
              Once licensed guides register and their identities are verified, approved profiles
              will appear here. If you are a guide, register below — it&apos;s free.
            </p>
            <Link
              href="/guides/register"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
            >
              Register as a guide
              <ArrowRight size={14} />
            </Link>
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
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
      <div className="flex items-center gap-2 text-emerald-700">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
          {icon}
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
          {label}
        </span>
      </div>
      <p className="mt-4 text-2xl font-bold text-stone-900">{value}</p>
      <p className="mt-1 text-sm leading-6 text-stone-500">{detail}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider text-stone-400">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-semibold text-stone-800">{value}</p>
    </div>
  );
}
