
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MobileNav from './components/MobileNav';
import Sidebar from './components/Sidebar';
import { AppProvider } from './contexts/AppContext.jsx';
import { useApp } from './contexts/useApp';
import Cadastros from './pages/Cadastros';
import Dashboard from './pages/Dashboard';
import Financeiro from './pages/Financeiro';
import Produtividade from './pages/Produtividade';

const pages = {
  dashboard: Dashboard,
  produtividade: Produtividade,
  financeiro: Financeiro,
  cadastros: Cadastros,
};

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const { theme } = useApp();
  const Page = pages[activePage];

  return (
    <div className="min-h-screen text-stone-900 dark:text-white">
      <Sidebar activePage={activePage} onChange={setActivePage} />
      <MobileNav activePage={activePage} onChange={setActivePage} />
      <main className="lg:pl-72">
        <AnimatePresence mode="wait">
          <Page key={activePage} />
        </AnimatePresence>
      </main>
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
      <AppContent />
    </AppProvider>
  );
}

export default App;
