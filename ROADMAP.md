# Development Roadmap & Next Steps

## 🎯 Current Status: Phase 1 Complete ✅

All baseline features from `plan.md` and `technical.md` have been successfully implemented.

---

## 📋 Phase 2: Enhanced Features (Recommended Order)

### 1. Itinerary Management
**Priority**: HIGH | **Effort**: 4 hours

**What to implement:**
- [ ] Itinerary service (`src/lib/supabase/itinerary.service.ts`)
- [ ] Itinerary API routes
- [ ] Itinerary form component
- [ ] Itinerary list component
- [ ] Day-by-day view

**Reference file**: `src/lib/supabase/holiday.service.ts`

**Steps:**
1. Copy holiday.service.ts pattern
2. Create itinerary.service.ts with CRUD operations
3. Create API routes: `GET/POST /api/holidays/:id/itineraries`
4. Create ItenaryForm component
5. Add to holiday detail page

---

### 2. Expense Tracking
**Priority**: HIGH | **Effort**: 4 hours

**What to implement:**
- [ ] Expense service (`src/lib/supabase/expense.service.ts`)
- [ ] Expense API routes
- [ ] Expense form component
- [ ] Expense list with totals
- [ ] Budget remaining calculation

**Files to create:**
- `src/lib/supabase/expense.service.ts`
- `src/app/api/holidays/:id/expenses/route.ts`
- `src/components/forms/ExpenseForm.tsx`
- `src/components/cards/ExpenseCard.tsx`

**Features:**
- Category dropdown (flights, accommodation, food, activities, other)
- Currency selection
- Date picker
- Budget total display
- Spent/remaining calculation

---

### 3. Accommodation Management
**Priority**: MEDIUM | **Effort**: 3 hours

**What to implement:**
- [ ] Accommodation service
- [ ] Accommodation API routes
- [ ] Accommodation form
- [ ] Accommodation list with check-in/out dates

**Files to create:**
- `src/lib/supabase/accommodation.service.ts`
- `src/app/api/holidays/:id/accommodations/route.ts`
- `src/components/forms/AccommodationForm.tsx`
- `src/components/cards/AccommodationCard.tsx`

---

### 4. Travel Companions/Collaboration
**Priority**: MEDIUM | **Effort**: 5 hours

**What to implement:**
- [ ] Companion invite system
- [ ] Email invitation logic
- [ ] Permission levels (viewer, editor, owner)
- [ ] Companion list management

**New concepts:**
- Real-time sharing
- Permission checks in RLS
- Email notifications (future)

---

### 5. Packing List
**Priority**: LOW | **Effort**: 3 hours

**What to implement:**
- [ ] Packing list template
- [ ] Custom items
- [ ] Check off items
- [ ] Share with companions

---

## 🔧 How to Add New Features

### Template: Adding Itineraries

#### 1. Create Service File
Create `src/lib/supabase/itinerary.service.ts`:
```typescript
import { supabase } from './client';
import { Itinerary, ApiResponse } from '@/types';

export const itineraryService = {
  async getByHoliday(holidayId: string): Promise<ApiResponse<Itinerary[]>> {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .select('*')
        .eq('holiday_id', holidayId)
        .order('day_number', { ascending: true });

      if (error) throw error;
      return { success: true, data: data as Itinerary[] };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch itineraries',
      };
    }
  },

  async create(holidayId: string, itinerary: Omit<Itinerary, 'id' | 'createdAt'>): Promise<ApiResponse<Itinerary>> {
    try {
      const { data, error } = await supabase
        .from('itineraries')
        .insert({
          holiday_id: holidayId,
          day_number: itinerary.dayNumber,
          activity: itinerary.activity,
          location: itinerary.location,
          start_time: itinerary.startTime,
          end_time: itinerary.endTime,
          notes: itinerary.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data: data as Itinerary };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to create itinerary',
      };
    }
  },

  // Add update, delete, etc.
};
```

#### 2. Create API Route
Create `src/app/api/holidays/[holidayId]/itineraries/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { itineraryService } from '@/lib/supabase/itinerary.service';

export async function GET(
  request: NextRequest,
  { params }: { params: { holidayId: string } }
) {
  try {
    const result = await itineraryService.getByHoliday(params.holidayId);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { holidayId: string } }
) {
  try {
    const body = await request.json();
    const result = await itineraryService.create(params.holidayId, body);
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

#### 3. Create Component
Create `src/components/forms/ItineraryForm.tsx`:
```typescript
'use client';

import { useState } from 'react';
import { Itinerary } from '@/types';

interface ItineraryFormProps {
  onSubmit: (itinerary: Omit<Itinerary, 'id' | 'createdAt'>) => Promise<void>;
  dayNumber: number;
}

