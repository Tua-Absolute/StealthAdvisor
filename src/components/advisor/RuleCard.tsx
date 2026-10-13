import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { RuleResult } from '@/lib/advisor/types';

function ScoreDots({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`Score ${score} of 2`}>
      {[-2, -1, 0, 1, 2].map((v) => {
        const lit = score === 0 ? v === 0 : score > 0 ? v > 0 && v <= score : v < 0 && v >= score;
        return (
          <span
            key={v}
            className={cn(
              'h-1.5 w-4 rounded-full',
              !lit && 'bg-gray-500/20',
              lit && score > 0 && 'bg-emerald-400',
              lit && score < 0 && 'bg-red-400',
              lit && score === 0 && 'bg-amber-400'
            )}
          />
        );
      })}
    </div>
  );
}

export function RuleCard({ rule }: { rule: RuleResult }) {
  return (
    <Card className="flex flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400 font-medium">{rule.label}</span>
        <span
          className={cn(
            'text-xs font-medium',
            rule.score > 0 ? 'text-emerald-400' : rule.score < 0 ? 'text-red-400' : 'text-amber-400'
          )}
        >
          {rule.score > 0 ? '+' : ''}
          {rule.score}
        </span>
      </div>
      <div className="text-lg font-semibold text-foreground-emphasis">{rule.value}</div>
      <ScoreDots score={rule.score} />
      <p className="text-sm text-foreground-default leading-relaxed">{rule.statement}</p>
    </Card>
  );
}
