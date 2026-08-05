import { motion } from 'framer-motion';

export default function StatCard({ title, value, detail, icon: Icon, tone = 'indigo' }) {
  const tones = {
    emerald: 'text-emerald-500 bg-emerald-500/10',
    rose: 'text-rose-500 bg-rose-500/10',
    amber: 'text-amber-500 bg-amber-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10',
  };

  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl border border-zinc-200 bg-white/75 p-5 shadow-sm backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-900/70"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{title}</p>
          <strong className="mt-3 block text-2xl font-semibold text-zinc-950 dark:text-white">{value}</strong>
          {detail && <span className="mt-2 block text-xs text-zinc-500 dark:text-zinc-500">{detail}</span>}
        </div>
        {Icon && (
          <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>
            <Icon size={21} />
          </div>
        )}
      </div>
    </motion.article>
  );
}
