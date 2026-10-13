'use client';

import { useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { analyze } from '@/lib/advisor';
import type { Analysis } from '@/lib/advisor/types';
import type { History, SearchResult } from '@/lib/data/types';
import { useProfileStore } from '@/store/profile';

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error ?? `Request failed (${res.status})`);
  return body as T;
}

export const fetchHistory = (ticker: string) =>
  getJson<History>(`/api/history/${encodeURIComponent(ticker.toUpperCase())}`);

export const searchTickers = (q: string) =>
  getJson<{ results: SearchResult[] }>(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.results);

const historyQuery = (ticker: string) => ({
  queryKey: ['history', ticker.toUpperCase()],
  queryFn: () => fetchHistory(ticker),
  staleTime: 15 * 60 * 1000,
  retry: 1,
});

export function useHistory(ticker: string) {
  return useQuery(historyQuery(ticker));
}

export interface AdvisedTicker {
  ticker: string;
  history?: History;
  analysis?: Analysis;
  isLoading: boolean;
  error?: Error | null;
}

/** History + analysis for several tickers, scored against SPY and the user's risk profile. */
export function useAdvice(tickers: string[]): AdvisedTicker[] {
  const profile = useProfileStore((s) => s.profile);
  const all = useMemo(() => ['SPY', ...tickers.filter((t) => t !== 'SPY')], [tickers]);
  const results = useQueries({ queries: all.map(historyQuery) });
  const spy = results[0].data;

  return tickers.map((ticker) => {
    const r = results[all.indexOf(ticker)];
    let analysis: Analysis | undefined;
    if (r.data) {
      try {
        analysis = analyze(ticker, r.data.bars, profile, spy?.bars);
      } catch {
        analysis = undefined;
      }
    }
    return { ticker, history: r.data, analysis, isLoading: r.isLoading, error: r.error };
  });
}
