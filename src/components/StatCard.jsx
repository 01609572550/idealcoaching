export default function StatCard({ label, value, icon: Icon, tone = 'blue' }) {
  const tones = {
    blue: 'from-blue-600 to-sky-500',
    green: 'from-emerald-600 to-teal-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-red-500'
  };
  return (
    <div className="rounded-xl border border-white/60 bg-white/80 p-5 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
          <strong className="mt-2 block text-2xl">{value}</strong>
        </div>
        {Icon && <div className={`rounded-xl bg-gradient-to-br ${tones[tone]} p-3 text-white`}><Icon size={22} /></div>}
      </div>
    </div>
  );
}
