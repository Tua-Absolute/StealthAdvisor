import { Card } from '@/components/ui/Card';
import { Disclaimer } from '@/components/advisor/Disclaimer';

const RULES = [
  ['Trend', 'Price compared with its 50-day and 200-day moving averages.'],
  ['Momentum', '14-day Relative Strength Index (RSI): overbought above 70, oversold below 30.'],
  ['Performance', '12-month return compared with the S&P 500 (SPY), with the 3-month return for context.'],
  ['Volatility', 'How much the price swings in a year (annualized standard deviation of daily returns).'],
  ['Drawdown', 'The largest drop from a high to a later low over the past 12 months.'],
  ['52-week range', 'Where today’s price sits between its 12-month low and high.'],
];

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground-emphasis">About StealthAdvisor</h1>
        <p className="text-sm text-gray-500 mt-1">How the advice is made</p>
      </div>

      <Card className="flex flex-col gap-4">
        <p className="text-sm text-foreground-default leading-relaxed">
          StealthAdvisor pulls two years of daily prices for a ticker and runs six simple rules over them. Each rule
          scores from −2 to +2 and explains itself in one sentence. The scores add up to a total between −12 and +12,
          which becomes a Favorable, Neutral or Caution signal. Your risk profile decides where those cut-offs sit.
        </p>
        <div className="flex flex-col divide-y divide-[var(--color-border-default)]">
          {RULES.map(([name, text]) => (
            <div key={name} className="flex flex-col sm:flex-row sm:gap-6 py-3">
              <span className="text-sm font-medium text-foreground-emphasis sm:w-36 flex-shrink-0">{name}</span>
              <span className="text-sm text-gray-400">{text}</span>
            </div>
          ))}
        </div>
        <p className="text-sm text-foreground-default leading-relaxed">
          Prices come from Yahoo Finance, then Alpha Vantage if Yahoo is unavailable. If both are down, saved prices for
          popular tickers are shown with a &ldquo;Demo data&rdquo; label.
        </p>
      </Card>

      <Disclaimer />
    </div>
  );
}
