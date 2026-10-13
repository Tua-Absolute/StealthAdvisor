'use client';

import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { PriceChart } from '@/components/advisor/PriceChart';
import { RuleCard } from '@/components/advisor/RuleCard';
import { SignalBadge } from '@/components/advisor/SignalBadge';
import { SourceBadge } from '@/components/advisor/SourceBadge';
import { Disclaimer } from '@/components/advisor/Disclaimer';
import { dayChange } from '@/components/advisor/AdviceCard';
import { useAdvice } from '@/lib/api';
import { PROFILE_LABELS } from '@/lib/advisor/profile';
import { cn, formatCurrency, formatPercent, getChangeColor } from '@/lib/utils';
import { useProfileStore } from '@/store/profile';
import { useWatchlistStore } from '@/store/watchlist';
import { Star, MessageSquareText } from 'lucide-react';
import Link from 'next/link';

export default function AnalyzePage({ params }: { params: { ticker: string } }) {
  const ticker = decodeURIComponent(params.ticker).toUpperCase();
  const [item] = useAdvice([ticker]);
  const profile = useProfileStore((s) => s.profile);
  const { tickers, toggle } = useWatchlistStore();
  const watching = tickers.includes(ticker);

  if (item.isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-80 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40" />)}
        </div>
      </div>
    );
  }

  if (!item.history || !item.analysis) {
    return (
      <Card className="flex flex-col gap-2 items-start">
        <h1 className="text-xl font-semibold text-foreground-emphasis">{ticker}</h1>
        <p className="text-sm text-gray-400">
          {item.error?.message ?? 'No price data is available for this ticker.'} Check the symbol, or try one like{' '}
          <Link href="/stock/AAPL" className="text-red-400">AAPL</Link>.
        </p>
      </Card>
    );
  }

  const { history, analysis } = item;
  const { change, changePercent } = dayChange(history.bars);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold text-foreground-emphasis">{ticker}</h1>
            <button
              onClick={() => toggle(ticker)}
              className="icon-button"
              aria-label={watching ? 'Remove from watchlist' : 'Add to watchlist'}
              title={watching ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Star className={cn('h-5 w-5', watching && 'fill-amber-400 text-amber-400')} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">{history.name}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold text-foreground-emphasis">{formatCurrency(analysis.price)}</div>
          <div className={`text-sm font-medium ${getChangeColor(changePercent)}`}>
            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({formatPercent(changePercent)}) today
          </div>
          <div className="mt-1"><SourceBadge history={history} /></div>
        </div>
      </div>

      <Card className="flex flex-col gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          <SignalBadge signal={analysis.signal} size="lg" />
          <span className="text-sm text-gray-400">for a {PROFILE_LABELS[profile].toLowerCase()} investor</span>
        </div>
        <div>
          <p className="text-lg font-medium text-foreground-emphasis">{analysis.headline}</p>
          <p className="text-sm text-foreground-default mt-2 leading-relaxed">{analysis.recommendation}</p>
        </div>
      </Card>

      <Card>
        <PriceChart bars={history.bars} />
      </Card>

      <section>
        <h2 className="text-lg font-medium text-foreground-emphasis mb-4">How the score adds up</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {analysis.rules.map((rule) => (
            <RuleCard key={rule.id} rule={rule} />
          ))}
        </div>
      </section>

      <Card className="flex flex-col gap-3">
        <h3 className="flex items-center gap-2 text-base font-medium text-foreground-emphasis">
          <MessageSquareText className="h-5 w-5 text-red-500" /> Advisory statements
        </h3>
        <ul className="flex flex-col gap-2 list-disc pl-5 text-sm text-foreground-default leading-relaxed">
          {analysis.rules.map((r) => <li key={r.id}>{r.statement}</li>)}
          <li>{analysis.recommendation}</li>
        </ul>
      </Card>

      <Disclaimer />
    </div>
  );
}
