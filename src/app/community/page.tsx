import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageSquare, Users, Calendar, Shield } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community | TrailSathi",
  description:
    "Trek partners, Q&A, and seasonal updates — coming soon on TrailSathi.",
};

const features = [
  {
    icon: MessageSquare,
    title: "Q&A and trip reports",
    text: "Ask route, permit, and gear questions with answers grounded in verified trek data where possible.",
  },
  {
    icon: Users,
    title: "Find trek partners",
    text: "Match by dates, region, and pace — with safety and identity checks before you share contact details.",
  },
  {
    icon: Calendar,
    title: "Seasonal updates",
    text: "Trail conditions, festival windows, and permit policy changes in one place.",
  },
  {
    icon: Shield,
    title: "Moderation and safety",
    text: "Public posts will be moderated; emergency guidance always defers to licensed guides and authorities.",
  },
];

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

      <section className="relative overflow-hidden bg-white">
        <div
          className="absolute inset-x-0 top-0 h-64 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 30%, #047857 1.5px, transparent 1.5px)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-4 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Community
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl">
              Trek together, ask experts, stay updated
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-600">
              TrailSathi community will connect you with fellow trekkers, local answers, and
              trip partners. This area is rolling out in phases — starting with curated
              discussions and partner content.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <f.icon size={20} />
              </span>
              <h2 className="mt-5 text-xl font-semibold text-stone-900">{f.title}</h2>
              <p className="mt-2 text-sm leading-6 text-stone-600">{f.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-dashed border-stone-300 bg-white p-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Coming soon
          </div>
          <p className="mt-4 text-xl font-semibold text-stone-900">
            Community signups open in the next release.
          </p>
          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-stone-600">
            Until then, explore verified treks and connect with licensed guides — or use the AI
            planner on the home page.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/treks"
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-800"
            >
              Browse treks
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-1.5 rounded-xl border border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 hover:bg-stone-50"
            >
              Find guides
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
