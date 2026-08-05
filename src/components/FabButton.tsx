import { Plus } from "lucide-react";

export function FabButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 z-[100] bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-2xl hover:from-orange-600 hover:to-orange-700 hover:scale-110 active:scale-95 transition-all duration-200 text-3xl focus:outline-none focus:ring-4 focus:ring-orange-500/50"
      aria-label="Nova Transação"
    >
      <Plus size={36} />
    </button>
  );
}
