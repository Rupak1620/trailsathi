import Link from "next/link";
import { ArrowRight, MapPin, Users, Shield, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default async function Home() {
  const { data: treks } = await supabase
    .from("treks")
    .select("*")
    .limit(3)
    .order("name");

  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative bg-gray-900 text-white">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600')",
          }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-32 text-center">
          <div className="inline-block bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
            Nepal tourism platform
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Plan your trek.<br />
            Find your guide.<br />
            Explore Nepal.
          </h1>
          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            TrailSathi connects trekkers with verified local guides, real trail
            data, and an AI-powered planner built specifically for Nepal.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/treks"
              className="inline-flex items-center gap-2 px-8 py-4 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Find a trek <ArrowRight size={16} />
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Find a guide
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-gray-900">{s.value}</div>
              <div className="text-sm text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured treks */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Popular treks
              </h2>
              <p className="text-gray-500 mt-1">
                Handpicked routes across Nepal
              </p>
            </div>
            <Link
              href="/treks"
              className="text-sm text-green-700 font-medium hover:underline flex items-center gap-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {treks?.map((trek) => (
              <Link
                href={`/treks/${trek.id}`}
                key={trek.id}
                className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all"
              >
                <div className="bg-gray-100 h-48 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                  <div className="absolute bottom-4 left-4">
                    <span className="text-xs font-medium text-white bg-green-600 px-2 py-1 rounded">
                      {trek.region}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700 transition-colors">
                      {trek.name}
                    </h3>
                    <span className="text-xs text-gray-400">
                      {trek.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                    {trek.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span>{trek.duration_days} days</span>
                    <span>{trek.max_altitude}m</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Why TrailSathi
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Built for Nepal, by someone who has trekked these trails
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-200 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center mb-4">
                  <f.icon size={20} className="text-green-700" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guide CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-green-700 rounded-2xl px-8 py-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Are you a trekking guide?</h2>
            <p className="text-green-100 mb-8 max-w-xl mx-auto">
              Join TrailSathi and get discovered by trekkers from around the
              world. Free to register. No commission until you grow.
            </p>
            <Link
              href="/guides/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-green-700 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Register as a guide <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-semibold text-gray-900">TrailSathi</p>
            <p className="text-sm text-gray-400">Nepal tourism platform</p>
          </div>
          <div className="flex gap-6">
            <Link href="/treks" className="text-sm text-gray-500 hover:text-gray-900">Treks</Link>
            <Link href="/guides" className="text-sm text-gray-500 hover:text-gray-900">Guides</Link>
            <Link href="/community" className="text-sm text-gray-500 hover:text-gray-900">Community</Link>
            <Link href="/destinations" className="text-sm text-gray-500 hover:text-gray-900">Destinations</Link>
          </div>
        </div>
      </footer>

    </main>
  );
}

const stats = [
  { value: "100+", label: "Trekking routes" },
  { value: "50+", label: "Verified guides" },
  { value: "15+", label: "Destinations" },
  { value: "8000m+", label: "Highest peak" },
];

const features = [
  {
    icon: Star,
    title: "AI trek planner",
    description:
      "Get personalized trek recommendations based on your fitness, budget, and experience.",
  },
  {
    icon: Users,
    title: "Verified guides",
    description:
      "Every guide is verified with license number, experience, and trekker reviews.",
  },
  {
    icon: MapPin,
    title: "Real trail data",
    description:
      "Up to date permit costs, teahouse locations, altitude profiles, and seasonal advice.",
  },
  {
    icon: Shield,
    title: "Safety first",
    description:
      "Emergency contacts, weather alerts, and SOS features for remote trekking areas.",
  },
];