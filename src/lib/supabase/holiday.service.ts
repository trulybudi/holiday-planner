import { supabase } from './client';
import { Holiday, ApiResponse } from '@/types';

// Mapping function to convert Supabase snake_case to camelCase
const mapHolidayData = (data: any): Holiday => {
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    destination: data.destination,
    startDate: data.start_date,
    endDate: data.end_date,
    budget: data.budget,
    description: data.description,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
};

export const holidayService = {
  async getAll(userId: string): Promise<ApiResponse<Holiday[]>> {
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data: (data || []).map(mapHolidayData) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch holidays',
      };
    }
  },

  async getById(id: string): Promise<ApiResponse<Holiday>> {
    try {
      const { data, error } = await supabase
        .from('holidays')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { success: true, data: mapHolidayData(data) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch holiday',
      };
    }
  },

  async create(userId: string, holiday: Omit<Holiday, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Holiday>> {
    try {
      const { data, error } = await supabase
        .from('holidays')
        .insert({
          user_id: userId,
          title: holiday.title,
          destination: holiday.destination,
          start_date: holiday.startDate,
          end_date: holiday.endDate,
          budget: holiday.budget,
          description: holiday.description,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: mapHolidayData(data) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create holiday',
      };
    }
  },

  async update(id: string, updates: Partial<Holiday>): Promise<ApiResponse<Holiday>> {
    try {
      const { data, error } = await supabase
        .from('holidays')
        .update({
          title: updates.title,
          destination: updates.destination,
          start_date: updates.startDate,
          end_date: updates.endDate,
          budget: updates.budget,
          description: updates.description,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: mapHolidayData(data) };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update holiday',
      };
    }
  },

  async delete(id: string): Promise<ApiResponse<{ success: boolean }>> {
    try {
      const { error } = await supabase
        .from('holidays')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, data: { success: true } };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to delete holiday',
      };
    }
  },
};
