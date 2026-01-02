import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
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
    <div className="w-full max-w-4xl mx-auto mt-8 bg-white rounded shadow p-4">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Resumo Gráfico</h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#363F5F" />
          <YAxis stroke="#363F5F" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" isAnimationActive fill="#33CC95">
            {data.map((entry, index) => (
              <cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
