import { useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { fallbackCategories, fallbackEvents, fallbackTasks, fallbackTransactions, fallbackWallets } from '../services/mockData';
import { AppContext } from './appContext';

export function AppProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [wallets, setWallets] = useState(fallbackWallets);
  const [categories, setCategories] = useState(fallbackCategories);
  const [transactions, setTransactions] = useState(fallbackTransactions);
  const [tasks, setTasks] = useState(fallbackTasks);
  const [events, setEvents] = useState(fallbackEvents);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  async function refreshBaseData() {
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
    } catch {
      setUsingFallback(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      refreshBaseData();
    }, 0);

    return () => window.clearTimeout(timeoutId);
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
    }),
    [theme, wallets, categories, transactions, tasks, events, dashboard, loading, usingFallback],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
