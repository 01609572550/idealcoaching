export default function Modal({ title, open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
      <div className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <h2 className="font-bold">{title}</h2>
          <button onClick={onClose} className="rounded-lg border px-3 py-1 dark:border-slate-700">Close</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
