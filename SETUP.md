# Gojo Setup Guide

Welcome! Your Gojo real estate platform is now initialized. Follow these steps to get it fully running.

## Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your application.

### 2. Set Up Supabase (Required for database)

#### Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Fill in:
   - Project name: `gojo`
   - Database password: (choose a strong password)
   - Region: Choose closest to Americas
5. Wait for project to be created (2-3 minutes)

#### Get Your API Keys
1. In your Supabase project, go to Settings > API
2. Copy the following values:
   - Project URL
   - `anon` `public` key

#### Configure Environment Variables
1. Create `.env.local` in the project root:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Run Database Migration
1. In Supabase Dashboard, go to SQL Editor
2. Open `supabase/migrations/001_initial_schema.sql` from this project
3. Copy all the SQL code
4. Paste it in the SQL Editor and click "Run"
5. You should see "Success. No rows returned"

See `supabase/README.md` for more detailed instructions.

### 3. Add Your Logo (Optional but recommended)

1. Copy your logo PNG file to `public/images/logo.png`
2. Open `src/components/ui/Logo.tsx`
3. Change line 9: `const hasLogo = false;` to `const hasLogo = true;`
4. Restart the dev server

See `public/images/LOGO_SETUP.md` for detailed instructions.

## What's Been Set Up

### Project Structure
```
gojo/
├── src/
│   ├── app/              # Next.js pages (App Router)
│   │   ├── layout.tsx    # Root layout with Header & Footer
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/
│   │   ├── layout/       # Header, Footer
│   │   ├── ui/           # Logo, reusable UI components
│   │   └── features/     # Feature-specific components
│   ├── lib/
│   │   └── supabase.ts   # Supabase client
│   └── types/
│       ├── database.ts   # Database type definitions
│       └── property.ts   # Property type definitions
├── supabase/
│   ├── migrations/       # Database migrations
│   └── README.md         # Supabase setup guide
├── public/
│   └── images/           # Static images, logo
└── docs/                 # Documentation
```

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Ready for Vercel

### Features Implemented
- ✅ Responsive layout with Header & Footer
- ✅ Landing page with hero section
- ✅ Supabase integration setup
- ✅ TypeScript configuration
- ✅ Database schema for properties
- ✅ Logo component (ready for your logo)

## Next Steps

### Phase 1: Property Listings Page
1. Create `/properties` page
2. Fetch properties from Supabase
3. Display property cards
4. Add search and filter functionality

### Phase 2: Property Details
1. Create `/properties/[id]` page
2. Display full property details
3. Image gallery
4. Contact form

### Phase 3: Add More Features
- User authentication
- Favorite properties
- Admin dashboard for managing listings
- Map integration

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify your `.env.local` file has correct Supabase credentials
3. Ensure all dependencies are installed (`npm install`)
4. Check that the Supabase migration ran successfully

## Ready to Code?

Start the development server and begin building:

```bash
npm run dev
```

Then open your browser to [http://localhost:3000](http://localhost:3000)
