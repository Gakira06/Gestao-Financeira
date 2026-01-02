import { useEffect, useState } from "react";
import { api } from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

interface TrendChartProps {
  className?: string;
}

export function TrendChart({ className }: TrendChartProps) {
  const [data, setData] = useState<{ data: string; saldo: number }[]>([]);

  useEffect(() => {
    api.get("/transacoes").then((res) => {
      // Agrupa por data e calcula saldo acumulado
      let saldo = 0;
      const grouped = res.data.reduce((acc: Record<string, number>, t: any) => {
        saldo += t.tipo === "entrada" ? t.valor : -t.valor;
        acc[t.data] = saldo;
        return acc;
      }, {});
      setData(
        Object.entries(grouped).map(([data, saldo]) => ({ data, saldo }))
      );
    });
  }, []);

  return (
    <div className={className}>
      <div className="bg-card rounded-2xl shadow-md p-6">
        <h3 className="text-lg font-bold text-text-dark mb-4">
          Evolução do Saldo
        </h3>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="data"
              tickFormatter={(d) =>
                d.slice(5, 10).split("-").reverse().join("/")
              }
              stroke="#6b7280"
              fontSize={13}
            />
            <YAxis stroke="#6b7280" fontSize={13} />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              formatter={(v: number) =>
                v.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })
              }
            />
            <Area
              type="monotone"
              dataKey="saldo"
              stroke="#14b8a6"
              fillOpacity={1}
              fill="url(#colorSaldo)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
