'use client';

import Link from 'next/link';
import { useUser } from '@/lib/hooks/useAuth';

export const Navigation = () => {
  const { user, loading } = useUser();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              🌍 Holiday Planner
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {!loading && (
              <>
                {user ? (
                  <>
                    <Link href="/dashboard" className="text-gray-700 hover:text-blue-600">
                      Dashboard
                    </Link>
                    <Link href="/profile" className="text-gray-700 hover:text-blue-600">
                      Profile
                    </Link>
                    <Link href="/auth/login" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                      Logout
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/auth/login" className="text-gray-700 hover:text-blue-600">
                      Login
                    </Link>
                    <Link href="/auth/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                      Register
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
