-- Holiday Planner Database Schema
-- This file contains the SQL migrations for Supabase

-- Create users table (auto-created by Supabase Auth, we just enhance it)
-- The users table is managed by Supabase Auth

-- Create holidays table
CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create itineraries table
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id UUID NOT NULL REFERENCES holidays(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  activity TEXT NOT NULL,
  location TEXT,
  start_time TIME,
  end_time TIME,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id UUID NOT NULL REFERENCES holidays(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  expense_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create accommodations table
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id UUID NOT NULL REFERENCES holidays(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  confirmation_number TEXT,
  price DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create travel_companions table
CREATE TABLE travel_companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id UUID NOT NULL REFERENCES holidays(id) ON DELETE CASCADE,
  companion_email TEXT NOT NULL,
  companion_name TEXT,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_holidays_user_id ON holidays(user_id);
CREATE INDEX idx_itineraries_holiday_id ON itineraries(holiday_id);
CREATE INDEX idx_expenses_holiday_id ON expenses(holiday_id);
CREATE INDEX idx_accommodations_holiday_id ON accommodations(holiday_id);
CREATE INDEX idx_travel_companions_holiday_id ON travel_companions(holiday_id);

-- Enable Row Level Security (RLS)
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_companions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for holidays
CREATE POLICY "Users can view their own holidays" ON holidays
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create holidays" ON holidays
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own holidays" ON holidays
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own holidays" ON holidays
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for itineraries
CREATE POLICY "Users can view itineraries of their holidays" ON itineraries
  FOR SELECT USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create itineraries" ON itineraries
  FOR INSERT WITH CHECK (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update itineraries of their holidays" ON itineraries
  FOR UPDATE USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete itineraries of their holidays" ON itineraries
  FOR DELETE USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

-- Similar policies for expenses
CREATE POLICY "Users can view expenses of their holidays" ON expenses
  FOR SELECT USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create expenses" ON expenses
  FOR INSERT WITH CHECK (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update expenses of their holidays" ON expenses
  FOR UPDATE USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete expenses of their holidays" ON expenses
  FOR DELETE USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

-- Similar policies for accommodations
CREATE POLICY "Users can view accommodations of their holidays" ON accommodations
  FOR SELECT USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create accommodations" ON accommodations
  FOR INSERT WITH CHECK (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update accommodations of their holidays" ON accommodations
  FOR UPDATE USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete accommodations of their holidays" ON accommodations
  FOR DELETE USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

-- Similar policies for travel_companions
CREATE POLICY "Users can view travel companions of their holidays" ON travel_companions
  FOR SELECT USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can create travel companions" ON travel_companions
  FOR INSERT WITH CHECK (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can update travel companions of their holidays" ON travel_companions
  FOR UPDATE USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );

CREATE POLICY "Users can delete travel companions of their holidays" ON travel_companions
  FOR DELETE USING (
    holiday_id IN (SELECT id FROM holidays WHERE user_id = auth.uid())
  );
