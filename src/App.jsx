import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MobileNav from './components/MobileNav';
import Sidebar from './components/Sidebar';
import TransactionForm from './components/TransactionForm';
import { AppProvider } from './contexts/AppContext.jsx';
import { useApp } from './contexts/useApp';
import Cadastros from './pages/Cadastros';
import Dashboard from './pages/Dashboard';
import Financeiro from './pages/Financeiro';
import Produtividade from './pages/Produtividade';

function AppContent() {
  const location = useLocation();
  const { theme, openTransactionForm, transactionForm } = useApp();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // "N" abre uma nova transação de qualquer tela
  useEffect(() => {
    function handleKeyDown(event) {
      const tag = event.target.tagName;
      if (transactionForm.open || event.ctrlKey || event.metaKey || event.altKey) return;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || event.target.isContentEditable) return;
      if (event.key.toLowerCase() === 'n') {
        event.preventDefault();
        openTransactionForm();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [openTransactionForm, transactionForm.open]);

  return (
    <div className="min-h-screen text-stone-900 dark:text-white">
      <Sidebar />
      <MobileNav />
      <main className="lg:pl-72">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rotina" element={<Produtividade />} />
            <Route path="/financas" element={<Financeiro />} />
            <Route path="/cadastros" element={<Cadastros />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
      <TransactionForm />
      <ToastContainer
        position="bottom-right"
        theme={theme === 'dark' ? 'dark' : 'light'}
        toastClassName="!rounded-2xl !font-sans"
        autoClose={2600}
        newestOnTop
      />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
