import * as XLSX from 'xlsx';

export function exportCsv(filename, rows) {
  const keys = Object.keys(rows[0] || {});
  const csv = [keys.join(','), ...rows.map(row => keys.map(key => `"${String(row[key] ?? '').replace(/"/g, '""')}"`).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportExcel(filename, rows, sheetName = 'Report') {
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, XLSX.utils.json_to_sheet(rows), sheetName);
  XLSX.writeFile(book, filename);
}
