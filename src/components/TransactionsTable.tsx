import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";
import type { Transaction } from "../types/Transaction";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 overflow-x-auto">
      <table className="min-w-full bg-white rounded-2xl text-gray-700 shadow-md border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-4 text-left font-bold text-base uppercase tracking-wide">
              Título
            </th>
            <th className="px-6 py-4 text-left font-bold text-base uppercase tracking-wide">
              Valor
            </th>
            <th className="px-6 py-4 text-left font-bold text-base uppercase tracking-wide">
              Categoria
            </th>
            <th className="px-6 py-4 text-left font-bold text-base uppercase tracking-wide">
              Banco
            </th>
            <th className="px-6 py-4 text-left font-bold text-base uppercase tracking-wide">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, idx) => (
            <tr
              key={transaction.id}
              className={`border-t border-gray-100 hover:bg-gray-50 transition-colors duration-150 ${
                idx % 2 === 0 ? "bg-white" : "bg-gray-50"
              }`}
            >
              <td className="px-6 py-4 text-base font-medium">
                {transaction.title}
              </td>
              <td
                className={`px-6 py-4 font-semibold text-lg ${
                  transaction.type === "income" ? "text-green" : "text-red"
                }`}
              >
                {transaction.type === "outcome" && "- "}
                {formatCurrencyBRL(transaction.amount)}
              </td>
              <td className="px-6 py-4 text-base">{transaction.category}</td>
              <td className="px-6 py-4 text-base">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {transaction.bank}
                </span>
              </td>
              <td className="px-6 py-4 text-base">
                {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
