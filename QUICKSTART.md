# Quick Start Guide - Holiday Planner

## 🚀 Getting Started (5 minutes)

### Step 1: Clone & Install
```bash
cd holiday-planner
npm install
```

### Step 2: Setup Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GROQ_API_KEY=your_groq_key (optional)
```

### Step 3: Setup Database
1. Go to your Supabase project
2. Open SQL Editor
3. Copy entire content of `schema.sql`
4. Paste and execute in Supabase

### Step 4: Run Locally
```bash
npm run dev
```

Open http://localhost:3000

### Step 5: Test the App
1. Click "Register" button
2. Create account with test email
3. Confirm email (check Supabase Auth)
4. Login
5. Create a holiday
6. View dashboard

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `schema.sql` | Database setup |
| `.env.local` | Environment variables |
| `src/app/page.tsx` | Home page |
| `src/app/dashboard/page.tsx` | Main dashboard |
| `src/lib/supabase/client.ts` | Supabase setup |
| `src/lib/supabase/holiday.service.ts` | Holiday CRUD logic |
| `src/components/forms/` | Form components |

---

## 🔧 Common Commands

```bash
# Development
npm run dev              # Start dev server

# Testing
npm test               # Run tests
npm run test:watch     # Watch mode

# Production
npm run build          # Build for production
npm start              # Run production server

# Deployment
npm run build          # Then deploy to Netlify
```

---

## 🐛 Troubleshooting

### Error: "Cannot find Supabase URL"
- Ensure `.env.local` exists with correct Supabase URL

### Error: "Tables don't exist"
- Run `schema.sql` in Supabase SQL Editor
- Wait 10 seconds for tables to be created

### Error: "Email not confirmed"
- Check Supabase Auth → Users
- Click email to confirm if needed

### Build fails
```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 🎯 What to Build Next

1. **Itineraries** - Add day-by-day activities
2. **Expenses** - Track spending
3. **Accommodations** - Manage bookings
4. **Companions** - Invite friends
5. **Weather** - Show forecast

Start with `src/lib/supabase/` - copy `holiday.service.ts` pattern

---

## 📱 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)

---

## ✅ Pre-Deployment Checklist

- [ ] `.env.local` configured
- [ ] Database schema running
- [ ] Can register/login
- [ ] Can create holiday
- [ ] Can view dashboard
- [ ] No console errors

Ready to deploy? See `DEPLOYMENT.md`

---

## 💡 Tips

1. **Testing emails**: Use format `test+1@example.com`, `test+2@example.com`
2. **Time travel**: Set future dates for testing
3. **Mobile test**: Chrome DevTools → Toggle Device Toolbar
4. **Database inspect**: Supabase Dashboard → Table Editor
5. **API test**: Postman or REST Client VS Code extension

---

## 🎓 Project Structure Explained

```
src/
├── app/          # Next.js pages & API routes
├── components/   # Reusable React components
├── lib/          # Utilities & services
│   ├── supabase/ # Database services
│   ├── hooks/    # Custom React hooks
│   └── utils/    # Helper functions
├── types/        # TypeScript type definitions
└── __tests__/    # Test files
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes
3. Test: `npm test`
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature/name`

---

**Last Updated**: February 1, 2026
**Version**: 0.1.0
