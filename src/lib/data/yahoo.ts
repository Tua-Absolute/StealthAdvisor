import YahooFinance from 'yahoo-finance2';
import type { History, SearchResult } from './types';

const yf = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

const TWO_YEARS_MS = 730 * 24 * 60 * 60 * 1000;

export async function yahooHistory(ticker: string): Promise<History> {
  const chart = await yf.chart(ticker, {
    period1: new Date(Date.now() - TWO_YEARS_MS),
    interval: '1d',
  });
  const bars = chart.quotes
    .filter((q) => q.close != null)
    .map((q) => ({ date: q.date.toISOString().slice(0, 10), close: Number(q.close!.toFixed(4)) }));
  if (bars.length < 2) throw new Error(`Yahoo returned no prices for ${ticker}`);
  const meta = chart.meta as { longName?: string; shortName?: string; currency?: string; symbol: string };
  return {
    ticker: meta.symbol.toUpperCase(),
    name: meta.longName ?? meta.shortName ?? ticker,
    currency: meta.currency ?? 'USD',
    source: 'yahoo',
    asOf: bars[bars.length - 1].date,
    bars,
  };
}

export async function yahooSearch(query: string): Promise<SearchResult[]> {
  const res = await yf.search(query, { quotesCount: 8, newsCount: 0 });
  return res.quotes
    .filter((q): q is typeof q & { symbol: string } => 'symbol' in q && typeof q.symbol === 'string')
    .filter((q) => ['EQUITY', 'ETF', 'INDEX'].includes(String((q as { quoteType?: string }).quoteType)))
    .map((q) => {
      const r = q as { symbol: string; longname?: string; shortname?: string; exchDisp?: string };
      return { ticker: r.symbol, name: r.longname ?? r.shortname ?? r.symbol, exchange: r.exchDisp ?? '' };
    });
}
