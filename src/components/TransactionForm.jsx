import { CalendarDays, Repeat, Sparkles } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useApp } from '../contexts/useApp';
import { api } from '../services/api';
import {
  addDaysKey,
  addMonthsKey,
  dateKey,
  descriptionSuggestions,
  formatMoney,
  quickParse,
  suggestFromHistory,
  todayKey,
} from '../utils/finance';
import Calendar from './Calendar';
import Modal from './Modal';

const caption = 'mb-2 block text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500';
const chip = (active) =>
  `inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
    active
      ? 'border-terracotta-500 bg-terracotta-500/10 text-stone-900 dark:text-white'
      : 'border-stone-200 text-stone-500 hover:text-stone-900 dark:border-white/10 dark:text-stone-400 dark:hover:text-white'
  }`;

export default function TransactionForm() {
  const { transactionForm, closeTransactionForm } = useApp();
  return (
    <Modal open={transactionForm.open} title={transactionForm.initial?.title || 'Nova transação'} onClose={closeTransactionForm}>
      <FormBody key={transactionForm.key} initial={transactionForm.initial} onDone={closeTransactionForm} />
    </Modal>
  );
}

function FormBody({ initial, onDone }) {
  const { wallets, categories, transactions, setTransactions, persist, refreshBaseData } = useApp();
  const lastWallet = transactions[0]?.walletId;

  const [type, setType] = useState(initial?.type || 'Despesa');
  const [cents, setCents] = useState(initial?.amount ? Math.round(Number(initial.amount) * 100) : 0);
  const [description, setDescription] = useState(initial?.description || '');
  const [walletId, setWalletId] = useState(String(initial?.walletId ?? lastWallet ?? wallets[0]?.id ?? ''));
  const [categoryId, setCategoryId] = useState(initial?.categoryId ? String(initial.categoryId) : '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ? dateKey(initial.dueDate) : todayKey());
  const [status, setStatus] = useState(initial?.status || null); // null = automático pela data
  const [repeat, setRepeat] = useState('unica');
  const [times, setTimes] = useState(2);
  const [quick, setQuick] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const touched = useRef({ category: !!initial?.categoryId, wallet: !!initial?.walletId });
  const amountRef = useRef(null);

  const amount = cents / 100;
  // Hoje ou antes: já foi pago. Depois: fica pendente até dar baixa.
  const effectiveStatus = status || (dueDate <= todayKey() ? 'Efetivado' : 'Pendente');

  const typeCategories = useMemo(() => {
    const usage = new Map();
    for (const item of transactions) usage.set(Number(item.categoryId), (usage.get(Number(item.categoryId)) || 0) + 1);
    return categories
      .filter((category) => category.type === type)
      .sort((a, b) => (usage.get(Number(b.id)) || 0) - (usage.get(Number(a.id)) || 0));
  }, [categories, transactions, type]);

  const suggestions = useMemo(
    () => (showSuggestions ? descriptionSuggestions(description, transactions) : []),
    [showSuggestions, description, transactions],
  );

  function applyHistory(item) {
    if (!item) return;
    setType(item.type);
    if (!touched.current.category) setCategoryId(String(item.categoryId));
    if (!touched.current.wallet) setWalletId(String(item.walletId));
  }

  function onQuick(text) {
    setQuick(text);
    const parsed = quickParse(text, { wallets, categories, transactions });
    if (parsed.type) setType(parsed.type);
    setCents(parsed.amount ? Math.round(parsed.amount * 100) : 0);
    setDescription(parsed.description || '');
    if (parsed.categoryId) setCategoryId(parsed.categoryId);
    if (parsed.walletId) setWalletId(parsed.walletId);
    setDueDate(parsed.dueDate || todayKey());
  }

  async function submit(again = false) {
    const nextErrors = {
      amount: cents <= 0,
      description: !description.trim(),
      walletId: !walletId,
      categoryId: !categoryId,
    };
    setErrors(nextErrors);
    if (Object.values(nextErrors).some(Boolean)) return;

    const base = {
      description: description.trim(),
      amount,
      type,
      walletId: Number(walletId),
      categoryId: Number(categoryId),
      dueDate,
      status: effectiveStatus,
    };

    let items = [base];
    if (repeat === 'parcelada') {
      const per = Math.floor(cents / times);
      items = Array.from({ length: times }, (_, index) => {
        const date = addMonthsKey(dueDate, index);
        return {
          ...base,
          description: `${base.description} (${index + 1}/${times})`,
          amount: (index === times - 1 ? cents - per * (times - 1) : per) / 100,
          dueDate: date,
          status: index === 0 ? effectiveStatus : date <= todayKey() ? 'Efetivado' : 'Pendente',
        };
      });
    } else if (repeat === 'mensal') {
      items = Array.from({ length: times }, (_, index) => {
        const date = addMonthsKey(dueDate, index);
        return { ...base, dueDate: date, status: index === 0 ? effectiveStatus : date <= todayKey() ? 'Efetivado' : 'Pendente' };
      });
    }

    setSaving(true);
    try {
      const created = [];
      for (const item of items) {
        created.push(
          await persist(
            () => api.createTransaction(item),
            () => ({ ...item, id: Date.now() + created.length, paymentDate: item.status === 'Efetivado' ? new Date().toISOString() : null }),
          ),
        );
      }
      setTransactions((current) => [...created, ...current]);
      refreshBaseData();
      toast.success(items.length > 1 ? `${items.length} lançamentos criados!` : 'Transação cadastrada!');
    } catch {
      setSaving(false);
      return;
    }

    if (again) {
      setCents(0);
      setDescription('');
      setQuick('');
      setRepeat('unica');
      touched.current.category = false;
      setSaving(false);
      amountRef.current?.focus();
      return;
    }
    onDone();
  }

  const accent = type === 'Despesa' ? 'text-rose-500' : 'text-emerald-500';
  const today = todayKey();

  if (wallets.length === 0 || categories.length === 0) {
    return (
      <p className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
        Cadastre pelo menos uma conta e uma categoria em <b>Cadastros</b> para lançar transações.
      </p>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        submit();
      }}
      className="grid gap-4"
    >
      <label className="flex items-center gap-2 rounded-2xl border border-dashed border-terracotta-300 bg-terracotta-50/50 px-3 py-2.5 focus-within:border-terracotta-500 dark:border-terracotta-500/30 dark:bg-terracotta-500/5">
        <Sparkles size={17} className="shrink-0 text-terracotta-500" />
        <input
          value={quick}
          onChange={(event) => onQuick(event.target.value)}
          placeholder='Escreva rápido: "mercado 230,50 nubank ontem"'
          className="w-full bg-transparent text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:text-white"
        />
      </label>

      <div className="grid grid-cols-2 rounded-2xl border border-stone-200 bg-stone-50 p-1 dark:border-white/10 dark:bg-white/5">
        {['Despesa', 'Receita'].map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => {
              setType(option);
              if (categories.find((category) => String(category.id) === categoryId)?.type !== option) setCategoryId('');
            }}
            className={`rounded-xl py-2 text-sm font-semibold transition ${
              type === option
                ? `bg-white shadow-sm dark:bg-white/10 ${option === 'Despesa' ? 'text-rose-500' : 'text-emerald-500'}`
                : 'text-stone-500 dark:text-stone-400'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <div className="text-center">
        <input
          ref={amountRef}
          inputMode="numeric"
          aria-label="Valor"
          value={formatMoney(amount)}
          onChange={(event) => setCents(Number(event.target.value.replace(/\D/g, '').slice(0, 11) || 0))}
          onKeyDown={(event) => {
            if (event.key === 'Backspace') {
              event.preventDefault();
              setCents((current) => Math.floor(current / 10));
            }
          }}
          className={`w-full bg-transparent text-center text-4xl font-bold tabular-nums outline-none ${cents ? accent : 'text-stone-300 dark:text-stone-600'}`}
        />
        {errors.amount && <p className="mt-1 text-xs text-rose-500">Informe um valor</p>}
        {repeat === 'parcelada' && cents > 0 && (
          <p className="mt-1 text-sm text-stone-500">
            {times}× de <b className="text-stone-900 dark:text-white">{formatMoney(amount / times)}</b>
          </p>
        )}
      </div>

      <div className="relative">
        <input
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            setShowSuggestions(true);
          }}
          onBlur={() => {
            setTimeout(() => setShowSuggestions(false), 150);
            applyHistory(suggestFromHistory(description, transactions));
          }}
          className={`input-control ${errors.description ? '!border-rose-500' : ''}`}
          placeholder="Descrição (ex.: Aluguel, salário, mercado)"
        />
        {suggestions.length > 0 && (
          <div className="absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-xl dark:border-white/10 dark:bg-[#1c140f]">
            {suggestions.map((item) => (
              <button
                type="button"
                key={item.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  setDescription(item.description.replace(/\s*\(\d+\/\d+\)\s*$/, ''));
                  setShowSuggestions(false);
                  applyHistory(item);
                  if (!cents) setCents(Math.round(Number(item.amount) * 100));
                }}
                className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm text-stone-700 hover:bg-terracotta-50 dark:text-stone-200 dark:hover:bg-white/5"
              >
                <span>{item.description.replace(/\s*\(\d+\/\d+\)\s*$/, '')}</span>
                <span className="tabular-nums text-stone-400">{formatMoney(item.amount)}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <span className={caption}>Categoria</span>
        <div className="flex flex-wrap gap-2">
          {typeCategories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => {
                touched.current.category = true;
                setCategoryId(String(category.id));
              }}
              className={chip(categoryId === String(category.id))}
            >
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category.colorHex }} />
              {category.name}
            </button>
          ))}
          {typeCategories.length === 0 && <span className="text-sm text-stone-500">Nenhuma categoria de {type.toLowerCase()} cadastrada.</span>}
        </div>
        {errors.categoryId && <p className="mt-1 text-xs text-rose-500">Escolha uma categoria</p>}
      </div>

      <div>
        <span className={caption}>Conta</span>
        <div className="flex flex-wrap gap-2">
          {wallets.map((wallet) => (
            <button
              type="button"
              key={wallet.id}
              onClick={() => {
                touched.current.wallet = true;
                setWalletId(String(wallet.id));
              }}
              className={chip(walletId === String(wallet.id))}
            >
              {wallet.name}
            </button>
          ))}
        </div>
        {errors.walletId && <p className="mt-1 text-xs text-rose-500">Escolha uma conta</p>}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <span className={caption}>
            <CalendarDays size={12} className="mr-1 inline" />
            Vencimento
          </span>
          <div className="mb-2 flex flex-wrap gap-2">
            {[
              ['Ontem', addDaysKey(today, -1)],
              ['Hoje', today],
              ['Amanhã', addDaysKey(today, 1)],
            ].map(([label, value]) => (
              <button type="button" key={label} onClick={() => setDueDate(value)} className={chip(dueDate === value)}>
                {label}
              </button>
            ))}
          </div>
          <Calendar value={dueDate} onChange={(date) => date && setDueDate(date)} placeholder="Outra data" />
        </div>
        <div>
          <span className={caption}>Situação</span>
          <div className="grid grid-cols-2 rounded-2xl border border-stone-200 bg-stone-50 p-1 dark:border-white/10 dark:bg-white/5">
            {[
              ['Efetivado', type === 'Despesa' ? 'Já paguei' : 'Já recebi'],
              ['Pendente', 'Pendente'],
            ].map(([value, label]) => (
              <button
                type="button"
                key={value}
                onClick={() => setStatus(value)}
                className={`rounded-xl py-2 text-xs font-semibold transition ${
                  effectiveStatus === value ? 'bg-white text-stone-900 shadow-sm dark:bg-white/10 dark:text-white' : 'text-stone-500 dark:text-stone-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <span className={`${caption} mt-4`}>
            <Repeat size={12} className="mr-1 inline" />
            Repetir
          </span>
          <div className="flex items-center gap-2">
            <select value={repeat} onChange={(event) => setRepeat(event.target.value)} className="input-control">
              <option value="unica">Não repete</option>
              <option value="parcelada">Parcelado</option>
              <option value="mensal">Todo mês</option>
            </select>
            {repeat !== 'unica' && (
              <input
                type="number"
                min={2}
                max={48}
                value={times}
                onChange={(event) => setTimes(Math.max(2, Math.min(48, Number(event.target.value) || 2)))}
                className="input-control w-20 text-center"
                aria-label={repeat === 'parcelada' ? 'Parcelas' : 'Meses'}
              />
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          disabled={saving}
          onClick={() => submit(true)}
          className="rounded-2xl px-4 py-3 text-sm font-semibold text-stone-500 transition hover:bg-stone-100 hover:text-stone-900 disabled:opacity-50 dark:hover:bg-white/5 dark:hover:text-white"
        >
          Salvar e +1
        </button>
        <button
          disabled={saving}
          className="flex-1 rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-terracotta-600/20 transition hover:bg-terracotta-500 disabled:opacity-60"
        >
          {saving ? 'Salvando...' : type === 'Despesa' ? 'Salvar despesa' : 'Salvar receita'}
        </button>
      </div>
    </form>
  );
}
