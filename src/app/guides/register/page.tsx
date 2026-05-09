import Link from "next/link";
import { ArrowLeft, BadgeCheck, FileCheck2, MapPinned, ShieldCheck } from "lucide-react";

const checklist = [
  "Guide identity and contact details",
  "License or training evidence",
  "Home region and base location",
  "Treks guided with real experience notes",
  "Languages and emergency contact readiness",
];

export default function GuideRegisterPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link href="/guides" className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900">
            <ArrowLeft size={16} />
            Back to guides
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Guide Registration
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
            Join TrailSathi as a verified trekking guide
          </h1>
          <p className="mt-4 text-lg leading-8 text-stone-600">
            This first registration flow explains what TrailSathi needs before publishing guide profiles. The actual submission form can connect to Supabase after the verification workflow is finalized.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <TrustPoint
              icon={<ShieldCheck size={18} />}
              title="Trust first"
              text="Profiles are reviewed before they appear in the public directory."
            />
            <TrustPoint
              icon={<MapPinned size={18} />}
              title="Trek expertise"
              text="Guide experience should connect to specific verified trek records."
            />
            <TrustPoint
              icon={<FileCheck2 size={18} />}
              title="Evidence backed"
              text="Licenses, training, or local proof can be tracked separately from public copy."
            />
          </div>
        </div>

        <section className="rounded-lg border border-stone-200 bg-white p-6 sm:p-8">
          <h2 className="text-2xl font-semibold text-stone-900">Verification checklist</h2>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            Use this as the intake structure while adding real guide records in Supabase.
          </p>

          <ul className="mt-6 space-y-3">
            {checklist.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg bg-stone-50 px-4 py-3 text-sm text-stone-700">
                <BadgeCheck className="mt-0.5 shrink-0 text-emerald-600" size={16} />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
            <h3 className="font-semibold text-stone-900">Current build note</h3>
            <p className="mt-2 text-sm leading-6 text-stone-700">
              The database foundation is ready for guide profiles, verification rows, and trek mappings. Keep guide publication manual until spam protection and review states are fully designed.
            </p>
          </div>
        </section>
      </section>
    </main>
  );
}

function TrustPoint({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex items-center gap-2 text-emerald-700">
        {icon}
        <h2 className="font-semibold">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </div>
  );
}
