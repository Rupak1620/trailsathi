import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="text-lg font-semibold text-green-700">
          TrailSathi
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/treks" className="text-sm text-gray-600 hover:text-gray-900">
            Treks
          </Link>
          <Link href="/guides" className="text-sm text-gray-600 hover:text-gray-900">
            Guides
          </Link>
          <Link href="/community" className="text-sm text-gray-600 hover:text-gray-900">
            Community
          </Link>
          <Link href="/destinations" className="text-sm text-gray-600 hover:text-gray-900">
            Destinations
          </Link>
          <Link
            href="/guides/register"
            className="text-sm px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-800"
          >
            Register as Guide
          </Link>
        </div>
      </div>
    </nav>
  );
}