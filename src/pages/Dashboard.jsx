import { CreditCard, FileWarning, GraduationCap, Users } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard.jsx';
import DataTable from '../components/DataTable.jsx';
import { collections } from '../data/constants.js';
import { useCollection } from '../hooks/useCollection.js';
import { money, monthKey } from '../utils/date.js';

export default function Dashboard() {
  const { data: students } = useCollection(collections.students);
  const { data: payments } = useCollection(collections.payments, { orderBy: ['createdAt', 'desc'], limit: 20 });
  const { data: results } = useCollection(collections.results);
  const currentMonth = monthKey();
  const totalDue = students.reduce((sum, s) => sum + Number(s.dueAmount || 0), 0);
  const monthlyIncome = payments.filter(p => String(p.month || '').startsWith(currentMonth)).reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const todayCollection = payments.filter(p => String(p.createdAt || '').startsWith(today)).reduce((sum, p) => sum + Number(p.paidAmount || 0), 0);
  const chart = Array.from({ length: 12 }, (_, i) => {
    const key = `${new Date().getFullYear()}-${String(i + 1).padStart(2, '0')}`;
    return { month: key.slice(5), income: payments.filter(p => p.month === key).reduce((sum, p) => sum + Number(p.paidAmount || 0), 0) };
  });

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Students" value={students.length} icon={Users} />
        <StatCard label="Total Due" value={money(totalDue)} icon={FileWarning} tone="amber" />
        <StatCard label="Monthly Income" value={money(monthlyIncome)} icon={CreditCard} tone="green" />
        <StatCard label="Exam Records" value={results.length} icon={GraduationCap} tone="rose" />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.4fr_.9fr]">
        <div className="card">
          <h2 className="mb-4 font-bold">Monthly Income</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={v => money(v)} />
                <Area dataKey="income" stroke="#2563eb" fill="#bfdbfe" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card">
          <h2 className="mb-2 font-bold">Today&apos;s Collection</h2>
          <strong className="text-3xl">{money(todayCollection)}</strong>
          <p className="text-sm text-slate-500">Realtime from Firestore</p>
        </div>
      </div>
      <DataTable columns={[
        { key: 'invoiceId', label: 'Invoice' },
        { key: 'studentName', label: 'Student' },
        { key: 'paidAmount', label: 'Paid', render: r => money(r.paidAmount) },
        { key: 'remainingDue', label: 'Due', render: r => money(r.remainingDue) },
        { key: 'method', label: 'Method' }
      ]} rows={payments.slice(0, 10)} empty="No recent payments." />
    </div>
  );
}
