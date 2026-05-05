export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No data found',
  getRowKey,
}) {
  const getKey = (row, index) =>
    (typeof getRowKey === 'function' && getRowKey(row, index)) ||
    row?._id ||
    row?.id ||
    index;

  return (
    <div className="card overflow-x-auto">
      <table className="w-full border-collapse" role="table">
        {/* HEADER */}
        <thead className="sticky top-0 bg-slate-900 z-10">
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

        {/* BODY */}
        <tbody>
          {/* LOADING STATE */}
          {loading &&
            [...Array(5)].map((_, i) => (
              <tr key={i} className="animate-pulse">
                {columns.map((col) => (
                  <td key={col.key} className="py-3 px-4">
                    <div className="h-4 bg-slate-700/50 rounded" />
                  </td>
                ))}
              </tr>
            ))}

          {/* EMPTY STATE */}
          {!loading && data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length || 1}
                className="text-center py-12 text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {/* DATA ROWS */}
          {!loading &&
            data.map((row, i) => (
              <tr
                key={getKey(row, i)}
                className="border-b border-slate-700/50 hover:bg-slate-700/20 transition"
              >
                {columns.map((col) => {
                  const value = row?.[col.key];

                  return (
                    <td
                      key={col.key}
                      className="py-3 px-4 text-slate-300 align-middle"
                    >
                      {typeof col.render === 'function'
                        ? col.render(value, row)
                        : value ?? '—'}
                    </td>
                  );
                })}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
