import OpenAI from "openai";
import type { Transaction } from "../types/Transaction";

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Para uso em desenvolvimento
});

export async function generateAIInsights(transactions: Transaction[]) {
  if (transactions.length === 0) {
    return null;
  }

  // Prepara dados para a IA
  const despesas = transactions.filter((t) => t.tipo === "saida");
  const receitas = transactions.filter((t) => t.tipo === "entrada");

  const totalDespesas = despesas.reduce((sum, t) => sum + t.valor, 0);
  const totalReceitas = receitas.reduce((sum, t) => sum + t.valor, 0);

  const gastoPorCategoria = despesas.reduce((acc, t) => {
    acc[t.categoria] = (acc[t.categoria] || 0) + t.valor;
    return acc;
  }, {} as Record<string, number>);

  const prompt = `
Você é um consultor financeiro especializado. Analise os seguintes dados financeiros e forneça insights práticos e acionáveis:

**Dados Financeiros:**
- Total de Receitas: R$ ${totalReceitas.toFixed(2)}
- Total de Despesas: R$ ${totalDespesas.toFixed(2)}
- Saldo: R$ ${(totalReceitas - totalDespesas).toFixed(2)}
- Taxa de Gastos: ${((totalDespesas / totalReceitas) * 100).toFixed(1)}%

**Gastos por Categoria:**
${Object.entries(gastoPorCategoria)
  .map(([cat, valor]) => `- ${cat}: R$ ${(valor as number).toFixed(2)}`)
  .join("\n")}

**Número de transações:**
- Receitas: ${receitas.length}
- Despesas: ${despesas.length}

Forneça uma análise em formato JSON com a seguinte estrutura:
{
  "insights": [
    {
      "type": "danger" | "warning" | "success" | "tip",
      "title": "Título do insight",
      "message": "Mensagem detalhada"
    }
  ],
  "suggestions": [
    {
      "categoria": "Nome da categoria",
      "economiaPossivel": valor_em_reais,
      "acao": "Ação específica e prática"
    }
  ],
  "resumo": "Um resumo geral da situação financeira em 2-3 linhas"
}

Seja direto, prático e focado em ações concretas que a pessoa pode tomar.
`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Você é um consultor financeiro experiente que fornece análises claras e práticas em português do Brasil.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Resposta vazia da IA");
    }

    // Extrai JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return JSON.parse(content);
  } catch (error) {
    console.error("Erro ao gerar insights com IA:", error);
    return null;
  }
}
