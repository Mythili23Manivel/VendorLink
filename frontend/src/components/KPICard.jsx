export default function KPICard({ title, value, icon, trend, subtitle }) {
  return (
    <div className="card hover:border-slate-600/50 transition">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm">{title}</p>
          <p className="text-2xl font-display font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {trend && (
        <p className={`text-sm mt-2 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last period
        </p>
      )}
    </div>
  );
}
