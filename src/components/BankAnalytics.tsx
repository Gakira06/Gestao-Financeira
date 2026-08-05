import { useMemo } from "react";
import type { Transaction } from "../types/Transaction";
import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface BankAnalyticsProps {
  transactions: Transaction[];
  bankName: string;
}

export function BankAnalytics({ transactions, bankName }: BankAnalyticsProps) {
  const analytics = useMemo(() => {
    // Agrupa transações por mês
    const monthlyData = transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.data);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      if (!acc[monthKey]) {
        acc[monthKey] = {
          month: monthKey,
          income: 0,
          outcome: 0,
          balance: 0,
        };
      }

      if (transaction.tipo === "entrada") {
        acc[monthKey].income += transaction.valor;
      } else {
        acc[monthKey].outcome += transaction.valor;
      }

      return acc;
    }, {} as Record<string, { month: string; income: number; outcome: number; balance: number }>);

    // Ordena por mês e calcula saldo acumulado
    const sortedData = Object.values(monthlyData).sort((a, b) =>
      a.month.localeCompare(b.month)
    );

    let cumulativeBalance = 0;
    sortedData.forEach((data) => {
      cumulativeBalance += data.income - data.outcome;
      data.balance = cumulativeBalance;
    });

    // Calcula taxa de crescimento média mensal
    let growthRate = 0;
    if (sortedData.length > 1) {
      const growthRates = [];
      for (let i = 1; i < sortedData.length; i++) {
        const prev = sortedData[i - 1].balance;
        const curr = sortedData[i].balance;
        if (prev !== 0) {
          growthRates.push(((curr - prev) / Math.abs(prev)) * 100);
        }
      }
      if (growthRates.length > 0) {
        growthRate =
          growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
      }
    }

    // Saldo atual
    const currentBalance =
      sortedData.length > 0 ? sortedData[sortedData.length - 1].balance : 0;

    // Projeção para os próximos 6 meses
    const projections = [];
    let projectedBalance = currentBalance;
    const avgMonthlyGrowth = growthRate / 100;

    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + i);
      const monthKey = `${futureDate.getFullYear()}-${String(
        futureDate.getMonth() + 1
      ).padStart(2, "0")}`;

      projectedBalance = projectedBalance * (1 + avgMonthlyGrowth);

      projections.push({
        month: monthKey,
        balance: projectedBalance,
        isProjection: true,
      });
    }

    return {
      monthlyData: sortedData,
      growthRate,
      currentBalance,
      projections,
      chartData: [
        ...sortedData.map((d) => ({
          month: d.month,
          balance: d.balance,
          isProjection: false,
        })),
        ...projections,
      ],
    };
  }, [transactions]);

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
          <h3 className="text-xs md:text-xs md:text-sm text-text-light mb-2">
            Saldo Atual
          </h3>
          <p
            className={`text-2xl md:text-3xl font-bold ${
              analytics.currentBalance >= 0 ? "text-green" : "text-red"
            }`}
          >
            {formatCurrencyBRL(analytics.currentBalance)}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm text-text-light mb-2">
            Taxa de Crescimento Média
          </h3>
          <p
            className={`text-3xl font-bold ${
              analytics.growthRate >= 0 ? "text-green" : "text-red"
            }`}
          >
            {analytics.growthRate.toFixed(2)}%
            <span className="text-sm text-text-light ml-2">ao mês</span>
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-md">
          <h3 className="text-sm text-text-light mb-2">Projeção em 6 Meses</h3>
          <p
            className={`text-3xl font-bold ${
              analytics.projections.length > 0
                ? analytics.projections[5].balance >= 0
                  ? "text-green"
                  : "text-red"
                : "text-text-dark"
            }`}
          >
            {analytics.projections.length > 0
              ? formatCurrencyBRL(analytics.projections[5].balance)
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Gráfico de Evolução e Projeção */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4 text-text-dark">
          Evolução do Saldo - {bankName}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analytics.chartData}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00875f" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00875f" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProjection" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const [year, month] = value.split("-");
                return `${month}/${year.slice(2)}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrencyBRL(value)}
            />
            <Tooltip
              formatter={(value: number | undefined) =>
                value ? formatCurrencyBRL(value) : "R$ 0,00"
              }
              labelFormatter={(label) => {
                const [year, month] = label.split("-");
                return `${month}/${year}`;
              }}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#00875f"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBalance)"
              connectNulls
            />
          </AreaChart>
        </ResponsiveContainer>
        <p className="text-xs text-text-light mt-2 text-center">
          * Projeção baseada na taxa de crescimento média dos últimos meses
        </p>
      </div>

      {/* Gráfico de Receitas vs Despesas por Mês */}
      <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4 text-text-dark">
          Receitas vs Despesas - {bankName}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={analytics.monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => {
                const [year, month] = value.split("-");
                return `${month}/${year.slice(2)}`;
              }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => formatCurrencyBRL(value)}
            />
            <Tooltip
              formatter={(value: number | undefined) =>
                value ? formatCurrencyBRL(value) : "R$ 0,00"
              }
              labelFormatter={(label) => {
                const [year, month] = label.split("-");
                return `${month}/${year}`;
              }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#00875f"
              strokeWidth={2}
              name="Receitas"
            />
            <Line
              type="monotone"
              dataKey="outcome"
              stroke="#f75a68"
              strokeWidth={2}
              name="Despesas"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
