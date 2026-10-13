import type { Bar } from '@/lib/advisor/types';

export type DataSource = 'yahoo' | 'alphavantage' | 'snapshot';

export interface History {
  ticker: string;
  name: string;
  currency: string;
  source: DataSource;
  asOf: string; // date of the last bar
  bars: Bar[];
}

export interface SearchResult {
  ticker: string;
  name: string;
  exchange: string;
}
