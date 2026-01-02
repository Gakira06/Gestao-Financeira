import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";

interface SummaryProps {
  income: number;
  outcome: number;
}

export function Summary({ income, outcome }: SummaryProps) {
  const total = income - outcome;
  return (
    <section className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 -mt-16 z-10 relative">
      <div className="bg-white p-7 rounded-2xl flex flex-col gap-2 shadow-md border border-gray-200 hover:shadow-xl hover:scale-[1.03] transition-all duration-200">
        <div className="flex items-center gap-3 mb-2">
          <ArrowUpCircle className="text-green" size={32} />
          <span className="font-semibold text-xl text-gray-700">Entradas</span>
        </div>
        <strong className="text-4xl tracking-tight text-gray-900">
          {formatCurrencyBRL(income)}
        </strong>
      </div>
      <div className="bg-white p-7 rounded-2xl flex flex-col gap-2 shadow-md border border-gray-200 hover:shadow-xl hover:scale-[1.03] transition-all duration-200">
        <div className="flex items-center gap-3 mb-2">
          <ArrowDownCircle className="text-red" size={32} />
          <span className="font-semibold text-xl text-gray-700">Saídas</span>
        </div>
        <strong className="text-4xl tracking-tight text-gray-900">
          {formatCurrencyBRL(outcome)}
        </strong>
      </div>
      <div
        className={`p-7 rounded-2xl flex flex-col gap-2 shadow-md border-2 ${
          total >= 0 ? "bg-green/10 border-green" : "bg-red/10 border-red"
        } hover:shadow-xl hover:scale-[1.03] transition-all duration-200`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="font-semibold text-xl text-gray-700">Total</span>
        </div>
        <strong className="text-4xl tracking-tight text-gray-900">
          {formatCurrencyBRL(total)}
        </strong>
      </div>
    </section>
  );
}
