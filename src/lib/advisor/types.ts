export interface Bar {
  date: string; // YYYY-MM-DD
  close: number;
}

export type RiskProfile = 'conservative' | 'balanced' | 'aggressive';

export type Signal = 'favorable' | 'neutral' | 'caution';

export interface RuleResult {
  id: 'trend' | 'momentum' | 'performance' | 'volatility' | 'drawdown' | 'range';
  label: string;
  score: number; // -2..+2
  value: string; // the headline number, e.g. "RSI 62"
  statement: string;
}

export interface Analysis {
  ticker: string;
  price: number;
  total: number;
  signal: Signal;
  headline: string;
  recommendation: string;
  rules: RuleResult[];
  metrics: Metrics;
}

export interface Metrics {
  sma50: number | null;
  sma200: number | null;
  rsi14: number | null;
  return3m: number | null;
  return12m: number | null;
  benchmarkReturn12m: number | null;
  volatility: number | null; // annualized, percent
  maxDrawdown: number | null; // percent, positive number
  high52: number;
  low52: number;
}
