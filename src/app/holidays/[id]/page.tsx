'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useAuth';
import { holidayService } from '@/lib/supabase/holiday.service';
import { Holiday } from '@/types';
import { formatDate, calculateDays } from '@/lib/utils/helpers';

export default function HolidayDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const id = params.id as string;

  useEffect(() => {
    if (!userLoading && user) {
      fetchHoliday();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, id]);

  const fetchHoliday = async () => {
    setLoading(true);
    setError(null);

    const result = await holidayService.getById(id);
    if (result.success) {
      setHoliday(result.data || null);
    } else {
      setError(result.error || 'Failed to load holiday');
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this holiday?')) return;

    setIsDeleting(true);
    setError(null);

    const result = await holidayService.delete(id);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Failed to delete holiday');
      setIsDeleting(false);
    }
  };

  if (userLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Please login to view holiday details</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading holiday details...</p>
      </div>
    );
  }

  if (!holiday) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Holiday not found</p>
        <Link href="/dashboard" className="text-blue-600 hover:underline">
          Go back to dashboard
        </Link>
      </div>
    );
  }

  const days = calculateDays(holiday.startDate, holiday.endDate);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href="/dashboard" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {/* Holiday Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{holiday.title}</h1>
            <p className="text-2xl text-gray-600 flex items-center">📍 {holiday.destination}</p>
          </div>
          <div className="text-right">
            {holiday.budget && (
              <p className="text-2xl font-bold text-green-600 mb-2">💰 ${holiday.budget.toLocaleString()}</p>
            )}
            <p className="text-lg text-gray-600 font-semibold">{days} days</p>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b">
          <div>
            <p className="text-sm text-gray-600">Start Date</p>
            <p className="text-lg font-semibold text-gray-900">📅 {formatDate(holiday.startDate)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">End Date</p>
            <p className="text-lg font-semibold text-gray-900">📅 {formatDate(holiday.endDate)}</p>
          </div>
        </div>

        {/* Description */}
        {holiday.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{holiday.description}</p>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 pt-6 border-t text-sm text-gray-600">
          <div>
            <p className="text-xs text-gray-500 uppercase">Created</p>
            <p>{formatDate(holiday.createdAt)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Updated</p>
            <p>{formatDate(holiday.updatedAt)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Link
          href={`/holidays/${holiday.id}/edit`}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition text-center font-semibold"
        >
          Edit Holiday
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50"
        >
          {isDeleting ? 'Deleting...' : 'Delete Holiday'}
        </button>
      </div>

      {/* Coming Soon */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">📅 Itineraries</h3>
          <p className="text-gray-600">Plan day-by-day activities</p>
          <p className="text-sm text-gray-500 mt-2">Coming soon</p>
        </div>
        <div className="bg-green-50 rounded-lg p-6 border-2 border-green-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">💰 Expenses</h3>
          <p className="text-gray-600">Track your spending</p>
          <p className="text-sm text-gray-500 mt-2">Coming soon</p>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border-2 border-purple-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">🏨 Accommodations</h3>
          <p className="text-gray-600">Manage your bookings</p>
          <p className="text-sm text-gray-500 mt-2">Coming soon</p>
        </div>
      </div>
    </div>
  );
}
