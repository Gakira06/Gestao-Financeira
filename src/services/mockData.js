export const fallbackWallets = [
  { id: 1, name: 'Nubank', type: 'Corrente', balance: 7280.5 },
  { id: 2, name: 'Reserva', type: 'Poupança', balance: 15420 },
  { id: 3, name: 'Cartão Black', type: 'Crédito', balance: -1380.9 },
];

export const fallbackCategories = [
  { id: 1, name: 'Salário', type: 'Receita', colorHex: '#34d399' },
  { id: 2, name: 'Alimentação', type: 'Despesa', colorHex: '#fb7185' },
  { id: 3, name: 'Moradia', type: 'Despesa', colorHex: '#f59e0b' },
  { id: 4, name: 'Transporte', type: 'Despesa', colorHex: '#60a5fa' },
  { id: 5, name: 'Freelance', type: 'Receita', colorHex: '#a78bfa' },
];

export const fallbackTransactions = [
  { id: 101, walletId: 1, categoryId: 1, description: 'Salário mensal', amount: 9200, type: 'Receita', dueDate: '2026-05-05T12:00:00.000Z', paymentDate: '2026-05-05T12:00:00.000Z', status: 'Efetivado' },
  { id: 102, walletId: 1, categoryId: 2, description: 'Mercado e hortifruti', amount: 684.35, type: 'Despesa', dueDate: '2026-05-12T12:00:00.000Z', paymentDate: '2026-05-12T12:00:00.000Z', status: 'Efetivado' },
  { id: 103, walletId: 3, categoryId: 3, description: 'Aluguel', amount: 2500, type: 'Despesa', dueDate: '2026-05-20T12:00:00.000Z', paymentDate: null, status: 'Pendente' },
  { id: 104, walletId: 2, categoryId: 5, description: 'Projeto de automação', amount: 1750, type: 'Receita', dueDate: '2026-05-26T12:00:00.000Z', paymentDate: null, status: 'Pendente' },
  { id: 105, walletId: 1, categoryId: 4, description: 'Aplicativo de transporte', amount: 126.8, type: 'Despesa', dueDate: '2026-05-18T12:00:00.000Z', paymentDate: '2026-05-18T12:00:00.000Z', status: 'Efetivado' },
];

export const fallbackTasks = [
  { id: 1, title: 'Revisar orçamento do mês', status: 'Em Andamento', priority: 'Alta', dueDate: '2026-05-29T12:00:00.000Z' },
  { id: 2, title: 'Treino funcional', status: 'A Fazer', priority: 'Média', dueDate: '2026-05-28T19:00:00.000Z' },
  { id: 3, title: 'Fechar relatório semanal', status: 'Concluído', priority: 'Baixa', dueDate: '2026-05-27T18:00:00.000Z' },
];

export const fallbackEvents = [
  { id: 1, title: 'Consulta', startDate: '2026-05-28T14:00:00.000Z', endDate: '2026-05-28T15:00:00.000Z' },
  { id: 2, title: 'Planejamento financeiro', startDate: '2026-05-30T10:00:00.000Z', endDate: '2026-05-30T11:30:00.000Z' },
];
