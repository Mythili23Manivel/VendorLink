export default function AlertPanel({ title, items, emptyMessage, type = 'warning' }) {
  const colors = {
    warning: 'border-amber-500/50 bg-amber-500/10',
    danger: 'border-red-500/50 bg-red-500/10',
    info: 'border-primary-500/50 bg-primary-500/10',
  };

  return (
    <div className={`card border ${colors[type]}`}>
      <h3 className="font-display font-semibold text-white mb-4">{title}</h3>
      {items?.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-slate-300 text-sm flex justify-between">
              <span>{item.name}</span>
              <span className="font-medium">{item.value}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-500 text-sm">{emptyMessage || 'No items'}</p>
      )}
    </div>
  );
}
