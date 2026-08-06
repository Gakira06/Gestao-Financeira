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
    <nav className="print:hidden fixed inset-x-3 bottom-3 z-50 grid grid-cols-4 gap-2 rounded-[1.5rem] border border-terracotta-100 bg-white/95 p-2 shadow-2xl backdrop-blur-xl dark:border-white/5 dark:bg-[#1c140f]/95 lg:hidden">
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
                ? "bg-terracotta-600 text-white shadow-lg shadow-terracotta-600/25"
                : "text-stone-500 hover:bg-terracotta-50 dark:text-stone-400 dark:hover:bg-white/5"
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
