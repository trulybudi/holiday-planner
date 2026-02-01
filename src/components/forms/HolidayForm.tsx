'use client';

import { useState } from 'react';
import { Holiday } from '@/types';
import { validateDate } from '@/lib/utils/helpers';

interface HolidayFormProps {
  onSubmit: (holiday: Omit<Holiday, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  initialData?: Holiday;
  isLoading?: boolean;
}

export const HolidayForm = ({ onSubmit, initialData, isLoading = false }: HolidayFormProps) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    destination: initialData?.destination || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    budget: initialData?.budget?.toString() || '',
    description: initialData?.description || '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const generateDescription = async () => {
    if (!formData.title.trim() || !formData.destination.trim()) {
      setError('Please fill in Title and Destination first');
      return;
    }

    setIsGeneratingDescription(true);
    setError(null);

    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to generate description');
      }

      const data = await response.json();
      setFormData({ ...formData, description: data.description });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate description');
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (!formData.destination.trim()) {
      setError('Destination is required');
      return;
    }

    if (!formData.startDate) {
      setError('Start date is required');
      return;
    }

    if (!formData.endDate) {
      setError('End date is required');
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      setError('Start date must be before end date');
      return;
    }

    try {
      await onSubmit({
        title: formData.title,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
        description: formData.description || undefined,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit form');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">{initialData ? 'Edit Holiday' : 'Create New Holiday'}</h2>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}

      <div className="mb-4">
        <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">
          Holiday Title *
        </label>
        <input
          id="title"
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Summer Vacation 2024"
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="destination" className="block text-gray-700 font-semibold mb-2">
          Destination *
        </label>
        <input
          id="destination"
          type="text"
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Paris, France"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="startDate" className="block text-gray-700 font-semibold mb-2">
            Start Date *
          </label>
          <input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-gray-700 font-semibold mb-2">
            End Date *
          </label>
          <input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="budget" className="block text-gray-700 font-semibold mb-2">
          Budget (Optional)
        </label>
        <input
          id="budget"
          type="number"
          step="0.01"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 5000"
        />
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <label htmlFor="description" className="block text-gray-700 font-semibold">
            Description (Optional)
          </label>
          <button
            type="button"
            onClick={generateDescription}
            disabled={isGeneratingDescription || isLoading}
            className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 disabled:bg-gray-400 font-semibold"
          >
            {isGeneratingDescription ? 'Generating...' : '✨ AI Generate'}
          </button>
        </div>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any notes about your holiday..."
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
      >
        {isLoading ? 'Saving...' : initialData ? 'Update Holiday' : 'Create Holiday'}
      </button>
    </form>
  );
};
