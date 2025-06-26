import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { QueryProvider } from '@/providers/query-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SIN Manpower - Leading Job Placement Agency',
  description: 'Connect with top employers worldwide. Expert job placement services across multiple industries and countries.',
  keywords: 'job placement, recruitment, career opportunities, international jobs, manpower agency',
  openGraph: {
    title: 'SIN Manpower - Leading Job Placement Agency',
    description: 'Connect with top employers worldwide. Expert job placement services across multiple industries and countries.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <QueryProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}