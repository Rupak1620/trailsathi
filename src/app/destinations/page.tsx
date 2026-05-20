import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Destinations | TrailSathi",
  description: "Nepal regions beyond a single trail — treks, cities, and safaris on TrailSathi.",
};

const destinations = [
  {
    slug: "everest-region",
    name: "Everest region",
    tagline: "High passes, base camp, and Khumbu culture",
    href: "/treks",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80",
  },
  {
    slug: "annapurna",
    name: "Annapurna & Pokhara",
    tagline: "Ghorepani loops, ABC, and lakeside recovery",
    href: "/treks",
    image: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800&q=80",
  },
  {
    slug: "chitwan",
    name: "Chitwan",
    tagline: "Jungle safaris, rivers, and wildlife",
    href: "/treks",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=80",
    comingSoon: true,
  },
  {
    slug: "mustang",
    name: "Upper Mustang",
    tagline: "Trans-Himalayan desert landscapes",
    href: "/treks",
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  },
  {
    slug: "rara",
    name: "Rara & west",
    tagline: "Remote lake treks and quieter trails",
    href: "/treks",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  },
  {
    slug: "kathmandu-valley",
    name: "Kathmandu Valley",
    tagline: "Heritage towns, ridge hikes, and gateways to the Himalaya",
    href: "/community",
    image: "https://images.unsplash.com/photo-1605647540926-0962900559c9?w=800&q=80",
    comingSoon: true,
  },
];

export default function DestinationsPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      <section className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900"
          >
            <ArrowLeft size={16} />
            Home
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          Destinations
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-stone-900">Nepal beyond a single trail</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-600">
          Trekking is the core of TrailSathi today — verified routes, permits, and guides. These destination hubs will
          grow into full guides for city breaks, safaris, and multi-region trips.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <article
              key={d.slug}
              className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg"
            >
              <Link href={d.href} className="block">
                <div className="relative h-44 w-full">
                  <Image
                    src={d.image}
                    alt={`${d.name} — Nepal destination`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1 text-xs font-semibold text-white">
                      <MapPin size={14} aria-hidden />
                      {d.comingSoon ? "Expanding" : "Explore"}
                    </span>
                    {d.comingSoon ? (
                      <span className="rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium text-stone-800">
                        More soon
                      </span>
                    ) : null}
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-stone-900 group-hover:text-emerald-700">{d.name}</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-600">{d.tagline}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
                    {d.comingSoon ? "Browse treks & community" : "See treks"}
                    <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
