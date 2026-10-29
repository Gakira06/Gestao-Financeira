import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { formatMoney } from '../utils/finance';

export default function CategoryBreakdown({ data, emptyText = 'Sem despesas neste mês.' }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (data.length === 0) {
    return (
      <p className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="grid items-center gap-4 sm:grid-cols-[170px_1fr]">
      <div className="relative mx-auto h-[170px] w-[170px]">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={56} outerRadius={82} paddingAngle={2} stroke="none">
              {data.map((item) => (
                <Cell key={item.id} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatMoney(value)}
              contentStyle={{ borderRadius: 14, border: '1px solid rgba(120,113,108,.25)', fontSize: 13 }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xs text-stone-500">Total</span>
          <strong className="text-base font-semibold tabular-nums text-stone-900 dark:text-white">{formatMoney(total)}</strong>
        </div>
      </div>
      <div className="space-y-2.5">
        {data.slice(0, 6).map((item) => {
          const pct = (item.value / total) * 100;
          return (
            <div key={item.id}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-2 text-stone-700 dark:text-stone-200">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name}</span>
                </span>
                <span className="shrink-0 tabular-nums text-stone-900 dark:text-white">
                  {formatMoney(item.value)} <span className="text-xs text-stone-400">{pct.toFixed(0)}%</span>
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-stone-100 dark:bg-white/5">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: item.color }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
