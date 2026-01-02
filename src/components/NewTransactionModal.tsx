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
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed z-50 bg-gray-800 rounded-lg p-8 w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-lg">
          <Dialog.Title className="text-lg font-bold text-white mb-4">
            Nova Transação
          </Dialog.Title>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 text-gray-300 hover:text-white"
          >
            <X />
          </button>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-2">
            <input
              className="bg-gray-600 rounded px-4 py-2 text-white placeholder-gray-300"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <input
              className="bg-gray-600 rounded px-4 py-2 text-white placeholder-gray-300"
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
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded ${
                  type === "income"
                    ? "bg-green text-white"
                    : "bg-gray-600 text-gray-200"
                } transition-colors`}
                onClick={() => setType("income")}
              >
                <ArrowUpCircle /> Entrada
              </button>
              <button
                type="button"
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded ${
                  type === "outcome"
                    ? "bg-red text-white"
                    : "bg-gray-600 text-gray-200"
                } transition-colors`}
                onClick={() => setType("outcome")}
              >
                <ArrowDownCircle /> Saída
              </button>
            </div>
            <input
              className="bg-gray-600 rounded px-4 py-2 text-white placeholder-gray-300"
              placeholder="Categoria"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-green text-white px-4 py-2 rounded font-bold hover:bg-green-dark transition-colors mt-2"
            >
              Cadastrar
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
