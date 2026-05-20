"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { RecommenderPlanner } from "@/components/home/RecommenderPlanner";

export function HomeHero() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = contentRef.current;
    if (!root) return;

    const items = root.querySelectorAll<HTMLElement>("[data-hero-reveal]");
    if (!items.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    items.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
    });

    animate(items, {
      opacity: { from: 0, to: 1 },
      y: { from: 20, to: 0 },
      duration: 780,
      ease: "out(3)",
      delay: stagger(85, { start: 120 }),
    });
  }, []);

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

      <div ref={contentRef} className="relative max-w-5xl mx-auto px-4 py-32 text-center">
        <div data-hero-reveal className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
          AI-powered Nepal travel planner
        </div>

        <h1 data-hero-reveal className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Plan your perfect Nepal trip
          <br />
          <span className="text-green-400">with AI + local insight</span>
        </h1>

        <p data-hero-reveal className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
          Tell us your time, budget, and interests — trekking, jungle safari, city tours, or adventure sports — TrailSathi
          builds your perfect Nepal itinerary with real local insights.
        </p>

        <div data-hero-reveal>
          <RecommenderPlanner />
        </div>

        <div data-hero-reveal className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            href="/treks"
            className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Explore treks <ArrowRight size={16} />
          </Link>
          <Link
            href="/guides"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Find guides
          </Link>
        </div>

        <div data-hero-reveal className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-gray-300">
          <div>🟢 500+ trekkers planning trips</div>
          <div>🟢 100+ verified guides</div>
          <div>🟢 Real-time travel insights</div>
        </div>
      </div>
    </section>
  );
}
