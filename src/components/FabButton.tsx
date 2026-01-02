import { Plus } from "lucide-react";

export function FabButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-[100] bg-primary text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:bg-primary-dark hover:scale-110 active:scale-95 transition-all duration-200 text-3xl focus:outline-none focus:ring-4 focus:ring-primary/50"
      aria-label="Nova Transação"
    >
      <Plus size={36} />
    </button>
  );
}
