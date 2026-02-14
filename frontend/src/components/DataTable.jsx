export default function DataTable({ columns, data, loading, emptyMessage = 'No data found' }) {
  if (loading) {
    return (
      <div className="card">
        <div className="animate-pulse space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-700/50 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="card text-center py-12 text-slate-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-700">
            {columns.map((col) => (
              <th key={col.key} className="text-left py-3 px-4 text-slate-400 font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b border-slate-700/50 hover:bg-slate-700/20">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-slate-300">
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
