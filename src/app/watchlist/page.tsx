'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { SignalBadge } from '@/components/advisor/SignalBadge';
import { Disclaimer } from '@/components/advisor/Disclaimer';
import { dayChange } from '@/components/advisor/AdviceCard';
import { useAdvice } from '@/lib/api';
import { cn, formatCurrency, getChangeBgColor, formatPercent } from '@/lib/utils';
import { useWatchlistStore } from '@/store/watchlist';
import { X } from 'lucide-react';

export default function WatchlistPage() {
  const { tickers, remove } = useWatchlistStore();
  const items = useAdvice(tickers);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground-emphasis">Watchlist</h1>
        <p className="text-sm text-gray-500 mt-1">Saved in this browser. Add tickers with the star on any Analyze page.</p>
      </div>

      <Card className="p-2 sm:p-4">
        {items.length === 0 ? (
          <p className="p-4 text-sm text-gray-400">Your watchlist is empty. Search for a ticker above to get started.</p>
        ) : (
          <div className="flex flex-col">
            {items.map(({ ticker, history, analysis, isLoading }) => (
              <div key={ticker} className="flex items-center gap-3 py-3 px-2 hover:bg-white/[0.02] rounded-lg transition-colors">
                <Link href={`/stock/${ticker}`} className="flex flex-1 items-center justify-between gap-3 min-w-0">
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-foreground-emphasis">{ticker}</span>
                    <span className="text-xs text-gray-500 truncate">{history?.name ?? (isLoading ? 'Loading…' : 'Unavailable')}</span>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-5 w-40" />
                  ) : history && analysis ? (
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-foreground-default hidden sm:inline">{formatCurrency(analysis.price)}</span>
                      <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', getChangeBgColor(dayChange(history.bars).changePercent))}>
                        {formatPercent(dayChange(history.bars).changePercent)}
                      </span>
                      <SignalBadge signal={analysis.signal} />
                    </div>
                  ) : null}
                </Link>
                <button onClick={() => remove(ticker)} className="icon-button" aria-label={`Remove ${ticker}`}>
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Disclaimer />
    </div>
  );
}
