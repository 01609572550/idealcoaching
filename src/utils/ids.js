import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../firebase/config.js';

export async function nextCounter(name, start = 100000) {
  const ref = doc(db, 'settings', `counter_${name}`);
  return runTransaction(db, async tx => {
    const snap = await tx.get(ref);
    const current = snap.exists() ? Number(snap.data().value || start) : start;
    const next = current + 1;
    tx.set(ref, { value: next, updatedAt: new Date().toISOString() }, { merge: true });
    return next;
  });
}

export async function nextRoll() {
  return String(await nextCounter('roll', 100000)).slice(-6);
}

export async function nextInvoiceId() {
  const n = await nextCounter('invoice', 0);
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `ICC-${date}-${String(n).padStart(6, '0')}`;
}
