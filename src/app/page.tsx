'use client';

import Link from 'next/link';
import { useQueries } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import { IndexCard } from '@/components/market/IndexCard';
import { AdviceCard } from '@/components/advisor/AdviceCard';
import { AllocationDonut } from '@/components/advisor/AllocationDonut';
import { Disclaimer } from '@/components/advisor/Disclaimer';
import { fetchHistory, useAdvice } from '@/lib/api';
import { ALLOCATIONS, PROFILE_BLURBS, PROFILE_LABELS } from '@/lib/advisor/profile';
import { useProfileStore } from '@/store/profile';
import { ArrowRight } from 'lucide-react';

const INDICES = [
  { ticker: 'SPY', label: 'S&P 500 (SPY)' },
  { ticker: 'QQQ', label: 'Nasdaq 100 (QQQ)' },
  { ticker: 'DIA', label: 'Dow Jones (DIA)' },
  { ticker: 'IWM', label: 'Russell 2000 (IWM)' },
];

const FEATURED = ['AAPL', 'MSFT', 'NVDA', 'JPM', 'KO', 'TSLA'];

export default function Dashboard() {
  const indices = useQueries({
    queries: INDICES.map(({ ticker }) => ({
      queryKey: ['history', ticker],
      queryFn: () => fetchHistory(ticker),
      staleTime: 15 * 60 * 1000,
    })),
  });
  const featured = useAdvice(FEATURED);
  const { profile, takenQuiz } = useProfileStore();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground-emphasis">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Market snapshot and the advisor&apos;s take, tuned to your risk profile</p>
      </div>

      <section>
        <h2 className="text-lg font-medium text-foreground-emphasis mb-4">Major Indices</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {INDICES.map((index, i) => (
            <IndexCard key={index.ticker} label={index.label} history={indices[i].data} isLoading={indices[i].isLoading} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-medium text-foreground-emphasis">Advisor&apos;s Take</h2>
          <span className="text-xs text-gray-500">For a {PROFILE_LABELS[profile].toLowerCase()} investor</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {featured.map((item) => (
            <AdviceCard key={item.ticker} item={item} />
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-foreground-emphasis">Your Risk Profile</h3>
            <Link href="/profile" className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300">
              {takenQuiz ? 'Retake quiz' : 'Take the quiz'} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div>
            <div className="text-xl font-semibold text-foreground-emphasis">{PROFILE_LABELS[profile]}</div>
            <p className="text-sm text-gray-400 mt-1">
              {takenQuiz ? PROFILE_BLURBS[profile] : 'Using Balanced until you take the five-question quiz.'}
            </p>
          </div>
        </Card>
        <Card className="flex flex-col gap-4">
          <h3 className="text-base font-medium text-foreground-emphasis">Sample Portfolio Mix</h3>
          <AllocationDonut allocation={ALLOCATIONS[profile]} />
        </Card>
      </section>

      <Disclaimer />
    </div>
  );
}
