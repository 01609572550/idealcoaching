import { collections } from '../data/constants.js';
import { createDoc, getAll, upsertDoc } from './firestoreService.js';

export function gradeFromMarks(marks) {
  const n = Number(marks || 0);
  if (n >= 80) return 'A+';
  if (n >= 70) return 'A';
  if (n >= 60) return 'A-';
  if (n >= 50) return 'B';
  if (n >= 40) return 'C';
  if (n >= 33) return 'D';
  return 'F';
}

export async function createExam(input) {
  return createDoc(collections.exams, {
    name: input.name,
    className: input.className,
    batchId: input.batchId || '',
    subjects: input.subjects || [],
    totalMarks: Number(input.totalMarks || 100),
    date: input.date || new Date().toISOString().slice(0, 10),
    createdAt: new Date().toISOString()
  });
}

export async function saveResult(input) {
  const marks = input.status === 'Absent' ? 0 : Number(input.marks || 0);
  const result = {
    examId: input.examId,
    examName: input.examName,
    roll: input.roll,
    studentName: input.studentName,
    subject: input.subject,
    marks,
    grade: input.status === 'Absent' ? 'Absent' : gradeFromMarks(marks),
    percentage: Number(input.totalMarks || 100) ? Math.round((marks / Number(input.totalMarks || 100)) * 10000) / 100 : 0,
    status: input.status || 'Present',
    remarks: input.remarks || '',
    updatedAt: new Date().toISOString()
  };
  await upsertDoc(collections.results, `${input.examId}_${input.roll}_${input.subject}`, result);
  return result;
}

export async function calculateMerit(examId) {
  const results = (await getAll(collections.results)).filter(item => item.examId === examId);
  const totals = new Map();
  results.forEach(item => {
    const row = totals.get(item.roll) || { roll: item.roll, studentName: item.studentName, total: 0 };
    row.total += Number(item.marks || 0);
    totals.set(item.roll, row);
  });
  return [...totals.values()].sort((a, b) => b.total - a.total).map((item, index) => ({ ...item, position: index + 1 }));
}
