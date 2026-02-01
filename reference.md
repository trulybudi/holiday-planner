# Code Reference - Holiday Planner

**Last Updated**: February 1, 2026  
**Version**: 0.1.0

Complete code snippets and patterns used throughout the Holiday Planner project.

---

## Table of Contents
1. [Authentication](#authentication)
2. [Supabase Integration](#supabase-integration)
3. [CRUD Operations](#crud-operations)
4. [React Components](#react-components)
5. [TypeScript Types](#typescript-types)
6. [Testing Patterns](#testing-patterns)
7. [API Routes](#api-routes)
8. [Environment Setup](#environment-setup)

---

## Authentication

### Login Form Component

**File**: `src/components/forms/LoginForm.tsx`

```typescript
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Signing in...' : 'Sign In'}
      </button>
    </form>
  );
}
```

### Register Form Component

**File**: `src/components/forms/RegisterForm.tsx`

```typescript
'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Show confirmation message
      alert('Check your email to confirm your account');
      router.push('/auth/login');
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* Similar to LoginForm with additional confirmPassword field */}
    </form>
  );
}
```

---

## Supabase Integration

### Supabase Client Setup

**File**: `src/lib/supabase/client.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          preferences: Record<string, unknown> | null;
          created_at: string;
        };
      };
      holidays: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          start_date: string;
          end_date: string;
          budget: number | null;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
```

### Custom Hook: useAuth

**File**: `src/lib/hooks/useAuth.ts`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    getSession();

    // Subscribe to auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription?.unsubscribe();
  }, []);

  return { user, loading };
}
```

---

## CRUD Operations

### Holiday Service

**File**: `src/lib/supabase/holiday.service.ts`

```typescript
import { supabase } from './client';

export interface Holiday {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateHolidayInput {
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget?: number;
  description?: string;
}

// Create a new holiday
export async function createHoliday(
  userId: string,
  data: CreateHolidayInput
): Promise<Holiday> {
  const { data: holiday, error } = await supabase
    .from('holidays')
    .insert([
      {
        user_id: userId,
        ...data,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return holiday;
}

// Read all holidays for a user
export async function getUserHolidays(userId: string): Promise<Holiday[]> {
  const { data, error } = await supabase
    .from('holidays')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Read a single holiday
export async function getHolidayById(id: string): Promise<Holiday> {
  const { data, error } = await supabase
    .from('holidays')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Update a holiday
export async function updateHoliday(
  id: string,
  updates: Partial<CreateHolidayInput>
): Promise<Holiday> {
  const { data, error } = await supabase
    .from('holidays')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete a holiday
export async function deleteHoliday(id: string): Promise<void> {
  const { error } = await supabase.from('holidays').delete().eq('id', id);

  if (error) throw error;
}
```

---

## React Components

### Holiday Card Component

**File**: `src/components/cards/HolidayCard.tsx`

```typescript
'use client';

import Link from 'next/link';
import type { Holiday } from '@/lib/supabase/holiday.service';

interface HolidayCardProps {
  holiday: Holiday;
}

export default function HolidayCard({ holiday }: HolidayCardProps) {
  const startDate = new Date(holiday.start_date).toLocaleDateString();
  const endDate = new Date(holiday.end_date).toLocaleDateString();
  const days = Math.ceil(
    (new Date(holiday.end_date).getTime() -
      new Date(holiday.start_date).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-6">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-gray-900">{holiday.title}</h3>
        <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {days} days
        </span>
      </div>

      <p className="text-gray-600 mb-2">📍 {holiday.destination}</p>

      <p className="text-sm text-gray-500 mb-4">
        {startDate} - {endDate}
      </p>

      {holiday.description && (
        <p className="text-gray-700 text-sm mb-4">{holiday.description}</p>
      )}

      {holiday.budget && (
        <p className="text-sm font-semibold text-green-600 mb-4">
          Budget: ${holiday.budget.toFixed(2)}
        </p>
      )}

      <Link
        href={`/holidays/${holiday.id}`}
        className="text-blue-600 hover:text-blue-800 font-semibold"
      >
        View Details →
      </Link>
    </div>
  );
}
```

### Holiday Form Component

**File**: `src/components/forms/HolidayForm.tsx`

```typescript
'use client';

import { useState, FormEvent } from 'react';
import type { CreateHolidayInput } from '@/lib/supabase/holiday.service';

interface HolidayFormProps {
  onSubmit: (data: CreateHolidayInput) => Promise<void>;
  initialValues?: CreateHolidayInput;
  loading?: boolean;
}

export default function HolidayForm({
  onSubmit,
  initialValues,
  loading = false,
}: HolidayFormProps) {
  const [formData, setFormData] = useState<CreateHolidayInput>(
    initialValues || {
      title: '',
      destination: '',
      start_date: '',
      end_date: '',
    }
  );
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Holiday Title
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Destination
          </label>
          <input
            type="text"
            value={formData.destination}
            onChange={(e) =>
              setFormData({ ...formData, destination: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Start Date
          </label>
          <input
            type="date"
            value={formData.start_date}
            onChange={(e) =>
              setFormData({ ...formData, start_date: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            End Date
          </label>
          <input
            type="date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Budget (Optional)
          </label>
          <input
            type="number"
            value={formData.budget || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                budget: e.target.value ? parseFloat(e.target.value) : undefined,
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description (Optional)
        </label>
        <textarea
          value={formData.description || ''}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Create Holiday'}
      </button>
    </form>
  );
}
```

---

## TypeScript Types

### Core Types

**File**: `src/types/index.ts`

```typescript
export interface User {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  preferences: Record<string, unknown> | null;
  created_at: string;
}

export interface Holiday {
  id: string;
  user_id: string;
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  id: string;
  holiday_id: string;
  day_number: number;
  activity: string;
  location: string | null;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  created_at: string;
}

export interface Expense {
  id: string;
  holiday_id: string;
  category: string;
  description: string | null;
  amount: number;
  currency: string;
  expense_date: string | null;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

## Testing Patterns

### Jest Test Template

**File**: `src/__tests__/helpers.test.ts`

```typescript
import { describe, it, expect } from '@jest/globals';

describe('Helper Functions', () => {
  it('should calculate days between dates correctly', () => {
    const startDate = new Date('2026-06-01');
    const endDate = new Date('2026-06-15');
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    expect(days).toBe(14);
  });

  it('should format currency correctly', () => {
    const amount = 1234.56;
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
    expect(formatted).toBe('$1,234.56');
  });
});
```

### React Component Test Template

```typescript
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from '@jest/globals';
import HolidayCard from '@/components/cards/HolidayCard';

describe('HolidayCard', () => {
  const mockHoliday = {
    id: '1',
    user_id: '1',
    title: 'Summer Vacation',
    destination: 'Paris',
    start_date: '2026-06-01',
    end_date: '2026-06-15',
    budget: 5000,
    description: 'A wonderful trip to Paris',
    created_at: '2026-01-01',
    updated_at: '2026-01-01',
  };

  it('renders holiday information', () => {
    render(<HolidayCard holiday={mockHoliday} />);
    expect(screen.getByText('Summer Vacation')).toBeInTheDocument();
    expect(screen.getByText(/Paris/)).toBeInTheDocument();
  });

  it('displays budget correctly', () => {
    render(<HolidayCard holiday={mockHoliday} />);
    expect(screen.getByText(/5000/)).toBeInTheDocument();
  });
});
```

---

## API Routes

### Holiday API Route

**File**: `src/app/api/holidays/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(request: NextRequest) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: holidays, error } = await supabase
      .from('holidays')
      .select('*')
      .eq('user_id', session.user.id)
      .order('start_date', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: holidays });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch holidays' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();

    const { data: holiday, error } = await supabase
      .from('holidays')
      .insert([
        {
          user_id: session.user.id,
          ...body,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ data: holiday }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create holiday' },
      { status: 500 }
    );
  }
}
```

---

## Environment Setup

### .env.local Template

**File**: `.env.local.example`

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: AI Features
GROQ_API_KEY=your_groq_api_key_here
```

### TypeScript Configuration

**File**: `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "resolveJsonModule": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.app.json" }]
}
```

---

## Quick Reference: Common Patterns

### Pattern 1: Server Component with Data Fetching

```typescript
// src/app/dashboard/page.tsx
import { supabase } from '@/lib/supabase/client';

export default async function Dashboard() {
  const { data } = await supabase.auth.getSession();

  if (!data.session) {
    redirect('/auth/login');
  }

  const holidays = await getHolidays(data.session.user.id);

  return (
    <div className="dashboard">
      {/* JSX */}
    </div>
  );
}
```

### Pattern 2: Client Component with Form

```typescript
// 'use client' directive at the top
// useState and event handlers
// Form submission with error handling
// Loading states
```

### Pattern 3: Error Handling

```typescript
try {
  // Operation
} catch (error) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  setError(message);
  // Show user-friendly message
}
```

---

## Related Files

- [troubleshoot.md](troubleshoot.md) - Troubleshooting guide
- [technical.md](technical.md) - Technical architecture
- [plan.md](plan.md) - Project plan
- [QUICKSTART.md](QUICKSTART.md) - Getting started
- [schema.sql](schema.sql) - Database schema

---

**Last Updated**: February 1, 2026  
**Project Version**: 0.1.0
