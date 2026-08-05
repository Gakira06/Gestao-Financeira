import { ChevronLeft, ChevronRight, Printer, Search } from 'lucide-react';

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
    <div className="print:hidden rounded-2xl border border-zinc-200 bg-white/75 p-4 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70">
      <div className="grid gap-3 xl:grid-cols-[1.15fr_1fr_1fr_1.2fr_auto]">
        <div className="flex items-center rounded-2xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
          <button onClick={() => shiftMonth(-1)} className="rounded-xl p-2 text-zinc-500 hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white">
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 text-center text-sm font-semibold capitalize text-zinc-900 dark:text-white">
            {monthFormatter.format(new Date(filters.year, filters.month - 1, 1))}
          </div>
          <button onClick={() => shiftMonth(1)} className="rounded-xl p-2 text-zinc-500 hover:bg-white hover:text-zinc-900 dark:hover:bg-zinc-900 dark:hover:text-white">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <input type="date" value={filters.startDate} onChange={(event) => updateField('startDate', event.target.value)} className="input-control" />
          <input type="date" value={filters.endDate} onChange={(event) => updateField('endDate', event.target.value)} className="input-control" />
        </div>

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

        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="flex rounded-2xl border border-zinc-200 bg-zinc-50 p-1 dark:border-zinc-800 dark:bg-zinc-950">
            {['Todos', 'Efetivado', 'Pendente'].map((status) => (
              <button
                key={status}
                onClick={() => updateField('status', status)}
                className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${
                  filters.status === status
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                }`}
              >
                {status === 'Efetivado' ? 'Pagos' : status}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 dark:border-zinc-800 dark:bg-zinc-950">
            <Search size={17} className="text-zinc-400" />
            <input
              value={filters.search}
              onChange={(event) => updateField('search', event.target.value)}
              placeholder="Buscar descrição"
              className="w-full bg-transparent py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-white"
            />
          </label>
        </div>

        <button onClick={onPrint} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500">
          <Printer size={17} />
          Imprimir
        </button>
      </div>
    </div>
  );
}
