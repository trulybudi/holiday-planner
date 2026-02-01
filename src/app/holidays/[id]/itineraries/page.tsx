'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useUser } from '@/lib/hooks/useAuth';
import { ItineraryCard } from '@/components/cards/ItineraryCard';
import { Itinerary, itineraryService } from '@/lib/supabase/itinerary.service';

export default function ItinerariesPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const holidayId = params.id as string;

  useEffect(() => {
    if (!userLoading && user) {
      fetchItineraries();
    } else if (!userLoading && !user) {
      setLoading(false);
    }
  }, [user, userLoading, holidayId]);

  const fetchItineraries = async () => {
    setLoading(true);
    setError(null);

    const result = await itineraryService.getByHolidayId(holidayId);
    if (result.success) {
      setItineraries(result.data || []);
    } else {
      setError(result.error || 'Failed to load itineraries');
    }
    setLoading(false);
  };

  const handleDelete = async (itineraryId: string) => {
    setError(null);
    const result = await itineraryService.delete(itineraryId);
    if (result.success) {
      setItineraries(itineraries.filter((i) => i.id !== itineraryId));
    } else {
      setError(result.error || 'Failed to delete itinerary');
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
        <p className="text-gray-600 mb-4">Please login to view itineraries</p>
        <Link href="/auth/login" className="text-blue-600 hover:underline">
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Trip Itinerary</h1>
        <Link
          href={`/holidays/${holidayId}/itineraries/new`}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 font-semibold"
        >
          + Add Activity
        </Link>
      </div>

      <Link href={`/holidays/${holidayId}`} className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Holiday
      </Link>

      {error && <div className="mb-6 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      {loading ? (
        <p className="text-gray-600">Loading itineraries...</p>
      ) : itineraries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No activities planned yet</p>
          <Link
            href={`/holidays/${holidayId}/itineraries/new`}
            className="text-blue-600 hover:underline"
          >
            Add your first activity
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {itineraries.map((itinerary) => (
            <ItineraryCard
              key={itinerary.id}
              itinerary={itinerary}
              holidayId={holidayId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
