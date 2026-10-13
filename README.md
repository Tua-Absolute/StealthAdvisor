# StealthAdvisor

A demo robo advisor in the style of StealthForecast. Type a ticker and StealthAdvisor pulls two years of daily prices, scores them with six transparent rules, and returns a **Favorable / Neutral / Caution** signal with plain-English advisory statements tuned to your risk profile.

> Educational demo only. Nothing here is financial advice.

## Stack

| Layer | Technology |
|---|---|
| App | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS with StealthForecast's dark-first theme |
| State | Zustand (theme, risk profile, watchlist, saved in the browser) |
| Data fetching | TanStack Query on the client, Next.js route handlers on the server |
| Charts | Recharts |
| Tests | Vitest |
| Hosting | Vercel |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # advice engine tests
```

No API keys are required. Optionally copy `.env.example` to `.env.local` and add a free
[Alpha Vantage key](https://www.alphavantage.co/support/#api-key) as a backup data source.

## How the advice works

`src/lib/advisor/` holds the engine. Each rule scores a ticker from -2 to +2 and writes one sentence:

| Rule | Measures |
|---|---|
| Trend | Price vs 50- and 200-day moving averages |
| Momentum | 14-day RSI |
| Performance | 12-month return vs SPY (plus 3-month return) |
| Volatility | Annualized standard deviation of daily returns |
| Drawdown | Largest peak-to-trough drop in 12 months |
| 52-week range | Where the price sits between its 12-month low and high |

The total (-12 to +12) becomes a signal. Thresholds depend on the risk profile from the five-question quiz:

| Profile | Favorable at | Caution at |
|---|---|---|
| Conservative | +6 | -3, or volatility ≥ 40% / drawdown ≥ 25% |
| Balanced | +4 | -3 |
| Aggressive | +3 | -4 |

## Data sources

`src/lib/data/` tries, in order:

1. **Yahoo Finance** via `yahoo-finance2` (no key)
2. **Alpha Vantage** if `ALPHA_VANTAGE_API_KEY` is set
3. **Saved snapshot** in `src/data/snapshot.json`, shown with a "Demo data" badge

Live responses are cached for 15 minutes. To refresh the snapshot from a running copy of the app:

```bash
npm run snapshot -- https://your-deployment.vercel.app
```

## Project structure

```
src/
├── app/            # Pages (Dashboard, Analyze, Watchlist, Risk Profile, About) and API routes
├── components/     # Layout, UI primitives, advisor and market components
├── data/           # Popular tickers and the fallback snapshot
├── lib/advisor/    # Indicators, rules, scoring, risk profile
├── lib/data/       # Yahoo, Alpha Vantage and snapshot sources
└── store/          # Zustand stores
```
