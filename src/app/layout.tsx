import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Header } from '@/components/layout/Header';
import { Sidebar, MobileNav } from '@/components/layout/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StealthAdvisor — Robo Advisor Demo',
  description: 'Rule-based stock analysis and plain-English advisory statements, tuned to your risk profile.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1">
              <Sidebar />
              <main className="flex-1 min-w-0 overflow-y-auto pb-20 lg:pb-0">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
                  {children}
                </div>
              </main>
            </div>
            <MobileNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
