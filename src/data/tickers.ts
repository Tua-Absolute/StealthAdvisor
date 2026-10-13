import type { SearchResult } from '@/lib/data/types';

/** Used for search when Yahoo is unreachable, and as the snapshot ticker list. */
export const POPULAR_TICKERS: SearchResult[] = [
  { ticker: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ' },
  { ticker: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ' },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ' },
  { ticker: 'AMZN', name: 'Amazon.com, Inc.', exchange: 'NASDAQ' },
  { ticker: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ' },
  { ticker: 'META', name: 'Meta Platforms, Inc.', exchange: 'NASDAQ' },
  { ticker: 'TSLA', name: 'Tesla, Inc.', exchange: 'NASDAQ' },
  { ticker: 'JPM', name: 'JPMorgan Chase & Co.', exchange: 'NYSE' },
  { ticker: 'KO', name: 'The Coca-Cola Company', exchange: 'NYSE' },
  { ticker: 'SPY', name: 'SPDR S&P 500 ETF Trust', exchange: 'NYSE Arca' },
  { ticker: 'QQQ', name: 'Invesco QQQ Trust', exchange: 'NASDAQ' },
  { ticker: 'DIA', name: 'SPDR Dow Jones Industrial Average ETF', exchange: 'NYSE Arca' },
  { ticker: 'IWM', name: 'iShares Russell 2000 ETF', exchange: 'NYSE Arca' },
  { ticker: 'VTI', name: 'Vanguard Total Stock Market ETF', exchange: 'NYSE Arca' },
  { ticker: 'BND', name: 'Vanguard Total Bond Market ETF', exchange: 'NASDAQ' },
  { ticker: 'VXUS', name: 'Vanguard Total International Stock ETF', exchange: 'NASDAQ' },
];
