# TrailSathi — DESIGN.md

Design contract for humans and coding agents. Inspired by structured design-system docs (see [getdesign.md](https://getdesign.md/) for reference collections) and common travel-product patterns: photography-led heroes, clear hierarchy, trust blocks, and restrained motion ([Dribbble travel UI](https://dribbble.com/search/travel-website) — use for moodboards only; do not copy assets).

---

## 1. Product principles

1. **Trust before delight** — Safety, permits, and verification copy must never be undermined by flashy UI.
2. **Nepal-first clarity** — NPR, seasons, regions, and altitude are first-class; avoid generic “global travel” vagueness.
3. **Truth in labeling** — If a feature is rules-based or pending, UI and marketing must say so (no “AI” without a grounded model).
4. **Performance on real devices** — Many users plan on mid-range phones; keep LCP and TTI healthy; heavy WebGL is opt-in or below the fold.

---

## 2. Visual language

| Token | Role | Notes |
|--------|------|--------|
| **Emerald / green** (`green-600`, `green-700`, `emerald-700`) | Primary CTA, brand accents | Aligns with mountains / “go”; do not use pure #00ff00. |
| **Stone** (`stone-50`–`stone-900`) | Default neutrals on app pages | Warmer than cool gray; pairs with trek photography. |
| **Amber** (`amber-50`, `amber-200`) | Safety / warning panels | Already used on trek detail; keep consistent. |
| **White / near-black** | Marketing hero contrast | Hero often `bg-gray-900` + image; body often `bg-white` or `stone-50`. |

**Photography:** Full-bleed hero with gradient scrim (`from-black/60 to-black/80`); card images 16:9-ish, `object-cover`. Prefer real trek or Nepal imagery over generic stock where possible.

**Radius:** Marketing cards `rounded-xl` / `rounded-2xl`; buttons `rounded-lg` / `rounded-md`.

---

## 3. Typography

- **App shell:** `Geist` (see `layout.tsx`). Marketing pages should inherit the same — avoid mixing Arial on `body` long-term; align `globals.css` with Geist when refactoring.
- **Headings:** Bold, tight line-height on hero (`leading-tight`); interior pages `tracking-tight` on `h1`.
- **Body:** `text-sm`–`text-base`, `leading-6`–`leading-7` for readable blocks (permits, safety).

---

## 4. Motion (Anime.js first; expand later)

**Default stack:** [Anime.js v4](https://animejs.com/documentation) for timeline-friendly DOM motion (`animate`, `stagger`, `ease`).

**Rules:**

- Prefer **opacity + small translate** (≤ 24px) for entrances; duration **450–900ms**.
- **One hero sequence per viewport** on first paint; avoid competing loops.
- **Respect `prefers-reduced-motion: reduce`:** skip motion; leave layout final state visible.
- Do not animate permit tables or long safety text in ways that delay reading.

**Future (use sparingly):**

- **Three.js** — Single focal moments only (e.g. abstract mountain mesh, subtle scroll parallax), lazy-loaded route or dynamic import.
- **React Bits / Animate UI** — Pull in discrete patterns (e.g. shimmer skeleton, magnetic button) when a page needs them; document each addition here under §7.

---

## 5. Layout & density

- **Max width:** `max-w-5xl` / `max-w-6xl` for main content; hero text `max-w-2xl` where appropriate.
- **Spacing:** Section rhythm `py-16`–`py-20`; compact lists `space-y-2`–`space-y-4`.
- **Navbar:** Height `h-16`, border-b; mobile nav to be added later (hamburger + sheet) — do not cram all links on &lt;640px.

---

## 6. Accessibility

- Focus visible on all interactive elements (ring-2 ring-green-500 pattern where missing).
- Icon-only controls must have `aria-label`.
- Trust badges (“Verified”) should not rely on color alone — keep icon + text (`BadgeCheck` + label).
- Motion: see §4.

---

## 7. Change log (agents: update when you introduce patterns)

| Date | Change |
|------|--------|
| 2026-05-20 | Initial DESIGN.md; home hero entrance uses Anime.js with reduced-motion guard. |

---

## 8. Open requests (needs input from founder)

- Final **brand name lockups** (EN / नेपाली) and wordmark if any.
- **Photography** source of truth (Unsplash only vs. partner guides’ photos + model releases).
- **Legal:** disclaimer copy for trekking advice and third-party map data.

When any of the above is decided, append to §8 and adjust §1–3 as needed.
