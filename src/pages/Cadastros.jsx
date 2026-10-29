import { motion } from 'framer-motion';
import { Landmark, Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import Field from '../components/Field';
import Modal from '../components/Modal';
import PageShell from '../components/PageShell';
import StatCard from '../components/StatCard';
import { useApp } from '../contexts/useApp';
import { api } from '../services/api';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const emptyWalletForm = { name: '', type: 'Corrente', balance: '' };

export default function Cadastros() {
  const { wallets, setWallets, categories, setCategories, transactions, persist } = useApp();
  const totalBalance = wallets.reduce((total, wallet) => total + Number(wallet.balance), 0);
  const [walletModal, setWalletModal] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [editingWalletId, setEditingWalletId] = useState(null);
  const [walletForm, setWalletForm] = useState(emptyWalletForm);
  const [categoryForm, setCategoryForm] = useState({ name: '', type: 'Despesa', colorHex: '#bb5a29' });

  function openNewWalletModal() {
    setEditingWalletId(null);
    setWalletForm(emptyWalletForm);
    setWalletModal(true);
  }

  function openEditWalletModal(wallet) {
    setEditingWalletId(wallet.id);
    setWalletForm({ name: wallet.name, type: wallet.type, balance: String(wallet.balance) });
    setWalletModal(true);
  }

  async function submitWallet(event) {
    event.preventDefault();
    const payload = { ...walletForm, balance: Number(walletForm.balance || 0) };

    try {
      if (editingWalletId) {
        const updated = await api.updateWallet(editingWalletId, payload);
        setWallets((current) => current.map((item) => (item.id === editingWalletId ? updated : item)));
        toast.success('Conta atualizada!');
      } else {
        const created = await api.createWallet(payload);
        setWallets((current) => [...current, created]);
        toast.success('Conta cadastrada!');
      }
    } catch (error) {
      toast.error(error.message || 'Nao foi possivel salvar a conta.');
      return;
    }

    setWalletModal(false);
    setEditingWalletId(null);
    setWalletForm(emptyWalletForm);
  }

  async function removeWallet(wallet) {
    const linked = transactions.filter((item) => Number(item.walletId) === Number(wallet.id)).length;
    const message = linked
      ? `Excluir a conta "${wallet.name}"? Ela tem ${linked} transação(ões) vinculada(s).`
      : `Excluir a conta "${wallet.name}"?`;
    if (!window.confirm(message)) return;

    try {
      await api.deleteWallet(wallet.id);
      setWallets((current) => current.filter((item) => item.id !== wallet.id));
      toast.info('Conta removida.');
    } catch (error) {
      toast.error(error.message || 'Nao foi possivel excluir a conta.');
    }
  }

  async function createCategory(event) {
    event.preventDefault();

    try {
      const created = await persist(() => api.createCategory(categoryForm), () => ({ ...categoryForm, id: Date.now() }));
      setCategories((current) => [...current, created]);
    } catch {
      return;
    }

    toast.success('Categoria cadastrada!');
    setCategoryModal(false);
    setCategoryForm({ name: '', type: 'Despesa', colorHex: '#bb5a29' });
  }

  return (
    <PageShell
      title="Cadastros"
      subtitle="Contas, bancos e categorias com cores prontas para relatórios e gráficos."
      actions={
        <>
          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setCategoryModal(true)} className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 dark:border-stone-800 dark:bg-stone-900 dark:text-white">
            <Tags size={18} />
            Categoria
          </motion.button>
          <motion.button whileTap={{ scale: 0.98 }} onClick={openNewWalletModal} className="inline-flex items-center gap-2 rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-terracotta-600/20 transition hover:bg-terracotta-500">
            <Plus size={18} />
            Conta
          </motion.button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Contas cadastradas" value={wallets.length} detail={`Somam ${currency.format(totalBalance)}`} icon={Landmark} tone="terracotta" />
        <StatCard title="Categorias ativas" value={categories.length} detail="Receitas e despesas" icon={Tags} tone="emerald" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <section className="rounded-2xl border border-stone-200 bg-white/75 p-5 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70">
          <h3 className="mb-4 font-semibold text-stone-950 dark:text-white">Contas</h3>
          <div className="space-y-3">
            {wallets.length === 0 && (
              <p className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
                Nenhuma conta cadastrada ainda.
              </p>
            )}
            {wallets.map((wallet) => (
              <motion.div key={wallet.id} whileHover={{ scale: 1.01 }} className="flex items-center justify-between gap-3 rounded-2xl bg-stone-100 p-4 dark:bg-stone-950">
                <div className="min-w-0">
                  <p className="font-medium text-stone-950 dark:text-white">{wallet.name}</p>
                  <span className="text-xs text-stone-500">{wallet.type}</span>
                </div>
                <div className="flex items-center gap-3">
                  <strong className={Number(wallet.balance) >= 0 ? 'text-emerald-500' : 'text-rose-500'}>{currency.format(Number(wallet.balance))}</strong>
                  <button onClick={() => openEditWalletModal(wallet)} className="text-stone-400 hover:text-terracotta-500" title="Editar conta">
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => removeWallet(wallet)} className="text-stone-400 hover:text-rose-500" title="Excluir conta">
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white/75 p-5 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70">
          <h3 className="mb-4 font-semibold text-stone-950 dark:text-white">Categorias</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {categories.length === 0 && (
              <p className="col-span-full rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
                Nenhuma categoria cadastrada ainda.
              </p>
            )}
            {categories.map((category) => (
              <motion.div key={category.id} whileHover={{ scale: 1.01 }} className="rounded-2xl border border-stone-200 p-4 dark:border-stone-800">
                <div className="mb-3 h-2 rounded-full" style={{ backgroundColor: category.colorHex }} />
                <p className="font-medium text-stone-950 dark:text-white">{category.name}</p>
                <span className={category.type === 'Receita' ? 'text-xs text-emerald-500' : 'text-xs text-rose-500'}>{category.type}</span>
              </motion.div>
            ))}
          </div>
        </section>
      </div>

      <Modal
        open={walletModal}
        title={editingWalletId ? 'Editar conta' : 'Nova conta'}
        onClose={() => {
          setWalletModal(false);
          setEditingWalletId(null);
          setWalletForm(emptyWalletForm);
        }}
      >
        <form onSubmit={submitWallet} className="grid gap-3">
          <Field label="Nome da conta">
            <input required value={walletForm.name} onChange={(event) => setWalletForm({ ...walletForm, name: event.target.value })} className="input-control" placeholder="Ex: Nubank, Carteira, Reserva..." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <select value={walletForm.type} onChange={(event) => setWalletForm({ ...walletForm, type: event.target.value })} className="input-control">
                <option>Corrente</option>
                <option>Poupança</option>
                <option>Crédito</option>
              </select>
            </Field>
            <Field label={editingWalletId ? 'Saldo (R$)' : 'Saldo inicial (R$)'}>
              <input type="number" step="0.01" value={walletForm.balance} onChange={(event) => setWalletForm({ ...walletForm, balance: event.target.value })} className="input-control" placeholder="0,00" />
            </Field>
          </div>
          <button className="rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-500">
            {editingWalletId ? 'Atualizar conta' : 'Salvar conta'}
          </button>
        </form>
      </Modal>

      <Modal open={categoryModal} title="Nova categoria" onClose={() => setCategoryModal(false)}>
        <form onSubmit={createCategory} className="grid gap-3">
          <Field label="Nome da categoria">
            <input required value={categoryForm.name} onChange={(event) => setCategoryForm({ ...categoryForm, name: event.target.value })} className="input-control" placeholder="Ex: Mercado, Salário..." />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Tipo">
              <select value={categoryForm.type} onChange={(event) => setCategoryForm({ ...categoryForm, type: event.target.value })} className="input-control">
                <option>Despesa</option>
                <option>Receita</option>
              </select>
            </Field>
            <Field label="Cor">
              <input type="color" value={categoryForm.colorHex} onChange={(event) => setCategoryForm({ ...categoryForm, colorHex: event.target.value })} className="h-11 w-full rounded-2xl border border-stone-200 bg-white p-1 dark:border-stone-800 dark:bg-stone-950" />
            </Field>
          </div>
          <button className="rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-500">Salvar categoria</button>
        </form>
      </Modal>
    </PageShell>
  );
}
