import { BadgeCheck, Mountain, ShieldAlert } from "lucide-react";
import { getVerifiedTreks } from "@/lib/treks";
import { TreksExplorer } from "@/components/trek/TreksExplorer";

export default async function TreksPage() {
  const treks = await getVerifiedTreks();

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="relative overflow-hidden border-b border-stone-200 bg-white">
        <div
          className="absolute inset-x-0 top-0 h-64 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 25% 30%, #047857 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Verified trek library
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Treks in Nepal
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
              Source-backed routes across the Himalaya with clear difficulty, altitude, permit
              fees, and seasonal guidance — all linked back to evidence.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <SummaryCard
              icon={<Mountain size={20} />}
              label="Verified routes"
              value={`${treks.length}`}
              detail="Only database-backed treks appear here."
            />
            <SummaryCard
              icon={<BadgeCheck size={20} />}
              label="Trust-first"
              value="Source-linked"
              detail="Every published trek traces back to evidence."
            />
            <SummaryCard
              icon={<ShieldAlert size={20} />}
              label="Permit clarity"
              value="NPR-first"
              detail="Real Nepali rupee fees, not generic prices."
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-stone-900">Verified trek collection</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-500">
            Clean, comparable cards for planning. Open any trek for the full source-linked
            profile, itinerary, and licensed guide directory.
          </p>
        </div>

        <TreksExplorer treks={treks} />
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
