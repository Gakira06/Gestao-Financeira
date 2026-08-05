import { motion } from "framer-motion";
import { BarChart3, CalendarCheck, CreditCard, Database } from "lucide-react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3 },
  { id: "produtividade", label: "Rotina", icon: CalendarCheck },
  { id: "financeiro", label: "Finanças", icon: CreditCard },
  { id: "cadastros", label: "Dados", icon: Database },
];

export default function MobileNav({ activePage, onChange }) {
  return (
    <nav className="print:hidden fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 gap-2 rounded-3xl border border-zinc-200 bg-white/95 p-2 shadow-xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/95 lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.id;

        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-1 rounded-3xl px-2 py-2 text-[11px] font-semibold transition ${
              active
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
                : "text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            }`}
          >
            <Icon size={18} />
            {item.label}
          </motion.button>
        );
      })}
    </nav>
  );
}
