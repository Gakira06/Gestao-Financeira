import { motion } from "framer-motion";
import {
  CalendarClock,
  CalendarPlus,
  CheckCircle2,
  Clock3,
  Flag,
  Plus,
  Sparkles,
  Target,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import Calendar from "../components/Calendar";
import Field from "../components/Field";
import Modal from "../components/Modal";
import PageShell from "../components/PageShell";
import StatCard from "../components/StatCard";
import { useApp } from "../contexts/useApp";
import { api } from "../services/api";
import { calculateProjectedBalance } from "../utils/forecast";

const statuses = ["A Fazer", "Em Andamento", "Concluído"];
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function Produtividade() {
  const { tasks, setTasks, events, setEvents } = useApp();
  const [taskModal, setTaskModal] = useState(false);
  const [eventModal, setEventModal] = useState(false);
  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    status: "A Fazer",
    priority: "Média",
    dueDate: "",
  });
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [forecastForm, setForecastForm] = useState({
    monthlyContribution: "200",
    months: "12",
    monthlyRate: "0.8",
  });

  const sortedTasks = useMemo(
    () => [...tasks].sort((a, b) => (a.status === "Concluído" ? 1 : -1)),
    [tasks],
  );
  const nextEvents = useMemo(
    () =>
      [...events]
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 4),
    [events],
  );
  const forecast = useMemo(
    () =>
      calculateProjectedBalance({
        monthlyContribution: Number(forecastForm.monthlyContribution),
        months: Number(forecastForm.months),
        monthlyRate: Number(forecastForm.monthlyRate),
      }),
    [forecastForm],
  );

  async function createTask(event) {
    event.preventDefault();
    const payload = { ...taskForm, dueDate: taskForm.dueDate || null };

    try {
      const created = await api.createTask(payload);
      setTasks((current) => [created, ...current]);
    } catch {
      setTasks((current) => [{ ...payload, id: Date.now() }, ...current]);
    }

    toast.success("Tarefa criada!");
    setTaskModal(false);
    setTaskForm({
      title: "",
      description: "",
      status: "A Fazer",
      priority: "Média",
      dueDate: "",
    });
  }

  async function updateTaskStatus(task, status) {
    try {
      await api.updateTask(task.id, { status });
    } catch {
      // Local optimistic update in demo mode.
    }

    setTasks((current) =>
      current.map((item) => (item.id === task.id ? { ...item, status } : item)),
    );
  }

  async function removeTask(task) {
    try {
      await api.deleteTask(task.id);
    } catch {
      // Local optimistic delete in demo mode.
    }

    setTasks((current) => current.filter((item) => item.id !== task.id));
    toast.info("Tarefa removida.");
  }

  async function createEvent(event) {
    event.preventDefault();

    try {
      const created = await api.createEvent(eventForm);
      setEvents((current) => [created, ...current]);
    } catch {
      setEvents((current) => [{ ...eventForm, id: Date.now() }, ...current]);
    }

    toast.success("Evento criado!");
    setEventModal(false);
    setEventForm({ title: "", description: "", startDate: "", endDate: "" });
  }

  return (
    <PageShell
      title="Agenda e rotina"
      subtitle="Organize tarefas, acompanhe compromissos e veja quanto seu planejamento pode renderizar no futuro."
      actions={
        <>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setEventModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm font-semibold text-stone-800 dark:border-stone-800 dark:bg-stone-900 dark:text-white"
          >
            <CalendarPlus size={18} />
            Evento
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => setTaskModal(true)}
            className="inline-flex items-center gap-2 rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-terracotta-600/20 transition hover:bg-terracotta-500"
          >
            <Plus size={18} />
            Tarefa
          </motion.button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="A fazer"
          value={tasks.filter((task) => task.status === "A Fazer").length}
          icon={Clock3}
          tone="amber"
        />
        <StatCard
          title="Em andamento"
          value={tasks.filter((task) => task.status === "Em Andamento").length}
          icon={Flag}
          tone="terracotta"
        />
        <StatCard
          title="Concluídas"
          value={tasks.filter((task) => task.status === "Concluído").length}
          icon={CheckCircle2}
          tone="emerald"
        />
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[1.35fr_0.95fr]">
        <section className="grid gap-4 md:grid-cols-3">
          {statuses.map((status) => (
            <div
              key={status}
              className="rounded-2xl border border-stone-200 bg-white/75 p-4 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70"
            >
              <h3 className="mb-4 text-sm font-semibold text-stone-950 dark:text-white">
                {status}
              </h3>
              <div className="space-y-3">
                {sortedTasks.filter((task) => task.status === status).length === 0 && (
                  <p className="rounded-2xl bg-terracotta-50/60 px-3 py-5 text-center text-xs text-stone-500 dark:bg-white/5 dark:text-stone-400">
                    Nada por aqui.
                  </p>
                )}
                {sortedTasks
                  .filter((task) => task.status === status)
                  .map((task) => (
                    <motion.article
                      key={task.id}
                      layout
                      whileHover={{ scale: 1.01 }}
                      className="rounded-2xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-stone-950 dark:text-white">
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="mt-1 text-xs text-stone-500">
                              {task.description}
                            </p>
                          )}
                          <span className="mt-2 inline-flex rounded-full bg-terracotta-500/10 px-2.5 py-1 text-xs text-terracotta-500">
                            {task.priority}
                          </span>
                        </div>
                        <button
                          onClick={() => removeTask(task)}
                          className="text-stone-400 hover:text-rose-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <select
                        value={task.status}
                        onChange={(event) =>
                          updateTaskStatus(task, event.target.value)
                        }
                        className="input-control mt-3"
                      >
                        {statuses.map((option) => (
                          <option key={option}>{option}</option>
                        ))}
                      </select>
                    </motion.article>
                  ))}
              </div>
            </div>
          ))}
        </section>

        <div className="space-y-5">
          <section className="rounded-2xl border border-stone-200 bg-white/75 p-5 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70">
            <div className="mb-4 flex items-center gap-2 text-stone-950 dark:text-white">
              <CalendarClock size={18} />
              <h3 className="text-sm font-semibold">Próximos compromissos</h3>
            </div>
            <div className="space-y-3">
              {nextEvents.length === 0 && (
                <p className="rounded-2xl bg-terracotta-50/60 px-4 py-6 text-center text-sm text-stone-500 dark:bg-white/5 dark:text-stone-400">
                  Nenhum compromisso agendado.
                </p>
              )}
              {nextEvents.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl bg-stone-100 p-4 dark:bg-stone-950"
                >
                  <p className="font-medium text-stone-950 dark:text-white">
                    {item.title}
                  </p>
                  <span className="mt-1 block text-xs text-stone-500">
                    {new Date(item.startDate).toLocaleString("pt-BR")}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white/75 p-5 backdrop-blur-xl dark:border-stone-800 dark:bg-stone-900/70">
            <div className="mb-4 flex items-center gap-2 text-stone-950 dark:text-white">
              <Sparkles size={18} />
              <h3 className="text-sm font-semibold">Calculadora de metas</h3>
            </div>
            <div className="grid gap-3">
              <Field label="Quanto você guarda por mês (R$)">
                <input
                  type="number"
                  min="0"
                  value={forecastForm.monthlyContribution}
                  onChange={(event) =>
                    setForecastForm({
                      ...forecastForm,
                      monthlyContribution: event.target.value,
                    })
                  }
                  className="input-control"
                  placeholder="200"
                />
              </Field>
              <Field label="Em quantos meses">
                <input
                  type="number"
                  min="1"
                  value={forecastForm.months}
                  onChange={(event) =>
                    setForecastForm({
                      ...forecastForm,
                      months: event.target.value,
                    })
                  }
                  className="input-control"
                  placeholder="12"
                />
              </Field>
              <Field label="Taxa de rendimento mensal (%)">
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={forecastForm.monthlyRate}
                  onChange={(event) =>
                    setForecastForm({
                      ...forecastForm,
                      monthlyRate: event.target.value,
                    })
                  }
                  className="input-control"
                  placeholder="0,8"
                />
              </Field>
            </div>
            <div className="mt-4 rounded-2xl bg-terracotta-600/10 p-4 text-sm text-stone-700 dark:text-stone-200">
              <div className="flex items-center gap-2 font-semibold text-terracotta-600 dark:text-terracotta-400">
                <Target size={16} />
                <span>Resumo da projeção</span>
              </div>
              <p className="mt-2 text-2xl font-semibold text-stone-950 dark:text-white">
                {currency.format(forecast.finalBalance)}
              </p>
              <p className="mt-2 text-sm">
                Você contribuiu com {currency.format(forecast.totalContributed)}{" "}
                em {forecastForm.months || 0} meses e o saldo estimado chega a{" "}
                {currency.format(forecast.finalBalance)}.
              </p>
            </div>
          </section>
        </div>
      </div>

      <Modal
        open={taskModal}
        title="Nova tarefa"
        onClose={() => setTaskModal(false)}
      >
        <form onSubmit={createTask} className="grid gap-3">
          <Field label="Título">
            <input
              required
              value={taskForm.title}
              onChange={(event) =>
                setTaskForm({ ...taskForm, title: event.target.value })
              }
              className="input-control"
              placeholder="Ex: Revisar orçamento do mês"
            />
          </Field>
          <Field label="Descrição">
            <textarea
              value={taskForm.description}
              onChange={(event) =>
                setTaskForm({ ...taskForm, description: event.target.value })
              }
              className="input-control min-h-24"
              placeholder="Detalhes da tarefa (opcional)"
            />
          </Field>
          <div className="grid grid-cols-3 gap-3">
            <Field label="Status">
              <select
                value={taskForm.status}
                onChange={(event) =>
                  setTaskForm({ ...taskForm, status: event.target.value })
                }
                className="input-control"
              >
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </Field>
            <Field label="Prioridade">
              <select
                value={taskForm.priority}
                onChange={(event) =>
                  setTaskForm({ ...taskForm, priority: event.target.value })
                }
                className="input-control"
              >
                <option>Baixa</option>
                <option>Média</option>
                <option>Alta</option>
              </select>
            </Field>
            <Field label="Prazo">
              <Calendar
                value={taskForm.dueDate}
                onChange={(date) => setTaskForm({ ...taskForm, dueDate: date })}
                placeholder="Opcional"
              />
            </Field>
          </div>
          <button className="rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-500">
            Salvar tarefa
          </button>
        </form>
      </Modal>

      <Modal
        open={eventModal}
        title="Novo evento"
        onClose={() => setEventModal(false)}
      >
        <form onSubmit={createEvent} className="grid gap-3">
          <Field label="Título">
            <input
              required
              value={eventForm.title}
              onChange={(event) =>
                setEventForm({ ...eventForm, title: event.target.value })
              }
              className="input-control"
              placeholder="Ex: Consulta, reunião..."
            />
          </Field>
          <Field label="Descrição">
            <textarea
              value={eventForm.description}
              onChange={(event) =>
                setEventForm({ ...eventForm, description: event.target.value })
              }
              className="input-control min-h-24"
              placeholder="Detalhes do compromisso (opcional)"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Início">
              <input
                required
                type="datetime-local"
                value={eventForm.startDate}
                onChange={(event) =>
                  setEventForm({ ...eventForm, startDate: event.target.value })
                }
                className="input-control"
              />
            </Field>
            <Field label="Fim">
              <input
                required
                type="datetime-local"
                value={eventForm.endDate}
                onChange={(event) =>
                  setEventForm({ ...eventForm, endDate: event.target.value })
                }
                className="input-control"
              />
            </Field>
          </div>
          <button className="rounded-2xl bg-terracotta-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-terracotta-500">
            Salvar evento
          </button>
        </form>
      </Modal>
    </PageShell>
  );
}
