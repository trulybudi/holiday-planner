'use client';

import { Holiday } from '@/types';
import { formatDate, calculateDays } from '@/lib/utils/helpers';
import Link from 'next/link';

interface HolidayCardProps {
  holiday: Holiday;
  onDelete?: (id: string) => void;
}

export const HolidayCard = ({ holiday, onDelete }: HolidayCardProps) => {
  const days = calculateDays(holiday.startDate, holiday.endDate);

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6 border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{holiday.title}</h3>
          <p className="text-gray-600 flex items-center mt-2">
            📍 {holiday.destination}
          </p>
        </div>
        <div className="text-right">
          {holiday.budget && <p className="text-lg font-semibold text-green-600">💰 ${holiday.budget}</p>}
          <p className="text-sm text-gray-500">{days} days</p>
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          📅 {formatDate(holiday.startDate)} - {formatDate(holiday.endDate)}
        </p>
      </div>

      {holiday.description && <p className="mt-4 text-gray-700">{holiday.description}</p>}

      <div className="mt-6 flex gap-3">
        <Link
          href={`/holidays/${holiday.id}`}
          className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>
        {onDelete && (
          <button
            onClick={() => onDelete(holiday.id)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};
