import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";
import type { Transaction } from "../types/Transaction";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded-xl text-gray-100 shadow-lg border border-gray-300">
        <thead>
          <tr className="bg-gray-600">
            <th className="px-6 py-3 text-left font-bold text-lg text-white">
              Título
            </th>
            <th className="px-6 py-3 text-left font-bold text-lg text-white">
              Valor
            </th>
            <th className="px-6 py-3 text-left font-bold text-lg text-white">
              Categoria
            </th>
            <th className="px-6 py-3 text-left font-bold text-lg text-white">
              Data
            </th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-t border-gray-600 hover:bg-gray-700 transition-colors duration-150"
            >
              <td className="px-6 py-4 text-base">{transaction.title}</td>
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
                {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
