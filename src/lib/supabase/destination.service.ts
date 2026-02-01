import { createClient } from '@supabase/supabase-js';
import { ApiResponse } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey || supabaseAnonKey!
);

export interface Destination {
  id: string;
  name: string;
  description?: string;
  country?: string;
  createdAt: string;
  updatedAt: string;
}

export const destinationService = {
  async getAll(): Promise<ApiResponse<Destination[]>> {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      const destinations = (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        country: d.country,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));

      return { success: true, data: destinations };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
