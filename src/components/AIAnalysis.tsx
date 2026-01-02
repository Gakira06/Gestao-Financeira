import { useState, useEffect } from "react";
import type { Transaction } from "../types/Transaction";
import {
  Brain,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Loader2,
} from "lucide-react";
import { formatCurrencyBRL } from "../utils/formatCurrencyBRL";
import { generateAIInsights } from "../services/openai";

interface AIAnalysisProps {
  transactions: Transaction[];
}

export function AIAnalysis({ transactions }: AIAnalysisProps) {
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (transactions.length === 0) {
      setAiAnalysis(null);
      return;
    }

    async function fetchAIAnalysis() {
      setLoading(true);
      setError(false);
      try {
        const result = await generateAIInsights(transactions);
        setAiAnalysis(result);
      } catch (err) {
        console.error("Erro ao buscar análise de IA:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    // Debounce - só gera análise após 1 segundo sem mudanças
    const timeout = setTimeout(fetchAIAnalysis, 1000);
    return () => clearTimeout(timeout);
  }, [transactions]);

  // Cálculos locais para o resumo
  const localAnalysis = (() => {
    if (transactions.length === 0) return null;

    const despesas = transactions.filter((t) => t.tipo === "saida");
    const receitas = transactions.filter((t) => t.tipo === "entrada");

    const totalDespesas = despesas.reduce((sum, t) => sum + t.valor, 0);
    const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0);

    const meses = new Set(
      despesas.map((t) => {
        const date = new Date(t.data);
        return `${date.getFullYear()}-${date.getMonth()}`;
      })
    );
    const mediaMensal = totalDespesas / (meses.size || 1);

    return {
      mediaMensal,
      totalDespesas,
      totalReceitas,
    };
  })();

  if (!localAnalysis) {
    return (
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="text-primary" size={28} />
          <h2 className="text-lg md:text-xl font-bold text-text-dark">
            Análise Inteligente com IA
          </h2>
        </div>
        <p className="text-text-light text-center py-8">
          Adicione transações para receber análises personalizadas com IA
        </p>
      </div>
    );
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "danger":
        return <AlertCircle className="text-red-500" size={24} />;
      case "warning":
        return <AlertCircle className="text-orange-500" size={24} />;
      case "success":
        return <TrendingUp className="text-green-500" size={24} />;
      default:
        return <Lightbulb className="text-blue-500" size={24} />;
    }
  };

  return (
    <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-xl p-4 md:p-6 shadow-lg border border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Brain className="text-purple-600" size={28} />
          <h2 className="text-lg md:text-xl font-bold text-text-dark">
            Análise Inteligente com IA
          </h2>
        </div>
        {loading && (
          <Loader2 className="animate-spin text-purple-600" size={20} />
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm">
            ⚠️ Erro ao carregar análise da IA. Mostrando análise básica.
          </p>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <Loader2
            className="animate-spin text-purple-600 mx-auto mb-3"
            size={40}
          />
          <p className="text-text-light">Gerando análise com IA...</p>
        </div>
      )}

      {!loading && aiAnalysis && (
        <>
          {/* Resumo da IA */}
          {aiAnalysis.resumo && (
            <div className="bg-white rounded-lg p-4 mb-4 border-l-4 border-purple-500">
              <p className="text-text-dark italic">{aiAnalysis.resumo}</p>
            </div>
          )}

          {/* Insights da IA */}
          <div className="space-y-4 mb-6">
            {aiAnalysis.insights?.map((insight: any, idx: number) => (
              <div
                key={idx}
                className={`bg-white rounded-lg p-4 border-l-4 ${
                  insight.type === "danger"
                    ? "border-red-500"
                    : insight.type === "warning"
                    ? "border-orange-500"
                    : insight.type === "success"
                    ? "border-green-500"
                    : "border-blue-500"
                }`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(insight.type)}
                  <div className="flex-1">
                    <h3 className="font-bold text-text-dark mb-1">
                      {insight.title}
                    </h3>
                    <p className="text-sm text-text-light">{insight.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sugestões de Economia da IA */}
          {aiAnalysis.suggestions && aiAnalysis.suggestions.length > 0 && (
            <div className="bg-white rounded-lg p-4 mb-4">
              <h3 className="font-bold text-text-dark mb-3 flex items-center gap-2">
                <Lightbulb className="text-yellow-500" size={20} />
                Como Economizar Mais
              </h3>
              {aiAnalysis.suggestions.map((sug: any, idx: number) => (
                <div key={idx} className="mb-3 last:mb-0">
                  <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                    <span className="font-semibold text-text-dark">
                      {sug.categoria}
                    </span>
                    <span className="text-green-600 font-bold text-sm">
                      Economize até {formatCurrencyBRL(sug.economiaPossivel)}
                    </span>
                  </div>
                  <p className="text-sm text-text-light bg-blue-50 p-2 rounded">
                    💡 {sug.acao}
                  </p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Resumo Rápido */}
      <div className="mt-4 pt-4 border-t border-purple-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-xs text-text-light">Média Mensal</p>
            <p className="text-base md:text-lg font-bold text-text-dark">
              {formatCurrencyBRL(localAnalysis.mediaMensal)}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-light">Taxa de Economia</p>
            <p className="text-base md:text-lg font-bold text-green-600">
              {localAnalysis.totalReceitas > 0
                ? (
                    ((localAnalysis.totalReceitas -
                      localAnalysis.totalDespesas) /
                      localAnalysis.totalReceitas) *
                    100
                  ).toFixed(1)
                : "0.0"}
              %
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
