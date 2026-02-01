import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">🌍 Welcome to Holiday Planner</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Plan your perfect holiday with our comprehensive planning tool. Organize itineraries, track expenses, manage accommodations, and travel with your companions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Plan Itineraries</h3>
            <p className="text-gray-600">Create day-by-day itineraries with activities, times, and locations.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Track Expenses</h3>
            <p className="text-gray-600">Monitor your spending and stay within budget throughout your trip.</p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="text-4xl mb-4">🤝</div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Collaborate</h3>
            <p className="text-gray-600">Invite travel companions and plan together seamlessly.</p>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link href="/auth/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
            Get Started
          </Link>
          <Link href="/auth/login" className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
