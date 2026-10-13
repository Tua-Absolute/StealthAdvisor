'use client';

import { useMemo, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { smaSeries } from '@/lib/advisor/indicators';
import type { Bar } from '@/lib/advisor/types';
import { cn, formatCurrency } from '@/lib/utils';

const RANGES = { '3M': 63, '6M': 126, '1Y': 252 } as const;
type Range = keyof typeof RANGES;

export function PriceChart({ bars }: { bars: Bar[] }) {
  const [range, setRange] = useState<Range>('1Y');

  const data = useMemo(() => {
    const closes = bars.map((b) => b.close);
    const s50 = smaSeries(closes, 50);
    const s200 = smaSeries(closes, 200);
    return bars.map((b, i) => ({ date: b.date, close: b.close, sma50: s50[i], sma200: s200[i] })).slice(-RANGES[range]);
  }, [bars, range]);

  const up = data.length > 1 && data[data.length - 1].close >= data[0].close;
  const stroke = up ? '#34d399' : '#f87171';

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded" style={{ background: stroke }} />Price</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-blue-400" />50-day avg</span>
          <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-violet-400" />200-day avg</span>
        </div>
        <div className="flex gap-1 rounded-xl bg-surface p-1 border border-border-default">
          {(Object.keys(RANGES) as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-colors',
                r === range ? 'bg-blue-500/10 text-blue-400' : 'text-gray-400 hover:text-foreground-emphasis'
              )}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--color-border-default)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              minTickGap={48}
              tickFormatter={(d: string) =>
                new Date(d + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
              }
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#71717a', fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={56}
              tickFormatter={(v: number) => `$${v.toFixed(0)}`}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--color-surface-elevated)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: 'var(--color-foreground-emphasis)' }}
              formatter={(v: number, name: string) => [
                formatCurrency(v),
                name === 'close' ? 'Price' : name === 'sma50' ? '50-day avg' : '200-day avg',
              ]}
            />
            <Line type="monotone" dataKey="sma200" stroke="#a78bfa" strokeWidth={1.25} dot={false} connectNulls />
            <Line type="monotone" dataKey="sma50" stroke="#60a5fa" strokeWidth={1.25} dot={false} connectNulls />
            <Line type="monotone" dataKey="close" stroke={stroke} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
