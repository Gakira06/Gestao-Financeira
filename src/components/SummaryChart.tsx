import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";

interface SummaryChartProps {
  income: number;
  outcome: number;
}

export function SummaryChart({ income, outcome }: SummaryChartProps) {
  const data = [
    { name: "Entradas", value: income, fill: "#33CC95" },
    { name: "Saídas", value: outcome, fill: "#E52E4D" },
    {
      name: "Saldo",
      value: income - outcome,
      fill: income - outcome >= 0 ? "#33CC95" : "#E52E4D",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mt-10 bg-white rounded-2xl shadow-md p-8 border border-gray-200">
      <h2 className="text-2xl font-extrabold mb-6 text-gray-800">
        Resumo Gráfico
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barSize={48} style={{ fontFamily: "inherit" }}>
          <XAxis
            dataKey="name"
            stroke="#363F5F"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 16, fill: "#363F5F" }}
          />
          <YAxis
            stroke="#363F5F"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 15, fill: "#363F5F" }}
          />
          <Tooltip
            wrapperClassName="!rounded-lg !shadow-lg !border !border-gray-200 !bg-white !text-gray-800"
            contentStyle={{ borderRadius: 12, fontSize: 15 }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 15 }} />
          <Bar
            dataKey="value"
            isAnimationActive
            fill="#33CC95"
            radius={[8, 8, 0, 0]}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
