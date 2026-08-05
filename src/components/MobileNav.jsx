import { motion } from 'framer-motion';
import { BarChart3, CalendarCheck, CreditCard, Database } from 'lucide-react';

const items = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'produtividade', label: 'Rotina', icon: CalendarCheck },
  { id: 'financeiro', label: 'Finanças', icon: CreditCard },
  { id: 'cadastros', label: 'Dados', icon: Database },
];

export default function MobileNav({ activePage, onChange }) {
  return (
    <nav className="print:hidden fixed inset-x-3 bottom-3 z-40 grid grid-cols-4 rounded-2xl border border-zinc-200 bg-white/90 p-2 shadow-2xl backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90 lg:hidden">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activePage === item.id;

        return (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => onChange(item.id)}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium ${
              active ? 'bg-indigo-600 text-white' : 'text-zinc-500 dark:text-zinc-400'
            }`}
          >
            <Icon size={17} />
            {item.label}
          </motion.button>
        );
      })}
    </nav>
  );
}
