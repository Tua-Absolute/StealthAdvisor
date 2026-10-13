import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'positive' | 'negative' | 'neutral';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium',
        variant === 'positive' && 'bg-emerald-400/10 text-emerald-400',
        variant === 'negative' && 'bg-red-400/10 text-red-400',
        variant === 'neutral' && 'bg-gray-400/10 text-gray-400',
        className
      )}
      {...props}
    />
  )
);
Badge.displayName = 'Badge';

export { Badge };
