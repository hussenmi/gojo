-- Clear all properties from the database
-- Run this in Supabase SQL Editor before re-seeding

DELETE FROM properties;

-- Verify it's empty
SELECT COUNT(*) as property_count FROM properties;
