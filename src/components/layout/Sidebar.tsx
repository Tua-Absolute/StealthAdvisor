'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, LineChart, Eye, UserCheck, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/store/profile';
import { PROFILE_LABELS } from '@/lib/advisor/profile';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/stock/AAPL', match: '/stock', label: 'Analyze', icon: LineChart },
  { href: '/watchlist', label: 'Watchlist', icon: Eye },
  { href: '/profile', label: 'Risk Profile', short: 'Profile', icon: UserCheck },
  { href: '/about', label: 'About', icon: Info },
];

function useIsActive() {
  const pathname = usePathname();
  return (item: (typeof navItems)[number]) => {
    const base = item.match ?? item.href;
    return pathname === base || (base !== '/' && pathname.startsWith(base));
  };
}

export function Sidebar() {
  const isActive = useIsActive();
  const profile = useProfileStore((s) => s.profile);

  return (
    <aside className="hidden lg:flex flex-col justify-between w-60 border-r border-border-default bg-surface min-h-[calc(100vh-64px)] p-4">
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              isActive(item)
                ? 'bg-red-500/10 text-red-400'
                : 'text-gray-400 hover:bg-white/5 hover:text-foreground-emphasis'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
      <Link
        href="/profile"
        className="rounded-xl border border-border-default bg-surface-container px-3 py-3 text-xs text-gray-400 hover:text-foreground-emphasis transition-colors"
      >
        Advice tuned for a
        <span className="block text-sm font-medium text-foreground-emphasis">{PROFILE_LABELS[profile]} investor</span>
      </Link>
    </aside>
  );
}

export function MobileNav() {
  const isActive = useIsActive();
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border-default bg-surface/90 backdrop-blur-xl">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 py-2.5 px-2 text-[11px] font-medium',
              isActive(item) ? 'text-red-400' : 'text-gray-400'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.short ?? item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
