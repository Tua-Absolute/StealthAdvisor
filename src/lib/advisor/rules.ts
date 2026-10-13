import type { Metrics, RuleResult } from './types';

// Round first so tiny values don't print as "-0%".
const round = (v: number, digits: number) => Number(v.toFixed(digits)) || 0;
const pct = (v: number, digits = 0) => `${round(v, digits) >= 0 ? '+' : ''}${round(v, digits).toFixed(digits)}%`;
const abs = (v: number, digits = 0) => `${Math.abs(round(v, digits)).toFixed(digits)}%`;
const direction = (v: number) => (round(v, 0) > 0 ? 'Up' : round(v, 0) < 0 ? 'Down' : 'Flat at');

export function trendRule(t: string, price: number, m: Metrics): RuleResult {
  const { sma50, sma200 } = m;
  let score = 0;
  let statement: string;
  if (sma50 === null) {
    statement = `Not enough history yet to judge ${t}'s trend.`;
  } else if (sma200 === null) {
    score = price > sma50 ? 1 : -1;
    statement = price > sma50
      ? `${t} is above its 50-day average, a short-term uptrend.`
      : `${t} is below its 50-day average, a short-term downtrend.`;
  } else if (price > sma50 && sma50 > sma200) {
    score = 2;
    statement = `${t} is above both its 50- and 200-day averages, a healthy uptrend.`;
  } else if (price < sma50 && sma50 < sma200) {
    score = -2;
    statement = `${t} is below both its 50- and 200-day averages, an established downtrend.`;
  } else if (price > sma200) {
    score = 1;
    statement = `${t} is above its 200-day average, so the long-term trend is still up, but short-term momentum is mixed.`;
  } else {
    score = -1;
    statement = `${t} is below its 200-day average, so the long-term trend is weak even if it has bounced recently.`;
  }
  const value = sma200 !== null ? `${((price / sma200 - 1) * 100).toFixed(1)}% vs 200-day` : '—';
  return { id: 'trend', label: 'Trend', score, value, statement };
}

export function momentumRule(t: string, m: Metrics): RuleResult {
  const r = m.rsi14;
  if (r === null) {
    return { id: 'momentum', label: 'Momentum', score: 0, value: '—', statement: 'Not enough data to measure momentum.' };
  }
  let score: number;
  let statement: string;
  if (r > 75) {
    score = -2;
    statement = `RSI of ${r.toFixed(0)} means ${t} is heavily overbought; a pullback is common from here, so consider waiting.`;
  } else if (r > 70) {
    score = -1;
    statement = `RSI of ${r.toFixed(0)} suggests ${t} is overbought in the short term; consider waiting for a pullback.`;
  } else if (r >= 50) {
    score = 1;
    statement = `RSI of ${r.toFixed(0)} shows steady buying pressure without being stretched.`;
  } else if (r >= 30) {
    score = 0;
    statement = `RSI of ${r.toFixed(0)} is neutral to soft; buyers and sellers are fairly balanced.`;
  } else {
    score = 1;
    statement = `RSI of ${r.toFixed(0)} means ${t} is oversold; patient investors sometimes find value here, but it can stay weak.`;
  }
  return { id: 'momentum', label: 'Momentum', score, value: `RSI ${r.toFixed(0)}`, statement };
}

export function performanceRule(t: string, m: Metrics): RuleResult {
  const r12 = m.return12m;
  const bench = m.benchmarkReturn12m;
  if (r12 === null) {
    return { id: 'performance', label: 'Performance', score: 0, value: '—', statement: 'Less than a year of history, so performance is not scored.' };
  }
  let score: number;
  let statement: string;
  const r3 = m.return3m !== null ? ` (${pct(m.return3m)} over 3 months)` : '';
  if (bench !== null && t !== 'SPY') {
    const ex = r12 - bench;
    score = ex >= 10 ? 2 : ex >= 0 ? 1 : ex > -10 ? -1 : -2;
    statement = `${direction(r12)} ${abs(r12)} over 12 months${r3}, ${round(ex, 0) === 0 ? 'in line with the S&P 500' : `${abs(ex)} ${ex > 0 ? 'ahead of' : 'behind'} the S&P 500`}.`;
  } else {
    score = r12 >= 15 ? 2 : r12 >= 0 ? 1 : r12 > -15 ? -1 : -2;
    statement = `${direction(r12)} ${abs(r12)} over 12 months${r3}.`;
  }
  return { id: 'performance', label: 'Performance', score, value: `${pct(r12)} 1Y`, statement };
}

export function volatilityRule(t: string, m: Metrics): RuleResult {
  const v = m.volatility;
  if (v === null) {
    return { id: 'volatility', label: 'Volatility', score: 0, value: '—', statement: 'Not enough data to measure volatility.' };
  }
  const score = v < 18 ? 2 : v < 25 ? 1 : v < 35 ? 0 : v < 50 ? -1 : -2;
  const vsMarket = v / 18;
  const statement =
    v < 18
      ? `${t} swings about ${v.toFixed(0)}% a year, calmer than the overall market.`
      : v < 25
        ? `${t} swings about ${v.toFixed(0)}% a year, close to the overall market.`
        : `${t} swings about ${v.toFixed(0)}% a year, roughly ${vsMarket.toFixed(1)}x the overall market, so expect bigger ups and downs.`;
  return { id: 'volatility', label: 'Volatility', score, value: `${v.toFixed(0)}% / yr`, statement };
}

export function drawdownRule(t: string, m: Metrics): RuleResult {
  const d = m.maxDrawdown;
  if (d === null) {
    return { id: 'drawdown', label: 'Drawdown', score: 0, value: '—', statement: 'Not enough data to measure drawdowns.' };
  }
  const score = d < 10 ? 2 : d < 20 ? 1 : d < 30 ? 0 : d < 45 ? -1 : -2;
  const statement =
    d < 10
      ? `${t}'s worst drop this year was only ${d.toFixed(0)}% from a high.`
      : `${t} fell ${d.toFixed(0)}% from its high at one point this year; make sure you could sit through a drop like that.`;
  return { id: 'drawdown', label: 'Drawdown', score, value: `-${d.toFixed(0)}% max`, statement };
}

export function rangeRule(t: string, price: number, m: Metrics): RuleResult {
  const { high52, low52 } = m;
  const span = high52 - low52 || 1;
  const pos = (price - low52) / span;
  const offHigh = ((high52 - price) / high52) * 100;
  const score = pos >= 0.85 ? 1 : pos >= 0.4 ? 0 : pos >= 0.15 ? -1 : -2;
  const statement =
    offHigh < 1
      ? `${t} is trading at its 52-week high.`
      : pos >= 0.4
        ? `${t} is trading ${offHigh.toFixed(0)}% below its 52-week high.`
        : `${t} is near the bottom of its 52-week range, ${offHigh.toFixed(0)}% below its high.`;
  return { id: 'range', label: '52-week range', score, value: `${(pos * 100).toFixed(0)}% of range`, statement };
}
