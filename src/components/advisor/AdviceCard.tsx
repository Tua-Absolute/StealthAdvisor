'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SignalBadge } from './SignalBadge';
import type { AdvisedTicker } from '@/lib/api';
import { formatCurrency, formatPercent, getChangeColor } from '@/lib/utils';

export function dayChange(bars: { close: number }[]) {
  if (bars.length < 2) return { change: 0, changePercent: 0 };
  const last = bars[bars.length - 1].close;
  const prev = bars[bars.length - 2].close;
  return { change: last - prev, changePercent: ((last - prev) / prev) * 100 };
}

export function AdviceCard({ item }: { item: AdvisedTicker }) {
  const { ticker, history, analysis, isLoading } = item;

  if (isLoading) {
    return (
      <Card className="flex flex-col gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-12 w-full" />
      </Card>
    );
  }

  if (!history || !analysis) {
    return (
      <Card className="flex flex-col gap-2">
        <span className="text-sm font-medium text-foreground-emphasis">{ticker}</span>
        <span className="text-sm text-gray-400">Data unavailable right now.</span>
      </Card>
    );
  }

  const { changePercent } = dayChange(history.bars);
  const top = [...analysis.rules].sort((a, b) => Math.abs(b.score) - Math.abs(a.score))[0];

  return (
    <Link href={`/stock/${ticker}`}>
      <Card className="flex flex-col gap-3 h-full hover:bg-white/[0.02] transition-colors">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="text-base font-semibold text-foreground-emphasis">{ticker}</div>
            <div className="text-xs text-gray-500 truncate">{history.name}</div>
          </div>
          <SignalBadge signal={analysis.signal} />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-semibold text-foreground-emphasis">{formatCurrency(analysis.price)}</span>
          <span className={`text-sm font-medium ${getChangeColor(changePercent)}`}>{formatPercent(changePercent)}</span>
        </div>
        <p className="text-sm text-foreground-default leading-relaxed">{top.statement}</p>
      </Card>
    </Link>
  );
}
