-- Create storage bucket for property images

-- Insert bucket configuration
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to upload images (you can restrict this later)
CREATE POLICY "Anyone can upload property images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'property-images');

-- Allow anyone to view property images
CREATE POLICY "Anyone can view property images"
ON storage.objects FOR SELECT
USING (bucket_id = 'property-images');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Users can delete their own property images"
ON storage.objects FOR DELETE
USING (bucket_id = 'property-images' AND auth.uid() = owner);
