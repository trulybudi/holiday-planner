'use client';

import Link from 'next/link';
import { useUser } from '@/lib/hooks/useAuth';

export default function ProfilePage() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Please login to view your profile</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Profile</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Email</label>
          <p className="text-gray-900">{user.email}</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">User ID</label>
          <p className="text-gray-900 font-mono text-sm break-all">{user.id}</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Account Created</label>
          <p className="text-gray-900">
            {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
          </p>
        </div>

        <div className="flex gap-4">
          <Link
            href="/dashboard"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
