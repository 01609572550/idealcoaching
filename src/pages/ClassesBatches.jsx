import { useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import FormField from '../components/FormField.jsx';
import { collections, subjects } from '../data/constants.js';
import { useCollection } from '../hooks/useCollection.js';
import { createDoc } from '../services/firestoreService.js';
import { useToast } from '../contexts/ToastContext.jsx';
import { money } from '../utils/date.js';

export default function ClassesBatches() {
  const toast = useToast();
  const { data: classes } = useCollection(collections.classes);
  const { data: batches } = useCollection(collections.batches);
  const [classForm, setClassForm] = useState({ name: '', monthlyFee: 0, sheetFee: 0, examFee: 0, otherFee: 0 });
  const [batchForm, setBatchForm] = useState({ name: '', className: '', subject: 'ICT', teacher: '', schedule: '', timing: '', monthlyFee: 0, sheetFee: 0, examFee: 0, otherFee: 0 });

  async function saveClass(e) {
    e.preventDefault();
    await createDoc(collections.classes, { ...classForm, createdAt: new Date().toISOString() });
    toast.push('Class saved.', 'success');
    setClassForm({ name: '', monthlyFee: 0, sheetFee: 0, examFee: 0, otherFee: 0 });
  }

  async function saveBatch(e) {
    e.preventDefault();
    await createDoc(collections.batches, { ...batchForm, createdAt: new Date().toISOString() });
    toast.push('Batch saved.', 'success');
    setBatchForm({ name: '', className: '', subject: 'ICT', teacher: '', schedule: '', timing: '', monthlyFee: 0, sheetFee: 0, examFee: 0, otherFee: 0 });
  }

  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <div className="card">
        <h2 className="mb-4 font-bold">Create Class</h2>
        <form onSubmit={saveClass} className="form-grid">
          <FormField label="Class Name"><input required value={classForm.name} onChange={e => setClassForm({ ...classForm, name: e.target.value })} /></FormField>
          {['monthlyFee','sheetFee','examFee','otherFee'].map(key => <FormField key={key} label={key}><input type="number" value={classForm[key]} onChange={e => setClassForm({ ...classForm, [key]: e.target.value })} /></FormField>)}
          <button className="btn btn-primary md:col-span-2">Save Class</button>
        </form>
        <div className="mt-5"><DataTable columns={[{ key:'name', label:'Class' }, { key:'monthlyFee', label:'Monthly', render:r=>money(r.monthlyFee) }, { key:'examFee', label:'Exam', render:r=>money(r.examFee) }]} rows={classes} /></div>
      </div>
      <div className="card">
        <h2 className="mb-4 font-bold">Create Batch</h2>
        <form onSubmit={saveBatch} className="form-grid">
          <FormField label="Batch Name"><input required value={batchForm.name} onChange={e => setBatchForm({ ...batchForm, name: e.target.value })} /></FormField>
          <FormField label="Class"><input value={batchForm.className} onChange={e => setBatchForm({ ...batchForm, className: e.target.value })} /></FormField>
          <FormField label="Subject"><select value={batchForm.subject} onChange={e => setBatchForm({ ...batchForm, subject: e.target.value })}>{subjects.map(v => <option key={v}>{v}</option>)}</select></FormField>
          <FormField label="Teacher"><input value={batchForm.teacher} onChange={e => setBatchForm({ ...batchForm, teacher: e.target.value })} /></FormField>
          <FormField label="Schedule"><input value={batchForm.schedule} onChange={e => setBatchForm({ ...batchForm, schedule: e.target.value })} /></FormField>
          <FormField label="Timing"><input value={batchForm.timing} onChange={e => setBatchForm({ ...batchForm, timing: e.target.value })} /></FormField>
          {['monthlyFee','sheetFee','examFee','otherFee'].map(key => <FormField key={key} label={key}><input type="number" value={batchForm[key]} onChange={e => setBatchForm({ ...batchForm, [key]: e.target.value })} /></FormField>)}
          <button className="btn btn-primary md:col-span-2">Save Batch</button>
        </form>
        <div className="mt-5"><DataTable columns={[{ key:'name', label:'Batch' }, { key:'className', label:'Class' }, { key:'teacher', label:'Teacher' }, { key:'monthlyFee', label:'Monthly', render:r=>money(r.monthlyFee) }]} rows={batches} /></div>
      </div>
    </div>
  );
}
