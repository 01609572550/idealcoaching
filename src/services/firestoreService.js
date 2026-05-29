import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config.js';

export function collectionRef(name) {
  return collection(db, name);
}

export function docRef(name, id) {
  return doc(db, name, String(id));
}

export async function upsertDoc(name, id, data) {
  await setDoc(docRef(name, id), data, { merge: true });
  return { id, ...data };
}

export async function createDoc(name, data) {
  const ref = await addDoc(collectionRef(name), data);
  return { id: ref.id, ...data };
}

export async function updateById(name, id, data) {
  await updateDoc(docRef(name, id), data);
  return { id, ...data };
}

export async function removeById(name, id) {
  await deleteDoc(docRef(name, id));
  return id;
}

export async function getById(name, id) {
  const snap = await getDoc(docRef(name, id));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function getAll(name) {
  const snap = await getDocs(collectionRef(name));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export function listenCollection(name, callback, options = {}) {
  const constraints = [];
  if (options.where) options.where.forEach(w => constraints.push(where(...w)));
  if (options.orderBy) constraints.push(orderBy(...options.orderBy));
  if (options.limit) constraints.push(limit(options.limit));
  const q = constraints.length ? query(collectionRef(name), ...constraints) : collectionRef(name);
  return onSnapshot(q, snap => callback(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
}
