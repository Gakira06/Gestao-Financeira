import { Sidebar } from "../components/Sidebar";
import { SummaryCard } from "../components/SummaryCard";
import { TrendChart } from "../components/TrendChart";
import { TransactionList } from "../components/TransactionList";
import { FabButton } from "../components/FabButton";
import { TransactionFormModal } from "../components/TransactionFormModal";
import { BankTabs, BANKS } from "../components/BankTabs";
import { BankAnalytics } from "../components/BankAnalytics";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import type { Transaction } from "../types/Transaction";

export function Dashboard() {
  const [open, setOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get("/transacoes").then((res) => setTransactions(res.data));
  }, [open]); // Recarrega quando o modal fechar

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 px-2 md:px-8 py-8 max-w-7xl mx-auto">
        <SummaryCard />

        <BankTabs>
          {(selectedBank) => {
            const filteredTransactions =
              selectedBank === "all"
                ? transactions
                : transactions.filter((t) => t.bank === selectedBank);

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
