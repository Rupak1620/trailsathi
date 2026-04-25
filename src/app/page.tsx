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

      {/* HERO WITH AI INPUT */}
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
            AI-powered trekking planner
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Plan your trek.<br />
            Find your guide.<br />
            Explore Nepal.
          </h1>

          <p className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto">
            TrailSathi helps you discover the perfect trek, connect with verified guides,
            and plan safely using real-time data and AI.
          </p>

          {/* AI INPUT BOX */}
          <div className="bg-white rounded-xl p-4 max-w-xl mx-auto shadow-lg">
            <input
              placeholder="e.g. 7 days, beginner, low budget..."
              className="w-full p-3 border rounded-lg mb-3 text-black"
            />
            <button className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700">
              Get my trek plan
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
            <Link
              href="/treks"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Explore treks <ArrowRight size={16} />
            </Link>
            <Link
              href="/guides"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100"
            >
              Find guides
            </Link>
          </div>

        </div>
      </section>

      {/* LIVE ACTIVITY */}
      <section className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap justify-center gap-6 text-sm text-gray-600">
          <span>🟢 12 trekkers planning trips this week</span>
          <span>🟢 5 guides available in Everest region</span>
          <span>🟢 20+ recent discussions</span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-10">
            How it works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-sm">
            {steps.map((step) => (
              <div key={step.title}>
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="font-semibold text-gray-900">{step.title}</h3>
                <p className="text-gray-500 mt-1">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR TREKS */}
      <section className="py-20 bg-gray-50">
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
                className="group border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-all bg-white"
              >
                <img
                  src={trek.image_url || "https://images.unsplash.com/photo-1501785888041-af3ef285b470"}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 group-hover:text-green-700">
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

      {/* WHY TRAILSATHI */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Why TrailSathi
          </h2>
          <p className="text-gray-500 mb-12">
            Built for Nepal, by real trekkers
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="p-6 border rounded-xl">
                <f.icon className="text-green-600 mb-4" />
                <h3 className="font-semibold text-gray-900">{f.title}</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION */}
      <section className="bg-gray-50 py-16 text-center">
        <div className="max-w-4xl mx-auto px-4 text-sm text-gray-600 space-y-2">
          <p>✔ Licensed and verified guides</p>
          <p>✔ Real-time trail and safety data</p>
          <p>✔ Built in Nepal 🇳🇵</p>
          <p>✔ Designed for safe trekking</p>
        </div>
      </section>

      {/* GUIDE CTA */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-green-700 rounded-2xl px-8 py-16 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Are you a trekking guide?
            </h2>
            <p className="text-green-100 mb-8 max-w-xl mx-auto">
              Join TrailSathi and get discovered by trekkers worldwide.
              Free to register.
            </p>
            <Link
              href="/guides/register"
              className="px-8 py-4 bg-white text-green-700 rounded-lg font-semibold"
            >
              Register as a guide
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t py-10 text-center text-sm text-gray-500">
        TrailSathi — Nepal trekking platform
      </footer>

    </main>
  );
}

const steps = [
  { icon: "🧠", title: "Tell us your plan", desc: "Budget, days, fitness" },
  { icon: "🤖", title: "Get AI recommendations", desc: "Best treks for you" },
  { icon: "🧑‍🏔️", title: "Connect with guides", desc: "Verified locals" },
  { icon: "🏔️", title: "Start your journey", desc: "Trek safely" },
];

const features = [
  {
    icon: Star,
    title: "Get your perfect trek in seconds",
    description: "AI matches your fitness, budget, and time",
  },
  {
    icon: Users,
    title: "Verified local guides",
    description: "Real profiles with experience and reviews",
  },
  {
    icon: MapPin,
    title: "Real trail data",
    description: "Updated routes, costs, and conditions",
  },
  {
    icon: Shield,
    title: "Safety-first design",
    description: "Emergency-ready features for trekking",
  },
];