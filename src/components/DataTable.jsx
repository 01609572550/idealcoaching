export default function DataTable({ columns, rows, empty = 'No data found.' }) {
  return (
    <div className="overflow-auto rounded-xl border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <table className="min-w-full border-collapse text-sm">
        <thead className="bg-slate-100 text-left text-xs uppercase text-slate-500 dark:bg-slate-800">
          <tr>{columns.map(col => <th key={col.key} className="px-4 py-3">{col.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.length ? rows.map((row, index) => (
            <tr key={row.id || row.roll || index} className="border-t border-slate-100 dark:border-slate-800">
              {columns.map(col => <td key={col.key} className="px-4 py-3 align-top">{col.render ? col.render(row) : row[col.key]}</td>)}
            </tr>
          )) : <tr><td className="px-4 py-8 text-center text-slate-500" colSpan={columns.length}>{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
