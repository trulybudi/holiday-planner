'use client';

import { Itinerary } from '@/lib/supabase/itinerary.service';
import Link from 'next/link';

interface ItineraryCardProps {
  itinerary: Itinerary;
  holidayId: string;
  onDelete: (id: string) => Promise<void>;
}

export const ItineraryCard = ({ itinerary, holidayId, onDelete }: ItineraryCardProps) => {
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      await onDelete(itinerary.id);
    }
  };

  const timeRange = itinerary.startTime && itinerary.endTime
    ? `${itinerary.startTime} - ${itinerary.endTime}`
    : itinerary.startTime
    ? `From ${itinerary.startTime}`
    : '';

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString + 'T00:00:00');
      return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="text-sm text-gray-500">{formatDate(itinerary.date)}</div>
          <h3 className="text-lg font-semibold text-gray-900">{itinerary.activity}</h3>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/holidays/${holidayId}/itineraries/${itinerary.id}/edit`}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {itinerary.location && (
        <p className="text-sm text-gray-600 mb-2">📍 {itinerary.location}</p>
      )}

      {timeRange && (
        <p className="text-sm text-gray-600 mb-2">🕐 {timeRange}</p>
      )}

      {itinerary.notes && (
        <p className="text-sm text-gray-700 border-t border-gray-200 pt-2 mt-2">
          {itinerary.notes}
        </p>
      )}
    </div>
  );
};
