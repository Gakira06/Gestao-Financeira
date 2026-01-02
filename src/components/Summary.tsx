import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";

interface SummaryProps {
  income: number;
  outcome: number;
}

export function Summary({ income, outcome }: SummaryProps) {
  const total = income - outcome;
  return (
    <section className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 -mt-8 z-10 relative">
      <div className="bg-gray-600 p-6 rounded text-white flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ArrowUpCircle className="text-green" />
          <span>Entradas</span>
        </div>
        <strong className="text-2xl">{formatCurrencyBRL(income)}</strong>
      </div>
      <div className="bg-gray-600 p-6 rounded text-white flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <ArrowDownCircle className="text-red" />
          <span>Saídas</span>
        </div>
        <strong className="text-2xl">{formatCurrencyBRL(outcome)}</strong>
      </div>
      <div
        className={`p-6 rounded text-white flex flex-col gap-2 ${
          total >= 0 ? "bg-green" : "bg-red"
        }`}
      >
        <div className="flex items-center gap-2">
          <span>Total</span>
        </div>
        <strong className="text-2xl">{formatCurrencyBRL(total)}</strong>
      </div>
    </section>
  );
}
