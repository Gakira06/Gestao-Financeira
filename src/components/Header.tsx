import { Plus } from "lucide-react";

interface HeaderProps {
  onOpenNewTransaction: () => void;
}

export function Header({ onOpenNewTransaction }: HeaderProps) {
  return (
    <header className="bg-gradient-to-r from-green via-gray-800 to-gray-600 px-6 py-6 flex items-center justify-between shadow-lg">
      <div className="flex items-center gap-2">
        <span className="text-3xl font-extrabold text-white tracking-tight drop-shadow">
          Financeiro<span className="text-green">$</span>
        </span>
      </div>
      <button
        type="button"
        onClick={onOpenNewTransaction}
        className="flex items-center gap-2 bg-green text-white px-6 py-3 rounded-lg shadow hover:scale-105 hover:bg-green-dark transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-dark"
      >
        <Plus size={22} />
        <span className="font-semibold">Nova Transação</span>
      </button>
    </header>
  );
}
