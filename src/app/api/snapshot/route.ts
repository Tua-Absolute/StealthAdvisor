import { NextResponse } from 'next/server';
import { POPULAR_TICKERS } from '@/data/tickers';
import { yahooHistory } from '@/lib/data/yahoo';

/**
 * Returns fresh Yahoo data for the popular tickers in the same shape as
 * src/data/snapshot.json. `npm run snapshot` saves it into the repo.
 */
export const dynamic = 'force-dynamic';

export async function GET() {
  const tickers: Record<string, unknown> = {};
  for (const { ticker } of POPULAR_TICKERS) {
    try {
      const { source: _source, ...h } = await yahooHistory(ticker);
      tickers[ticker] = { ...h, bars: h.bars.slice(-400) };
    } catch {
      // skip tickers Yahoo can't return
    }
  }
  return NextResponse.json({ generatedAt: new Date().toISOString(), tickers });
}
