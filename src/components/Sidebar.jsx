import { motion } from "framer-motion";
import { BarChart3, Moon, Plus, Sun } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useApp } from "../contexts/useApp";
import { navItems } from "./navItems";

export default function Sidebar() {
  const { theme, setTheme, openTransactionForm } = useApp();

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

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openTransactionForm()}
          className="mb-6 flex w-full items-center gap-3 rounded-3xl border border-terracotta-200 bg-terracotta-50 px-4 py-3 text-left text-sm font-semibold text-terracotta-700 transition hover:bg-terracotta-100 dark:border-terracotta-500/20 dark:bg-terracotta-500/10 dark:text-terracotta-300 dark:hover:bg-terracotta-500/15"
        >
          <Plus size={18} />
          Nova transação
          <kbd className="ml-auto rounded-lg bg-white/70 px-1.5 text-[11px] font-medium text-stone-500 dark:bg-white/10 dark:text-stone-400">N</kbd>
        </motion.button>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 rounded-3xl px-4 py-3 text-left text-sm font-semibold transition ${
                    isActive
                      ? "bg-terracotta-600 text-white shadow-lg shadow-terracotta-600/25"
                      : "text-stone-600 hover:bg-terracotta-50 dark:text-stone-300 dark:hover:bg-white/5"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
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
