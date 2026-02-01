# Deployment Instructions - Holiday Planner

## Prerequisites
- Node.js 16+ and npm/yarn installed
- Supabase account and project created
- Netlify account
- Git repository

## Environment Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd holiday-planner
npm install
```

### 2. Supabase Configuration
1. Create a project on [Supabase](https://supabase.com)
2. Go to Project Settings → API Keys
3. Copy your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy your `SUPABASE_SERVICE_ROLE_KEY`

### 3. Database Migration
1. Go to Supabase SQL Editor
2. Run the contents of `schema.sql` to create tables and policies
3. Enable Row Level Security (RLS) as specified in schema

### 4. Environment Variables
Create `.env.local` file:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_key (optional)
```

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser to http://localhost:3000
```

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Build for Production

```bash
# Build the project
npm run build

# Test production build locally
npm start
```

## Deployment to Netlify

### Option 1: Connect GitHub Repository
1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Add environment variables in Netlify dashboard
7. Deploy

### Option 2: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Authenticate
netlify login

# Deploy
netlify deploy --prod
```

## Post-Deployment

1. **Update Authentication URLs** in Supabase:
   - Go to Authentication → URL Configuration
   - Add your Netlify domain to Redirect URLs

2. **Test Core Features**:
   - User registration
   - User login
   - Create holiday
   - Update holiday
   - Delete holiday
   - View dashboard

3. **Monitor Performance**:
   - Check Netlify Analytics
   - Monitor Supabase usage
   - Check browser console for errors

## Troubleshooting

### CORS Issues
- Ensure Supabase URL is correctly set
- Verify Netlify domain is whitelisted in Supabase auth settings

### Database Connection Issues
- Check Supabase is running
- Verify environment variables are set
- Check RLS policies are enabled

### Build Failures
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Next.js version compatibility

## Rollback Plan

```bash
# If issues occur, rollback to previous version
git revert <commit-hash>
npm run build
netlify deploy --prod
```

## Monitoring & Maintenance

- Regular backups of Supabase data
- Monitor error logs in Netlify
- Keep dependencies updated
- Review RLS policies periodically
