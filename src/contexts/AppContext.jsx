import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { fallbackCategories, fallbackEvents, fallbackTasks, fallbackTransactions, fallbackWallets } from '../services/mockData';
import { AppContext } from './appContext';

function readTheme() {
  try {
    return localStorage.getItem('mc:theme') || 'dark';
  } catch {
    return 'dark';
  }
}

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(readTheme);
  const [wallets, setWallets] = useState(fallbackWallets);
  const [categories, setCategories] = useState(fallbackCategories);
  const [transactions, setTransactions] = useState(fallbackTransactions);
  const [tasks, setTasks] = useState(fallbackTasks);
  const [events, setEvents] = useState(fallbackEvents);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [transactionForm, setTransactionForm] = useState({ open: false, initial: null, key: 0 });
  const usingFallbackRef = useRef(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('mc:theme', theme);
    } catch {
      // modo privado
    }
  }, [theme]);

  const refreshBaseData = useCallback(async () => {
    setLoading(true);

    try {
      const [walletData, categoryData, transactionData, taskData, eventData, dashboardData] = await Promise.all([
        api.getWallets(),
        api.getCategories(),
        api.getTransactions(),
        api.getTasks(),
        api.getEvents(),
        api.getDashboard(),
      ]);

      setWallets(walletData);
      setCategories(categoryData);
      setTransactions(transactionData);
      setTasks(taskData);
      setEvents(eventData);
      setDashboard(dashboardData);
      setUsingFallback(false);
      usingFallbackRef.current = false;
    } catch {
      setUsingFallback(true);
      usingFallbackRef.current = true;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshBaseData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshBaseData]);

  /**
   * Executa uma gravação na API. Só aplica a versão local (fallback) quando o app
   * está em modo demonstração; com a API no ar, um erro é mostrado de verdade em
   * vez de fingir que salvou.
   */
  const persist = useCallback(async (request, fallback) => {
    try {
      return await request();
    } catch (error) {
      if (usingFallbackRef.current && fallback) return fallback();
      toast.error(error.message || 'Não foi possível salvar. Verifique a conexão.');
      throw error;
    }
  }, []);

  /** Remove na hora e só apaga no servidor se o usuário não desfizer em 5s */
  const removeWithUndo = useCallback(
    ({ label, remove, restore, request }) => {
      let undone = false;
      remove();
      const toastId = toast(
        ({ closeToast }) => (
          <div className="flex w-full items-center justify-between gap-3">
            <span className="text-sm">
              <b>{label}</b> excluído
            </span>
            <button
              onClick={() => {
                undone = true;
                restore();
                closeToast();
              }}
              className="shrink-0 rounded-xl bg-terracotta-600/15 px-3 py-1.5 text-sm font-semibold text-terracotta-600 hover:bg-terracotta-600/25 dark:text-terracotta-400"
            >
              Desfazer
            </button>
          </div>
        ),
        {
          autoClose: 5000,
          closeButton: false,
          onClose: () => {
            if (undone) return;
            request()
              .then(() => refreshBaseData())
              .catch(() => {
                if (usingFallbackRef.current) return;
                restore();
                toast.error(`Não foi possível excluir "${label}".`);
              });
          },
        },
      );
      return toastId;
    },
    [refreshBaseData],
  );

  const markPaid = useCallback(
    async (transaction) => {
      try {
        await persist(() => api.payTransaction(transaction.id), () => null);
      } catch {
        return false;
      }
      setTransactions((current) =>
        current.map((item) => (item.id === transaction.id ? { ...item, status: 'Efetivado', paymentDate: new Date().toISOString() } : item)),
      );
      refreshBaseData();
      toast.success(transaction.type === 'Receita' ? 'Recebimento confirmado!' : 'Pagamento confirmado!');
      return true;
    },
    [persist, refreshBaseData],
  );

  const updateTask = useCallback(
    async (task, changes) => {
      try {
        await persist(() => api.updateTask(task.id, changes), () => null);
      } catch {
        return false;
      }
      setTasks((current) => current.map((item) => (item.id === task.id ? { ...item, ...changes } : item)));
      return true;
    },
    [persist],
  );

  const openTransactionForm = useCallback((initial = null) => {
    setTransactionForm((current) => ({ open: true, initial, key: current.key + 1 }));
  }, []);
  const closeTransactionForm = useCallback(() => {
    setTransactionForm((current) => ({ ...current, open: false }));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      wallets,
      setWallets,
      categories,
      setCategories,
      transactions,
      setTransactions,
      tasks,
      setTasks,
      events,
      setEvents,
      dashboard,
      setDashboard,
      loading,
      usingFallback,
      refreshBaseData,
      persist,
      removeWithUndo,
      markPaid,
      updateTask,
      transactionForm,
      openTransactionForm,
      closeTransactionForm,
    }),
    [theme, wallets, categories, transactions, tasks, events, dashboard, loading, usingFallback, refreshBaseData, persist, removeWithUndo, markPaid, updateTask, transactionForm, openTransactionForm, closeTransactionForm],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
