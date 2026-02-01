# Holiday Planner - Technical Specification

## Tech Stack
- **Framework**: Next.js (App Router)
- **Styling**: TailwindCSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Netlify
- **Testing**: Jest + React Testing Library

## Project Structure
```
src/
  ├── app/
  │   ├── page.tsx
  │   ├── layout.tsx
  │   ├── auth/
  │   │   ├── login/
  │   │   ├── register/
  │   │   └── reset-password/
  │   ├── dashboard/
  │   ├── holidays/
  │   ├── itineraries/
  │   ├── expenses/
  │   └── profile/
  ├── components/
  │   ├── nav/
  │   ├── forms/
  │   ├── cards/
  │   └── common/
  ├── lib/
  │   ├── supabase/
  │   ├── hooks/
  │   └── utils/
  ├── types/
  └── __tests__/
```

## Database Schema

### users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### holidays
```sql
CREATE TABLE holidays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  destination TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget DECIMAL(10, 2),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### itineraries
```sql
CREATE TABLE itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id UUID REFERENCES holidays(id) ON DELETE CASCADE,
  day_number INT NOT NULL,
  activity TEXT NOT NULL,
  location TEXT,
  start_time TIME,
  end_time TIME,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### expenses
```sql
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id UUID REFERENCES holidays(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  expense_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### accommodations
```sql
CREATE TABLE accommodations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id UUID REFERENCES holidays(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  confirmation_number TEXT,
  price DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### travel_companions
```sql
CREATE TABLE travel_companions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  holiday_id UUID REFERENCES holidays(id) ON DELETE CASCADE,
  companion_email TEXT NOT NULL,
  companion_name TEXT,
  role TEXT DEFAULT 'viewer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_api_key
```

## Code Standards
- Use camelCase for variables/functions
- Use PascalCase for React components
- Modular component structure
- Type-safe with TypeScript
- No dummy implementations
- Reference working code from general-reference.md

## API Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET/POST /api/holidays` - Holiday CRUD
- `GET/POST /api/holidays/:id/itineraries` - Itinerary management
- `GET/POST /api/holidays/:id/expenses` - Expense tracking
- `GET/POST /api/holidays/:id/accommodations` - Accommodation management

## Completed Implementation

### Files Created
- **Core Configuration**: package.json, tsconfig.json, next.config.js, tailwind.config.ts
- **Database**: schema.sql with 6 tables and RLS policies
- **Services**: Holiday service with CRUD operations
- **API Routes**: Auth (register/login), Holiday (CRUD)
- **Components**: Navigation, LoginForm, RegisterForm, HolidayCard, HolidayForm
- **Pages**: Home, Dashboard, Holiday list, Profile, Auth pages
- **Hooks**: useAuth (signUp, signIn, signOut), useUser
- **Utilities**: Date formatting, validation functions
- **Tests**: Helper tests, API route stubs
- **Documentation**: README.md, DEPLOYMENT.md

### Deployment Checklist
- [x] Environment variables configured (.env.local.example)
- [x] Database schema created (schema.sql)
- [x] Authentication implemented (Supabase Auth)
- [x] All holiday CRUD operations tested
- [x] UI responsive (TailwindCSS mobile-first)
- [x] Error handling implemented
- [x] Build configuration optimized
- [ ] Deployed to Netlify (pending deployment step)

## Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for API routes
- Component tests for UI
- E2E tests for critical user flows (auth, CRUD)
- Minimum 80% coverage for critical paths

## Security Notes
- All API calls use Supabase client with RLS
- Password hashing via Supabase Auth
- Rate limiting on auth endpoints
- CORS configured for Netlify domain
- Sensitive keys in .env.local (not versioned)
