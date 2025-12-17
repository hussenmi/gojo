-- Create properties table
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,

  -- Basic information
  title TEXT NOT NULL,
  title_am TEXT,
  description TEXT NOT NULL,
  description_am TEXT,
  price NUMERIC NOT NULL,

  -- Property details
  property_type TEXT NOT NULL CHECK (property_type IN ('house', 'apartment', 'commercial', 'land')),
  listing_type TEXT NOT NULL CHECK (listing_type IN ('sale', 'rent')),
  bedrooms INTEGER,
  bathrooms INTEGER,
  area_sqm NUMERIC,

  -- Location
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  region TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,

  -- Media and status
  images TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'pending', 'sold', 'rented'))
);

-- Create indexes for better query performance
CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_region ON properties(region);
CREATE INDEX idx_properties_property_type ON properties(property_type);
CREATE INDEX idx_properties_listing_type ON properties(listing_type);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_featured ON properties(featured);
CREATE INDEX idx_properties_price ON properties(price);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to active properties
CREATE POLICY "Allow public read access to active properties"
  ON properties FOR SELECT
  USING (status = 'active');

-- Create policy to allow all access for authenticated users (for now)
-- You can make this more restrictive later
CREATE POLICY "Allow all access for authenticated users"
  ON properties FOR ALL
  USING (auth.role() = 'authenticated');
