import { motion } from "framer-motion";

export default function PageShell({ children, title, subtitle, actions }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.24, ease: "easeOut" }}
      className="min-h-screen px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-10"
      style={{ maxWidth: 1180, margin: "0 auto" }}
    >
      <header className="print:hidden mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-500 dark:text-indigo-400">
            Organização simples e prática
          </p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 max-w-2xl text-sm text-zinc-500 dark:text-zinc-400">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        )}
      </header>
      {children}
    </motion.section>
  );
}
