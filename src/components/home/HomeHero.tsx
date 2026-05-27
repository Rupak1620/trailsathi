import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RecommenderPlanner } from "@/components/home/RecommenderPlanner";

export function HomeHero() {
  return (
    <section className="relative bg-gray-900 text-white">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-50"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />

      <div className="relative mx-auto max-w-5xl px-4 py-32 text-center">
        <div className="hero-reveal hero-reveal--1 inline-block rounded-full bg-green-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider">
          AI-powered Nepal travel planner
        </div>

        <h1 className="hero-reveal hero-reveal--2 mb-6 text-4xl font-bold leading-tight md:text-6xl">
          Plan your perfect Nepal trip
          <br />
          <span className="text-green-400">with AI + local insight</span>
        </h1>

        <p className="hero-reveal hero-reveal--3 mx-auto mb-10 max-w-2xl text-lg text-gray-300">
          Tell us your time, budget, and interests — trekking, jungle safari, city tours, or adventure sports —
          TrailSathi builds your perfect Nepal itinerary with real local insights.
        </p>

        <div className="hero-reveal hero-reveal--4">
          <RecommenderPlanner />
        </div>

        <div className="hero-reveal hero-reveal--5 mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-8 py-4 font-medium text-white transition-colors hover:bg-green-700"
          >
            Explore treks <ArrowRight size={16} />
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 font-medium text-gray-900 transition-colors hover:bg-gray-100"
          >
            Find guides
          </Link>
        </div>

        <div className="hero-reveal hero-reveal--6 mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-300">
          <div>🟢 500+ trekkers planning trips</div>
          <div>🟢 100+ verified guides</div>
          <div>🟢 Real-time travel insights</div>
        </div>
      </div>
    </section>
  );
}
