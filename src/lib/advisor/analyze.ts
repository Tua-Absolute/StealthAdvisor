import { annualizedVolatility, maxDrawdown, periodReturn, rsi, sma } from './indicators';
import { drawdownRule, momentumRule, performanceRule, rangeRule, trendRule, volatilityRule } from './rules';
import { PROFILE_LABELS } from './profile';
import type { Analysis, Bar, Metrics, RiskProfile, Signal } from './types';

const YEAR = 252;

export const THRESHOLDS: Record<RiskProfile, { favorable: number; caution: number }> = {
  conservative: { favorable: 6, caution: -3 },
  balanced: { favorable: 4, caution: -3 },
  aggressive: { favorable: 3, caution: -4 },
};

export function computeMetrics(bars: Bar[], benchmark?: Bar[]): Metrics {
  const closes = bars.map((b) => b.close);
  const year = closes.slice(-YEAR - 1);
  const benchCloses = benchmark?.map((b) => b.close) ?? [];
  return {
    sma50: sma(closes, 50),
    sma200: sma(closes, 200),
    rsi14: rsi(closes.slice(-120), 14),
    return3m: periodReturn(closes, 63),
    return12m: periodReturn(closes, YEAR),
    benchmarkReturn12m: benchCloses.length ? periodReturn(benchCloses, YEAR) : null,
    volatility: annualizedVolatility(year),
    maxDrawdown: maxDrawdown(year),
    high52: Math.max(...year),
    low52: Math.min(...year),
  };
}

export function analyze(ticker: string, bars: Bar[], profile: RiskProfile = 'balanced', benchmark?: Bar[]): Analysis {
  if (bars.length < 2) throw new Error('Not enough price history to analyze');
  const t = ticker.toUpperCase();
  const price = bars[bars.length - 1].close;
  const metrics = computeMetrics(bars, benchmark);

  const rules = [
    trendRule(t, price, metrics),
    momentumRule(t, metrics),
    performanceRule(t, metrics),
    volatilityRule(t, metrics),
    drawdownRule(t, metrics),
    rangeRule(t, price, metrics),
  ];
  const total = rules.reduce((a, r) => a + r.score, 0);

  const { favorable, caution } = THRESHOLDS[profile];
  let signal: Signal = total >= favorable ? 'favorable' : total <= caution ? 'caution' : 'neutral';

  // Conservative investors get flagged on big swings regardless of the score.
  const tooRisky =
    profile === 'conservative' &&
    ((metrics.volatility ?? 0) >= 40 || (metrics.maxDrawdown ?? 0) >= 25);
  if (tooRisky) signal = 'caution';

  return {
    ticker: t,
    price,
    total,
    signal,
    headline: headlineFor(t, signal, total),
    recommendation: recommendationFor(t, signal, profile, tooRisky),
    rules,
    metrics,
  };
}

function headlineFor(t: string, signal: Signal, total: number): string {
  const s = `${total >= 0 ? '+' : ''}${total}`;
  if (signal === 'favorable') return `${t} looks favorable right now (score ${s} of 12).`;
  if (signal === 'caution') return `${t} calls for caution right now (score ${s} of 12).`;
  return `${t} looks neutral right now (score ${s} of 12).`;
}

function recommendationFor(t: string, signal: Signal, profile: RiskProfile, tooRisky: boolean): string {
  const p = PROFILE_LABELS[profile].toLowerCase();
  if (tooRisky) {
    return `${t} moves too much for a ${p} investor. If you want exposure, keep it a small slice of your portfolio or use a broad fund instead.`;
  }
  if (signal === 'favorable') {
    return `For a ${p} investor, ${t} is a reasonable candidate. Consider building a position gradually rather than all at once.`;
  }
  if (signal === 'caution') {
    return `For a ${p} investor, the risks on ${t} currently outweigh the positives. Consider avoiding new buys or trimming an oversized position.`;
  }
  return `For a ${p} investor, ${t} is a hold-and-watch. If you own it, there is no strong reason to act; if you don't, wait for a clearer trend.`;
}
