import { useEffect, useState } from "react";
import { api } from "../services/api";
import { ArrowUpRight, ArrowDownRight, DollarSign } from "lucide-react";

export function SummaryCard() {
  const [summary, setSummary] = useState<{
    saldo: number;
    total_entradas: number;
    total_saidas: number;
  } | null>(null);

  useEffect(() => {
    api.get("/transacoes/resumo").then((res) => setSummary(res.data));
  }, []);

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
      <div className="bg-card rounded-2xl shadow-md p-4 md:p-6 flex flex-col gap-2">
        <span className="text-text-light text-sm md:text-base font-medium flex items-center gap-2">
          <ArrowUpRight className="text-primary" size={20} /> Receitas Totais
        </span>
        <span className="text-2xl md:text-3xl font-bold text-primary">
          {summary
            ? summary.total_entradas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "--"}
        </span>
      </div>
      <div className="bg-card rounded-2xl shadow-md p-4 md:p-6 flex flex-col gap-2">
        <span className="text-text-light text-sm md:text-base font-medium flex items-center gap-2">
          <ArrowDownRight className="text-danger" size={20} /> Despesas Totais
        </span>
        <span className="text-2xl md:text-3xl font-bold text-danger">
          {summary
            ? summary.total_saidas.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "--"}
        </span>
      </div>
      <div className="bg-card rounded-2xl shadow-md p-4 md:p-6 flex flex-col gap-2 border-2 border-primary">
        <span className="text-text-light text-sm md:text-base font-medium flex items-center gap-2">
          <DollarSign className="text-primary" size={20} /> Saldo Atual
        </span>
        <span className="text-3xl md:text-4xl font-extrabold text-text-dark">
          {summary
            ? summary.saldo.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })
            : "--"}
        </span>
      </div>
    </section>
  );
}
