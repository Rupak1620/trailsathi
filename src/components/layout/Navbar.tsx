"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/treks", label: "Treks" },
  { href: "/guides", label: "Guides" },
  { href: "/community", label: "Community" },
  { href: "/destinations", label: "Destinations" },
] as const;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const y = window.scrollY;
      if (reduced || y < 80) {
        setHidden(false);
        lastScrollY.current = y;
        return;
      }

      const delta = y - lastScrollY.current;
      if (delta > 8 && y > 120) setHidden(true);
      else if (delta < -8) setHidden(false);

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`navbar-shell ${hidden ? "navbar-shell--hidden" : ""}`}>
      <nav className="w-full border-b border-stone-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-emerald-700 transition-colors hover:text-emerald-800"
          >
            TrailSathi
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-stone-700 hover:bg-stone-100 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-stone-600 transition-colors hover:text-emerald-700"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/guides/register"
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-800"
            >
              Register as Guide
            </Link>
          </div>
        </div>

        {open ? (
          <div id="mobile-nav" className="border-t border-stone-100 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-stone-800 hover:bg-emerald-50 hover:text-emerald-700"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/guides/register"
                className="mt-2 rounded-lg bg-emerald-700 py-3 text-center text-sm font-semibold text-white hover:bg-emerald-800"
                onClick={() => setOpen(false)}
              >
                Register as Guide
              </Link>
            </div>
          </div>
        ) : null}
      </nav>
    </header>
  );
}
