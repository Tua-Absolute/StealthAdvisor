import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WatchlistState {
  tickers: string[];
  toggle: (ticker: string) => void;
  remove: (ticker: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      tickers: ['AAPL', 'NVDA', 'KO'],
      toggle: (ticker) =>
        set((s) => ({
          tickers: s.tickers.includes(ticker) ? s.tickers.filter((t) => t !== ticker) : [...s.tickers, ticker],
        })),
      remove: (ticker) => set((s) => ({ tickers: s.tickers.filter((t) => t !== ticker) })),
    }),
    { name: 'stealth-advisor-watchlist' }
  )
);
