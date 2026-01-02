import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";

interface SummaryProps {
  income: number;
  outcome: number;
}

export function Summary({ income, outcome }: SummaryProps) {
  const total = income - outcome;
  return (
    <section className="w-full max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 -mt-8 z-10 relative">
      <div className="bg-gray-600 p-6 rounded-xl text-white flex flex-col gap-2 shadow-lg border border-gray-300 hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-2 mb-2">
          <ArrowUpCircle className="text-green" size={28} />
          <span className="font-semibold text-lg">Entradas</span>
        </div>
        <strong className="text-3xl tracking-tight">
          {formatCurrencyBRL(income)}
        </strong>
      </div>
      <div className="bg-gray-600 p-6 rounded-xl text-white flex flex-col gap-2 shadow-lg border border-gray-300 hover:scale-105 transition-transform duration-200">
        <div className="flex items-center gap-2 mb-2">
          <ArrowDownCircle className="text-red" size={28} />
          <span className="font-semibold text-lg">Saídas</span>
        </div>
        <strong className="text-3xl tracking-tight">
          {formatCurrencyBRL(outcome)}
        </strong>
      </div>
      <div
        className={`p-6 rounded-xl text-white flex flex-col gap-2 shadow-lg border-2 ${
          total >= 0 ? "bg-green border-green-dark" : "bg-red border-red"
        } hover:scale-105 transition-transform duration-200`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold text-lg">Total</span>
        </div>
        <strong className="text-3xl tracking-tight">
          {formatCurrencyBRL(total)}
        </strong>
      </div>
    </section>
  );
}
