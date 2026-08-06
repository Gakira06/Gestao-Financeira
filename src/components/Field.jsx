export default function Field({ label, hint, children }) {
  return (
    <label className="grid gap-1.5 text-sm">
      <span className="font-medium text-stone-600 dark:text-stone-300">{label}</span>
      {children}
      {hint && <span className="text-xs text-stone-400 dark:text-stone-500">{hint}</span>}
    </label>
  );
}
