import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { getVerifiedTreks } from "@/lib/treks";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeStats } from "@/components/home/HomeStats";
import { TrekCard } from "@/components/trek/TrekCard";

export default async function Home() {
  const allTreks = await getVerifiedTreks();
  const treks = allTreks.slice(0, 3);

  return (
    <main className="min-h-screen bg-white">
      <HomeHero />

      <HomeStats trekCount={allTreks.length} />

      {/* HOW IT WORKS */}
      <section className="relative overflow-hidden bg-stone-50 py-24">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 40%, #047857 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              How it works
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Plan with confidence in four steps
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              Every recommendation is grounded in verified trek data, real permit costs, and
              licensed local guides.
            </p>
          </div>

          <ol className="relative mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 [perspective:800px]">
            <div
              className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-7 hidden h-px bg-gradient-to-r from-transparent via-emerald-300 to-transparent lg:block"
              aria-hidden
            />
            {steps.map((step, idx) => (
              <li
                key={step.title}
                className={`step-3d relative text-center lg:text-left step-3d--${idx + 1}`}
              >
                <div className="flex flex-col items-center lg:items-start">
                  <span className="step-3d__badge relative z-10 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-lg font-bold text-white shadow-lg shadow-emerald-600/25 ring-4 ring-stone-50">
                    {idx + 1}
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-stone-900">{step.title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-stone-500">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* POPULAR TREKS */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Verified treks
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
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
            <div className="mt-10 rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-10 text-center">
              <p className="font-medium text-stone-800">
                Verified treks will appear here once added in Supabase.
              </p>
              <p className="mt-2 text-sm text-stone-500">
                Run the seed in{" "}
                <code className="rounded bg-stone-100 px-1.5 py-0.5 font-mono text-xs">
                  supabase/verified-trek-content-seed.sql
                </code>{" "}
                to populate sample data.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* WHY TRAILSATHI */}
      <section className="bg-stone-50 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Why TrailSathi
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
              Built for Nepal, by trekkers who know it
            </h2>
            <p className="mt-4 text-base leading-7 text-stone-600">
              AI planning grounded in real verified routes, permit fees in NPR, and licensed local guides.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-stone-200/80 bg-white p-6 transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
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

      {/* GUIDE CTA */}
      <section className="bg-white pb-20 pt-4">
        <div className="mx-auto max-w-6xl px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-700 via-emerald-800 to-emerald-900 px-6 py-16 text-center text-white sm:px-12">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 20%, white 2px, transparent 2px)",
                backgroundSize: "30px 30px",
              }}
            />
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
    title: "Tell us your plan",
    desc: "Budget, days, fitness, interests — just the basics.",
  },
  {
    title: "Get AI matches",
    desc: "Treks ranked for your profile, with permits and altitudes.",
  },
  {
    title: "Connect with guides",
    desc: "Direct, verified local guides — no agency middleman.",
  },
  {
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
