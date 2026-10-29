import { motion } from 'framer-motion';
import { AlertTriangle, PieChart, Plus, Scale, TrendingDown, TrendingUp } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryBreakdown from '../components/CategoryBreakdown';
import FinanceToolbar from '../components/FinanceToolbar';
import PageShell from '../components/PageShell';
import StatCard from '../components/StatCard';
import TransactionTable from '../components/TransactionTable';
import { useApp } from '../contexts/useApp';
import { api, buildTransactionQuery } from '../services/api';
import { byCategory, dateKey, exportCSV, formatMoney, inMonth, normalize, summarize } from '../utils/finance';

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

function initialFilters(params) {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    startDate: '',
    endDate: '',
    walletId: params.get('conta') || '',
    categoryId: params.get('categoria') || '',
    status: params.get('status') || 'Todos',
    search: '',
  };
}

export default function Financeiro() {
  const { wallets, categories, transactions, setTransactions, markPaid, removeWithUndo, openTransactionForm } = useApp();
  const [params] = useSearchParams();
  const [filters, setFilters] = useState(() => initialFilters(params));
  const [payingId, setPayingId] = useState(null);

  // Busca o período no servidor e mescla com o que já temos, sem apagar os outros meses
  const periodQuery = JSON.stringify({ month: filters.month, year: filters.year, startDate: filters.startDate, endDate: filters.endDate });
  useEffect(() => {
    const { month, year, startDate, endDate } = JSON.parse(periodQuery);
    api
      .getTransactions(buildTransactionQuery({ month, year, startDate, endDate, status: 'Todos' }))
      .then((data) => {
        setTransactions((current) => {
          const byId = new Map(current.map((item) => [item.id, item]));
          for (const item of data) byId.set(item.id, item);
          return [...byId.values()];
        });
      })
      .catch(() => {
        // Sem API: seguimos com os dados já carregados
      });
  }, [periodQuery, setTransactions]);

  const filteredTransactions = useMemo(() => {
    const search = normalize(filters.search);
    return transactions
      .filter((item) => {
        const key = dateKey(item.dueDate);
        const inPeriod = filters.startDate || filters.endDate
          ? (!filters.startDate || key >= filters.startDate) && (!filters.endDate || key <= filters.endDate)
          : inMonth(item, filters.month, filters.year);
        const walletMatch = filters.walletId ? Number(item.walletId) === Number(filters.walletId) : true;
        const categoryMatch = filters.categoryId ? Number(item.categoryId) === Number(filters.categoryId) : true;
        const statusMatch = filters.status === 'Todos' ? true : item.status === filters.status;
        const searchMatch = !search || normalize(item.description).includes(search) || String(item.amount).includes(filters.search.replace(',', '.'));
        return inPeriod && walletMatch && categoryMatch && statusMatch && searchMatch;
      })
      .sort((a, b) => dateKey(b.dueDate).localeCompare(dateKey(a.dueDate)) || b.id - a.id);
  }, [transactions, filters]);

  const totals = summarize(filteredTransactions);
  const categoryData = byCategory(filteredTransactions, categories);

  async function handlePay(transaction) {
    setPayingId(transaction.id);
    await markPaid(transaction);
    setPayingId(null);
  }

  function handleDelete(transaction) {
    removeWithUndo({
      label: transaction.description,
      remove: () => setTransactions((current) => current.filter((item) => item.id !== transaction.id)),
      restore: () => setTransactions((current) => [transaction, ...current]),
      request: () => api.deleteTransaction(transaction.id),
    });
  }

  function handleDuplicate(transaction) {
    openTransactionForm({
      title: 'Duplicar transação',
      description: transaction.description.replace(/\s*\(\d+\/\d+\)\s*$/, ''),
      amount: transaction.amount,
      type: transaction.type,
      walletId: transaction.walletId,
      categoryId: transaction.categoryId,
    });
  }

  const periodLabel = filters.startDate || filters.endDate
    ? 'Período personalizado'
    : monthFormatter.format(new Date(filters.year, filters.month - 1, 1));
  const printTitle = `Relatório Financeiro Pessoal - Competência: ${periodLabel}`;

  return (
    <PageShell
      title="Finanças"
      subtitle="Extrato vivo com filtros, baixa de pendências, exportação e impressão."
      actions={
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => openTransactionForm()} className="inline-flex items-center gap-2 rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-terracotta-600/25 transition hover:bg-terracotta-500">
          <Plus size={18} />
          Nova transação
        </motion.button>
      }
    >
      <div className="print:block hidden">
        <h1 className="print-title">{printTitle}</h1>
      </div>

      <div className="print:hidden grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Receitas" value={formatMoney(totals.income)} detail={totals.receivable ? `${formatMoney(totals.receivable)} ainda a receber` : 'Tudo recebido'} icon={TrendingUp} tone="emerald" />
        <StatCard title="Despesas" value={formatMoney(totals.expense)} detail={totals.payable ? `${formatMoney(totals.payable)} ainda a pagar` : 'Tudo pago'} icon={TrendingDown} tone="rose" />
        <StatCard title="Resultado" value={formatMoney(totals.income - totals.expense)} detail={totals.income ? `${(((totals.income - totals.expense) / totals.income) * 100).toFixed(0)}% da renda sobrando` : 'Receitas menos despesas'} icon={Scale} tone="terracotta" />
        <StatCard title="Atrasadas" value={totals.overdue} detail={totals.overdue ? 'Venceram e não foram baixadas' : 'Nenhuma conta atrasada'} icon={AlertTriangle} tone="amber" />
      </div>

      <div className="mt-5">
        <FinanceToolbar
          filters={filters}
          setFilters={setFilters}
          wallets={wallets}
          categories={categories}
          onPrint={() => window.print()}
          onExport={() => exportCSV(filteredTransactions, { wallets, categories }, `financas-${filters.year}-${String(filters.month).padStart(2, '0')}`)}
        />
      </div>

      <div className="mt-5 grid gap-5">
        <div className="min-w-0 overflow-x-auto">
          <TransactionTable
            transactions={filteredTransactions}
            wallets={wallets}
            categories={categories}
            onPay={handlePay}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            payingId={payingId}
          />
        </div>
        <section className="print:hidden rounded-2xl border border-stone-200 bg-white/75 p-5 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70">
          <div className="mb-4 flex items-center gap-2 text-stone-950 dark:text-white">
            <PieChart size={18} />
            <h3 className="text-sm font-semibold">Despesas por categoria</h3>
          </div>
          <CategoryBreakdown data={categoryData} emptyText="Sem despesas com esses filtros." />
        </section>
      </div>
    </PageShell>
  );
}
