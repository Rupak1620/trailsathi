import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { RecommenderPlanner } from "@/components/home/RecommenderPlanner";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-stone-950 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1920&q=80')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/70 via-stone-950/65 to-stone-950/90" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/40 via-transparent to-stone-950/0" />

      <div className="relative mx-auto max-w-5xl px-4 py-24 text-center sm:py-28 lg:py-32">
        <div className="hero-reveal hero-reveal--1 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur">
          <Sparkles size={12} />
          AI-powered Nepal trip planner
        </div>

        <h1 className="hero-reveal hero-reveal--2 mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          Plan your perfect Nepal trip
          <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-300 to-emerald-100 bg-clip-text text-transparent">
            with AI + local insight
          </span>
        </h1>

        <p className="hero-reveal hero-reveal--3 mx-auto mt-6 max-w-2xl text-base leading-7 text-stone-200/90 sm:text-lg">
          Tell us your time, budget, and interests — trekking, jungle safari, city tours, or
          adventure sports — TrailSathi builds a Nepal itinerary grounded in real trek data and
          licensed local guides.
        </p>

        <div className="hero-reveal hero-reveal--4 mt-10">
          <RecommenderPlanner />
        </div>

        <div className="hero-reveal hero-reveal--5 mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/treks"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500 sm:w-auto"
          >
            Explore verified treks
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/guides"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/10 sm:w-auto"
          >
            Find a local guide
          </Link>
        </div>

        <div className="hero-reveal hero-reveal--6 mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-xs text-stone-300/90 sm:text-sm">
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Verified trek routes
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Licensed local guides
          </div>
          <div className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Real-time trail insights
          </div>
        </div>
      </div>
    </section>
  );
}
