import { ChevronLeft, ChevronRight, Printer, Search } from 'lucide-react';
import Calendar from './Calendar';

const caption = 'mb-1 block text-[11px] font-semibold uppercase tracking-wide text-stone-400 dark:text-stone-500';

const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

export default function FinanceToolbar({ filters, setFilters, wallets, categories, onPrint }) {
  function shiftMonth(direction) {
    const date = new Date(filters.year, filters.month - 1 + direction, 1);
    setFilters((current) => ({
      ...current,
      month: date.getMonth() + 1,
      year: date.getFullYear(),
      startDate: '',
      endDate: '',
    }));
  }

  function updateField(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="print:hidden rounded-2xl border border-stone-200 bg-white/75 p-4 shadow-sm backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70">
      <div className="flex flex-wrap items-end gap-3">
        <div>
          <span className={caption}>Mês</span>
          <div className="flex min-w-47.5 items-center rounded-2xl border border-stone-200 bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-950">
            <button onClick={() => shiftMonth(-1)} className="rounded-xl p-2 text-stone-500 hover:bg-white hover:text-stone-900 dark:hover:bg-stone-900 dark:hover:text-white">
              <ChevronLeft size={18} />
            </button>
            <div className="flex-1 text-center text-sm font-semibold capitalize text-stone-900 dark:text-white">
              {monthFormatter.format(new Date(filters.year, filters.month - 1, 1))}
            </div>
            <button onClick={() => shiftMonth(1)} className="rounded-xl p-2 text-stone-500 hover:bg-white hover:text-stone-900 dark:hover:bg-stone-900 dark:hover:text-white">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="min-w-55 flex-1">
          <span className={caption}>Período (opcional)</span>
          <div className="grid grid-cols-2 gap-2">
            <Calendar value={filters.startDate} onChange={(date) => updateField('startDate', date)} placeholder="De" />
            <Calendar value={filters.endDate} onChange={(date) => updateField('endDate', date)} placeholder="Até" />
          </div>
        </div>

        <div className="min-w-55 flex-1">
          <span className={caption}>Conta e categoria</span>
          <div className="grid grid-cols-2 gap-2">
            <select value={filters.walletId} onChange={(event) => updateField('walletId', event.target.value)} className="input-control">
              <option value="">Todas as contas</option>
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>{wallet.name}</option>
              ))}
            </select>
            <select value={filters.categoryId} onChange={(event) => updateField('categoryId', event.target.value)} className="input-control">
              <option value="">Categorias</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className={caption}>Status</span>
          <div className="flex rounded-2xl border border-stone-200 bg-stone-50 p-1 dark:border-stone-800 dark:bg-stone-950">
            {['Todos', 'Efetivado', 'Pendente'].map((status) => (
              <button
                key={status}
                onClick={() => updateField('status', status)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold whitespace-nowrap transition ${
                  filters.status === status
                    ? 'bg-terracotta-600 text-white shadow-sm'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white'
                }`}
              >
                {status === 'Efetivado' ? 'Pagos' : status}
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-50 flex-1">
          <span className={caption}>Buscar</span>
          <label className="flex items-center gap-2 rounded-2xl border border-stone-200 bg-stone-50 px-3 dark:border-stone-800 dark:bg-stone-950">
            <Search size={17} className="shrink-0 text-stone-400" />
            <input
              value={filters.search}
              onChange={(event) => updateField('search', event.target.value)}
              placeholder="Descrição da transação"
              className="w-full bg-transparent py-2 text-sm text-stone-900 outline-none placeholder:text-stone-400 dark:text-white"
            />
          </label>
        </div>

        <button onClick={onPrint} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-terracotta-600 px-4 py-2 text-sm font-semibold whitespace-nowrap text-white shadow-lg shadow-terracotta-600/20 transition hover:bg-terracotta-500">
          <Printer size={17} />
          Imprimir
        </button>
      </div>
    </div>
  );
}
