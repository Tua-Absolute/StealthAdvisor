'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { AllocationDonut } from '@/components/advisor/AllocationDonut';
import { Disclaimer } from '@/components/advisor/Disclaimer';
import { ALLOCATIONS, PROFILE_BLURBS, PROFILE_LABELS, QUESTIONS, profileFromPoints } from '@/lib/advisor/profile';
import { THRESHOLDS } from '@/lib/advisor/analyze';
import { cn } from '@/lib/utils';
import { useProfileStore } from '@/store/profile';

export default function ProfilePage() {
  const { profile, answers: saved, takenQuiz, setResult } = useProfileStore();
  const [answers, setAnswers] = useState<Record<string, number>>(saved);
  const complete = QUESTIONS.every((q) => answers[q.id] !== undefined);

  const submit = () => {
    const points = QUESTIONS.reduce((sum, q) => sum + q.options[answers[q.id]].points, 0);
    setResult(profileFromPoints(points), answers);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const t = THRESHOLDS[profile];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground-emphasis">Risk Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Five questions that tune every signal in StealthAdvisor</p>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="flex flex-col gap-3">
          <span className="text-sm text-gray-400">{takenQuiz ? 'Your result' : 'Current setting (default)'}</span>
          <div className="text-2xl font-semibold text-foreground-emphasis">{PROFILE_LABELS[profile]}</div>
          <p className="text-sm text-foreground-default leading-relaxed">{PROFILE_BLURBS[profile]}</p>
          <p className="text-xs text-gray-500">
            A stock reads Favorable at a score of +{t.favorable} or more and Caution at {t.caution} or less
            {profile === 'conservative' && ', or whenever it swings more than 40% a year or has dropped 25% from a high'}.
          </p>
        </Card>
        <Card className="flex flex-col gap-4">
          <h3 className="text-base font-medium text-foreground-emphasis">Sample Portfolio Mix</h3>
          <AllocationDonut allocation={ALLOCATIONS[profile]} />
        </Card>
      </section>

      <section className="flex flex-col gap-4">
        {QUESTIONS.map((q, qi) => (
          <Card key={q.id} className="flex flex-col gap-3">
            <h3 className="text-base font-medium text-foreground-emphasis">
              {qi + 1}. {q.text}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {q.options.map((o, oi) => (
                <button
                  key={o.label}
                  onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                  className={cn(
                    'rounded-xl border px-4 py-3 text-left text-sm transition-colors',
                    answers[q.id] === oi
                      ? 'border-red-500 bg-red-500/10 text-red-400'
                      : 'border-border-default text-foreground-default hover:bg-white/5'
                  )}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </Card>
        ))}
        <button
          onClick={submit}
          disabled={!complete}
          className="self-start rounded-xl bg-red-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {takenQuiz ? 'Update my profile' : 'See my profile'}
        </button>
      </section>

      <Disclaimer />
    </div>
  );
}
