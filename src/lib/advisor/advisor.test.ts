import { describe, expect, it } from 'vitest';
import { analyze, annualizedVolatility, maxDrawdown, profileFromPoints, rsi, sma, smaSeries } from './index';
import type { Bar } from './types';

function series(fn: (i: number) => number, n = 300): Bar[] {
  const start = Date.UTC(2025, 0, 1);
  return Array.from({ length: n }, (_, i) => ({
    date: new Date(start + i * 864e5).toISOString().slice(0, 10),
    close: fn(i),
  }));
}

describe('indicators', () => {
  it('computes simple moving averages', () => {
    expect(sma([1, 2, 3, 4], 2)).toBe(3.5);
    expect(sma([1, 2], 3)).toBeNull();
    expect(smaSeries([1, 2, 3, 4], 2)).toEqual([null, 1.5, 2.5, 3.5]);
  });

  it('gives RSI 100 for a straight rise and near 0 for a straight fall', () => {
    expect(rsi(Array.from({ length: 30 }, (_, i) => 100 + i))).toBe(100);
    expect(rsi(Array.from({ length: 30 }, (_, i) => 100 - i))!).toBeLessThan(1);
  });

  it('measures drawdown from the peak', () => {
    expect(maxDrawdown([100, 120, 90, 110])).toBeCloseTo(25);
  });

  it('gives zero volatility for a constant price', () => {
    expect(annualizedVolatility(Array(30).fill(50))).toBe(0);
  });
});

describe('analyze', () => {
  // Steady 0.1% a day climb with a small wiggle: strong trend, low volatility.
  const riser = series((i) => 100 * 1.001 ** i * (1 + 0.004 * Math.sin(i)));
  // Steady 0.15% a day decline: established downtrend with a deep drawdown.
  const faller = series((i) => 100 * 0.9985 ** i * (1 + 0.004 * Math.sin(i)));
  // Wild swings around a flat line.
  const wild = series((i) => 100 * (1 + 0.25 * Math.sin(i / 6)) * (1 + 0.04 * Math.sin(i * 2.3)));

  it('rates a steady riser favorable', () => {
    const a = analyze('UP', riser);
    expect(a.signal).toBe('favorable');
    expect(a.rules.find((r) => r.id === 'trend')!.score).toBe(2);
    expect(a.rules).toHaveLength(6);
  });

  it('rates a steady faller caution', () => {
    const a = analyze('DOWN', faller);
    expect(a.signal).toBe('caution');
    expect(a.rules.find((r) => r.id === 'trend')!.score).toBe(-2);
  });

  it('flags a volatile stock as caution for a conservative investor', () => {
    expect(analyze('WILD', wild, 'conservative').signal).toBe('caution');
  });

  it('compares performance against the benchmark when given', () => {
    const flat = series(() => 100);
    const a = analyze('UP', riser, 'balanced', flat);
    expect(a.rules.find((r) => r.id === 'performance')!.statement).toMatch(/ahead of the S&P 500/);
  });

  it('writes a statement for every rule', () => {
    for (const r of analyze('UP', riser).rules) expect(r.statement.length).toBeGreaterThan(10);
  });
});

describe('risk profile', () => {
  it('maps quiz points to profiles', () => {
    expect(profileFromPoints(5)).toBe('conservative');
    expect(profileFromPoints(10)).toBe('balanced');
    expect(profileFromPoints(15)).toBe('aggressive');
  });
});
