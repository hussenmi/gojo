-- Property Analytics Tracking

-- Drop existing table if it has wrong type
DROP TABLE IF EXISTS property_views CASCADE;

-- Create property_views table to track page views
CREATE TABLE IF NOT EXISTS property_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Optional: track user session/IP for unique view counting
  session_id TEXT,
  user_agent TEXT,
  CONSTRAINT fk_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_property_views_property_id ON property_views(property_id);
CREATE INDEX IF NOT EXISTS idx_property_views_viewed_at ON property_views(viewed_at DESC);

-- Create a view for property analytics summary
CREATE OR REPLACE VIEW property_analytics AS
SELECT
  p.id,
  p.title,
  p.featured,
  p.status,
  -- View count
  COUNT(DISTINCT pv.id) as total_views,
  COUNT(DISTINCT CASE WHEN pv.viewed_at >= NOW() - INTERVAL '7 days' THEN pv.id END) as views_last_7_days,
  COUNT(DISTINCT CASE WHEN pv.viewed_at >= NOW() - INTERVAL '30 days' THEN pv.id END) as views_last_30_days,
  -- Inquiry count
  COUNT(DISTINCT ci.id) as total_inquiries,
  COUNT(DISTINCT CASE WHEN ci.created_at >= NOW() - INTERVAL '7 days' THEN ci.id END) as inquiries_last_7_days,
  -- Viewing request count
  COUNT(DISTINCT vs.id) as total_viewing_requests,
  COUNT(DISTINCT CASE WHEN vs.created_at >= NOW() - INTERVAL '7 days' THEN vs.id END) as viewing_requests_last_7_days,
  -- Favorite count
  COUNT(DISTINCT f.id) as total_favorites,
  -- Latest activity
  MAX(GREATEST(
    COALESCE(pv.viewed_at, p.created_at),
    COALESCE(ci.created_at, p.created_at),
    COALESCE(vs.created_at, p.created_at)
  )) as last_activity_at
FROM properties p
LEFT JOIN property_views pv ON p.id = pv.property_id
LEFT JOIN contact_inquiries ci ON p.id = ci.property_id
LEFT JOIN viewing_schedules vs ON p.id = vs.property_id
LEFT JOIN favorites f ON p.id = f.property_id
GROUP BY p.id, p.title, p.featured, p.status;

-- Enable Row Level Security
ALTER TABLE property_views ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can track property views" ON property_views;
DROP POLICY IF EXISTS "Anyone can read property views" ON property_views;

-- Policy to allow anyone to insert views (tracking)
CREATE POLICY "Anyone can track property views" ON property_views
  FOR INSERT WITH CHECK (true);

-- Policy to allow reading view data
CREATE POLICY "Anyone can read property views" ON property_views
  FOR SELECT USING (true);
