export default function FormField({ label, children }) {
  return <label className="grid gap-1 text-sm font-semibold text-slate-600 dark:text-slate-300">{label}{children}</label>;
}
