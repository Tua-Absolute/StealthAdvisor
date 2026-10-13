'use client';

import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import type { Allocation } from '@/lib/advisor/profile';

const COLORS = ['#dc2626', '#e4e4e7', '#71717a', '#f87171'];

export function AllocationDonut({ allocation }: { allocation: Allocation[] }) {
  return (
    <div className="flex items-center gap-8 flex-wrap">
      <div className="h-36 w-36 flex-shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={allocation} dataKey="percent" nameKey="ticker" innerRadius="65%" outerRadius="100%" stroke="none">
              {allocation.map((a, i) => (
                <Cell key={a.ticker} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-col gap-2 flex-1 min-w-[180px]">
        {allocation.map((a, i) => (
          <div key={a.ticker} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-sm font-medium text-foreground-emphasis">{a.ticker}</span>
              <span className="text-sm text-gray-400">{a.name}</span>
            </div>
            <span className="text-sm font-medium text-foreground-default">{a.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
