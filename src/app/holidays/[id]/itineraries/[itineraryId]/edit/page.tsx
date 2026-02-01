'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useAuth';
import { ItineraryForm } from '@/components/forms/ItineraryForm';
import { Itinerary, itineraryService } from '@/lib/supabase/itinerary.service';
import { holidayService } from '@/lib/supabase/holiday.service';
import { Holiday } from '@/types';

export default function EditItineraryPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [holiday, setHoliday] = useState<Holiday | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const holidayId = params.id as string;
  const itineraryId = params.itineraryId as string;

  useEffect(() => {
    if (!userLoading && user) {
      fetchData();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, itineraryId]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    const itineraryResult = await itineraryService.getById(itineraryId);
    const holidayResult = await holidayService.getById(holidayId);

    if (itineraryResult.success) {
      setItinerary(itineraryResult.data || null);
    } else {
      setError(itineraryResult.error || 'Failed to load itinerary');
    }

    if (holidayResult.success) {
      setHoliday(holidayResult.data || null);
    } else {
      setError((prev) => prev || (holidayResult.error || 'Failed to load holiday'));
    }

    setLoading(false);
  };

  const handleSubmit = async (updates: Omit<Itinerary, 'id' | 'createdAt'>) => {
    setIsSubmitting(true);
    setError(null);

    const result = await itineraryService.update(itineraryId, updates);
    if (result.success) {
      router.push(`/holidays/${holidayId}/itineraries`);
    } else {
      setError(result.error || 'Failed to update itinerary');
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
        <p className="text-gray-600 mb-4">Please login to edit activities</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600">Loading activity...</p>
      </div>
    );
  }

  if (!itinerary || !holiday) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 mb-4">Activity or holiday not found</p>
        <Link href={`/holidays/${holidayId}/itineraries`} className="text-blue-600 hover:underline">
          Go back to itinerary
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href={`/holidays/${holidayId}/itineraries`} className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Itinerary
      </Link>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Activity</h2>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <ItineraryForm
        onSubmit={handleSubmit}
        initialData={itinerary}
        isLoading={isSubmitting}
        holidayStartDate={holiday.startDate}
        holidayEndDate={holiday.endDate}
        destination={holiday.destination}
      />
    </div>
  );
}
