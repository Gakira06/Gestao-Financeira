import * as Dialog from "@radix-ui/react-dialog";
import { X, ArrowDownCircle, ArrowUpCircle } from "lucide-react";
import { useState } from "react";

interface NewTransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (data: {
    title: string;
    amount: number;
    type: "income" | "outcome";
    category: string;
  }) => void;
}

export function NewTransactionModal({
  open,
  onOpenChange,
  onCreate,
}: NewTransactionModalProps) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [type, setType] = useState<"income" | "outcome">("income");
  const [category, setCategory] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !amount || !category) return;
    onCreate({ title, amount: Number(amount), type, category });
    setTitle("");
    setAmount("");
    setType("income");
    setCategory("");
    onOpenChange(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fadeIn" />
        <Dialog.Content className="fixed z-50 bg-gray-800 border-2 border-green rounded-2xl p-8 w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl animate-slideUp">
          <Dialog.Title className="text-2xl font-extrabold text-green mb-6 text-center drop-shadow">
            Nova Transação
          </Dialog.Title>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-300 hover:text-green focus:outline-none focus:ring-2 focus:ring-green"
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <input
              className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:bg-white transition-all"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:bg-white transition-all"
              placeholder="Valor"
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
            />
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green/60 ${
                  type === "income"
                    ? "bg-green text-white border-green scale-105 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setType("income")}
              >
                <ArrowUpCircle size={22} /> Entrada
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold shadow-sm border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red/60 ${
                  type === "outcome"
                    ? "bg-red text-white border-red scale-105 shadow-md"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setType("outcome")}
              >
                <ArrowDownCircle size={22} /> Saída
              </button>
            </div>
            <input
              className="bg-gray-100 border border-gray-300 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green focus:bg-white transition-all"
              placeholder="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green text-white px-6 py-3 rounded-xl font-bold shadow-md hover:bg-green-dark hover:scale-105 transition-all duration-200 mt-2 focus:outline-none focus:ring-2 focus:ring-green-dark"
            >
              Cadastrar
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
