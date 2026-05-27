import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Users,
  ShieldCheck,
  Sparkles,
  Compass,
  HeartPulse,
  Mountain,
  BadgeCheck,
} from "lucide-react";
import { getVerifiedTreks } from "@/lib/treks";
import { HomeHero } from "@/components/home/HomeHero";
import { TrekCard } from "@/components/trek/TrekCard";

export default async function Home() {
  const treks = await getVerifiedTreks(3);

  return (
    <main className="min-h-screen bg-white">
      <HomeHero />

      {/* TRUST STRIP */}
      <section className="border-b border-stone-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-4 py-6 text-sm text-stone-600">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Source-cited trek profiles
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Licensed guide verification
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Built in Nepal
          </span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              How it works
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Plan with confidence in four steps
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Every recommendation is grounded in verified trek data, real permit costs, and
              licensed local guides.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, idx) => (
              <div
                key={step.title}
                className="group relative rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <span className="absolute right-5 top-5 text-xs font-mono font-bold text-stone-300">
                  0{idx + 1}
                </span>
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition-colors group-hover:bg-emerald-100">
                  <step.icon size={20} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-stone-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR TREKS */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                Verified treks
              </div>
              <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
                Popular routes across Nepal
              </h2>
              <p className="mt-3 text-base leading-7 text-stone-600">
                Hand-picked, source-cited trek profiles. Permits, altitudes, and difficulty kept
                grounded.
              </p>
            </div>
            <Link
              href="/treks"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              View all treks
              <ArrowRight size={14} />
            </Link>
          </div>

          {treks.length > 0 ? (
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {treks.map((trek) => (
                <TrekCard key={trek.id} trek={trek} variant="compact" />
              ))}
            </div>
          ) : (
            <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-white p-10 text-center">
              <p className="font-medium text-stone-800">
                Verified treks will appear here once added in Supabase.
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Run the seed in <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">supabase/verified-trek-content-seed.sql</code> to populate sample data.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* WHY TRAILSATHI */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
              Why TrailSathi
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Built for Nepal, by trekkers who know it
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              We pair AI planning with real ground truth — verified routes, real fees, and
              licensed local guides.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-stone-200 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <f.icon size={20} />
                </span>
                <h3 className="mt-5 text-base font-semibold text-stone-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-stone-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST PILLARS */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPillars.map((pillar) => (
              <div key={pillar.label} className="text-center">
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-stone-200">
                  <pillar.icon size={22} />
                </span>
                <p className="mt-4 text-sm font-semibold text-stone-900">{pillar.label}</p>
                <p className="mt-1 text-xs leading-5 text-stone-500">{pillar.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDE CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 px-6 py-16 text-center text-white sm:px-12">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, white 2px, transparent 2px)", backgroundSize: "30px 30px" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-50 backdrop-blur">
                <Sparkles size={12} />
                Guide Partner Program
              </div>
              <h2 className="mt-5 text-3xl font-bold sm:text-4xl">
                Are you a trekking guide in Nepal?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-emerald-50/90">
                Get discovered by trekkers worldwide. Free to register, no commission cuts —
                direct contact through WhatsApp or email.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href="/guides/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50"
                >
                  Register as a guide
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/guides"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/0 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Browse directory
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-lg font-semibold text-emerald-700">TrailSathi</p>
              <p className="mt-3 max-w-xs text-sm leading-6 text-stone-500">
                AI-powered Nepal trekking platform. Source-cited routes, verified guides,
                permits-first.
              </p>
            </div>

            <FooterColumn
              title="Explore"
              links={[
                { href: "/treks", label: "Treks" },
                { href: "/destinations", label: "Destinations" },
                { href: "/guides", label: "Guides" },
                { href: "/community", label: "Community" },
              ]}
            />
            <FooterColumn
              title="For guides"
              links={[
                { href: "/guides/register", label: "Register" },
                { href: "/guides", label: "Directory" },
              ]}
            />
            <FooterColumn
              title="Help"
              links={[
                { href: "/community", label: "Q&A" },
                { href: "/treks", label: "Permits" },
              ]}
            />
          </div>

          <div className="mt-10 flex flex-col gap-3 border-t border-stone-100 pt-6 text-sm text-stone-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© {new Date().getFullYear()} TrailSathi. Built in Nepal.</p>
            <p className="text-xs text-stone-400">
              Trek responsibly. Always defer to licensed guides and authorities in emergencies.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}

const steps = [
  {
    icon: Sparkles,
    title: "Tell us your plan",
    desc: "Budget, days, fitness, interests — just the basics.",
  },
  {
    icon: Compass,
    title: "Get AI matches",
    desc: "Treks ranked for your profile, with permits and altitudes.",
  },
  {
    icon: Users,
    title: "Connect with guides",
    desc: "Direct, verified local guides — no agency middleman.",
  },
  {
    icon: Mountain,
    title: "Trek with confidence",
    desc: "Itineraries, safety alerts, and acclimatization guidance.",
  },
];

const features = [
  {
    icon: Sparkles,
    title: "Perfect trek in seconds",
    description: "AI matches fitness, budget, and time. No generic suggestions.",
  },
  {
    icon: Users,
    title: "Verified local guides",
    description: "Identity and license-checked. WhatsApp & email contact.",
  },
  {
    icon: MapPin,
    title: "Real trail data",
    description: "Source-cited routes, NPR-first permit fees, and seasonal windows.",
  },
  {
    icon: ShieldCheck,
    title: "Safety-first design",
    description: "Lake-Louise AMS scoring, altitude planner, evac contacts.",
  },
];

const trustPillars = [
  { icon: BadgeCheck, label: "Source-cited", detail: "Every trek links to official sources." },
  { icon: ShieldCheck, label: "License-verified", detail: "Guides pass identity and license checks." },
  { icon: HeartPulse, label: "Safety-aware", detail: "AMS scoring and helicopter contacts." },
  { icon: MapPin, label: "Made in Nepal", detail: "Built by Nepali developers and trekkers." },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-stone-500 transition-colors hover:text-emerald-700"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
