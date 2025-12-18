-- Fix property_id columns to be UUID type for proper foreign key relationships
-- Also add owner_id to properties table to track ownership

-- Add owner_id to properties table (for tracking which user owns each property)
ALTER TABLE properties
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster owner queries
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON properties(owner_id);

-- Fix contact_inquiries table
ALTER TABLE contact_inquiries
  ALTER COLUMN property_id TYPE UUID USING property_id::uuid;

ALTER TABLE contact_inquiries
  ADD CONSTRAINT fk_contact_property
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

-- Fix viewing_schedules table
ALTER TABLE viewing_schedules
  ALTER COLUMN property_id TYPE UUID USING property_id::uuid;

ALTER TABLE viewing_schedules
  ADD CONSTRAINT fk_viewing_property
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;

-- Fix favorites table (if it exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'favorites') THEN
    ALTER TABLE favorites
      ALTER COLUMN property_id TYPE UUID USING property_id::uuid;

    ALTER TABLE favorites
      ADD CONSTRAINT fk_favorite_property
      FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE;
  END IF;
END $$;
