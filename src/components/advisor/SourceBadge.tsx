import type { History } from '@/lib/data/types';

const LABELS = { yahoo: 'Yahoo Finance', alphavantage: 'Alpha Vantage', snapshot: 'Demo data' } as const;

export function SourceBadge({ history }: { history: History }) {
  const isSnapshot = history.source === 'snapshot';
  return (
    <span
      className={
        isSnapshot
          ? 'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400/10 text-amber-400'
          : 'text-xs text-gray-500'
      }
      title={isSnapshot ? 'Live data is unavailable, so saved prices are shown.' : undefined}
    >
      {LABELS[history.source]} · as of {history.asOf}
    </span>
  );
}
