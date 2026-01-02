import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";
import type { Transaction } from "../types/Transaction";

interface TransactionsTableProps {
  transactions: Transaction[];
}

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 overflow-x-auto">
      <table className="min-w-full bg-gray-800 rounded text-gray-100">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left">Título</th>
            <th className="px-6 py-3 text-left">Valor</th>
            <th className="px-6 py-3 text-left">Categoria</th>
            <th className="px-6 py-3 text-left">Data</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="border-t border-gray-600">
              <td className="px-6 py-4">{transaction.title}</td>
              <td
                className={`px-6 py-4 font-medium ${
                  transaction.type === "income" ? "text-green" : "text-red"
                }`}
              >
                {transaction.type === "outcome" && "- "}
                {formatCurrencyBRL(transaction.amount)}
              </td>
              <td className="px-6 py-4">{transaction.category}</td>
              <td className="px-6 py-4">
                {new Date(transaction.createdAt).toLocaleDateString("pt-BR")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
