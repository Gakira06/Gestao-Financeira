import { motion } from 'framer-motion';
import { Plus, ReceiptText, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import FinanceToolbar from '../components/FinanceToolbar';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import StatCard from '../components/StatCard';
import TransactionTable from '../components/TransactionTable';
import { useApp } from '../contexts/useApp';
import { api, buildTransactionQuery } from '../services/api';
import { fallbackTransactions } from '../services/mockData';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

function initialFilters() {
  const now = new Date();
  return {
    month: now.getMonth() + 1,
    year: now.getFullYear(),
    startDate: '',
    endDate: '',
    walletId: '',
    categoryId: '',
    status: 'Todos',
    search: '',
  };
}

export default function Financeiro() {
  const { wallets, categories, transactions, setTransactions, refreshBaseData } = useApp();
  const [filters, setFilters] = useState(initialFilters);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payingId, setPayingId] = useState(null);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'Despesa',
    walletId: '',
    categoryId: '',
    dueDate: '',
    status: 'Pendente',
  });

  useEffect(() => {
    const query = buildTransactionQuery(filters);

    api.getTransactions(query)
      .then(setTransactions)
      .catch(() => {
        setTransactions(fallbackTransactions);
      });
  }, [filters, setTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const dueDate = new Date(item.dueDate);
      const sameMonth = dueDate.getMonth() + 1 === Number(filters.month) && dueDate.getFullYear() === Number(filters.year);
      const afterStart = filters.startDate ? dueDate >= new Date(`${filters.startDate}T00:00:00`) : true;
      const beforeEnd = filters.endDate ? dueDate <= new Date(`${filters.endDate}T23:59:59`) : true;
      const walletMatch = filters.walletId ? Number(item.walletId) === Number(filters.walletId) : true;
      const categoryMatch = filters.categoryId ? Number(item.categoryId) === Number(filters.categoryId) : true;
      const statusMatch = filters.status === 'Todos' ? true : item.status === filters.status;
      const searchMatch = item.description.toLowerCase().includes(filters.search.toLowerCase());

      return (filters.startDate || filters.endDate || sameMonth) && afterStart && beforeEnd && walletMatch && categoryMatch && statusMatch && searchMatch;
    });
  }, [transactions, filters]);

  const totals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, item) => {
        if (item.type === 'Receita') acc.income += Number(item.amount);
        if (item.type === 'Despesa') acc.expense += Number(item.amount);
        if (item.status === 'Pendente') acc.pending += Number(item.amount);
        return acc;
      },
      { income: 0, expense: 0, pending: 0 },
    );
  }, [filteredTransactions]);

  async function handlePay(transaction) {
    setPayingId(transaction.id);

    try {
      await api.payTransaction(transaction.id);
    } catch {
      // Keeps the interaction responsive in demo mode.
    }

    setTimeout(() => {
      setTransactions((current) => current.map((item) => item.id === transaction.id ? { ...item, status: 'Efetivado', paymentDate: new Date().toISOString() } : item));
      setPayingId(null);
      refreshBaseData();
      toast.success('Transação baixada!');
    }, 420);
  }

  async function handleDelete(transaction) {
    try {
      await api.deleteTransaction(transaction.id);
    } catch {
      // Demo mode removes locally when the backend is unavailable.
    }

    setTransactions((current) => current.filter((item) => item.id !== transaction.id));
    refreshBaseData();
    toast.info('Transação removida.');
  }

  async function handleCreate(event) {
    event.preventDefault();
    const payload = {
      ...form,
      walletId: Number(form.walletId),
      categoryId: Number(form.categoryId),
      amount: Number(form.amount),
    };

    try {
      const created = await api.createTransaction(payload);
      setTransactions((current) => [created, ...current]);
      refreshBaseData();
    } catch {
      setTransactions((current) => [{ ...payload, id: Date.now(), paymentDate: payload.status === 'Efetivado' ? new Date().toISOString() : null }, ...current]);
    }

    toast.success('Transação cadastrada!');
    setIsModalOpen(false);
    setForm({ description: '', amount: '', type: 'Despesa', walletId: '', categoryId: '', dueDate: '', status: 'Pendente' });
  }

  const printTitle = `Relatório Financeiro Pessoal - Competência: ${monthFormatter.format(new Date(filters.year, filters.month - 1, 1))}`;

  return (
    <PageShell
      title="Finanças"
      subtitle="Extrato vivo com filtros avançados, baixa de pendências e impressão profissional."
      actions={
        <motion.button whileTap={{ scale: 0.98 }} onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-terracotta-600/25 transition hover:bg-terracotta-500">
          <Plus size={18} />
          Nova transação
        </motion.button>
      }
    >
      <div className="print:block hidden">
        <h1 className="print-title">{printTitle}</h1>
      </div>

      <div className="print:hidden grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Receitas filtradas" value={currency.format(totals.income)} icon={TrendingUp} tone="emerald" />
        <StatCard title="Despesas filtradas" value={currency.format(totals.expense)} icon={TrendingDown} tone="rose" />
        <StatCard title="Pendências" value={currency.format(totals.pending)} icon={ReceiptText} tone="amber" />
        <StatCard title="Contas" value={wallets.length} icon={Wallet} tone="terracotta" />
      </div>

      <div className="mt-5">
        <FinanceToolbar filters={filters} setFilters={setFilters} wallets={wallets} categories={categories} onPrint={() => window.print()} />
      </div>

      <div className="mt-5 overflow-x-auto">
        <TransactionTable transactions={filteredTransactions} wallets={wallets} categories={categories} onPay={handlePay} onDelete={handleDelete} payingId={payingId} />
      </div>

      <Modal open={isModalOpen} title="Nova transação" onClose={() => setIsModalOpen(false)}>
        <form onSubmit={handleCreate} className="grid gap-3">
          <input required value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="input-control" placeholder="Descrição" />
          <div className="grid grid-cols-2 gap-3">
            <input required type="number" min="0.01" step="0.01" value={form.amount} onChange={(event) => setForm({ ...form, amount: event.target.value })} className="input-control" placeholder="Valor" />
            <input required type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} className="input-control" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select value={form.type} onChange={(event) => setForm({ ...form, type: event.target.value, categoryId: '' })} className="input-control">
              <option>Despesa</option>
              <option>Receita</option>
            </select>
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="input-control">
              <option>Pendente</option>
              <option>Efetivado</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select required value={form.walletId} onChange={(event) => setForm({ ...form, walletId: event.target.value })} className="input-control">
              <option value="">Conta</option>
              {wallets.map((wallet) => <option key={wallet.id} value={wallet.id}>{wallet.name}</option>)}
            </select>
            <select required value={form.categoryId} onChange={(event) => setForm({ ...form, categoryId: event.target.value })} className="input-control">
              <option value="">Categoria</option>
              {categories.filter((category) => category.type === form.type).map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </div>
          <button className="mt-2 rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-500">Salvar transação</button>
        </form>
      </Modal>
    </PageShell>
  );
}
