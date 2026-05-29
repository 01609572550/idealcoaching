import DataTable from '../components/DataTable.jsx';
import { collections } from '../data/constants.js';
import { useCollection } from '../hooks/useCollection.js';
import { exportCsv, exportExcel } from '../utils/export.js';
import { money } from '../utils/date.js';

export default function Reports() {
  const { data: students } = useCollection(collections.students);
  const { data: payments } = useCollection(collections.paymentHistory);
  const dueRows = students.filter(s => Number(s.dueAmount || 0) > 0);
  const collectionRows = payments.map(p => ({
    invoiceId: p.invoiceId,
    roll: p.roll,
    studentName: p.studentName,
    type: p.type,
    paidAmount: p.paidAmount,
    remainingDue: p.remainingDue,
    timestamp: p.timestamp
  }));
  const totalIncome = collectionRows.reduce((sum, row) => sum + Number(row.paidAmount || 0), 0);
  const totalDue = dueRows.reduce((sum, row) => sum + Number(row.dueAmount || 0), 0);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><p className="text-sm text-slate-500">Total Income</p><strong className="text-3xl">{money(totalIncome)}</strong></div>
        <div className="card"><p className="text-sm text-slate-500">Total Due</p><strong className="text-3xl">{money(totalDue)}</strong></div>
      </div>
      <div className="card">
        <div className="mb-4 flex flex-wrap justify-between gap-2"><h2 className="font-bold">Collection Report</h2><div className="flex gap-2"><button className="btn" onClick={() => window.print()}>Print</button><button className="btn" onClick={() => exportCsv('collection-report.csv', collectionRows)}>CSV</button><button className="btn" onClick={() => exportExcel('collection-report.xlsx', collectionRows)}>Excel</button></div></div>
        <DataTable columns={[{ key:'invoiceId', label:'Invoice' }, { key:'roll', label:'Roll' }, { key:'studentName', label:'Student' }, { key:'paidAmount', label:'Paid', render:r=>money(r.paidAmount) }, { key:'remainingDue', label:'Due', render:r=>money(r.remainingDue) }, { key:'timestamp', label:'Date' }]} rows={collectionRows} />
      </div>
      <div className="card">
        <div className="mb-4 flex flex-wrap justify-between gap-2"><h2 className="font-bold">Due Report</h2><div className="flex gap-2"><button className="btn" onClick={() => exportCsv('due-report.csv', dueRows)}>CSV</button><button className="btn" onClick={() => exportExcel('due-report.xlsx', dueRows)}>Excel</button></div></div>
        <DataTable columns={[{ key:'roll', label:'Roll' }, { key:'fullName', label:'Student' }, { key:'className', label:'Class' }, { key:'phone', label:'Phone' }, { key:'dueAmount', label:'Due', render:r=>money(r.dueAmount) }]} rows={dueRows} />
      </div>
    </div>
  );
}
