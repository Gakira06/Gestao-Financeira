import { Sidebar } from "../components/Sidebar";
import { SummaryCard } from "../components/SummaryCard";
import { TransactionList } from "../components/TransactionList";
import { FabButton } from "../components/FabButton";
import { TransactionFormModal } from "../components/TransactionFormModal";
import { BankTabs, BANKS } from "../components/BankTabs";
import { BankAnalytics } from "../components/BankAnalytics";
import { AIAnalysis } from "../components/AIAnalysis";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { Transaction } from "../types/Transaction";

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get("/transacoes").then((res) => {
      // Filtrar apenas transações com banco definido
      const transacoesComBanco = res.data.filter((t: any) => t.banco);
      setTransactions(transacoesComBanco);
    });
  }, [open]); // Recarrega quando o modal fechar

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row pb-20 md:pb-0">
      <Sidebar />
      <main className="flex-1 px-4 md:px-8 py-4 md:py-8 max-w-7xl mx-auto w-full md:ml-20">
        <SummaryCard />

        {/* Análise com IA */}
        <div className="my-6">
          <AIAnalysis transactions={transactions} />
        </div>

        <BankTabs>
          {(selectedBank) => {
            const filteredTransactions =
              selectedBank === "all"
                ? transactions
                : transactions.filter((t) => t.banco === selectedBank);

            const bankName =
              BANKS.find((b) => b.value === selectedBank)?.label || "Todos";

            return (
              <div className="space-y-8">
                <BankAnalytics
                  transactions={filteredTransactions}
                  bankName={bankName}
                />
                <div className="bg-white rounded-xl p-6 shadow-md">
                  <h3 className="text-lg font-bold mb-4 text-text-dark">
                    Transações - {bankName}
                  </h3>
                  <TransactionList />
                </div>
              </div>
            );
          }}
        </BankTabs>

        <FabButton onClick={() => setOpen(true)} />
        <TransactionFormModal open={open} onOpenChange={setOpen} />
      </main>
    </div>
  );
}
