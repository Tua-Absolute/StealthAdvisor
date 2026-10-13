'use client';

import { SearchBar } from '@/components/ui/SearchBar';
import { useThemeStore } from '@/store/theme';
import { Sun, Moon, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export function Header() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-red-500/20 bg-surface/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <ShieldCheck className="h-6 w-6 text-red-500" />
            <span className="text-lg font-semibold text-foreground-emphasis hidden sm:block">
              Stealth<span className="text-red-500">Advisor</span>
            </span>
          </Link>

          <SearchBar />

          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="icon-button" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
