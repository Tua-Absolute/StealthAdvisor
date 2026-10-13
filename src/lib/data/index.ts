import { unstable_cache } from 'next/cache';
import { alphaVantageHistory } from './alphavantage';
import { localSearch, snapshotHistory } from './snapshot';
import type { History, SearchResult } from './types';
import { yahooHistory, yahooSearch } from './yahoo';

export * from './types';

const FIFTEEN_MINUTES = 15 * 60;

/** Live sources only; throws if both fail. Cached so failures aren't cached. */
const liveHistory = unstable_cache(
  async (ticker: string): Promise<History> => {
    const errors: string[] = [];
    for (const source of [yahooHistory, alphaVantageHistory]) {
      try {
        return await source(ticker);
      } catch (e) {
        errors.push((e as Error).message);
      }
    }
    throw new Error(errors.join('; '));
  },
  ['history-v1'],
  { revalidate: FIFTEEN_MINUTES },
);

/** Yahoo first, then Alpha Vantage, then the bundled snapshot. */
export async function getHistory(ticker: string): Promise<History> {
  const t = ticker.toUpperCase();
  try {
    return await liveHistory(t);
  } catch (e) {
    try {
      return snapshotHistory(t);
    } catch {
      throw new Error(`No data available for ${t} (${(e as Error).message})`);
    }
  }
}

const cachedSearch = unstable_cache((q: string) => yahooSearch(q), ['search-v1'], { revalidate: 24 * 60 * 60 });

export async function searchTickers(query: string): Promise<SearchResult[]> {
  try {
    const results = await cachedSearch(query.trim().toLowerCase());
    if (results.length) return results;
  } catch {
    // fall through to the local list
  }
  return localSearch(query);
}
