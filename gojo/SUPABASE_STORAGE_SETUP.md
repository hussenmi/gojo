# Supabase Storage Setup for Image Uploads

Follow these steps to enable image uploads for property listings.

## Step 1: Create Storage Bucket

1. **Go to your Supabase Dashboard**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Navigate to Storage**
   - Click "Storage" in the left sidebar
   - Click "New bucket"

3. **Create the bucket**
   - **Name**: `properties`
   - **Public bucket**: ✅ CHECK THIS (makes images publicly accessible)
   - Click "Create bucket"

## Step 2: Set Up Storage Policies

1. **Click on the `properties` bucket** you just created

2. **Go to Policies tab** (if not already there)

3. **Add Upload Policy**:
   - Click "New Policy"
   - Select "For full customization, create a policy from scratch"
   - **Policy name**: `Allow authenticated users to upload`
   - **Allowed operation**: INSERT
   - **Policy definition**:
   ```sql
   (auth.role() = 'authenticated')
   ```
   - Click "Review" then "Save policy"

4. **Add Public Read Policy** (already exists for public buckets, but verify):
   - Should see a policy named something like "Give public access"
   - Allowed operation: SELECT
   - This allows anyone to view the images

## Step 3: Test the Setup

Once you've completed the above steps:

1. Go to your admin panel: http://localhost:3001/admin
2. Try adding a new property
3. Use the "Upload Images" button to upload a photo
4. It should upload successfully and show a preview

## Troubleshooting

### "Storage bucket not found" error
- Make sure the bucket name is exactly `properties` (lowercase)
- Verify you're in the correct Supabase project

### "403 Forbidden" or "Access Denied" errors
- Check that the bucket is marked as **Public**
- Verify the upload policy allows authenticated users
- Make sure you're logged into the admin panel

### Images not loading
- Check that the bucket is public
- Verify the URLs are correct (should start with your Supabase URL)
- Check browser console for CORS errors

## File Size Limits

- Current limit: 5MB per image
- To change: Edit `src/components/admin/ImageUpload.tsx:50`
- Supabase free tier: 1GB total storage

## Alternative: Keep Using URL Method

If you don't want to set up storage right now, you can continue using image URLs:
- Use the "add image URLs manually" textarea in the forms
- Paste URLs from Unsplash, Imgur, or any image hosting service
- One URL per line

The image upload feature is optional - URL input still works!
