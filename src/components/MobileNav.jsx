import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useApp } from "../contexts/useApp";
import { navItems } from "./navItems";

function Tab({ item }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.to}
      end={item.to === "/"}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 rounded-3xl px-1 py-2 text-[11px] font-semibold transition ${
          isActive
            ? "bg-terracotta-600 text-white shadow-lg shadow-terracotta-600/25"
            : "text-stone-500 hover:bg-terracotta-50 dark:text-stone-400 dark:hover:bg-white/5"
        }`
      }
    >
      <Icon size={18} />
      {item.short}
    </NavLink>
  );
}

export default function MobileNav() {
  const { openTransactionForm } = useApp();

  return (
    <nav className="print:hidden fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 items-center gap-1 rounded-[1.5rem] border border-terracotta-100 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-[#1c140f]/95 lg:hidden">
      {navItems.slice(0, 2).map((item) => (
        <Tab key={item.to} item={item} />
      ))}
      <div className="flex justify-center">
        <motion.button
          whileTap={{ scale: 0.92 }}
          onClick={() => openTransactionForm()}
          aria-label="Nova transação"
          className="-my-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-terracotta-600 text-white shadow-xl shadow-terracotta-600/35 ring-4 ring-[#fbf4ee] dark:ring-[#17110d]"
        >
          <Plus size={26} />
        </motion.button>
      </div>
      {navItems.slice(2).map((item) => (
        <Tab key={item.to} item={item} />
      ))}
    </nav>
  );
}
