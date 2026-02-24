export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data found',
  getRowKey, // optional: (row, index) => string|number
}) {
  const colCount = Math.max(columns.length, 1);

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

  if (!Array.isArray(data) || data.length === 0) {
    return <div className="card text-center py-12 text-slate-500">{emptyMessage}</div>;
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full" role="table">
        <thead>
          <tr className="border-b border-slate-700">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className="text-left py-3 px-4 text-slate-400 font-medium whitespace-nowrap"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, i) => {
            const rowKey =
              (typeof getRowKey === 'function' && getRowKey(row, i)) ||
              row?._id ||
              row?.id ||
              i;

            return (
              <tr key={rowKey} className="border-b border-slate-700/50 hover:bg-slate-700/20">
                {columns.map((col) => {
                  const value = row?.[col.key];
                  return (
                    <td key={col.key} className="py-3 px-4 text-slate-300 align-middle">
                      {typeof col.render === 'function' ? col.render(value, row) : (value ?? '—')}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* tiny footer spacing to avoid cramped last row on some cards */}
      <div className="h-2" aria-hidden="true" />
    </div>
  );
}
