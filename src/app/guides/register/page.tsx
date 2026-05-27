import Link from "next/link";
import { ArrowLeft, FileCheck2, MapPinned, ShieldCheck } from "lucide-react";
import { getVerifiedTreks } from "@/lib/treks";
import { GuideRegistrationForm } from "@/components/guides/GuideRegistrationForm";

export default async function GuideRegisterPage() {
  const treks = await getVerifiedTreks();
  const trekOptions = (treks ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    region: t.region,
  }));

  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft size={16} />
            Back to guides
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Guide Partner Program
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
              Get discovered by trekkers worldwide
            </h1>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Join TrailSathi&apos;s two-sided marketplace. Registered profiles receive high-quality leads, verified badges, and direct routes-linking benefits for maximum exposure.
            </p>
          </div>

          <div className="grid gap-4">
            <TrustPoint
              icon={<ShieldCheck size={20} />}
              title="Identity & License Verification"
              text="Our team manually reviews and matches your government license details for absolute trekker peace of mind."
            />
            <TrustPoint
              icon={<MapPinned size={20} />}
              title="Dynamic Trail Linking"
              text="Your registered profile is automatically embedded inside details pages of the treks you guide."
            />
            <TrustPoint
              icon={<FileCheck2 size={20} />}
              title="No Commission Cuts"
              text="Connect directly with clients. Keep 100% of what you negotiate. We don&apos;t sit in-between your payouts."
            />
          </div>
        </div>

        <div>
          <GuideRegistrationForm treks={trekOptions} />
        </div>
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
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-2.5 text-emerald-700">
        {icon}
        <h2 className="font-bold text-stone-800">{title}</h2>
      </div>
      <p className="mt-2 text-sm leading-6 text-stone-600">{text}</p>
    </div>
  );
}
