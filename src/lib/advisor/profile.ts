import type { RiskProfile } from './types';

export interface Question {
  id: string;
  text: string;
  options: { label: string; points: number }[];
}

export const QUESTIONS: Question[] = [
  {
    id: 'horizon',
    text: 'When will you need most of this money?',
    options: [
      { label: 'Within 3 years', points: 1 },
      { label: 'In 3 to 10 years', points: 2 },
      { label: 'More than 10 years from now', points: 3 },
    ],
  },
  {
    id: 'drop',
    text: 'Your investments fall 20% in a month. What do you do?',
    options: [
      { label: 'Sell to stop the losses', points: 1 },
      { label: 'Hold and wait it out', points: 2 },
      { label: 'Buy more while prices are low', points: 3 },
    ],
  },
  {
    id: 'goal',
    text: 'What matters most to you?',
    options: [
      { label: 'Protecting what I have', points: 1 },
      { label: 'Steady growth with some ups and downs', points: 2 },
      { label: 'Maximum growth, even with big swings', points: 3 },
    ],
  },
  {
    id: 'experience',
    text: 'How much investing experience do you have?',
    options: [
      { label: 'Little or none', points: 1 },
      { label: 'Some: funds or a few stocks', points: 2 },
      { label: 'A lot: I trade regularly', points: 3 },
    ],
  },
  {
    id: 'income',
    text: 'How stable is your income?',
    options: [
      { label: 'Uncertain', points: 1 },
      { label: 'Fairly stable', points: 2 },
      { label: 'Very stable, with savings set aside', points: 3 },
    ],
  },
];

export function profileFromPoints(points: number): RiskProfile {
  if (points <= 8) return 'conservative';
  if (points <= 11) return 'balanced';
  return 'aggressive';
}

export interface Allocation {
  ticker: string;
  name: string;
  percent: number;
}

export const ALLOCATIONS: Record<RiskProfile, Allocation[]> = {
  conservative: [
    { ticker: 'BND', name: 'US bonds', percent: 50 },
    { ticker: 'VTI', name: 'US stocks', percent: 30 },
    { ticker: 'VXUS', name: 'International stocks', percent: 10 },
    { ticker: 'SGOV', name: 'Treasury bills', percent: 10 },
  ],
  balanced: [
    { ticker: 'VTI', name: 'US stocks', percent: 60 },
    { ticker: 'BND', name: 'US bonds', percent: 30 },
    { ticker: 'VXUS', name: 'International stocks', percent: 10 },
  ],
  aggressive: [
    { ticker: 'VTI', name: 'US stocks', percent: 70 },
    { ticker: 'VXUS', name: 'International stocks', percent: 20 },
    { ticker: 'QQQ', name: 'Nasdaq 100', percent: 10 },
  ],
};

export const PROFILE_LABELS: Record<RiskProfile, string> = {
  conservative: 'Conservative',
  balanced: 'Balanced',
  aggressive: 'Aggressive',
};

export const PROFILE_BLURBS: Record<RiskProfile, string> = {
  conservative: 'You put protecting your money first. Advice favors steady, lower-volatility holdings and flags big swings early.',
  balanced: 'You want growth but can live with moderate ups and downs. Advice weighs trend and risk evenly.',
  aggressive: 'You are comfortable with large swings in pursuit of growth. Advice gives more room to volatile, high-momentum stocks.',
};
