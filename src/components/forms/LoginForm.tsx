'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { validateEmail, validatePassword } from '@/lib/utils/helpers';

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { signIn, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Invalid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters');
      return;
    }

    const result = await signIn(email, password);
    if (result.success) {
      setSuccess(true);
      setEmail('');
      setPassword('');
      // Redirect to dashboard after successful login
      setTimeout(() => {
        router.push('/dashboard');
      }, 500);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Login</h2>

      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {success && <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">Login successful!</div>}

      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
          required
        />
      </div>

      <div className="mb-6">
        <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="••••••••"
          required
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{' '}
        <a href="/auth/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </p>
    </form>
  );
};