export const ItineraryForm = ({ onSubmit, dayNumber }: ItineraryFormProps) => {
  const [formData, setFormData] = useState({
    activity: '',
    location: '',
    startTime: '',
    endTime: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      dayNumber,
      activity: formData.activity,
      location: formData.location,
      startTime: formData.startTime,
      endTime: formData.endTime,
      notes: formData.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
    </form>
  );
};
```

---

## 🐛 Known Issues & Fixes

### Issue: "Reset Password" page doesn't exist
**Fix**: Create `src/app/auth/reset-password/page.tsx`

### Issue: Need dynamic holiday detail page
**Fix**: Create `src/app/holidays/[id]/page.tsx` to show:
- Holiday details
- Itineraries
- Expenses
- Accommodations

### Issue: Mobile navigation not optimized
**Fix**: Update Navigation.tsx with hamburger menu

---

## 🚀 Deployment Checklist

Before deploying to production:
- [ ] Test all CRUD operations locally
- [ ] Run full test suite: `npm test`
- [ ] Check for console errors
- [ ] Verify RLS policies are active in Supabase
- [ ] Update NEXT_PUBLIC_SUPABASE_URL for production
- [ ] Test auth flow (register → confirm → login)
- [ ] Test with real Supabase project
- [ ] Set up error tracking (Sentry)
- [ ] Configure Netlify environment variables
- [ ] Test production build locally: `npm run build && npm start`

---

## 📊 Testing Roadmap

### Current Test Coverage
- Helper functions: 4 tests
- API routes: Test stubs

### Add These Tests
- [ ] Auth forms (LoginForm, RegisterForm)
- [ ] API routes (full integration)
- [ ] Holiday CRUD operations
- [ ] Form validation
- [ ] Error handling
- [ ] Navigation component

### Run Tests
```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode for development
npm run test:coverage       # See coverage report
```

---

## 📝 Code Quality Improvements

### Current State
- ✅ TypeScript strict mode enabled
- ✅ Linting configured (ESLint ready)
- ✅ Error handling implemented
- ✅ Input validation in place

### Recommended Additions
- [ ] Add ESLint configuration
- [ ] Add Prettier for code formatting
- [ ] Add pre-commit hooks (husky)
- [ ] Add API documentation (OpenAPI/Swagger)
- [ ] Add performance monitoring
- [ ] Add error tracking (Sentry)

---

## 🔐 Security Enhancements

### Current
- ✅ RLS policies on all tables
- ✅ JWT authentication
- ✅ Password validation
- ✅ Email validation
- ✅ SQL injection prevention (Supabase client)

### Add These
- [ ] Rate limiting on auth endpoints
- [ ] CSRF protection
- [ ] XSS prevention validation
- [ ] API key rotation strategy
- [ ] Audit logging for sensitive operations
- [ ] 2FA (two-factor authentication)

---

## 🌍 Internationalization (i18n)

**Priority**: LOW | **Effort**: 2 days

- [ ] Add next-intl or i18next
- [ ] Create translation files
- [ ] Support multiple languages
- [ ] Date/currency localization

---

## 📱 Mobile App Version

**Priority**: FUTURE | **Effort**: 1-2 weeks

Consider React Native or Flutter:
- Reuse API backend
- Native mobile experience
- Offline sync capability

---

## 💡 Performance Optimizations

- [ ] Image optimization
- [ ] Code splitting
- [ ] Database query optimization
- [ ] Caching strategy (Redis)
- [ ] CDN for static assets
- [ ] API response caching

---

## 🔗 Resources & References

### Documentation Files
- [QUICKSTART.md](./QUICKSTART.md) - Quick setup
- [README.md](./README.md) - Project overview
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Deploy guide
- [technical.md](./technical.md) - Architecture

### External Resources
- [Supabase Guide](https://supabase.com/docs)
- [Next.js Tutorial](https://nextjs.org/learn)
- [TailwindCSS Guide](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Support

### If You Get Stuck
1. Check `troubleshoot.md` (auto-created for issues)
2. Review schema.sql for database structure
3. Check Supabase Dashboard for data
4. Look at existing service patterns
5. Read inline code comments

### Common Patterns

All services follow this pattern:
```typescript
export const service = {
  async operation(params): Promise<ApiResponse<T>> {
    try {
      // Implementation
      return { success: true, data };
    } catch (error) {
      return { success: false, error: message };
    }
  },
};
```

---

## ✅ Completion Checklist

Use this to track your progress:

**Phase 1** (COMPLETE ✅)
- [x] Setup & initialization
- [x] Database schema
- [x] Authentication
- [x] Holiday CRUD
- [x] Documentation

**Phase 2** (IN PROGRESS)
- [ ] Itineraries
- [ ] Expenses
- [ ] Accommodations
- [ ] Companions
- [ ] Packing lists

**Phase 3** (PLANNED)
- [ ] Real-time features
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Integrations

---

**Last Updated**: February 1, 2026
**Version**: 0.1.0
**Next Review**: After Phase 2
