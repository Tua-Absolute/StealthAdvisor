import snapshot from '@/data/snapshot.json';
import { POPULAR_TICKERS } from '@/data/tickers';
import type { History, SearchResult } from './types';

const data = snapshot as unknown as { generatedAt: string | null; tickers: Record<string, Omit<History, 'source'>> };

export const SNAPSHOT_TICKERS = Object.keys(data.tickers);

export function snapshotHistory(ticker: string): History {
  const h = data.tickers[ticker.toUpperCase()];
  if (!h) throw new Error(`No saved data for ${ticker}`);
  return { ...h, source: 'snapshot' };
}

export function localSearch(query: string): SearchResult[] {
  const q = query.trim().toUpperCase();
  return POPULAR_TICKERS.filter((t) => t.ticker.startsWith(q) || t.name.toUpperCase().includes(q)).slice(0, 8);
}
