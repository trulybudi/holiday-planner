# Holiday Planner

A modern web application for planning holidays with friends and family. Manage itineraries, track expenses, organize accommodations, and collaborate with travel companions.

## Features

✨ **Core Features**
- 🔐 User authentication with Supabase Auth
- 🎯 Create and manage multiple holiday trips
- 📅 Build day-by-day itineraries
- 💰 Track expenses and budgets
- 🏨 Manage accommodations
- 🤝 Invite and collaborate with travel companions
- 📋 Create packing lists and checklists
- 📝 Add notes and reminders

## Tech Stack

- **Frontend**: Next.js 14 with React
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Testing**: Jest + React Testing Library
- **Deployment**: Netlify

## Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd holiday-planner
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials
```

4. Run the development server
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

1. Execute `schema.sql` in your Supabase project SQL editor
2. This creates all tables with RLS policies enabled

## Project Structure

```
src/
├── app/
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main dashboard
│   ├── holidays/          # Holiday management
│   ├── profile/           # User profile
│   └── api/               # API routes
├── components/
│   ├── forms/             # Form components
│   ├── cards/             # Card components
│   ├── nav/               # Navigation
│   └── common/            # Reusable components
├── lib/
│   ├── supabase/          # Supabase client & services
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
├── types/                 # TypeScript types
└── __tests__/             # Test files
```

## Available Scripts

```bash
# Development
npm run dev           # Start dev server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Linting
npm run lint         # Run ESLint
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user
- `POST /api/auth/login` - Login user

### Holidays
- `GET /api/holidays` - Get all user holidays
- `POST /api/holidays` - Create new holiday
- `GET /api/holidays/[id]` - Get holiday details
- `PUT /api/holidays/[id]` - Update holiday
- `DELETE /api/holidays/[id]` - Delete holiday

## Authentication Flow

1. User registers with email and password
2. Supabase Auth creates user account
3. User logs in with credentials
4. JWT token stored in session
5. Token used for API requests via RLS policies

## Security

- Row Level Security (RLS) enabled on all tables
- JWT-based authentication via Supabase
- Password validation (minimum 8 characters)
- Email validation
- CORS protection
- Sensitive environment variables in `.env.local`

## Testing

```bash
# Run all tests
npm test

# Run specific test file
npm test helpers.test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

Quick deployment to Netlify:
```bash
npm run build
netlify deploy --prod
```

## Troubleshooting

### Cannot connect to Supabase
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `.env.local`
- Ensure Supabase project is active

### Authentication errors
- Clear browser cookies
- Verify email is confirmed in Supabase Auth
- Check RLS policies in database

### Build errors
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `npm install`
- Check Node.js version (16+)

## Contributing

1. Create a feature branch
2. Commit changes
3. Push to repository
4. Create pull request

## License

MIT License - feel free to use for personal or commercial projects

## Support

For issues or questions:
1. Check [troubleshoot.md](./troubleshoot.md) (created during development)
2. Review Supabase documentation
3. Check Next.js documentation

## Roadmap

- [ ] Weather integration for destination
- [ ] Real-time collaboration
- [ ] Mobile app
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Budget analytics
- [ ] Travel document verification
