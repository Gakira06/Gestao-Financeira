import { ToastContainer } from "react-toastify";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import { Header } from "./components/Header";
import { Summary } from "./components/Summary";
import { TransactionsTable } from "./components/TransactionsTable";
import { SummaryChart } from "./components/SummaryChart";
import type { Transaction } from "./types/Transaction";
import { NewTransactionModal } from "./components/NewTransactionModal";

const transactionsMock: Transaction[] = [
  {
    id: 1,
    title: "Salário",
    amount: 5000,
    type: "income",
    category: "Trabalho",
    createdAt: "2026-01-01",
  },
  {
    id: 2,
    title: "Aluguel",
    amount: 1500,
    type: "outcome",
    category: "Casa",
    createdAt: "2026-01-02",
  },
  {
    id: 3,
    title: "Freelance",
    amount: 1200,
    type: "income",
    category: "Trabalho",
    createdAt: "2026-01-02",
  },
  {
    id: 4,
    title: "Supermercado",
    amount: 400,
    type: "outcome",
    category: "Alimentação",
    createdAt: "2026-01-02",
  },
];

function App() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(transactionsMock);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const outcome = transactions
    .filter((t) => t.type === "outcome")
    .reduce((acc, t) => acc + t.amount, 0);

  function handleCreateTransaction(data: {
    title: string;
    amount: number;
    type: "income" | "outcome";
    category: string;
  }) {
    const newTransaction: Transaction = {
      id: transactions.length + 1,
      title: data.title,
      amount: data.amount,
      type: data.type,
      category: data.category,
      createdAt: new Date().toISOString(),
    };
    setTransactions([newTransaction, ...transactions]);
    toast.success("Transação cadastrada com sucesso!");
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      <ToastContainer position="top-right" autoClose={3000} />
      <Header onOpenNewTransaction={() => setIsModalOpen(true)} />
      <Summary income={income} outcome={outcome} />
      <SummaryChart income={income} outcome={outcome} />
      <TransactionsTable transactions={transactions} />
      <NewTransactionModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onCreate={handleCreateTransaction}
      />
    </div>
  );
}

export default App;
