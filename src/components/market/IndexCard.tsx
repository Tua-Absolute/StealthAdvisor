'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { dayChange } from '@/components/advisor/AdviceCard';
import { formatCurrency, formatPercent, getChangeColor } from '@/lib/utils';
import type { History } from '@/lib/data/types';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function IndexCard({ label, history, isLoading }: { label: string; history?: History; isLoading: boolean }) {
  if (isLoading || !history) {
    return (
      <Card className="flex flex-col gap-3 min-w-[200px]">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-10 w-full" />
      </Card>
    );
  }

  const { change, changePercent } = dayChange(history.bars);
  const isPositive = changePercent >= 0;
  const sparkline = history.bars.slice(-30).map((b) => b.close);
  const min = Math.min(...sparkline);
  const max = Math.max(...sparkline);
  const range = max - min || 1;

  return (
    <Link href={`/stock/${history.ticker}`}>
      <Card className="flex flex-col gap-3 hover:bg-white/[0.02] transition-colors cursor-pointer min-w-[200px]">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400 font-medium">{label}</span>
          {isPositive ? (
            <TrendingUp className="h-4 w-4 text-emerald-400" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-400" />
          )}
        </div>

        <div>
          <div className="text-xl font-semibold text-foreground-emphasis">{formatCurrency(history.bars.at(-1)!.close)}</div>
          <div className={`text-sm font-medium ${getChangeColor(changePercent)}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({formatPercent(changePercent)})
          </div>
        </div>

        <div className="h-10 w-full">
          <svg viewBox={`0 0 ${sparkline.length - 1} 40`} className="w-full h-full" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={isPositive ? '#34d399' : '#f87171'}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              points={sparkline.map((v, i) => `${i},${40 - ((v - min) / range) * 36 - 2}`).join(' ')}
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
