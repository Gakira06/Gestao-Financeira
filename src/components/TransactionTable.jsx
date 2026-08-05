import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Trash2 } from 'lucide-react';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

export default function TransactionTable({ transactions, wallets, categories, onPay, onDelete, payingId }) {
  const walletById = new Map(wallets.map((wallet) => [Number(wallet.id), wallet]));
  const categoryById = new Map(categories.map((category) => [Number(category.id), category]));

  return (
    <div className="print-table overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
      <table className="w-full min-w-[860px] border-collapse text-left">
        <thead className="bg-zinc-100/80 text-xs uppercase text-zinc-500 dark:bg-zinc-950/80 dark:text-zinc-400">
          <tr>
            <th className="px-4 py-3">Descrição</th>
            <th className="px-4 py-3">Conta</th>
            <th className="px-4 py-3">Categoria</th>
            <th className="px-4 py-3">Vencimento</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Valor</th>
            <th className="print:hidden px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
          <AnimatePresence initial={false}>
            {transactions.map((transaction) => {
              const wallet = walletById.get(Number(transaction.walletId));
              const category = categoryById.get(Number(transaction.categoryId));
              const isIncome = transaction.type === 'Receita';
              const isPaying = payingId === transaction.id;

              return (
                <motion.tr
                  key={transaction.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.24 }}
                  className="text-sm text-zinc-700 dark:text-zinc-200"
                >
                  <td className="px-4 py-4 font-medium text-zinc-950 dark:text-white">{transaction.description}</td>
                  <td className="px-4 py-4">{wallet?.name || '-'}</td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category?.colorHex || '#71717a' }} />
                      {category?.name || '-'}
                    </span>
                  </td>
                  <td className="px-4 py-4">{dateFormatter.format(new Date(transaction.dueDate))}</td>
                  <td className="px-4 py-4">
                    <motion.span
                      animate={isPaying ? { backgroundColor: ['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.28)', 'rgba(16,185,129,0.12)'] } : {}}
                      transition={{ duration: 0.45 }}
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction.status === 'Efetivado'
                          ? 'bg-emerald-500/10 text-emerald-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {transaction.status}
                    </motion.span>
                  </td>
                  <td className={`px-4 py-4 text-right font-semibold ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isIncome ? '+' : '-'} {currency.format(Number(transaction.amount))}
                  </td>
                  <td className="print:hidden px-4 py-4">
                    <div className="flex justify-end gap-2">
                      {transaction.status === 'Pendente' && (
                        <motion.button
                          whileTap={{ scale: 0.94 }}
                          onClick={() => onPay(transaction)}
                          className="rounded-xl bg-emerald-500/10 p-2 text-emerald-500 transition hover:bg-emerald-500/20"
                        >
                          <CheckCircle2 size={17} />
                        </motion.button>
                      )}
                      <motion.button
                        whileTap={{ scale: 0.94 }}
                        onClick={() => onDelete(transaction)}
                        className="rounded-xl bg-rose-500/10 p-2 text-rose-500 transition hover:bg-rose-500/20"
                      >
                        <Trash2 size={17} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
