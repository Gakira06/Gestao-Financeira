import { Sidebar } from "../components/Sidebar";
import { BankTabs, BANKS } from "../components/BankTabs";
import { BankAnalytics } from "../components/BankAnalytics";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { Transaction } from "../types/Transaction";

export function Relatorios() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get("/transacoes").then((res) => {
      // Filtrar apenas transações com banco definido
      const transacoesComBanco = res.data.filter((t: any) => t.banco);
      setTransactions(transacoesComBanco);
    });
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-4 md:py-8 max-w-7xl mx-auto w-full md:ml-20">
        <h1 className="text-2xl md:text-3xl font-bold text-text-dark mb-6 md:mb-8">
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
