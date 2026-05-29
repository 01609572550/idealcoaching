import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { roles } from '../data/constants.js';

export default function ProtectedRoute({ children, permission }) {
  const { user, profile, can } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (profile?.status === 'Inactive') return <Navigate to="/login" replace />;
  if (permission === '*' && profile?.role !== roles.SUPER_ADMIN) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">Only Super Admin can open this page.</div>;
  }
  if (permission && permission !== '*' && !can(permission) && profile?.role !== roles.SUPER_ADMIN) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">You do not have permission to open this page.</div>;
  }
  return children;
}
