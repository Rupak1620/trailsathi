import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-sm text-green-700 font-medium mb-4 tracking-wide uppercase">
          Nepal tourism platform
        </p>
        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
          Plan your trek.<br />Find your guide.<br />Explore Nepal.
        </h1>
        <p className="text-lg text-gray-500 mb-10 max-w-xl mx-auto">
          TrailSathi helps you plan the perfect Nepal trek with AI-powered recommendations, verified local guides, and a community of trekkers.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/treks"
            className="px-6 py-3 bg-green-700 text-white rounded-md text-sm font-medium hover:bg-green-800"
          >
            Find a trek
          </Link>
          <Link
            href="/guides"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
          >
            Find a guide
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Everything you need for Nepal
          </h2>
          <p className="text-gray-500 text-center mb-12">
            One platform for planning, connecting, and exploring
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-lg p-6 border border-gray-100">
                <div className="text-green-700 font-semibold text-sm mb-2">{f.label}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
            How it works
          </h2>
          <p className="text-gray-500 text-center mb-12">
            Start planning your Nepal adventure in minutes
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {steps.map((s, i) => (
              <div key={s.title} className="text-center">
                <div className="w-10 h-10 rounded-full bg-green-700 text-white flex items-center justify-center text-sm font-semibold mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-700 py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            Are you a trekking guide?
          </h2>
          <p className="text-green-100 mb-8">
            Join TrailSathi and connect with trekkers from around the world. Free to register.
          </p>
          <Link
            href="/guides/register"
            className="px-6 py-3 bg-white text-green-700 rounded-md text-sm font-medium hover:bg-green-50"
          >
            Register as a guide
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">TrailSathi — Nepal tourism platform</p>
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

const features = [
  {
    label: "AI powered",
    title: "Trek recommender",
    description: "Get personalized trek suggestions based on your fitness, budget, and available days.",
  },
  {
    label: "Verified",
    title: "Guide directory",
    description: "Browse and connect with licensed, verified local guides across all trekking regions.",
  },
  {
    label: "Community",
    title: "Find trek partners",
    description: "Connect with other trekkers, ask questions, and form groups for your next adventure.",
  },
  {
    label: "Safety",
    title: "Trail information",
    description: "Up to date permit info, teahouse locations, weather conditions, and safety guidance.",
  },
];

const steps = [
  {
    title: "Tell us about yourself",
    description: "Enter your fitness level, budget, available days, and preferred trekking style.",
  },
  {
    title: "Get your recommendation",
    description: "Our AI matches you with the best treks and guides based on your profile.",
  },
  {
    title: "Plan and go",
    description: "Connect with a guide, join the community, and start your Nepal adventure.",
  },
];