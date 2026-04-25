import Link from "next/link";
import { getVerifiedTreks } from "@/lib/treks";

export default async function TreksPage() {
  const treks = await getVerifiedTreks();

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Treks in Nepal
        </h1>
        <p className="text-gray-500">
          Find the perfect trek based on your fitness, budget and time.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {treks?.map((trek) => (
          <Link
            href={`/treks/${trek.slug}`}
            key={trek.id}
            className="border border-gray-100 rounded-lg p-6 hover:border-green-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
                {trek.region}
              </span>
              <span className="text-xs text-gray-400">{trek.difficulty}</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              {trek.name}
            </h2>
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">
              {trek.description}
            </p>
            <div className="grid grid-cols-3 gap-2 text-center border-t border-gray-50 pt-4">
              <div>
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-sm font-medium text-gray-700">
                  {formatDuration(trek.duration_days)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Max altitude</p>
                <p className="text-sm font-medium text-gray-700">
                  {trek.max_altitude ? `${trek.max_altitude}m` : "Pending"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Permit</p>
                <p className="text-sm font-medium text-gray-700">
                  {trek.permit_required && trek.permit_cost
                    ? `From NPR ${trek.permit_cost}`
                    : trek.permit_required
                      ? "Required"
                      : "Not required"}
                </p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-1">
              {trek.best_seasons?.map((season) => (
                <span
                  key={season}
                  className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded"
                >
                  {season}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

function formatDuration(duration: number | null) {
  if (typeof duration === "number") {
    return `${duration} days`;
  }

  return "Pending";
}
