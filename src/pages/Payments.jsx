import { useMemo, useState } from 'react';
import { db } from '../firebase/config.js';
import DataTable from '../components/DataTable.jsx';
import FormField from '../components/FormField.jsx';
import { collections, paymentMethods, paymentTypes } from '../data/constants.js';
import { useCollection } from '../hooks/useCollection.js';
import { addManualDue, createPayment } from '../services/paymentService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useToast } from '../contexts/ToastContext.jsx';
import { inputDate, money, monthKey } from '../utils/date.js';
import { useOfflineQueue } from '../services/offlineQueue.js';

export default function Payments() {
  const { user } = useAuth();
  const toast = useToast();
  const queue = useOfflineQueue();
  const { data: students } = useCollection(collections.students);
  const { data: payments } = useCollection(collections.paymentHistory, { orderBy: ['createdAt', 'desc'], limit: 100 });
  const [roll, setRoll] = useState('');
  const student = useMemo(() => students.find(s => s.roll === roll), [students, roll]);
  const [form, setForm] = useState({ type: 'Monthly Fee', method: 'Cash', paidAmount: '', currentCharges: '', discount: 0, month: monthKey(), paymentDate: inputDate(), paymentTime: '', comment: '' });
  const [due, setDue] = useState({ amount: '', type: 'Other Fees', date: inputDate(), time: '', comment: '' });

  async function submitPayment(e) {
    e.preventDefault();
    const payload = { ...form, roll, db };
    if (!navigator.onLine) {
      queue.enqueue({ label: 'Payment', payload, action: 'createPayment' });
      toast.push('Saved offline. It will sync when internet returns.', 'success');
      return;
    }
    try {
      await createPayment(payload, user);
      toast.push('Payment saved and invoice generated.', 'success');
      setForm({ ...form, paidAmount: '', currentCharges: '', discount: 0, comment: '' });
    } catch (error) {
      toast.push(error.message, 'error');
    }
  }

  async function submitDue(e) {
    e.preventDefault();
    const payload = { ...due, roll };
    if (!navigator.onLine) {
      queue.enqueue({ label: 'Manual Due', payload, action: 'addManualDue' });
      toast.push('Manual due saved offline.', 'success');
      return;
    }
    try {
      await addManualDue(payload, db, user);
      toast.push('Manual due added.', 'success');
      setDue({ ...due, amount: '', comment: '' });
    } catch (error) {
      toast.push(error.message, 'error');
    }
  }

  const history = payments.filter(item => !roll || item.roll === roll);

  return (
    <div className="grid gap-5 xl:grid-cols-[.95fr_1.05fr]">
      <div className="grid gap-5">
        <div className="card">
          <h2 className="mb-4 font-bold">Collect Payment</h2>
          <FormField label="Roll Search"><input value={roll} onChange={e => setRoll(e.target.value)} placeholder="6 digit roll" /></FormField>
          {student && <div className="my-3 rounded-lg bg-blue-50 p-3 text-sm text-blue-900 dark:bg-blue-950 dark:text-blue-100">{student.fullName} - Current Due {money(student.dueAmount)}</div>}
          <form onSubmit={submitPayment} className="form-grid">
            <FormField label="Type"><select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>{paymentTypes.map(v => <option key={v}>{v}</option>)}</select></FormField>
            <FormField label="Method"><select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>{paymentMethods.map(v => <option key={v}>{v}</option>)}</select></FormField>
            <FormField label="Month"><input type="month" value={form.month} onChange={e => setForm({ ...form, month: e.target.value })} /></FormField>
            <FormField label="Current Charges"><input type="number" value={form.currentCharges} onChange={e => setForm({ ...form, currentCharges: e.target.value })} /></FormField>
            <FormField label="Paid Amount"><input required type="number" value={form.paidAmount} onChange={e => setForm({ ...form, paidAmount: e.target.value })} /></FormField>
            <FormField label="Discount"><input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} /></FormField>
            <FormField label="Payment Date"><input type="date" value={form.paymentDate} onChange={e => setForm({ ...form, paymentDate: e.target.value })} /></FormField>
            <FormField label="Payment Time"><input type="time" value={form.paymentTime} onChange={e => setForm({ ...form, paymentTime: e.target.value })} /></FormField>
            <FormField label="Comment"><textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} /></FormField>
            <button className="btn btn-primary self-end">Save Payment</button>
          </form>
        </div>
        <div className="card">
          <h2 className="mb-4 font-bold">Add Manual Due</h2>
          <form onSubmit={submitDue} className="form-grid">
            <FormField label="Due Amount"><input required type="number" value={due.amount} onChange={e => setDue({ ...due, amount: e.target.value })} /></FormField>
            <FormField label="Type"><select value={due.type} onChange={e => setDue({ ...due, type: e.target.value })}>{paymentTypes.map(v => <option key={v}>{v}</option>)}</select></FormField>
            <FormField label="Date"><input type="date" value={due.date} onChange={e => setDue({ ...due, date: e.target.value })} /></FormField>
            <FormField label="Time"><input type="time" value={due.time} onChange={e => setDue({ ...due, time: e.target.value })} /></FormField>
            <FormField label="Comment"><textarea value={due.comment} onChange={e => setDue({ ...due, comment: e.target.value })} /></FormField>
            <button className="btn btn-primary self-end">Add Due</button>
          </form>
        </div>
      </div>
      <div className="card">
        <h2 className="mb-4 font-bold">Payment Timeline</h2>
        <DataTable columns={[
          { key: 'invoiceId', label: 'Invoice' },
          { key: 'studentName', label: 'Student' },
          { key: 'paidAmount', label: 'Paid', render: r => money(r.paidAmount) },
          { key: 'remainingDue', label: 'Due', render: r => money(r.remainingDue) },
          { key: 'timestamp', label: 'Date' }
        ]} rows={history} />
      </div>
    </div>
  );
}
