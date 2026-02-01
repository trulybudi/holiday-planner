'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useAuth';
import { HolidayForm } from '@/components/forms/HolidayForm';
import { holidayService } from '@/lib/supabase/holiday.service';
import { Holiday } from '@/types';

export default function EditHolidayPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (
    holidayData: Omit<Holiday, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ) => {
    setIsSubmitting(true);
    setError(null);

    const result = await holidayService.update(id, holidayData);
    if (result.success) {
      router.push(`/holidays/${id}`);
    } else {
      setError(result.error || 'Failed to update holiday');
    }
    setIsSubmitting(false);
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
        <p className="text-gray-600 mb-4">Please login to edit a holiday</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading holiday...</p>
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <Link href={`/holidays/${id}`} className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Holiday
      </Link>

      <h1 className="text-4xl font-bold text-gray-900 mb-8">Edit Holiday</h1>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <HolidayForm
        onSubmit={handleSubmit}
        initialData={holiday}
        isLoading={isSubmitting}
      />
    </div>
  );
}
