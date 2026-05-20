import Link from "next/link";
import { ArrowLeft, MessageSquare, Users, Calendar, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | TrailSathi",
  description: "Trek partners, Q&A, and seasonal updates — coming soon on TrailSathi.",
};

export default function CommunityPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Community
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">
          Trek together, ask experts, stay updated
        </h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
          TrailSathi community will connect you with fellow trekkers, local answers, and trip partners. This area is
          rolling out in phases — starting with curated discussions and partner content.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <MessageSquare className="text-emerald-600" size={22} />
            <h2 className="mt-4 text-xl font-semibold text-stone-900">Q&amp;A &amp; trip reports</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Ask route, permit, and gear questions with answers grounded in verified trek data where possible.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <Users className="text-emerald-600" size={22} />
            <h2 className="mt-4 text-xl font-semibold text-stone-900">Find trek partners</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Match by dates, region, and pace — with safety and identity checks before you share contact details.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <Calendar className="text-emerald-600" size={22} />
            <h2 className="mt-4 text-xl font-semibold text-stone-900">Seasonal updates</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Trail conditions, festival windows, and permit policy changes in one place.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-6">
            <Shield className="text-emerald-600" size={22} />
            <h2 className="mt-4 text-xl font-semibold text-stone-900">Moderation &amp; safety</h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Public posts will be moderated; emergency guidance always defers to licensed guides and authorities.
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-2xl border border-dashed border-stone-300 bg-white p-8 text-center">
          <p className="text-stone-800 font-medium">Community signup opens soon.</p>
          <p className="mt-2 text-sm text-stone-600">
            Until then, explore verified treks and guides — and use the planner on the home page.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/treks"
              className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Browse treks
            </Link>
            <Link
              href="/guides"
              className="rounded-lg border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Find guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
