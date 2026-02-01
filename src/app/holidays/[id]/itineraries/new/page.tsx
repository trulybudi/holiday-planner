'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useUser } from '@/lib/hooks/useAuth';
import { ItineraryForm } from '@/components/forms/ItineraryForm';
import { Itinerary, itineraryService } from '@/lib/supabase/itinerary.service';
import { holidayService } from '@/lib/supabase/holiday.service';
import { Holiday } from '@/types';

export default function NewItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const holidayId = params.id as string;

  useEffect(() => {
    if (!userLoading && user) {
      fetchHoliday();
    } else if (!userLoading && !user) {
      setIsLoading(false);
    }
  }, [user, userLoading, holidayId]);

  const fetchHoliday = async () => {
    setIsLoading(true);
    const result = await holidayService.getById(holidayId);
    if (result.success) {
      setHoliday(result.data || null);
    } else {
      setError(result.error || 'Failed to load holiday');
    }
    setIsLoading(false);
  };

  const handleSubmit = async (itinerary: Omit<Itinerary, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    setError(null);

    const result = await itineraryService.create(holidayId, itinerary);
    if (result.success) {
      router.push(`/holidays/${holidayId}/itineraries`);
    } else {
      setError(result.error || 'Failed to create itinerary');
    }
    setIsSubmitting(false);
  };

  if (userLoading || isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Please login to add activities</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Go to login
        </Link>
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
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href={`/holidays/${holidayId}/itineraries`} className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Itinerary
      </Link>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Activity</h2>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <ItineraryForm
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
        holidayStartDate={holiday.startDate}
        holidayEndDate={holiday.endDate}
        destination={holiday.destination}
      />
    </div>
  );
}
