/** Simple moving average of the last `n` values, or null if there aren't enough. */
export function sma(values: number[], n: number): number | null {
  if (values.length < n) return null;
  let sum = 0;
  for (let i = values.length - n; i < values.length; i++) sum += values[i];
  return sum / n;
}

/** Moving average series aligned with `values` (null until `n` values exist). */
export function smaSeries(values: number[], n: number): (number | null)[] {
  const out: (number | null)[] = [];
  let sum = 0;
  for (let i = 0; i < values.length; i++) {
    sum += values[i];
    if (i >= n) sum -= values[i - n];
    out.push(i >= n - 1 ? sum / n : null);
  }
  return out;
}

/** Wilder's Relative Strength Index. */
export function rsi(values: number[], period = 14): number | null {
  if (values.length <= period) return null;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const d = values[i] - values[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  for (let i = period + 1; i < values.length; i++) {
    const d = values[i] - values[i - 1];
    avgGain = (avgGain * (period - 1) + Math.max(d, 0)) / period;
    avgLoss = (avgLoss * (period - 1) + Math.max(-d, 0)) / period;
  }
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

/** Percent return over the last `days` trading days. */
export function periodReturn(values: number[], days: number): number | null {
  if (values.length <= days) return null;
  const start = values[values.length - 1 - days];
  const end = values[values.length - 1];
  return ((end - start) / start) * 100;
}

/** Annualized volatility (percent) from daily log returns. */
export function annualizedVolatility(values: number[]): number | null {
  if (values.length < 20) return null;
  const rets: number[] = [];
  for (let i = 1; i < values.length; i++) rets.push(Math.log(values[i] / values[i - 1]));
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length;
  const variance = rets.reduce((a, r) => a + (r - mean) ** 2, 0) / (rets.length - 1);
  return Math.sqrt(variance) * Math.sqrt(252) * 100;
}

/** Largest peak-to-trough drop (percent, as a positive number). */
export function maxDrawdown(values: number[]): number | null {
  if (values.length < 2) return null;
  let peak = values[0];
  let worst = 0;
  for (const v of values) {
    if (v > peak) peak = v;
    worst = Math.max(worst, (peak - v) / peak);
  }
  return worst * 100;
}
