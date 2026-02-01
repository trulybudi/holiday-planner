'use client';

import { useState } from 'react';
import { Itinerary } from '@/lib/supabase/itinerary.service';

interface ItineraryFormProps {
  onSubmit: (itinerary: Omit<Itinerary, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Itinerary;
  isLoading?: boolean;
  holidayStartDate: string; // YYYY-MM-DD
  holidayEndDate: string; // YYYY-MM-DD
  destination?: string; // Trip destination for AI context
}

export const ItineraryForm = ({
  onSubmit,
  initialData,
  isLoading = false,
  holidayStartDate,
  holidayEndDate,
  destination = '',
}: ItineraryFormProps) => {
  const [formData, setFormData] = useState({
    date: initialData?.date || '',
    activity: initialData?.activity || '',
    location: initialData?.location || '',
    startTime: initialData?.startTime || '',
    endTime: initialData?.endTime || '',
    notes: initialData?.notes || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [suggestingField, setSuggestingField] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<Record<string, string>>({});

  const handleAISuggest = async (field: 'activity' | 'location' | 'notes') => {
    if (!destination || !formData.date) {
      setError('Please select a date and destination first');
      return;
    }

    setSuggestingField(field);
    setError(null);

    try {
      const response = await fetch('/api/ai/suggest-itinerary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination,
          date: formData.date,
          field,
          currentValue: formData[field as keyof typeof formData] || '',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSuggestions((prev) => ({
          ...prev,
          [field]: data.suggestion,
        }));
      } else {
        setError(data.error || 'Failed to generate suggestion');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate suggestion');
    } finally {
      setSuggestingField(null);
    }
  };

  const applySuggestion = (field: 'activity' | 'location' | 'notes') => {
    const suggestion = suggestions[field];
    if (suggestion) {
      setFormData((prev) => ({
        ...prev,
        [field]: suggestion,
      }));
      setSuggestions((prev) => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate date is selected
    if (!formData.date.trim()) {
      setError('Please select a date for this activity');
      return;
    }

    // Validate date is within trip range
    if (formData.date < holidayStartDate) {
      setError(`Date cannot be before trip start date (${holidayStartDate})`);
      return;
    }

    if (formData.date > holidayEndDate) {
      setError(`Date cannot be after trip end date (${holidayEndDate})`);
      return;
    }

    if (!formData.activity.trim()) {
      setError('Activity is required');
      return;
    }

    if (formData.startTime && formData.endTime) {
      if (formData.startTime >= formData.endTime) {
        setError('End time must be after start time');
        return;
      }
    }

    try {
      await onSubmit({
        holidayId: initialData?.holidayId || '',
        date: formData.date,
        activity: formData.activity,
        location: formData.location || undefined,
        startTime: formData.startTime || undefined,
        endTime: formData.endTime || undefined,
        notes: formData.notes || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg border border-red-300">
          {error}
        </div>
      )}

      {/* Date Selection */}
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date *
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          min={holidayStartDate}
          max={holidayEndDate}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">
          Select a date between {holidayStartDate} and {holidayEndDate}
        </p>
      </div>

      {/* Activity */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="activity" className="block text-sm font-medium text-gray-700">
            Activity *
          </label>
          {destination && (
            <button
              type="button"
              onClick={() => handleAISuggest('activity')}
              disabled={suggestingField === 'activity' || !formData.date}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate AI suggestion for activity"
            >
              {suggestingField === 'activity' ? '✨ Suggesting...' : '✨ Suggest'}
            </button>
          )}
        </div>
        <input
          type="text"
          id="activity"
          name="activity"
          value={formData.activity}
          onChange={handleChange}
          placeholder="e.g., Visit Eiffel Tower, Morning jog"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {suggestions.activity && (
          <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">
              💡 AI Suggestion: <strong>{suggestions.activity}</strong>
            </p>
            <button
              type="button"
              onClick={() => applySuggestion('activity')}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Use This
            </button>
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location (Optional)
          </label>
          {destination && (
            <button
              type="button"
              onClick={() => handleAISuggest('location')}
              disabled={suggestingField === 'location' || !formData.date}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate AI suggestion for location"
            >
              {suggestingField === 'location' ? '✨ Suggesting...' : '✨ Suggest'}
            </button>
          )}
        </div>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="e.g., Paris, France"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {suggestions.location && (
          <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">
              💡 AI Suggestion: <strong>{suggestions.location}</strong>
            </p>
            <button
              type="button"
              onClick={() => applySuggestion('location')}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Use This
            </button>
          </div>
        )}
      </div>

      {/* Time Range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Start Time (Optional)
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
            End Time (Optional)
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          {formData.startTime && formData.endTime && (
            <p className="text-xs text-gray-500 mt-1">
              Duration: {calculateDuration(formData.startTime, formData.endTime)}
            </p>
          )}
        </div>
      </div>

      {/* Notes */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes (Optional)
          </label>
          {destination && (
            <button
              type="button"
              onClick={() => handleAISuggest('notes')}
              disabled={suggestingField === 'notes' || !formData.date}
              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Generate AI suggestion for notes/tips"
            >
              {suggestingField === 'notes' ? '✨ Suggesting...' : '✨ Suggest'}
            </button>
          )}
        </div>
        <textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Add any additional notes about this activity..."
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        {suggestions.notes && (
          <div className="mt-2 p-3 bg-blue-50 rounded border border-blue-200">
            <p className="text-sm text-gray-600 mb-2">
              💡 AI Tip: <strong>{suggestions.notes}</strong>
            </p>
            <button
              type="button"
              onClick={() => applySuggestion('notes')}
              className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            >
              Use This
            </button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Activity' : 'Add Activity'}
      </button>
    </form>
  );
};

function calculateDuration(startTime: string, endTime: string): string {
  try {
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;
    const durationMinutes = endMinutes - startMinutes;

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) return `${minutes} min`;
    if (minutes === 0) return `${hours} hr`;
    return `${hours}h ${minutes}m`;
  } catch {
    return '';
  }
}
