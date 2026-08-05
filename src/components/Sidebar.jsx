import { motion } from "framer-motion";
import {
  BarChart3,
  CalendarCheck,
  CreditCard,
  Database,
  Moon,
  Sun,
} from "lucide-react";
import { useApp } from "../contexts/useApp";

const items = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "produtividade", label: "Rotina", icon: CalendarCheck },
  { id: "financeiro", label: "Finanças", icon: CreditCard },
  { id: "cadastros", label: "Cadastros", icon: Database },
];

export default function Sidebar({ activePage, onChange }) {
  const { theme, setTheme } = useApp();

  return (
    <aside className="print:hidden fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-zinc-200/70 bg-white/95 p-6 shadow-lg shadow-zinc-200/50 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90 lg:block">
      <div className="flex h-full flex-col">
        <div className="mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-xl shadow-indigo-600/20">
            <BarChart3 size={24} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-zinc-950 dark:text-white">
            Meu Organizador
          </h1>
          <p className="mt-2 max-w-xs text-sm text-zinc-500 dark:text-zinc-400">
            Rotina, tarefas e finanças em um lugar só.
          </p>
        </div>

        <nav className="space-y-2">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onChange(item.id)}
                className={`flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </motion.button>
            );
          })}
        </nav>

        <div className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex w-full items-center justify-between rounded-3xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <span>{theme === "dark" ? "Modo Escuro" : "Modo Claro"}</span>
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
