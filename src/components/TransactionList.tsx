import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Tag, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface Transaction {
  id: number;
  titulo: string;
  valor: number;
  tipo: "entrada" | "saida";
  categoria: string;
  data: string;
}

export function TransactionList({ className = "" }: { className?: string }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    api.get("/transacoes").then((res) => setTransactions(res.data));
  }, []);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <h3 className="text-lg font-bold text-text-dark mb-2">
        Transações Recentes
      </h3>
      <div className="flex flex-col gap-2">
        {transactions.map((t) => (
          <div
            key={t.id}
            className="bg-card rounded-xl shadow-sm px-4 py-3 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Tag className="text-primary" />
              <div>
                <div className="font-semibold text-text-dark">{t.titulo}</div>
                <div className="text-xs text-text-light">
                  {new Date(t.data).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </div>
              </div>
            </div>
            <div
              className={`text-lg font-bold ${
                t.tipo === "entrada" ? "text-primary" : "text-danger"
              }`}
            >
              {t.tipo === "entrada" ? "+" : "-"}
              {t.valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
