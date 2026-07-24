"use client";

import { useEffect, useRef, useState } from "react";

type Stat = {
  value: number;
  suffix?: string;
  label: string;
  detail: string;
};

const stats: Stat[] = [
  { value: 8, suffix: "+", label: "Verified treks", detail: "Source-cited route profiles" },
  { value: 50, suffix: "+", label: "Licensed guides", detail: "Identity & license checked" },
  { value: 5545, suffix: "m", label: "Highest altitude", detail: "Everest Base Camp route" },
  { value: 100, suffix: "%", label: "NPR-first permits", detail: "Real Nepali rupee fees" },
];

export function HomeStats({ trekCount }: { trekCount?: number }) {
  const items = trekCount && trekCount > 0
    ? stats.map((s, i) => (i === 0 ? { ...s, value: trekCount, suffix: "" } : s))
    : stats;

  return (
    <section className="border-b border-stone-100 bg-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px bg-stone-100 sm:grid-cols-4">
        {items.map((stat, index) => (
          <StatCell key={stat.label} stat={stat} delayMs={index * 80} />
        ))}
      </div>
    </section>
  );
}

function StatCell({ stat, delayMs }: { stat: Stat; delayMs: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [display, setDisplay] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(stat.value);
      setStarted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [stat.value]);

  useEffect(() => {
    if (!started) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(stat.value);
      return;
    }

    const duration = 1100;
    const start = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(stat.value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };

    const timeout = window.setTimeout(() => {
      frame = requestAnimationFrame(tick);
    }, delayMs);

    return () => {
      window.clearTimeout(timeout);
      cancelAnimationFrame(frame);
    };
  }, [started, stat.value, delayMs]);

  return (
    <div ref={ref} className="bg-white px-4 py-8 text-center sm:px-6 sm:py-10">
      <p className="text-3xl font-bold tracking-tight text-emerald-700 sm:text-4xl">
        {display.toLocaleString()}
        {stat.suffix ? <span className="text-emerald-600">{stat.suffix}</span> : null}
      </p>
      <p className="mt-2 text-sm font-semibold text-stone-900">{stat.label}</p>
      <p className="mt-1 text-xs text-stone-500">{stat.detail}</p>
    </div>
  );
}
