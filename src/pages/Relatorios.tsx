import { Sidebar } from "../components/Sidebar";
import { BankTabs, BANKS } from "../components/BankTabs";
import { BankAnalytics } from "../components/BankAnalytics";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { Transaction } from "../types/Transaction";

export function Relatorios() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get("/transacoes").then((res) => setTransactions(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 px-2 md:px-8 py-8 max-w-7xl mx-auto md:ml-20">
        <h1 className="text-3xl font-bold text-text-dark mb-8">
          Relatórios Financeiros
        </h1>

        <BankTabs>
          {(selectedBank) => {
            const filteredTransactions =
              selectedBank === "all"
                ? transactions
                : transactions.filter((t) => t.banco === selectedBank);

            const bankName =
              BANKS.find((b) => b.value === selectedBank)?.label || "Todos";

            return (
              <BankAnalytics
                transactions={filteredTransactions}
                bankName={bankName}
              />
            );
          }}
        </BankTabs>
      </main>
    </div>
  );
}
