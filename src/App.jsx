import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Login from './pages/Login.jsx';
import Students from './pages/Students.jsx';
import Payments from './pages/Payments.jsx';
import Results from './pages/Results.jsx';
import ClassesBatches from './pages/ClassesBatches.jsx';
import Reports from './pages/Reports.jsx';
import Settings from './pages/Settings.jsx';
import StudentPortal from './pages/StudentPortal.jsx';
import VerifyInvoice from './pages/VerifyInvoice.jsx';
import Staff from './pages/Staff.jsx';
import { useAuth } from './contexts/AuthContext.jsx';

export default function App() {
  const { loading } = useAuth();
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50 text-slate-600 dark:bg-slate-950 dark:text-slate-300">Loading app...</div>;

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/portal" element={<StudentPortal />} />
      <Route path="/verify/invoice/:invoiceId" element={<VerifyInvoice />} />
      <Route element={<ProtectedRoute><Shell /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<ProtectedRoute permission="students:read"><Students /></ProtectedRoute>} />
        <Route path="/payments" element={<ProtectedRoute permission="payments:write"><Payments /></ProtectedRoute>} />
        <Route path="/results" element={<ProtectedRoute permission="results:write"><Results /></ProtectedRoute>} />
        <Route path="/classes" element={<ProtectedRoute permission="*"><ClassesBatches /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute permission="reports:limited"><Reports /></ProtectedRoute>} />
        <Route path="/staff" element={<ProtectedRoute permission="*"><Staff /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute permission="*"><Settings /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
