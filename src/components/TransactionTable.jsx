import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Copy, PiggyBank, Trash2 } from 'lucide-react';
import { dateKey, formatMoney, isOverdue, parseKey } from '../utils/finance';

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

function StatusBadge({ transaction, isPaying, compact = false }) {
  const overdue = isOverdue(transaction);
  const paid = transaction.status === 'Efetivado';
  const label = paid ? (transaction.type === 'Receita' ? 'Recebido' : 'Pago') : overdue ? 'Atrasada' : 'Pendente';
  const style = paid ? 'bg-emerald-500/10 text-emerald-500' : overdue ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500';

  return (
    <motion.span
      animate={isPaying ? { backgroundColor: ['rgba(16,185,129,0.12)', 'rgba(16,185,129,0.28)', 'rgba(16,185,129,0.12)'] } : {}}
      transition={{ duration: 0.45 }}
      className={`inline-flex rounded-full font-semibold ${compact ? 'px-2.5 py-0.5' : 'px-3 py-1 text-xs'} ${style}`}
    >
      {label}
    </motion.span>
  );
}

function Actions({ transaction, onPay, onDelete, onDuplicate, withLabels = false }) {
  const pending = transaction.status === 'Pendente';
  const base = `inline-flex items-center gap-1.5 rounded-xl transition ${withLabels ? 'px-3 py-2 text-xs font-semibold' : 'p-2'}`;
  return (
    <>
      {pending && (
        <motion.button
          whileTap={{ scale: 0.94 }}
          onClick={() => onPay(transaction)}
          title={transaction.type === 'Receita' ? 'Confirmar recebimento' : 'Dar baixa'}
          className={`${base} bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20`}
        >
          <CheckCircle2 size={withLabels ? 16 : 17} />
          {withLabels && 'Dar baixa'}
        </motion.button>
      )}
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => onDuplicate(transaction)}
        title="Duplicar"
        className={`${base} bg-stone-500/10 text-stone-500 hover:bg-stone-500/20 dark:text-stone-300`}
      >
        <Copy size={withLabels ? 16 : 17} />
        {withLabels && 'Duplicar'}
      </motion.button>
      <motion.button
        whileTap={{ scale: 0.94 }}
        onClick={() => onDelete(transaction)}
        title="Excluir"
        className={`${base} bg-rose-500/10 text-rose-500 hover:bg-rose-500/20`}
      >
        <Trash2 size={withLabels ? 16 : 17} />
        {withLabels && 'Excluir'}
      </motion.button>
    </>
  );
}

export default function TransactionTable({ transactions, wallets, categories, onPay, onDelete, onDuplicate, payingId }) {
  const walletById = new Map(wallets.map((wallet) => [Number(wallet.id), wallet]));
  const categoryById = new Map(categories.map((category) => [Number(category.id), category]));

  if (transactions.length === 0) {
    return (
      <div className="print-table flex flex-col items-center gap-3 rounded-2xl border border-dashed border-terracotta-200 bg-white/60 px-6 py-14 text-center backdrop-blur-xl dark:border-white/10 dark:bg-white/3">
        <PiggyBank size={28} className="text-terracotta-400" />
        <p className="text-sm text-stone-500 dark:text-stone-400">
          Nenhuma transação encontrada para esse período ou filtro.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 sm:hidden">
        <AnimatePresence initial={false}>
          {transactions.map((transaction) => {
            const wallet = walletById.get(Number(transaction.walletId));
            const category = categoryById.get(Number(transaction.categoryId));
            const isIncome = transaction.type === 'Receita';

            return (
              <motion.div
                key={transaction.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.24 }}
                className={`rounded-2xl border bg-white/80 p-4 shadow-sm backdrop-blur-xl dark:bg-stone-900/70 ${
                  isOverdue(transaction) ? 'border-rose-300 dark:border-rose-500/30' : 'border-stone-200 dark:border-stone-800'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-medium text-stone-950 dark:text-white">{transaction.description}</p>
                    <p className="mt-0.5 text-xs text-stone-500">{wallet?.name || '-'}</p>
                  </div>
                  <span className={`shrink-0 font-semibold tabular-nums ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {isIncome ? '+' : '-'} {formatMoney(transaction.amount)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-500">
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: category?.colorHex || '#a8a29e' }} />
                    {category?.name || '-'}
                  </span>
                  <span>•</span>
                  <span>{dateFormatter.format(parseKey(dateKey(transaction.dueDate)))}</span>
                  <StatusBadge transaction={transaction} isPaying={payingId === transaction.id} compact />
                </div>

                <div className="mt-3 flex justify-end gap-2">
                  <Actions transaction={transaction} onPay={onPay} onDelete={onDelete} onDuplicate={onDuplicate} withLabels />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="print-table hidden overflow-hidden rounded-2xl border border-stone-200 bg-white/80 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70 sm:block">
        <table className="w-full min-w-215 border-collapse text-left">
          <thead className="bg-stone-100/80 text-xs uppercase text-stone-500 dark:bg-stone-950/80 dark:text-stone-400">
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
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            <AnimatePresence initial={false}>
              {transactions.map((transaction) => {
                const wallet = walletById.get(Number(transaction.walletId));
                const category = categoryById.get(Number(transaction.categoryId));
                const isIncome = transaction.type === 'Receita';

                return (
                  <motion.tr
                    key={transaction.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.24 }}
                    className={`group text-sm text-stone-700 dark:text-stone-200 ${isOverdue(transaction) ? 'bg-rose-500/[0.04]' : ''}`}
                  >
                    <td className="px-4 py-4 font-medium text-stone-950 dark:text-white">{transaction.description}</td>
                    <td className="px-4 py-4">{wallet?.name || '-'}</td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: category?.colorHex || '#a8a29e' }} />
                        {category?.name || '-'}
                      </span>
                    </td>
                    <td className="px-4 py-4 tabular-nums">{dateFormatter.format(parseKey(dateKey(transaction.dueDate)))}</td>
                    <td className="px-4 py-4">
                      <StatusBadge transaction={transaction} isPaying={payingId === transaction.id} />
                    </td>
                    <td className={`px-4 py-4 text-right font-semibold tabular-nums ${isIncome ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {isIncome ? '+' : '-'} {formatMoney(transaction.amount)}
                    </td>
                    <td className="print:hidden px-4 py-4">
                      <div className="flex justify-end gap-2 opacity-70 transition group-hover:opacity-100">
                        <Actions transaction={transaction} onPay={onPay} onDelete={onDelete} onDuplicate={onDuplicate} />
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </>
  );
}
