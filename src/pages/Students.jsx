import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import Modal from '../components/Modal.jsx';
import FormField from '../components/FormField.jsx';
import { collections, genders, studentStatuses, subjects } from '../data/constants.js';
import { useCollection } from '../hooks/useCollection.js';
import { saveStudent } from '../services/studentService.js';
import { useToast } from '../contexts/ToastContext.jsx';
import { exportCsv, exportExcel } from '../utils/export.js';
import { inputDate, money } from '../utils/date.js';

const emptyForm = {
  mode: 'new', roll: '', fullName: '', fatherName: '', motherName: '', phone: '', guardianPhone: '', address: '',
  schoolCollege: '', gender: 'Male', dateOfBirth: '', admissionDate: inputDate(), className: '', subject: 'ICT',
  monthlyFee: 0, sheetFee: 0, examFee: 0, discount: 0, dueAmount: 0, status: 'Active', notes: ''
};

export default function Students() {
  const { data: students } = useCollection(collections.students);
  const { data: batches } = useCollection(collections.batches);
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [selectedBatches, setSelectedBatches] = useState([]);

  const rows = useMemo(() => students.filter(s => [s.roll, s.fullName, s.phone, s.guardianPhone].some(v => String(v || '').toLowerCase().includes(search.toLowerCase()))), [students, search]);

  async function submit(e) {
    e.preventDefault();
    try {
      await saveStudent({ ...form, batches: selectedBatches }, form.mode);
      toast.push('Student saved.', 'success');
      setOpen(false);
    } catch (error) {
      toast.push(error.message, 'error');
    }
  }

  function edit(row) {
    setForm({ ...emptyForm, ...row, mode: 'existing' });
    setSelectedBatches(row.batches || []);
    setOpen(true);
  }

  return (
    <div className="grid gap-4">
      <div className="card">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <input className="max-w-md" placeholder="Search roll, name, phone" value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex gap-2">
            <button className="btn" onClick={() => exportCsv('students.csv', rows)}>CSV</button>
            <button className="btn" onClick={() => exportExcel('students.xlsx', rows, 'Students')}>Excel</button>
            <button className="btn btn-primary" onClick={() => { setForm(emptyForm); setSelectedBatches([]); setOpen(true); }}>Add Student</button>
          </div>
        </div>
        <DataTable columns={[
          { key: 'roll', label: 'Roll' },
          { key: 'fullName', label: 'Name' },
          { key: 'className', label: 'Class' },
          { key: 'subject', label: 'Subject' },
          { key: 'dueAmount', label: 'Due', render: r => money(r.dueAmount) },
          { key: 'status', label: 'Status' },
          { key: 'actions', label: 'Actions', render: r => <button className="btn" onClick={() => edit(r)}>Edit</button> }
        ]} rows={rows} />
      </div>
      <Modal open={open} title="Student Form" onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="form-grid">
          <FormField label="Student Type"><select value={form.mode} onChange={e => setForm({ ...form, mode: e.target.value })}><option value="new">New Student</option><option value="existing">Existing Student</option></select></FormField>
          <FormField label="Roll Number"><input value={form.roll} disabled={form.mode === 'new'} onChange={e => setForm({ ...form, roll: e.target.value })} /></FormField>
          <FormField label="Full Name"><input required value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })} /></FormField>
          <FormField label="Father Name"><input value={form.fatherName} onChange={e => setForm({ ...form, fatherName: e.target.value })} /></FormField>
          <FormField label="Mother Name"><input value={form.motherName} onChange={e => setForm({ ...form, motherName: e.target.value })} /></FormField>
          <FormField label="Phone"><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></FormField>
          <FormField label="Guardian Phone"><input value={form.guardianPhone} onChange={e => setForm({ ...form, guardianPhone: e.target.value })} /></FormField>
          <FormField label="School/College"><input value={form.schoolCollege} onChange={e => setForm({ ...form, schoolCollege: e.target.value })} /></FormField>
          <FormField label="Gender"><select value={form.gender} onChange={e => setForm({ ...form, gender: e.target.value })}>{genders.map(v => <option key={v}>{v}</option>)}</select></FormField>
          <FormField label="Date of Birth"><input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} /></FormField>
          <FormField label="Admission Date"><input type="date" value={form.admissionDate} onChange={e => setForm({ ...form, admissionDate: e.target.value })} /></FormField>
          <FormField label="Class"><input required value={form.className} onChange={e => setForm({ ...form, className: e.target.value })} /></FormField>
          <FormField label="Subject"><select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })}>{subjects.map(v => <option key={v}>{v}</option>)}</select></FormField>
          <FormField label="Monthly Fee"><input type="number" value={form.monthlyFee} onChange={e => setForm({ ...form, monthlyFee: e.target.value })} /></FormField>
          <FormField label="Sheet Fee"><input type="number" value={form.sheetFee} onChange={e => setForm({ ...form, sheetFee: e.target.value })} /></FormField>
          <FormField label="Exam Fee"><input type="number" value={form.examFee} onChange={e => setForm({ ...form, examFee: e.target.value })} /></FormField>
          <FormField label="Discount"><input type="number" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} /></FormField>
          <FormField label="Previous Due"><input type="number" value={form.dueAmount} onChange={e => setForm({ ...form, dueAmount: e.target.value })} /></FormField>
          <FormField label="Status"><select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>{studentStatuses.map(v => <option key={v}>{v}</option>)}</select></FormField>
          <div className="md:col-span-2">
            <p className="mb-2 text-sm font-bold text-slate-600">Batches</p>
            <div className="grid gap-2 rounded-lg border p-3 md:grid-cols-2 dark:border-slate-700">
              {batches.map(batch => <label key={batch.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedBatches.includes(batch.id)} onChange={e => setSelectedBatches(items => e.target.checked ? [...items, batch.id] : items.filter(id => id !== batch.id))} /> {batch.name}</label>)}
            </div>
          </div>
          <FormField label="Address"><textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></FormField>
          <FormField label="Notes"><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></FormField>
          <button className="btn btn-primary md:col-span-2">Save Student</button>
        </form>
      </Modal>
    </div>
  );
}
