-- Migration: Add date column to itineraries table
-- This migration updates the itineraries table from using day_number to using date
-- Date created: February 1, 2026

-- Step 1: Add the new date column (nullable initially to avoid breaking existing records)
ALTER TABLE itineraries ADD COLUMN date DATE;

-- Step 2: Migrate data from day_number to date (if there's existing data)
-- This assumes day_number is relative to the holiday's start_date
UPDATE itineraries 
SET date = (
  SELECT start_date + MAKE_INTERVAL(days => itineraries.day_number - 1)
  FROM holidays 
  WHERE holidays.id = itineraries.holiday_id
)
WHERE date IS NULL;

-- Step 3: Make date NOT NULL after migration
ALTER TABLE itineraries ALTER COLUMN date SET NOT NULL;

-- Step 4: Create an index on the date column for better query performance
CREATE INDEX idx_itineraries_date ON itineraries(date);

-- Step 5: Create a composite index for querying by holiday and date
CREATE INDEX idx_itineraries_holiday_date ON itineraries(holiday_id, date);

-- Step 6: Drop the old day_number column (no longer needed)
ALTER TABLE itineraries DROP COLUMN day_number;

-- Rollback (if needed):
-- DELETE INDEX idx_itineraries_date;
-- DELETE INDEX idx_itineraries_holiday_date;
-- ALTER TABLE itineraries DROP COLUMN date;
-- ALTER TABLE itineraries ADD COLUMN day_number INT;
