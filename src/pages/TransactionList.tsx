import { Sidebar } from "../components/Sidebar";
import { TransactionList } from "../components/TransactionList";

export function TransactionListPage() {
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <main className="flex-1 px-2 md:px-8 py-8 max-w-6xl mx-auto">
        <TransactionList />
      </main>
    </div>
  );
}
