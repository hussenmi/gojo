# Gojo - Ethiopian Real Estate Platform

A modern real estate platform for the Ethiopian market, built with Next.js and Supabase.

## About

Gojo (ጎጆ - meaning "traditional house" in Amharic) is a real estate listing platform designed specifically for the Ethiopian market. Similar to Zillow, it provides comprehensive property listings, search capabilities, and market insights tailored to Ethiopian real estate.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (planned)

## Features (Planned)

### Phase 1 (MVP)
- [ ] Property listings (buy/rent)
- [ ] Advanced search and filtering
- [ ] Property details pages
- [ ] Responsive design
- [ ] Amharic/English language support

### Phase 2
- [ ] User authentication
- [ ] Save favorite properties
- [ ] Agent/owner listings management
- [ ] Map integration
- [ ] Image galleries

### Phase 3
- [ ] Property comparison
- [ ] Market insights and analytics
- [ ] Mortgage calculator
- [ ] Contact forms and inquiries

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
gojo/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utility functions and configurations
├── public/          # Static assets (images, fonts, etc.)
├── supabase/        # Supabase schemas and migrations
└── types/           # TypeScript type definitions
```

## Environment Variables

Create a `.env.local` file with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines.

## License

MIT
