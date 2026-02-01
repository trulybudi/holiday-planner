import { supabase } from './client';
import { ApiResponse } from '@/types';

export interface Itinerary {
  id: string;
  holidayId: string;
  date: string; // YYYY-MM-DD format
  activity: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  notes?: string;
  createdAt: string;
}

const mapItineraryData = (data: any): Itinerary => {
  return {
    id: data.id,
    holidayId: data.holiday_id,
    date: data.date,
    activity: data.activity,
    location: data.location,
    startTime: data.start_time,
    endTime: data.end_time,
    notes: data.notes,
    createdAt: data.created_at,
  };
};

export const itineraryService = {
  async getByHolidayId(holidayId: string): Promise<ApiResponse<Itinerary[]>> {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('holiday_id', holidayId)
        .order('date', { ascending: true });

      if (error) throw error;
      return { success: true, data: (data || []).map(mapItineraryData) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch itineraries',
      };
    }
  },

  async getById(id: string): Promise<ApiResponse<Itinerary>> {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data: mapItineraryData(data) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch itinerary',
      };
    }
  },

  async create(
    holidayId: string,
    itinerary: Omit<Itinerary, 'id' | 'createdAt'>
  ): Promise<ApiResponse<Itinerary>> {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .insert({
          holiday_id: holidayId,
          date: itinerary.date,
          activity: itinerary.activity,
          location: itinerary.location,
          start_time: itinerary.startTime,
          end_time: itinerary.endTime,
          notes: itinerary.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: mapItineraryData(data) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create itinerary',
      };
    }
  },

  async update(
    id: string,
    updates: Partial<Omit<Itinerary, 'id' | 'holidayId' | 'createdAt'>>
  ): Promise<ApiResponse<Itinerary>> {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .update({
          date: updates.date,
          activity: updates.activity,
          location: updates.location,
          start_time: updates.startTime,
          end_time: updates.endTime,
          notes: updates.notes,
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: mapItineraryData(data) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update itinerary',
      };
    }
  },

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const { error } = await supabase
        .from('itineraries')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, data: { success: true } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete itinerary',
      };
    }
  },
};
