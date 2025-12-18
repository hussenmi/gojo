-- Assign ownership to existing properties
-- This will assign all properties without an owner to a specific user

-- INSTRUCTIONS:
-- 1. Go to /admin/users in your app
-- 2. Find your user and copy the ID (shown as "ID: xxxxxxxx...")
-- 3. Replace 'YOUR_USER_ID_HERE' below with your actual user ID
-- 4. Run this migration

-- Update all properties without an owner_id
UPDATE properties
SET owner_id = '3c87af58-640b-45ad-a6ba-ff77abad5a76'
WHERE owner_id IS NULL;

-- You can verify with:
-- SELECT id, title, owner_id FROM properties;
