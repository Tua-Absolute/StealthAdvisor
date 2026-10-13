import { cn } from '@/lib/utils';
import type { Signal } from '@/lib/advisor/types';
import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react';

export const SIGNAL_LABELS: Record<Signal, string> = {
  favorable: 'Favorable',
  neutral: 'Neutral',
  caution: 'Caution',
};

const STYLES: Record<Signal, string> = {
  favorable: 'bg-emerald-400/10 text-emerald-400',
  neutral: 'bg-amber-400/10 text-amber-400',
  caution: 'bg-red-400/10 text-red-400',
};

const ICONS = { favorable: ShieldCheck, neutral: ShieldQuestion, caution: ShieldAlert };

export function SignalBadge({ signal, size = 'sm' }: { signal: Signal; size?: 'sm' | 'lg' }) {
  const Icon = ICONS[signal];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        size === 'lg' ? 'px-4 py-1.5 text-base' : 'px-2 py-0.5 text-xs',
        STYLES[signal]
      )}
    >
      <Icon className={size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5'} />
      {SIGNAL_LABELS[signal]}
    </span>
  );
}
