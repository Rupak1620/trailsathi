# TrailSathi

AI-powered Nepal tourism platform, your intelligent trekking companion.

# What is TrailSathi?

TrailSathi is a platform that helps travelers plan, connect, navigate and stay safe across all of Nepal's destinations. AI-powered, community-driven, real-data integrated.

# Features (Roadmap)

- AI trek recommender (fitness + budget + season)
- Verified guide directory with self-registration
- Community forum  (find trek partners, ask questions)
- Trail pages with permits, teahouses, day-by-day info
- Offline maps with GPS and teahouse pins
- Weather-integrated gear and clothing suggestions
- SOS emergency system
- Beyond trekking (Chitwan, Pokhara, Rara and more....

# Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Supabase (database + auth)
- Claude API (AI recommendations)
- MapLibre (offline maps)

# Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

# Project Structure

src/
app/
treks/          # Trail pages and AI recommender
guides/         # Guide directory and registration
community/      # Forum, groups, trek partners
destinations/   # Chitwan, Pokhara, Rara etc
components/
ui/             # Reusable UI components
layout/         # Header, footer, nav
trek/           # Trek-specific components
guides/         # Guide-specific components
lib/              # API calls, Claude integration
types/            # TypeScript type definitions