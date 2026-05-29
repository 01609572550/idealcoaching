import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';

export default function Login() {
  const { user, login } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ username: 'Shad', password: '752002' });
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.username, form.password);
      toast.push('Login successful.', 'success');
    } catch (error) {
      toast.push(error.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 p-4 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} onSubmit={submit} className="w-full max-w-md rounded-2xl border border-white/70 bg-white/80 p-8 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-teal-700 font-black text-white">IC</div>
        <h1 className="text-2xl font-black">Ideal Coaching Center</h1>
        <p className="mb-6 text-slate-500">Secure admin login</p>
        <div className="grid gap-4">
          <label className="grid gap-1 text-sm font-bold">Username<input value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></label>
          <label className="grid gap-1 text-sm font-bold">Password<input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
          <button disabled={busy} className="btn btn-primary">{busy ? 'Signing in...' : 'Login'}</button>
        </div>
      </motion.form>
    </div>
  );
}
