# Cab Booking App

A modern cab booking platform built with Next.js, featuring real-time tracking, secure payments, and excellent user experience.

## Features

- User authentication (rider and driver roles)
- Real-time ride booking and tracking
- Secure payment processing with Stripe
- Interactive maps with Mapbox
- Dashboard for riders and drivers
- Responsive design with Tailwind CSS

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, Supabase
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Payments:** Stripe
- **Maps:** Mapbox GL JS
- **State Management:** Zustand
- **Forms:** React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Mapbox account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── driver/            # Driver dashboard
│   ├── rider/             # Rider dashboard
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/                # UI components
│   ├── maps/              # Map components
│   ├── rides/             # Ride-related components
│   └── dashboard/         # Dashboard components
├── lib/                   # Utility libraries
│   ├── supabase/          # Supabase client
│   └── stripe/            # Stripe client
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
├── schemas/               # Zod validation schemas
├── services/              # API services
└── types/                 # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.