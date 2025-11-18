# Numinax

A modern web application for calculating BaZi (Eight Characters) Four Pillars of Destiny and determining Eight Constitution Medicine (ECM) types through traditional Chinese metaphysics. Ancient wisdom meets contemporary design.

## Features

- **Four Pillars Calculation**: Accurate BaZi calculation with solar time adjustments
- **ECM Type Determination**: Analyzes constitutional type based on elemental balance
- **Personalized Health Profile**: Comprehensive wellness recommendations based on your ECM constitution
- **PDF Report Generation**: Download your complete health profile with diet, lifestyle, and wellness advice
- **Timezone Detection**: Automatic geocoding and DST detection for precise calculations
- **User Authentication**: Secure login system powered by Supabase
- **Subscription Plans**: Flexible pricing with Free, Pro, Expert, and Lifetime options
- **Marketplace**: Premium reports, guides, and courses for advanced learning
- **Payment Processing**: Secure payments via Stripe
- **Modern UI**: Clean, flat design interface with shadcn/ui components

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS v4 with flat design
- **Authentication**: Supabase Auth
- **Payments**: Stripe for subscriptions and one-time purchases
- **PDF Generation**: jsPDF + jspdf-autotable for downloadable reports
- **Routing**: React Router v6
- **Icons**: Lucide React
- **BaZi Engine**: lunar-typescript (Chinese calendar calculations)
- **Geolocation**: @photostructure/tz-lookup (timezone detection)

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- A Supabase account (free tier works fine)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd bazi
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Follow the detailed instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
   - Create a `.env` file with your Supabase credentials

4. Set up Stripe (optional for payment features):
   - Follow the detailed instructions in [STRIPE_SETUP.md](./STRIPE_SETUP.md)
   - Add your Stripe publishable key to `.env`

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5174 in your browser

## Project Structure

```
bazi/
├── src/
│   ├── components/          # React components
│   │   ├── BaziForm.tsx     # Input form for birth data
│   │   ├── BaziResults.tsx  # Display BaZi results
│   │   ├── ECMResults.tsx   # ECM analysis display
│   │   ├── Navbar.tsx       # Navigation bar
│   │   └── ProtectedRoute.tsx # Route guard
│   ├── contexts/            # React contexts
│   │   └── AuthContext.tsx  # Authentication state
│   ├── core/                # Core calculation logic
│   │   └── bazi.ts          # BaZi calculation engine
│   ├── lib/                 # Utility libraries
│   │   ├── baziToEcm.ts     # BaZi to ECM transformation
│   │   ├── ecmType.ts       # ECM type determination
│   │   └── supabase.ts      # Supabase client
│   ├── pages/               # Page components
│   │   ├── Home.tsx         # Landing page
│   │   ├── Login.tsx        # Login page
│   │   ├── Signup.tsx       # Registration page
│   │   ├── Dashboard.tsx    # User dashboard
│   │   ├── Calculator.tsx   # Calculator page
│   │   ├── Pricing.tsx      # Subscription plans
│   │   ├── Marketplace.tsx  # Premium content store
│   │   └── Subscription.tsx # Subscription management
│   ├── App.tsx              # Main app with routing
│   ├── main.tsx             # Entry point
│   └── index.css            # Tailwind CSS imports
├── .env                     # Environment variables (not in git)
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## How It Works

### BaZi Calculation

1. User enters birth date, time, and location
2. System performs geocoding to determine exact coordinates
3. Detects timezone and DST status for the birth location
4. Converts to solar (true local) time
5. Calculates the Four Pillars using lunar calendar
6. Analyzes Heavenly Stems and Earthly Branches

### ECM Type Determination

1. Transforms BaZi chart to ECM format
2. Calculates root strength for each element:
   - Branch roots = 2 points
   - Stem roots = 1 point
3. Analyzes stability through:
   - Bilateral support (presence on both sides)
   - Over-demanding checks (excessive consumption)
   - Parent over-demanding checks
4. Selects most stable element (Fire excluded as constitutional base)
5. Determines polarity (Yin/Yang) through Yin index

## Authentication Flow

1. User signs up with email and password
2. Supabase sends verification email (configurable)
3. User logs in with credentials
4. Session is maintained via Supabase Auth
5. Protected routes require authentication
6. User can access calculator and dashboard

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

See setup guides:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Authentication setup
- [STRIPE_SETUP.md](./STRIPE_SETUP.md) - Payment processing setup

## Testing

The calculator includes quick-load test users for development:
- Jelani (1963-08-12, New York)
- Jani (1983-03-30, Panama)
- JC Colón (1976-08-18, New York)
- John M (1978-09-12, Caracas)
- Maria Torres (1959-11-28, Buenos Aires)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The project includes a `vercel.json` configuration file.

### Other Platforms

The app can be deployed to any static hosting service (Netlify, Cloudflare Pages, etc.). Make sure to:
1. Set environment variables
2. Configure build command: `npm run build`
3. Set output directory: `dist`

## Subscription Plans

- **Free**: 3 calculations/month, basic features
- **Pro** ($19.99/mo): Unlimited calculations, advanced reports, marketplace access
- **Expert** ($49.99/mo): Everything in Pro + API access, white-label reports
- **Lifetime** ($299): One-time payment for lifetime access to all features

## Marketplace

Premium content available for purchase:
- Comprehensive BaZi Reports
- Relationship Compatibility Analysis
- Business Timing Strategies
- BaZi Mastery Course
- ECM Constitution Diet Guides

## Future Enhancements

- [ ] Backend API for payment processing
- [ ] Store calculation history in Supabase database
- [ ] User profile management
- [ ] Password reset functionality
- [ ] Social authentication (Google, GitHub)
- [ ] Export results as PDF
- [ ] Client management system for practitioners
- [ ] Multiple language support
- [ ] Mobile app (React Native)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[Your License Here]

## Credits

Built with love using traditional Chinese metaphysical principles and modern web technologies.
