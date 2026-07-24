import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { RecommenderPlanner } from "@/components/home/RecommenderPlanner";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=2400&q=85";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden bg-stone-950 text-white">
      <div className="hero-bg-3d absolute inset-0" aria-hidden>
        <div
          className="hero-bg-3d__layer absolute inset-[-8%] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
        />
      </div>
      {/* Deep overlay so the AI planner stays readable and centered */}
      <div className="absolute inset-0 bg-stone-950/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/50 to-stone-950/90" />
      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-950/35 via-transparent to-transparent" />

      <div className="relative mx-auto max-w-4xl px-4 pb-20 pt-20 text-center sm:pb-24 sm:pt-24 lg:pt-28 [perspective:1200px]">
        <div className="hero-reveal hero-reveal--1 inline-flex items-center gap-2 rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-200 backdrop-blur-sm">
          <Sparkles size={12} className="text-emerald-300" />
          AI-powered Nepal trip planner
        </div>

        <h1 className="hero-reveal hero-reveal--2 mt-7 font-bold leading-[1.08] tracking-tight">
          <span className="hero-brand-3d block text-5xl text-white sm:text-6xl md:text-7xl">
            TrailSathi
          </span>
          <span className="mt-3 block text-xl font-medium text-stone-200 sm:text-2xl md:text-3xl">
            Plan your perfect Nepal trek
            <span className="text-emerald-300"> with AI + local insight</span>
          </span>
        </h1>

        <p className="hero-reveal hero-reveal--3 mx-auto mt-5 max-w-xl text-base leading-7 text-stone-300/95 sm:text-lg">
          Describe your days, budget, and fitness — get verified routes, real permit costs, and
          licensed local guides.
        </p>

        <div className="hero-reveal hero-reveal--4 mt-10 sm:mt-12">
          <RecommenderPlanner />
        </div>

        <div className="hero-reveal hero-reveal--5 mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-stone-300">
          <Link
            href="/treks"
            className="inline-flex items-center gap-1.5 font-medium text-emerald-300 transition-colors hover:text-emerald-200"
          >
            Browse verified treks
            <ArrowRight size={14} />
          </Link>
          <span className="hidden h-1 w-1 rounded-full bg-stone-500 sm:block" aria-hidden />
          <Link
            href="/guides"
            className="font-medium text-stone-300 transition-colors hover:text-white"
          >
            Find a local guide
          </Link>
        </div>
      </div>
    </section>
  );
}
