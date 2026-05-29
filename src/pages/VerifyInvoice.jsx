import { useParams } from 'react-router-dom';
import { collections } from '../data/constants.js';
import { useCollection } from '../hooks/useCollection.js';
import { money } from '../utils/date.js';

export default function VerifyInvoice() {
  const { invoiceId } = useParams();
  const { data } = useCollection(collections.invoices);
  const invoice = data.find(item => item.invoiceId === invoiceId || item.id === invoiceId);

  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 p-4 dark:bg-slate-950">
      <div className="w-full max-w-xl rounded-2xl border bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
        <span className={`badge ${invoice ? 'text-emerald-600' : 'text-red-600'}`}>{invoice ? 'Valid Invoice' : 'Invoice Not Found'}</span>
        <h1 className="mt-4 text-2xl font-black">Invoice Verification</h1>
        {invoice ? <dl className="mt-4 grid grid-cols-[140px_1fr] gap-3 text-sm">
          <dt>Invoice ID</dt><dd className="font-bold">{invoice.invoiceId}</dd>
          <dt>Student</dt><dd className="font-bold">{invoice.studentName}</dd>
          <dt>Roll</dt><dd className="font-bold">{invoice.roll}</dd>
          <dt>Paid</dt><dd className="font-bold">{money(invoice.paidAmount)}</dd>
          <dt>Due</dt><dd className="font-bold">{money(invoice.remainingDue)}</dd>
          <dt>Timestamp</dt><dd className="font-bold">{invoice.timestamp}</dd>
        </dl> : <p className="mt-4 text-slate-500">This invoice could not be verified.</p>}
      </div>
    </div>
  );
}
