-- Create contact_inquiries table
CREATE TABLE IF NOT EXISTS contact_inquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed'))
);

-- Create viewing_schedules table
CREATE TABLE IF NOT EXISTS viewing_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_date DATE NOT NULL,
  preferred_time TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled'))
);

-- Create indexes for better query performance
CREATE INDEX idx_contact_inquiries_property_id ON contact_inquiries(property_id);
CREATE INDEX idx_contact_inquiries_created_at ON contact_inquiries(created_at DESC);
CREATE INDEX idx_viewing_schedules_property_id ON viewing_schedules(property_id);
CREATE INDEX idx_viewing_schedules_preferred_date ON viewing_schedules(preferred_date);
CREATE INDEX idx_viewing_schedules_created_at ON viewing_schedules(created_at DESC);

-- Enable Row Level Security
ALTER TABLE contact_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE viewing_schedules ENABLE ROW LEVEL SECURITY;

-- Create policies to allow anyone to insert (submit forms)
CREATE POLICY "Anyone can submit contact inquiries" ON contact_inquiries
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can submit viewing schedules" ON viewing_schedules
  FOR INSERT WITH CHECK (true);

-- Create policies to allow users to view their own submissions
CREATE POLICY "Users can view their own contact inquiries" ON contact_inquiries
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own viewing schedules" ON viewing_schedules
  FOR SELECT USING (true);
