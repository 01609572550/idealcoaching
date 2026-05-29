import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import { collections } from '../data/constants.js';
import { useCollection } from '../hooks/useCollection.js';
import { money } from '../utils/date.js';

export default function StudentPortal() {
  const [roll, setRoll] = useState('');
  const { data: students } = useCollection(collections.students);
  const { data: results } = useCollection(collections.results, { orderBy: ['updatedAt', 'desc'] });
  const { data: payments } = useCollection(collections.paymentHistory, { orderBy: ['createdAt', 'desc'] });
  const student = useMemo(() => students.find(s => s.roll === roll), [students, roll]);
  const studentResults = results.filter(r => r.roll === roll);
  const studentPayments = payments.filter(p => p.roll === roll);

  return (
    <div className="min-h-screen bg-slate-50 p-4 dark:bg-slate-950">
      <div className="mx-auto grid max-w-5xl gap-5">
        <div className="card">
          <h1 className="text-2xl font-black">Student Portal</h1>
          <p className="text-slate-500">Search by roll number to view results, payments, and dues.</p>
          <input className="mt-4 max-w-sm" placeholder="Enter roll number" value={roll} onChange={e => setRoll(e.target.value)} />
        </div>
        {student && <div className="card"><h2 className="font-bold">{student.fullName}</h2><p>Class {student.className} - Due {money(student.dueAmount)}</p></div>}
        <DataTable columns={[{ key:'examName', label:'Exam' }, { key:'subject', label:'Subject' }, { key:'marks', label:'Marks' }, { key:'grade', label:'Grade' }, { key:'status', label:'Status' }]} rows={studentResults} empty="No results found." />
        <DataTable columns={[{ key:'invoiceId', label:'Invoice' }, { key:'type', label:'Type' }, { key:'paidAmount', label:'Paid', render:r=>money(r.paidAmount) }, { key:'remainingDue', label:'Due', render:r=>money(r.remainingDue) }, { key:'timestamp', label:'Date' }]} rows={studentPayments} empty="No payment history found." />
      </div>
    </div>
  );
}
