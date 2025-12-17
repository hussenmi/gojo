# Supabase Setup

This directory contains database migrations and configurations for the Gojo platform.

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be provisioned

### 2. Get Your Credentials

1. Go to Project Settings > API
2. Copy your Project URL and anon/public key
3. Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

### 3. Run Migrations

You can run migrations in two ways:

#### Option 1: Using Supabase Dashboard (Recommended for first setup)

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the contents of `migrations/001_initial_schema.sql`
4. Paste and run it in the SQL Editor

#### Option 2: Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Run migrations
supabase db push
```

## Database Schema

### Properties Table

The main table storing property listings with the following fields:

- Basic info: title (English/Amharic), description (English/Amharic), price
- Property details: type, bedrooms, bathrooms, area
- Location: address, city, region, coordinates
- Media: images array
- Status: active, pending, sold, rented

### Indexes

Created on commonly queried fields for optimal performance:
- city, region, property_type, listing_type, status, featured, price

### Row Level Security (RLS)

- Public users can read active properties
- Authenticated users have full access (customize as needed)

## Next Steps

After running the migration:

1. Test the connection by visiting your Next.js app
2. Add sample data using the Supabase dashboard
3. Customize RLS policies based on your requirements
