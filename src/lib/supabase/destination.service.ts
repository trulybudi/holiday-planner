import { createClient } from '@supabase/supabase-js';
import { ApiResponse } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(
  supabaseUrl!,
  supabaseServiceKey || supabaseAnonKey!
);

interface Destination {
  id: string;
  name: string;
  description?: string;
  country?: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export const destinationService = {
  async getAll(userId: string): Promise<ApiResponse<Destination[]>> {
    try {
      const { data, error } = await supabase
        .from('destinations')
        .select('*')
        .eq('user_id', userId)
        .order('usage_count', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        return { success: false, error: error.message };
      }

      const destinations = (data || []).map((d: any) => ({
        id: d.id,
        name: d.name,
        description: d.description,
        country: d.country,
        usageCount: d.usage_count,
        createdAt: d.created_at,
        updatedAt: d.updated_at,
      }));

      return { success: true, data: destinations };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },

  async findOrCreate(userId: string, name: string): Promise<ApiResponse<Destination>> {
    try {
      // Try to find existing destination
      const { data: existing, error: selectError } = await supabase
        .from('destinations')
        .select('*')
        .eq('user_id', userId)
        .eq('name', name)
        .single();

      if (existing) {
        // Update usage count
        const newCount = (existing.usage_count || 0) + 1;
        await supabase
          .from('destinations')
          .update({ usage_count: newCount, updated_at: new Date().toISOString() })
          .eq('id', existing.id);

        return {
          success: true,
          data: {
            id: existing.id,
            name: existing.name,
            description: existing.description,
            country: existing.country,
            usageCount: newCount,
            createdAt: existing.created_at,
            updatedAt: new Date().toISOString(),
          },
        };
      }

      // Create new destination if not found
      const { data: newDest, error: insertError } = await supabase
        .from('destinations')
        .insert({
          user_id: userId,
          name,
          usage_count: 1,
        })
        .select()
        .single();

      if (insertError) {
        return { success: false, error: insertError.message };
      }

      return {
        success: true,
        data: {
          id: newDest.id,
          name: newDest.name,
          description: newDest.description,
          country: newDest.country,
          usageCount: newDest.usage_count,
          createdAt: newDest.created_at,
          updatedAt: newDest.updated_at,
        },
      };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
    }
  },
};
