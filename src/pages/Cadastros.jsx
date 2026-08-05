import { motion } from 'framer-motion';
import { Landmark, Plus, Tags } from 'lucide-react';
import { useState } from 'react';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import StatCard from '../components/StatCard';
import { useApp } from '../contexts/useApp';
import { api } from '../services/api';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Cadastros() {
  const { wallets, setWallets, categories, setCategories } = useApp();
  const [walletModal, setWalletModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [walletForm, setWalletForm] = useState({ name: '', type: 'Corrente', balance: '' });
  const [categoryForm, setCategoryForm] = useState({ name: '', type: 'Despesa', colorHex: '#6366f1' });

  async function createWallet(event) {
    event.preventDefault();
    const payload = { ...walletForm, balance: Number(walletForm.balance || 0) };

    try {
      const created = await api.createWallet(payload);
      setWallets((current) => [...current, created]);
    } catch {
      setWallets((current) => [...current, { ...payload, id: Date.now() }]);
    }

    setWalletModal(false);
    setWalletForm({ name: '', type: 'Corrente', balance: '' });
  }

  async function createCategory(event) {
    event.preventDefault();

    try {
      const created = await api.createCategory(categoryForm);
      setCategories((current) => [...current, created]);
    } catch {
      setCategories((current) => [...current, { ...categoryForm, id: Date.now() }]);
    }

    setCategoryModal(false);
    setCategoryForm({ name: '', type: 'Despesa', colorHex: '#6366f1' });
  }

  return (
    <PageShell
      title="Cadastros"
      subtitle="Contas, bancos e categorias com cores prontas para relatórios e gráficos."
      actions={
        <>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setCategoryModal(true)} className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white">
            <Tags size={18} />
            Categoria
          </motion.button>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setWalletModal(true)} className="inline-flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500">
            <Plus size={18} />
            Conta
          </motion.button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Contas cadastradas" value={wallets.length} detail="Bancos, reservas e cartões" icon={Landmark} tone="indigo" />
        <StatCard title="Categorias ativas" value={categories.length} detail="Receitas e despesas" icon={Tags} tone="emerald" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-zinc-200 bg-white/75 p-5 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
          <h3 className="mb-4 font-semibold text-zinc-950 dark:text-white">Contas</h3>
          <div className="space-y-3">
            {wallets.map((wallet) => (
              <motion.div key={wallet.id} whileHover={{ scale: 1.01 }} className="flex items-center justify-between rounded-2xl bg-zinc-100 p-4 dark:bg-zinc-950">
                <div>
                  <p className="font-medium text-zinc-950 dark:text-white">{wallet.name}</p>
                  <span className="text-xs text-zinc-500">{wallet.type}</span>
                </div>
                <strong className={Number(wallet.balance) >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{currency.format(Number(wallet.balance))}</strong>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white/75 p-5 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
          <h3 className="mb-4 font-semibold text-zinc-950 dark:text-white">Categorias</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.map((category) => (
              <motion.div key={category.id} whileHover={{ scale: 1.01 }} className="rounded-2xl border border-zinc-200 p-4 dark:border-zinc-800">
                <div className="mb-3 h-2 rounded-full" style={{ backgroundColor: category.colorHex }} />
                <p className="font-medium text-zinc-950 dark:text-white">{category.name}</p>
                <span className={category.type === 'Receita' ? 'text-xs text-emerald-500' : 'text-xs text-rose-500'}>{category.type}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Modal open={walletModal} title="Nova conta" onClose={() => setWalletModal(false)}>
        <form onSubmit={createWallet} className="grid gap-3">
          <input required value={walletForm.name} onChange={(event) => setWalletForm({ ...walletForm, name: event.target.value })} className="input-control" placeholder="Nome" />
          <div className="grid grid-cols-2 gap-3">
            <select value={walletForm.type} onChange={(event) => setWalletForm({ ...walletForm, type: event.target.value })} className="input-control">
              <option>Corrente</option>
              <option>Poupança</option>
              <option>Crédito</option>
            </select>
            <input type="number" step="0.01" value={walletForm.balance} onChange={(event) => setWalletForm({ ...walletForm, balance: event.target.value })} className="input-control" placeholder="Saldo inicial" />
          </div>
          <button className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">Salvar conta</button>
        </form>
      </Modal>

      <Modal open={categoryModal} title="Nova categoria" onClose={() => setCategoryModal(false)}>
        <form onSubmit={createCategory} className="grid gap-3">
          <input required value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} className="input-control" placeholder="Nome" />
          <div className="grid grid-cols-2 gap-3">
            <select value={categoryForm.type} onChange={(event) => setCategoryForm({ ...categoryForm, type: event.target.value })} className="input-control">
              <option>Despesa</option>
              <option>Receita</option>
            </select>
            <input type="color" value={categoryForm.colorHex} onChange={(event) => setCategoryForm({ ...categoryForm, colorHex: event.target.value })} className="h-12 rounded-2xl border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-950" />
          </div>
          <button className="rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">Salvar categoria</button>
        </form>
      </Modal>
    </PageShell>
  );
}
