import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          preferences: Record<string, unknown> | null;
          created_at: string;
        };
      };
      holidays: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          start_date: string;
          end_date: string;
          budget: number | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      itineraries: {
        Row: {
          id: string;
          holiday_id: string;
          date: string;
          activity: string;
          location: string | null;
          start_time: string | null;
          end_time: string | null;
          notes: string | null;
          created_at: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          holiday_id: string;
          category: string;
          description: string | null;
          amount: number;
          currency: string;
          expense_date: string | null;
          created_at: string;
        };
      };
      accommodations: {
        Row: {
          id: string;
          holiday_id: string;
          name: string;
          address: string | null;
          check_in_date: string;
          check_out_date: string;
          confirmation_number: string | null;
          price: number | null;
          notes: string | null;
          created_at: string;
        };
      };
      travel_companions: {
        Row: {
          id: string;
          holiday_id: string;
          companion_email: string;
          companion_name: string | null;
          role: string;
          created_at: string;
        };
      };
    };
  };
};
