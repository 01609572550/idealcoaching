import { useMemo, useState } from 'react';
import DataTable from '../components/DataTable.jsx';
import FormField from '../components/FormField.jsx';
import { collections } from '../data/constants.js';
import { useCollection } from '../hooks/useCollection.js';
import { calculateMerit, createExam, saveResult } from '../services/resultService.js';
import { useToast } from '../contexts/ToastContext.jsx';

export default function Results() {
  const toast = useToast();
  const { data: students } = useCollection(collections.students);
  const { data: exams } = useCollection(collections.exams, { orderBy: ['createdAt', 'desc'] });
  const { data: results } = useCollection(collections.results);
  const [exam, setExam] = useState({ name: '', className: '', subjects: 'ICT,English', totalMarks: 100, date: new Date().toISOString().slice(0, 10) });
  const [entry, setEntry] = useState({ examId: '', roll: '', subject: '', marks: '', totalMarks: 100, status: 'Present', remarks: '' });
  const [merit, setMerit] = useState([]);
  const student = useMemo(() => students.find(s => s.roll === entry.roll), [students, entry.roll]);
  const selectedExam = exams.find(e => e.id === entry.examId);

  async function submitExam(e) {
    e.preventDefault();
    await createExam({ ...exam, subjects: exam.subjects.split(',').map(s => s.trim()).filter(Boolean) });
    toast.push('Exam created.', 'success');
    setExam({ ...exam, name: '' });
  }

  async function submitResult(e) {
    e.preventDefault();
    await saveResult({ ...entry, examName: selectedExam?.name, studentName: student?.fullName, totalMarks: selectedExam?.totalMarks || entry.totalMarks });
    toast.push('Result saved.', 'success');
  }

  async function showMerit() {
    if (!entry.examId) return toast.push('Select exam first.', 'error');
    setMerit(await calculateMerit(entry.examId));
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[.9fr_1.1fr]">
      <div className="grid gap-5">
        <div className="card">
          <h2 className="mb-4 font-bold">Create Exam</h2>
          <form onSubmit={submitExam} className="form-grid">
            <FormField label="Exam Name"><input required value={exam.name} onChange={e => setExam({ ...exam, name: e.target.value })} /></FormField>
            <FormField label="Class"><input value={exam.className} onChange={e => setExam({ ...exam, className: e.target.value })} /></FormField>
            <FormField label="Subjects"><input value={exam.subjects} onChange={e => setExam({ ...exam, subjects: e.target.value })} /></FormField>
            <FormField label="Total Marks"><input type="number" value={exam.totalMarks} onChange={e => setExam({ ...exam, totalMarks: e.target.value })} /></FormField>
            <FormField label="Date"><input type="date" value={exam.date} onChange={e => setExam({ ...exam, date: e.target.value })} /></FormField>
            <button className="btn btn-primary self-end">Save Exam</button>
          </form>
        </div>
        <div className="card">
          <h2 className="mb-4 font-bold">Input Marks</h2>
          <form onSubmit={submitResult} className="form-grid">
            <FormField label="Exam"><select required value={entry.examId} onChange={e => setEntry({ ...entry, examId: e.target.value })}><option value="">Select</option>{exams.map(x => <option key={x.id} value={x.id}>{x.name}</option>)}</select></FormField>
            <FormField label="Roll"><input required value={entry.roll} onChange={e => setEntry({ ...entry, roll: e.target.value })} /></FormField>
            <FormField label="Student"><input readOnly value={student?.fullName || ''} /></FormField>
            <FormField label="Subject"><input required value={entry.subject} onChange={e => setEntry({ ...entry, subject: e.target.value })} /></FormField>
            <FormField label="Marks"><input type="number" value={entry.marks} onChange={e => setEntry({ ...entry, marks: e.target.value })} /></FormField>
            <FormField label="Status"><select value={entry.status} onChange={e => setEntry({ ...entry, status: e.target.value })}><option>Present</option><option>Absent</option></select></FormField>
            <FormField label="Remarks"><textarea value={entry.remarks} onChange={e => setEntry({ ...entry, remarks: e.target.value })} /></FormField>
            <button className="btn btn-primary self-end">Save Result</button>
          </form>
        </div>
      </div>
      <div className="grid gap-5">
        <div className="card">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-bold">Merit List</h2><button className="btn" onClick={showMerit}>Calculate</button></div>
          <DataTable columns={[{ key:'position', label:'Position' }, { key:'roll', label:'Roll' }, { key:'studentName', label:'Student' }, { key:'total', label:'Total' }]} rows={merit} />
        </div>
        <DataTable columns={[{ key:'examName', label:'Exam' }, { key:'roll', label:'Roll' }, { key:'subject', label:'Subject' }, { key:'marks', label:'Marks' }, { key:'grade', label:'Grade' }, { key:'status', label:'Status' }]} rows={results} />
      </div>
    </div>
  );
}
