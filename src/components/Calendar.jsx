import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const WEEKDAYS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseISODate(value) {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function isSameDay(a, b) {
  return !!a && !!b
    && a.getFullYear() === b.getFullYear()
    && a.getMonth() === b.getMonth()
    && a.getDate() === b.getDate();
}

function buildMonthCells(year, month) {
  const firstDayWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const cells = [];

  for (let i = 0; i < firstDayWeekday; i += 1) {
    const day = daysInPrevMonth - firstDayWeekday + 1 + i;
    cells.push({ day, currentMonth: false, dateObj: new Date(year, month - 1, day) });
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ day, currentMonth: true, dateObj: new Date(year, month, day) });
  }
  while (cells.length % 7 !== 0) {
    const day = cells.length - (firstDayWeekday + daysInMonth) + 1;
    cells.push({ day, currentMonth: false, dateObj: new Date(year, month + 1, day) });
  }

  return cells;
}

export default function Calendar({ value, onChange, placeholder = 'Selecionar data', className = '' }) {
  const selected = parseISODate(value);
  const [open, setOpen] = useState(false);
  const [viewDate, setViewDate] = useState(selected || new Date());
  const containerRef = useRef(null);

  useEffect(() => {
    if (selected) setViewDate(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const cells = buildMonthCells(year, month);
  const today = new Date();

  function selectDay(dateObj) {
    onChange(toISODate(dateObj));
    setOpen(false);
  }

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="input-control flex w-full items-center justify-between gap-2 text-left"
      >
        <span className={selected ? '' : 'text-stone-400'}>
          {selected ? selected.toLocaleDateString('pt-BR') : placeholder}
        </span>
        <CalendarDays size={16} className="shrink-0 text-terracotta-500" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute z-30 mt-2 w-72 rounded-2xl border border-terracotta-100 bg-white p-3 shadow-2xl dark:border-white/10 dark:bg-[#1c140f]"
          >
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month - 1, 1))}
                className="rounded-lg p-1.5 text-stone-500 transition hover:bg-terracotta-50 dark:hover:bg-white/5"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-sm font-semibold capitalize text-stone-900 dark:text-white">
                {MONTHS[month]} {year}
              </span>
              <button
                type="button"
                onClick={() => setViewDate(new Date(year, month + 1, 1))}
                className="rounded-lg p-1.5 text-stone-500 transition hover:bg-terracotta-50 dark:hover:bg-white/5"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-stone-400">
              {WEEKDAYS.map((weekday, index) => (
                <span key={`${weekday}-${index}`}>{weekday}</span>
              ))}
            </div>

            <div className="mt-1 grid grid-cols-7 gap-1">
              {cells.map((cell) => {
                const isSelected = isSameDay(cell.dateObj, selected);
                const isToday = isSameDay(cell.dateObj, today);

                return (
                  <button
                    type="button"
                    key={cell.dateObj.toISOString()}
                    onClick={() => selectDay(cell.dateObj)}
                    className={`rounded-lg py-1.5 text-xs font-medium transition ${
                      isSelected
                        ? 'bg-terracotta-600 text-white'
                        : cell.currentMonth
                          ? 'text-stone-700 hover:bg-terracotta-50 dark:text-stone-200 dark:hover:bg-white/10'
                          : 'text-stone-300 dark:text-stone-600'
                    } ${isToday && !isSelected ? 'ring-1 ring-inset ring-terracotta-400' : ''}`}
                  >
                    {cell.day}
                  </button>
                );
              })}
            </div>

            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => selectDay(today)}
                className="flex-1 rounded-xl bg-terracotta-50 py-1.5 text-xs font-semibold text-terracotta-600 transition hover:bg-terracotta-100 dark:bg-white/5 dark:text-terracotta-400 dark:hover:bg-white/10"
              >
                Hoje
              </button>
              {selected && (
                <button
                  type="button"
                  onClick={() => { onChange(''); setOpen(false); }}
                  className="flex-1 rounded-xl bg-stone-100 py-1.5 text-xs font-semibold text-stone-500 transition hover:bg-stone-200 dark:bg-white/5 dark:text-stone-400 dark:hover:bg-white/10"
                >
                  Limpar
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
