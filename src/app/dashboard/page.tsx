'use client';

import Link from 'next/link';
import { useUser } from '@/lib/hooks/useAuth';
import { useEffect, useState } from 'react';
import { Holiday, ApiResponse } from '@/types';
import { holidayService } from '@/lib/supabase/holiday.service';
import { HolidayCard } from '@/components/cards/HolidayCard';

export default function DashboardPage() {
  const { user, loading: userLoading } = useUser();
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userLoading && user) {
      fetchHolidays();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading]);

  const fetchHolidays = async () => {
    setLoading(true);
    setError(null);
    if (!user) return;

    const result = await holidayService.getAll(user.id);
    if (result.success) {
      setHolidays(result.data || []);
    } else {
      setError(result.error || 'Failed to load holidays');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this holiday?')) {
      const result = await holidayService.delete(id);
      if (result.success) {
        setHolidays(holidays.filter((h) => h.id !== id));
      } else {
        setError(result.error || 'Failed to delete holiday');
      }
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
        <p className="text-gray-600 mb-4">Please login to view your dashboard</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
        <Link
          href="/holidays/new"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + New Holiday
        </Link>
      </div>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {loading ? (
        <p className="text-gray-600">Loading holidays...</p>
      ) : holidays.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No holidays planned yet</p>
          <Link
            href="/holidays/new"
            className="text-blue-600 hover:underline font-semibold"
          >
            Create your first holiday
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {holidays.map((holiday) => (
            <HolidayCard
              key={holiday.id}
              holiday={holiday}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
