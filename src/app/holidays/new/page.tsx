'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/lib/hooks/useAuth';
import { HolidayForm } from '@/components/forms/HolidayForm';
import { holidayService } from '@/lib/supabase/holiday.service';
import { Holiday } from '@/types';

export default function NewHolidayPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (holidayData: Omit<Holiday, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const result = await holidayService.create(user.id, holidayData);
    if (result.success) {
      router.push('/dashboard');
    } else {
      setError(result.error || 'Failed to create holiday');
    }
    setIsSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-16">Loading...</div>;
  }

  if (!user) {
    return <div className="text-center py-16">Please login to create a holiday</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Create New Holiday</h1>
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      <HolidayForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}
