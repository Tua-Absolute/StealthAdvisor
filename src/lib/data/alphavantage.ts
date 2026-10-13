import type { History } from './types';

type Daily = Record<string, { '4. close': string }>;

export async function alphaVantageHistory(ticker: string): Promise<History> {
  const key = process.env.ALPHA_VANTAGE_API_KEY;
  if (!key) throw new Error('ALPHA_VANTAGE_API_KEY is not set');
  const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(
    ticker,
  )}&outputsize=full&apikey=${key}`;
  const res = await fetch(url, { cache: 'no-store' });
  const json = (await res.json()) as { 'Time Series (Daily)'?: Daily };
  const daily = json['Time Series (Daily)'];
  // Rate limits and bad symbols come back as 200s with a "Note" or "Information" field instead.
  if (!daily) throw new Error(`Alpha Vantage returned no prices for ${ticker}`);
  const cutoff = new Date(Date.now() - 730 * 864e5).toISOString().slice(0, 10);
  const bars = Object.entries(daily)
    .filter(([date]) => date >= cutoff)
    .map(([date, v]) => ({ date, close: Number(v['4. close']) }))
    .sort((a, b) => a.date.localeCompare(b.date));
  return {
    ticker: ticker.toUpperCase(),
    name: ticker.toUpperCase(),
    currency: 'USD',
    source: 'alphavantage',
    asOf: bars[bars.length - 1].date,
    bars,
  };
}
