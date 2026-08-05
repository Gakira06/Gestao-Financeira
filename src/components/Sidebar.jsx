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
  { id: "produtividade", label: "Produtividade", icon: CalendarCheck },
  { id: "financeiro", label: "Finanças", icon: CreditCard },
  { id: "cadastros", label: "Cadastros", icon: Database },
];

export default function Sidebar({ activePage, onChange }) {
  const { theme, setTheme } = useApp();

  return (
    <aside className="print:hidden fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-zinc-200/80 bg-white/80 p-5 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/80 lg:block">
      <div className="flex h-full flex-col">
        <div className="mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <BarChart3 size={24} />
          </div>
          <h1 className="mt-5 text-xl font-semibold text-zinc-950 dark:text-white">
            Agenda Pessoal
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Planeje tarefas, compromissos e metas
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
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                    : "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900"
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
            className="flex w-full items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
          >
            <span>{theme === "dark" ? "Dark Mode" : "Light Mode"}</span>
            {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
          </motion.button>
        </div>
      </div>
    </aside>
  );
}
