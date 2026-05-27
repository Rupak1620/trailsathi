"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";

type TrekParallaxHeroProps = {
  src: string;
  alt: string;
  children?: ReactNode;
};

export function TrekParallaxHero({ src, alt, children }: TrekParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offsetY, setOffsetY] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const onScroll = () => {
      const el = containerRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.85)));
      setOffsetY(progress * 48);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative h-72 w-full overflow-hidden sm:h-96">
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${offsetY}px, 0) scale(1.1)` }}
      >
        <Image src={src} alt={alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 70vw" priority />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
      {children}
    </div>
  );
}
