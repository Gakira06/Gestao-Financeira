import { Sidebar } from "../components/Sidebar";
import { useState, useEffect, useMemo } from "react";
import { api } from "../services/api";
import type { Transaction } from "../types/Transaction";
import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#84cc16",
];

export function Categorias() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");

  useEffect(() => {
    api.get("/transacoes").then((res) => setTransactions(res.data));
  }, []);

  const categoryData = useMemo(() => {
    const filtered = transactions.filter((t) => t.tipo === tipo);
    const grouped = filtered.reduce((acc, t) => {
      if (!acc[t.categoria]) {
        acc[t.categoria] = 0;
      }
      acc[t.categoria] += t.valor;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [transactions, tipo]);

  const total = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 px-2 md:px-8 py-8 max-w-6xl mx-auto md:ml-20">
        <h1 className="text-3xl font-bold text-text-dark mb-8">
          Gastos por Categoria
        </h1>

        {/* Filtro Entrada/Saída */}
        <div className="flex gap-2 mb-8">
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              tipo === "saida"
                ? "bg-danger text-white shadow-md"
                : "bg-white text-text-dark hover:bg-danger/10 border border-gray-200"
            }`}
            onClick={() => setTipo("saida")}
          >
            Despesas
          </button>
          <button
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              tipo === "entrada"
                ? "bg-primary text-white shadow-md"
                : "bg-white text-text-dark hover:bg-primary/10 border border-gray-200"
            }`}
            onClick={() => setTipo("entrada")}
          >
            Receitas
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfico de Pizza */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4 text-text-dark">
              Distribuição por Categoria
            </h3>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                    }
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number | undefined) =>
                      value ? formatCurrencyBRL(value) : "R$ 0,00"
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-text-light py-20">
                Nenhuma transação encontrada
              </p>
            )}
          </div>

          {/* Lista de Categorias */}
          <div className="bg-white rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-bold mb-4 text-text-dark">
              Detalhamento
            </h3>
            <div className="space-y-3">
              {categoryData.map((item, index) => {
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-background rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="font-semibold text-text-dark">
                        {item.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-text-dark">
                        {formatCurrencyBRL(item.value)}
                      </div>
                      <div className="text-xs text-text-light">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {categoryData.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-text-dark">Total:</span>
                  <span className="text-xl font-bold text-text-dark">
                    {formatCurrencyBRL(total)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
