import type { Metadata } from 'next';
import { Navigation } from '@/components/nav/Navigation';
import './globals.css';

export const metadata: Metadata = {
  title: 'Holiday Planner',
  description: 'Plan your holidays with ease',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
      </body>
    </html>
  );
}
