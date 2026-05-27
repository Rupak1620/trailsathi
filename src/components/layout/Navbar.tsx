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
      <nav className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="text-lg font-semibold text-green-700">
            TrailSathi
          </Link>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 text-stone-700 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div className="hidden items-center gap-6 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="text-sm text-gray-600 transition-colors hover:text-gray-900">
                {l.label}
              </Link>
            ))}
            <Link
              href="/guides/register"
              className="rounded-md bg-green-700 px-4 py-2 text-sm text-white transition-colors hover:bg-green-800"
            >
              Register as Guide
            </Link>
          </div>
        </div>

        {open ? (
          <div id="mobile-nav" className="border-t border-stone-100 px-4 py-4 md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="rounded-lg py-2 text-sm font-medium text-stone-800 hover:bg-stone-50"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </Link>
              ))}
              <Link
                href="/guides/register"
                className="rounded-lg bg-green-700 py-3 text-center text-sm font-semibold text-white hover:bg-green-800"
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
