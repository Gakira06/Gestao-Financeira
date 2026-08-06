import { CalendarDays, CreditCard, Loader2, Target, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import PageShell from '../components/PageShell';
import StatCard from '../components/StatCard';
import { useApp } from '../contexts/useApp';

const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

export default function Dashboard() {
  const { wallets, transactions, tasks, events, dashboard, usingFallback, loading } = useApp();
  const totalBalance = dashboard?.totalBalance ?? wallets.reduce((total, wallet) => total + Number(wallet.balance), 0);
  const payable = dashboard?.monthPendingPayable ?? transactions.filter((item) => item.status === 'Pendente' && item.type === 'Despesa').reduce((total, item) => total + Number(item.amount), 0);
  const receivable = dashboard?.monthPendingReceivable ?? transactions.filter((item) => item.status === 'Pendente' && item.type === 'Receita').reduce((total, item) => total + Number(item.amount), 0);
  const openTasks = tasks.filter((task) => task.status !== 'Concluído').length;

  return (
    <PageShell title="Dashboard" subtitle="Um panorama aconchegante do seu dinheiro, rotina e próximos compromissos.">
      {loading && (
        <div className="mb-5 flex items-center gap-2 text-sm text-terracotta-500 dark:text-terracotta-400">
          <Loader2 size={16} className="animate-spin" />
          Atualizando dados...
        </div>
      )}
      {usingFallback && !loading && (
        <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Dados demonstrativos ativos enquanto a API local não responde.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Saldo total" value={currency.format(totalBalance)} detail={`${wallets.length} contas cadastradas`} icon={Wallet} tone="emerald" />
        <StatCard title="A pagar" value={currency.format(payable)} detail="Pendências do mês" icon={TrendingDown} tone="amber" />
        <StatCard title="A receber" value={currency.format(receivable)} detail="Receitas pendentes" icon={TrendingUp} tone="terracotta" />
        <StatCard title="Tarefas abertas" value={openTasks} detail={`${events.length} eventos no radar`} icon={Target} tone="rose" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-terracotta-100 bg-white/75 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-white/3">
          <div className="mb-5 flex items-center gap-2 text-stone-900 dark:text-white">
            <CreditCard size={19} />
            <h3 className="font-semibold">Fluxo recente</h3>
          </div>
          {transactions.length === 0 ? (
            <p className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
              Nenhuma transação por aqui ainda. Cadastre a primeira em Finanças.
            </p>
          ) : (
            <div className="space-y-3">
              {transactions.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl bg-terracotta-50/60 px-4 py-3 dark:bg-white/5">
                  <div>
                    <p className="text-sm font-medium text-stone-900 dark:text-white">{item.description}</p>
                    <span className="text-xs text-stone-500">{item.status}</span>
                  </div>
                  <strong className={item.type === 'Receita' ? 'text-emerald-500' : 'text-rose-500'}>{currency.format(Number(item.amount))}</strong>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-terracotta-100 bg-white/75 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-white/3">
          <div className="mb-5 flex items-center gap-2 text-stone-900 dark:text-white">
            <CalendarDays size={19} />
            <h3 className="font-semibold">Agenda próxima</h3>
          </div>
          {events.length === 0 ? (
            <p className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
              Sem compromissos marcados. Aproveite para planejar a semana.
            </p>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="rounded-2xl border border-terracotta-100 p-4 dark:border-white/5">
                  <p className="font-medium text-stone-900 dark:text-white">{event.title}</p>
                  <span className="mt-1 block text-xs text-stone-500">{new Date(event.startDate).toLocaleString('pt-BR')}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
