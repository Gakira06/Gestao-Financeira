import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, CreditCard, Loader2, PieChart, Target, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import CategoryBreakdown from '../components/CategoryBreakdown';
import PageShell from '../components/PageShell';
import StatCard from '../components/StatCard';
import { useApp } from '../contexts/useApp';
import { addDaysKey, byCategory, dateKey, formatMoney, inMonth, isOverdue, relativeDay, summarize, toISODate, todayKey } from '../utils/finance';

const panel = 'rounded-2xl border border-terracotta-100 bg-white/75 p-5 backdrop-blur-xl dark:border-white/5 dark:bg-white/3';
const timeFormatter = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' });
const todayLabel = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function PanelTitle({ icon: Icon, children, to, linkLabel = 'Ver tudo' }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 text-stone-900 dark:text-white">
        <Icon size={19} />
        <h3 className="font-semibold">{children}</h3>
      </div>
      {to && (
        <Link to={to} className="inline-flex items-center gap-1 text-xs font-semibold text-terracotta-600 hover:underline dark:text-terracotta-400">
          {linkLabel} <ArrowRight size={13} />
        </Link>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { wallets, categories, transactions, tasks, events, dashboard, usingFallback, loading, markPaid, updateTask, openTransactionForm } = useApp();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const today = todayKey();

  const totalBalance = dashboard?.totalBalance ?? wallets.reduce((total, wallet) => total + Number(wallet.balance), 0);
  const monthTransactions = useMemo(() => transactions.filter((item) => inMonth(item, month, year)), [transactions, month, year]);
  const monthSummary = summarize(monthTransactions);
  const payable = dashboard?.monthPendingPayable ?? monthSummary.payable;
  const receivable = dashboard?.monthPendingReceivable ?? monthSummary.receivable;
  const projected = totalBalance + receivable - payable;
  const openTasks = tasks.filter((task) => task.status !== 'Concluído');
  const lateTasks = openTasks.filter((task) => task.dueDate && dateKey(task.dueDate) < today);

  // O que precisa de atenção: contas atrasadas e vencendo nos próximos 7 dias
  const attention = useMemo(() => {
    const limit = addDaysKey(today, 7);
    return transactions
      .filter((item) => item.status === 'Pendente' && dateKey(item.dueDate) <= limit)
      .sort((a, b) => dateKey(a.dueDate).localeCompare(dateKey(b.dueDate)));
  }, [transactions, today]);

  const todayTasks = useMemo(
    () =>
      openTasks
        .filter((task) => task.dueDate && dateKey(task.dueDate) <= addDaysKey(today, 1))
        .sort((a, b) => dateKey(a.dueDate).localeCompare(dateKey(b.dueDate))),
    [openTasks, today],
  );

  const upcomingEvents = useMemo(
    () =>
      events
        .filter((event) => new Date(event.endDate || event.startDate) >= now)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [events],
  );

  const recent = useMemo(
    () => [...transactions].filter((item) => dateKey(item.dueDate) <= today).sort((a, b) => dateKey(b.dueDate).localeCompare(dateKey(a.dueDate)) || b.id - a.id).slice(0, 6),
    [transactions, today],
  );

  const categoryData = byCategory(monthTransactions, categories);
  const walletById = new Map(wallets.map((wallet) => [Number(wallet.id), wallet]));
  const categoryById = new Map(categories.map((category) => [Number(category.id), category]));
  const spentPct = monthSummary.income > 0 ? Math.min(100, (monthSummary.expense / monthSummary.income) * 100) : 0;

  return (
    <PageShell title={`${greeting()}! 👋`} subtitle={`${todayLabel.format(now).replace(/^./, (c) => c.toUpperCase())}. Seu dinheiro, sua rotina e o que vem pela frente.`}>
      {loading && (
        <div className="mb-5 flex items-center gap-2 text-sm text-terracotta-500 dark:text-terracotta-400">
          <Loader2 size={16} className="animate-spin" />
          Atualizando dados...
        </div>
      )}
      {usingFallback && !loading && (
        <div className="mb-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          Dados demonstrativos ativos enquanto a API não responde. O que você criar agora não será salvo.
        </div>
      )}

      {/* Saldo + contas */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-terracotta-600 via-terracotta-700 to-[#3a2116] p-6 text-white shadow-xl shadow-terracotta-900/20"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-white/75">Saldo em todas as contas</p>
            <p className="mt-1 text-4xl font-semibold tracking-tight tabular-nums md:text-5xl">{formatMoney(totalBalance)}</p>
            <p className="mt-3 text-sm text-white/80">
              Previsão para o fim do mês: <b className="tabular-nums">{formatMoney(projected)}</b>
            </p>
          </div>
          <div className="w-full md:max-w-xs">
            <div className="mb-1.5 flex justify-between text-xs text-white/75">
              <span>Gastos do mês: {formatMoney(monthSummary.expense)}</span>
              <span>{monthSummary.income > 0 ? `${spentPct.toFixed(0)}% da renda` : 'sem receitas'}</span>
            </div>
            <div className="h-2 rounded-full bg-white/15">
              <div className={`h-full rounded-full ${spentPct > 90 ? 'bg-rose-300' : 'bg-white'}`} style={{ width: `${spentPct}%` }} />
            </div>
          </div>
        </div>
        {wallets.length > 0 && (
          <div className="scrollbar-hide relative -mx-1 mt-6 flex gap-2 overflow-x-auto px-1">
            {wallets.map((wallet) => (
              <Link
                key={wallet.id}
                to={`/financas?conta=${wallet.id}`}
                className="shrink-0 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur transition hover:bg-white/15"
              >
                <span className="block text-xs text-white/70">{wallet.name}</span>
                <span className={`text-sm font-semibold tabular-nums ${Number(wallet.balance) < 0 ? 'text-rose-200' : ''}`}>{formatMoney(wallet.balance)}</span>
              </Link>
            ))}
          </div>
        )}
      </motion.section>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Entrou no mês" value={formatMoney(monthSummary.incomePaid)} detail={receivable > 0 ? `+ ${formatMoney(receivable)} a receber` : 'Nada pendente'} icon={TrendingUp} tone="emerald" />
        <StatCard title="Saiu no mês" value={formatMoney(monthSummary.expensePaid)} detail={payable > 0 ? `+ ${formatMoney(payable)} a pagar` : 'Tudo pago'} icon={TrendingDown} tone="rose" />
        <StatCard
          title="Contas atrasadas"
          value={attention.filter(isOverdue).length}
          detail={attention.length ? `${attention.length - attention.filter(isOverdue).length} vencem em 7 dias` : 'Nenhuma pendência'}
          icon={AlertTriangle}
          tone="amber"
        />
        <StatCard title="Tarefas abertas" value={openTasks.length} detail={lateTasks.length ? `${lateTasks.length} atrasada(s)` : `${upcomingEvents.length} eventos no radar`} icon={Target} tone="terracotta" />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <section className={panel}>
            <PanelTitle icon={AlertTriangle} to="/financas?status=Pendente" linkLabel="Pendências">
              Precisa de atenção
            </PanelTitle>
            {attention.length === 0 ? (
              <p className="rounded-2xl bg-emerald-500/10 px-4 py-4 text-sm font-medium text-emerald-600 dark:text-emerald-400">
                Tudo em dia! Nenhuma conta vencendo nos próximos 7 dias. ✨
              </p>
            ) : (
              <div className="space-y-2">
                {attention.slice(0, 6).map((item) => {
                  const overdue = isOverdue(item);
                  return (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-terracotta-50/60 px-4 py-3 dark:bg-white/5">
                      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: categoryById.get(Number(item.categoryId))?.colorHex || '#a8a29e' }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-900 dark:text-white">{item.description}</p>
                        <span className={`text-xs ${overdue ? 'font-semibold text-rose-500' : 'text-stone-500'}`}>
                          {overdue ? `Venceu ${relativeDay(dateKey(item.dueDate)).toLowerCase()}` : `Vence ${relativeDay(dateKey(item.dueDate)).toLowerCase()}`}
                          {' · '}
                          {walletById.get(Number(item.walletId))?.name || '-'}
                        </span>
                      </div>
                      <strong className={`shrink-0 text-sm tabular-nums ${item.type === 'Receita' ? 'text-emerald-500' : 'text-rose-500'}`}>{formatMoney(item.amount)}</strong>
                      <button
                        onClick={() => markPaid(item)}
                        title={item.type === 'Receita' ? 'Confirmar recebimento' : 'Dar baixa'}
                        className="shrink-0 rounded-xl bg-emerald-500/10 p-2 text-emerald-500 transition hover:bg-emerald-500/20"
                      >
                        <CheckCircle2 size={17} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={panel}>
            <PanelTitle icon={PieChart} to="/financas">
              Para onde foi o dinheiro
            </PanelTitle>
            <CategoryBreakdown data={categoryData} />
          </section>

          <section className={panel}>
            <PanelTitle icon={CreditCard} to="/financas">
              Fluxo recente
            </PanelTitle>
            {recent.length === 0 ? (
              <div className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
                Nenhuma transação por aqui ainda.
                <button onClick={() => openTransactionForm()} className="mt-3 block w-full font-semibold text-terracotta-600 dark:text-terracotta-400">
                  + Lançar a primeira
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recent.map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-3 rounded-2xl bg-terracotta-50/60 px-4 py-3 dark:bg-white/5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900 dark:text-white">{item.description}</p>
                      <span className="text-xs text-stone-500">
                        {relativeDay(dateKey(item.dueDate))} · {categoryById.get(Number(item.categoryId))?.name || '-'}
                      </span>
                    </div>
                    <strong className={`shrink-0 tabular-nums ${item.type === 'Receita' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {item.type === 'Receita' ? '+' : '-'} {formatMoney(item.amount)}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="space-y-5">
          <section className={panel}>
            <PanelTitle icon={Target} to="/rotina">
              Tarefas para agora
            </PanelTitle>
            {todayTasks.length === 0 ? (
              <p className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
                Nada vencendo hoje ou amanhã. {openTasks.length > 0 && `Você tem ${openTasks.length} tarefa(s) em aberto.`}
              </p>
            ) : (
              <div className="space-y-2">
                {todayTasks.slice(0, 6).map((task) => {
                  const late = dateKey(task.dueDate) < today;
                  return (
                    <div key={task.id} className="flex items-center gap-3 rounded-2xl bg-terracotta-50/60 px-4 py-3 dark:bg-white/5">
                      <button
                        onClick={() => updateTask(task, { status: 'Concluído' })}
                        title="Concluir"
                        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-stone-300 text-transparent transition hover:border-emerald-500 hover:text-emerald-500 dark:border-stone-600"
                      >
                        <CheckCircle2 size={14} />
                      </button>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-stone-900 dark:text-white">{task.title}</p>
                        <span className={`text-xs ${late ? 'font-semibold text-rose-500' : 'text-stone-500'}`}>
                          {late ? 'Atrasada · ' : ''}
                          {relativeDay(dateKey(task.dueDate))} · {task.priority}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={panel}>
            <PanelTitle icon={CalendarDays} to="/rotina">
              Agenda próxima
            </PanelTitle>
            {upcomingEvents.length === 0 ? (
              <p className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
                Sem compromissos marcados. Aproveite para planejar a semana.
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const start = new Date(event.startDate);
                  return (
                    <div key={event.id} className="flex items-center gap-3 rounded-2xl border border-terracotta-100 p-3 dark:border-white/5">
                      <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-terracotta-600/10 text-terracotta-600 dark:text-terracotta-400">
                        <span className="text-base font-semibold leading-none">{start.getDate()}</span>
                        <span className="text-[10px] uppercase">{start.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium text-stone-900 dark:text-white">{event.title}</p>
                        <span className="text-xs text-stone-500">
                          {relativeDay(toISODate(start))} às {timeFormatter.format(start)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          <section className={panel}>
            <PanelTitle icon={Wallet} to="/cadastros" linkLabel="Gerenciar">
              Contas
            </PanelTitle>
            <div className="space-y-2">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center justify-between rounded-2xl bg-terracotta-50/60 px-4 py-3 text-sm dark:bg-white/5">
                  <span>
                    <span className="font-medium text-stone-900 dark:text-white">{wallet.name}</span>
                    <span className="ml-2 text-xs text-stone-500">{wallet.type}</span>
                  </span>
                  <strong className={`tabular-nums ${Number(wallet.balance) >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>{formatMoney(wallet.balance)}</strong>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PageShell>
  );
}

