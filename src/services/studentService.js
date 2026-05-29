import { query, where, getDocs } from 'firebase/firestore';
import { collections, studentStatuses, subjects } from '../data/constants.js';
import { collectionRef, getById, upsertDoc } from './firestoreService.js';
import { nextRoll } from '../utils/ids.js';
import { assertRequired, sanitizeText } from '../utils/security.js';

export async function saveStudent(input, mode = 'new') {
  assertRequired(input.fullName, 'Full name');
  assertRequired(input.className, 'Class');
  const roll = mode === 'existing' ? sanitizeText(input.roll) : (input.roll || await nextRoll());
  if (!/^\d{6}$/.test(String(roll))) throw new Error('Roll must be exactly 6 digits.');
  const existing = await getById(collections.students, roll);
  if (mode === 'new' && existing) throw new Error('Roll already exists.');

  const student = {
    roll,
    fullName: sanitizeText(input.fullName),
    fatherName: sanitizeText(input.fatherName),
    motherName: sanitizeText(input.motherName),
    phone: sanitizeText(input.phone),
    guardianPhone: sanitizeText(input.guardianPhone),
    address: sanitizeText(input.address),
    schoolCollege: sanitizeText(input.schoolCollege),
    gender: input.gender || '',
    dateOfBirth: input.dateOfBirth || '',
    admissionDate: input.admissionDate || new Date().toISOString().slice(0, 10),
    className: sanitizeText(input.className),
    batches: Array.isArray(input.batches) ? input.batches : [],
    subject: subjects.includes(input.subject) ? input.subject : 'Others',
    monthlyFee: Number(input.monthlyFee || 0),
    sheetFee: Number(input.sheetFee || 0),
    examFee: Number(input.examFee || 0),
    discount: Number(input.discount || 0),
    dueAmount: Number(input.dueAmount || 0),
    status: studentStatuses.includes(input.status) ? input.status : 'Active',
    notes: sanitizeText(input.notes),
    profileImageUrl: input.profileImageUrl || '',
    updatedAt: new Date().toISOString(),
    createdAt: existing?.createdAt || new Date().toISOString()
  };

  await upsertDoc(collections.students, roll, student);
  return student;
}

export async function searchStudents(term) {
  const clean = sanitizeText(term).toLowerCase();
  if (!clean) return [];
  const rollSnap = await getDocs(query(collectionRef(collections.students), where('roll', '==', clean)));
  if (!rollSnap.empty) return rollSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  const all = await getDocs(collectionRef(collections.students));
  return all.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(s => [s.roll, s.fullName, s.phone, s.guardianPhone].some(v => String(v || '').toLowerCase().includes(clean)));
}

export async function archiveStudent(roll) {
  const student = await getById(collections.students, roll);
  if (!student) throw new Error('Student not found.');
  await upsertDoc(collections.students, roll, { status: 'Inactive', archivedAt: new Date().toISOString() });
}

export function calculateStudentFees(student, batches = [], classes = []) {
  const assigned = batches.filter(batch => (student.batches || []).includes(batch.id || batch.batchId));
  const batchTotal = assigned.reduce((sum, batch) => sum + Number(batch.monthlyFee || 0) + Number(batch.sheetFee || 0) + Number(batch.examFee || 0) + Number(batch.otherFee || 0), 0);
  const classItem = classes.find(item => item.name === student.className);
  const classTotal = classItem ? Number(classItem.monthlyFee || 0) + Number(classItem.sheetFee || 0) + Number(classItem.examFee || 0) + Number(classItem.otherFee || 0) : 0;
  const individual = Number(student.monthlyFee || 0) + Number(student.sheetFee || 0) + Number(student.examFee || 0);
  return Math.max(0, batchTotal + classTotal + individual - Number(student.discount || 0));
}
