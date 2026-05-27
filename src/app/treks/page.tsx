import { BadgeCheck, Mountain, ShieldAlert } from "lucide-react";
import { getVerifiedTreks } from "@/lib/treks";
import { TreksExplorer } from "@/components/trek/TreksExplorer";

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
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">Treks in Nepal</h1>
            <p className="mt-4 text-lg leading-8 text-stone-600">
              Browse source-backed routes across Nepal with clear difficulty, altitude, permit, and seasonal guidance.
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
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-stone-900">Verified trek collection</h2>
          <p className="mt-2 text-sm text-stone-500">
            Clean, comparable cards for planning. Details open into the full trust page.
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
