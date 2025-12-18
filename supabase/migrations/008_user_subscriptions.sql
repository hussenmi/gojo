-- User Subscription Tiers System

-- Create user_profiles table to track subscription information
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'admin')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  subscription_started_at TIMESTAMP WITH TIME ZONE,
  subscription_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier ON user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(subscription_status);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (limited fields)
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- Anyone can insert their profile (for signup)
CREATE POLICY "Anyone can create profile on signup" ON user_profiles
  FOR INSERT WITH CHECK (true);

-- Function to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, subscription_tier, subscription_status)
  VALUES (
    NEW.id,
    NEW.email,
    'free',
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a view for admins to see user stats
CREATE OR REPLACE VIEW user_stats AS
SELECT
  up.id,
  up.email,
  up.subscription_tier,
  up.subscription_status,
  up.subscription_started_at,
  up.subscription_expires_at,
  up.created_at,
  COUNT(DISTINCT p.id) as total_properties,
  COUNT(DISTINCT CASE WHEN p.featured = true THEN p.id END) as featured_properties,
  COUNT(DISTINCT CASE WHEN p.status = 'active' THEN p.id END) as active_properties
FROM user_profiles up
LEFT JOIN properties p ON up.id = p.owner_id
GROUP BY up.id, up.email, up.subscription_tier, up.subscription_status,
         up.subscription_started_at, up.subscription_expires_at, up.created_at;
