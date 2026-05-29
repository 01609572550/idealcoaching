import { NavLink, Outlet } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, BookOpen, CreditCard, FileText, GraduationCap, LayoutDashboard, LogOut, Moon, Settings, ShieldCheck, Sun, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useOfflineQueue } from '../services/offlineQueue.js';
import { CENTER_NAME } from '../data/constants.js';
import { db } from '../firebase/config.js';
import { addManualDue, createPayment } from '../services/paymentService.js';
import { useToast } from '../contexts/ToastContext.jsx';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/students', label: 'Students', icon: Users },
  { to: '/payments', label: 'Payments', icon: CreditCard },
  { to: '/results', label: 'Results', icon: GraduationCap },
  { to: '/classes', label: 'Classes & Batches', icon: BookOpen },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/staff', label: 'Staff', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: Settings }
];

export default function Shell() {
  const { profile, logout } = useAuth();
  const { user } = useAuth();
  const toast = useToast();
  const { items, online, remove, setSyncing } = useOfflineQueue();
  const [dark, setDark] = useState(localStorage.theme === 'dark');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.theme = dark ? 'dark' : 'light';
  }, [dark]);

  useEffect(() => {
    if (!online || !items.length) return;
    let cancelled = false;
    async function sync() {
      setSyncing(true);
      for (const item of items) {
        if (cancelled) break;
        try {
          if (item.action === 'createPayment') await createPayment({ ...item.payload, db }, user);
          if (item.action === 'addManualDue') await addManualDue(item.payload, db, user);
          remove(item.id);
          toast.push(`${item.label} synced.`, 'success');
        } catch (error) {
          toast.push(`Sync waiting: ${error.message}`, 'error');
          break;
        }
      }
      setSyncing(false);
    }
    sync();
    return () => { cancelled = true; };
  }, [online, items.length]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/50 bg-white/80 p-4 shadow-soft backdrop-blur-xl transition lg:translate-x-0 dark:border-slate-800 dark:bg-slate-900/80 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-6 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-700 font-black text-white">IC</div>
          <div>
            <strong>{CENTER_NAME}</strong>
            <p className="m-0 text-xs text-slate-500">{profile?.role}</p>
          </div>
        </div>
        <nav className="grid gap-1">
          {links.map(item => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'}`}>
              <item.icon size={18} /> {item.label}
            </NavLink>
          ))}
          <NavLink to="/portal" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"><FileText size={18} /> Student Portal</NavLink>
        </nav>
      </aside>
      <main className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/60 bg-slate-50/80 px-4 py-3 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/80">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(true)} className="rounded-lg border px-3 py-2 lg:hidden">Menu</button>
            <div>
              <h1 className="text-lg font-bold">Ideal Coaching Center Management System</h1>
              <p className="text-xs text-slate-500">{online ? 'Online' : 'Offline'} {items.length ? `- ${items.length} pending sync` : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg border p-2 dark:border-slate-700" onClick={() => setDark(v => !v)}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
            <button className="rounded-lg border p-2 text-red-600 dark:border-slate-700" onClick={logout}><LogOut size={18} /></button>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="p-4">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
