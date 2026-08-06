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
    <aside className="print:hidden fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-terracotta-100 bg-white/90 p-6 shadow-lg shadow-terracotta-900/5 backdrop-blur-xl dark:border-white/5 dark:bg-[#1c140f]/90 lg:block">
      <div className="flex h-full flex-col">
        <div className="mb-8">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-terracotta-600 text-white shadow-xl shadow-terracotta-600/25">
            <BarChart3 size={24} />
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-stone-900 dark:text-white">
            Meu Cantinho
          </h1>
          <p className="mt-2 max-w-xs text-sm text-stone-500 dark:text-stone-400">
            Rotina, tarefas e finanças em um só lugar.
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
                    ? "bg-terracotta-600 text-white shadow-lg shadow-terracotta-600/25"
                    : "text-stone-600 hover:bg-terracotta-50 dark:text-stone-300 dark:hover:bg-white/5"
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
            className="flex w-full items-center justify-between rounded-3xl border border-terracotta-100 bg-terracotta-50/60 px-4 py-3 text-sm font-semibold text-stone-600 shadow-sm transition hover:bg-terracotta-100/60 dark:border-white/5 dark:bg-white/5 dark:text-stone-300 dark:hover:bg-white/10"
          >
            <span>{theme === "dark" ? "Modo Escuro" : "Modo Claro"}</span>
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
