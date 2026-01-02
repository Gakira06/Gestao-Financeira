import { Plus } from "lucide-react";

interface HeaderProps {
  onOpenNewTransaction: () => void;
}

export function Header({ onOpenNewTransaction }: HeaderProps) {
  return (
    <header className="bg-gray-800 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold text-white">
          Financeiro<span className="text-green">$</span>
        </span>
      </div>
      <button
        type="button"
        onClick={onOpenNewTransaction}
        className="flex items-center gap-2 bg-green text-white px-4 py-2 rounded hover:bg-green-dark transition-colors"
      >
        <Plus size={20} />
        Nova Transação
      </button>
    </header>
  );
}
