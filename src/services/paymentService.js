import { doc, runTransaction } from 'firebase/firestore';
import QRCode from 'qrcode';
import { collections } from '../data/constants.js';
import { bdDateTime, monthKey } from '../utils/date.js';
import { nextInvoiceId } from '../utils/ids.js';
import { sanitizeText } from '../utils/security.js';
import { getById, upsertDoc } from './firestoreService.js';

export async function createPayment(input, user) {
  const roll = sanitizeText(input.roll);
  if (!/^\d{6}$/.test(roll)) throw new Error('Valid roll is required.');
  const student = await getById(collections.students, roll);
  if (!student) throw new Error('Student not found.');

  const invoiceId = await nextInvoiceId();
  const paidAmount = Number(input.paidAmount || 0);
  const currentCharges = Number(input.currentCharges || 0);
  const previousDue = Number(student.dueAmount || 0);
  const discount = Number(input.discount || 0);
  const payable = Math.max(0, previousDue + currentCharges - discount);
  const remainingDue = Math.max(0, payable - paidAmount);
  const timestamp = input.paymentDate ? `${input.paymentDate} ${input.paymentTime || '00:00'}` : bdDateTime();
  const verifyUrl = `${import.meta.env.VITE_APP_BASE_URL || location.origin}/verify/invoice/${invoiceId}`;
  const qrData = await QRCode.toDataURL(JSON.stringify({ invoiceId, roll, paidAmount, remainingDue, verifyUrl }));

  const payment = {
    invoiceId,
    roll,
    studentName: student.fullName,
    type: input.type,
    method: input.method,
    month: input.month || monthKey(),
    previousDue,
    currentCharges,
    discount,
    payable,
    paidAmount,
    remainingDue,
    comment: sanitizeText(input.comment),
    timestamp,
    createdAt: new Date().toISOString(),
    createdBy: user?.uid || '',
    createdByName: user?.displayName || user?.email || ''
  };

  const invoice = {
    ...payment,
    status: remainingDue > 0 ? 'Partial' : 'Paid',
    qrData,
    verifyUrl,
    centerName: 'Ideal Coaching Center'
  };

  await runTransaction(input.db, async tx => {
    tx.set(doc(input.db, collections.payments, invoiceId), payment);
    tx.set(doc(input.db, collections.paymentHistory, invoiceId), payment);
    tx.set(doc(input.db, collections.invoices, invoiceId), invoice);
    tx.set(doc(input.db, collections.dues, roll), {
      roll,
      studentName: student.fullName,
      dueAmount: remainingDue,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    tx.set(doc(input.db, collections.students, roll), {
      dueAmount: remainingDue,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  });

  return invoice;
}

export async function addManualDue(input, db, user) {
  const roll = sanitizeText(input.roll);
  const student = await getById(collections.students, roll);
  if (!student) throw new Error('Student not found.');
  const amount = Number(input.amount || 0);
  if (amount <= 0) throw new Error('Due amount must be greater than zero.');
  const nextDue = Number(student.dueAmount || 0) + amount;
  const id = `DUE-${roll}-${Date.now()}`;
  await upsertDoc(collections.paymentHistory, id, {
    invoiceId: id,
    roll,
    studentName: student.fullName,
    type: input.type || 'Other Fees',
    method: 'Manual Due',
    previousDue: Number(student.dueAmount || 0),
    currentCharges: amount,
    paidAmount: 0,
    remainingDue: nextDue,
    comment: sanitizeText(input.comment),
    timestamp: input.date ? `${input.date} ${input.time || '00:00'}` : bdDateTime(),
    createdAt: new Date().toISOString(),
    createdBy: user?.uid || ''
  });
  await upsertDoc(collections.dues, roll, { roll, studentName: student.fullName, dueAmount: nextDue, updatedAt: new Date().toISOString() });
  await upsertDoc(collections.students, roll, { dueAmount: nextDue, updatedAt: new Date().toISOString() });
}
