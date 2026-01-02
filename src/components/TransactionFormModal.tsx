import * as Dialog from "@radix-ui/react-dialog";
import { useState } from "react";
import { api } from "../services/api";
import { toast } from "react-toastify";

const categorias = [
  "Salário",
  "Alimentação",
  "Transporte",
  "Lazer",
  "Casa",
  "Outros",
];

const bancos = [
  { value: "xp1", label: "XP1 Pessoal" },
  { value: "xp2", label: "XP2 Compartilhado" },
  { value: "inter", label: "Inter" },
  { value: "mercadopago", label: "Mercado Pago" },
];

export function TransactionFormModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [valor, setValor] = useState("");
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida">("entrada");
  const [data, setData] = useState("");
  const [categoria, setCategoria] = useState("");
  const [banco, setBanco] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/transacoes", {
        valor: Number(valor),
        titulo,
        tipo,
        data,
        categoria,
        banco,
      });
      toast.success("Transação cadastrada!");
      setValor("");
      setTitulo("");
      setTipo("entrada");
      setData("");
      setCategoria("");
      setBanco("");
      onOpenChange(false);
    } catch {
      toast.error("Erro ao cadastrar transação");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-40" />
        <Dialog.Content className="fixed z-50 bg-gradient-to-br from-white via-blue-50 to-purple-50 rounded-2xl p-8 w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl border border-gray-200">
          <Dialog.Title className="text-xl font-bold text-text-dark mb-6 text-center">
            Nova Transação
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              className="text-4xl font-bold text-center bg-background rounded-xl py-4 px-2 border-none outline-none focus:ring-2 focus:ring-primary"
              placeholder="R$ 0,00"
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
            />
            <input
              className="bg-background rounded-xl px-4 py-3 text-text-dark placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Descrição"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <div className="flex gap-2">
              <button
                type="button"
                className={`flex-1 py-3 rounded-xl font-semibold border transition-all duration-200 ${
                  tipo === "entrada"
                    ? "bg-primary text-white border-primary shadow-md"
                    : "bg-background text-text-dark border-gray-300 hover:border-primary hover:bg-primary/5 active:bg-primary/10"
                }`}
                onClick={() => setTipo("entrada")}
              >
                Entrada
              </button>
              <button
                type="button"
                className={`flex-1 py-3 rounded-xl font-semibold border transition-all duration-200 ${
                  tipo === "saida"
                    ? "bg-danger text-white border-danger shadow-md"
                    : "bg-background text-text-dark border-gray-300 hover:border-danger hover:bg-danger/5 active:bg-danger/10"
                }`}
                onClick={() => setTipo("saida")}
              >
                Saída
              </button>
            </div>
            <input
              className="bg-background rounded-xl px-4 py-3 text-text-dark placeholder-text-light focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
            <select
              className="bg-background rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              required
            >
              <option value="">Selecione a categoria</option>
              {categorias.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <select
              className="bg-background rounded-xl px-4 py-3 text-text-dark focus:outline-none focus:ring-2 focus:ring-primary"
              value={banco}
              onChange={(e) => setBanco(e.target.value)}
              required
            >
              <option value="">Selecione o banco</option>
              {bancos.map((b) => (
                <option key={b.value} value={b.value}>
                  {b.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-xl py-4 font-bold text-lg mt-2 hover:bg-primary-dark transition-all disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar"}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
