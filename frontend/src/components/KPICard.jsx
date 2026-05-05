export default function KPICard({ title, value, icon, trend, subtitle }) {
  const isPositive = trend > 0;

  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700 
                    rounded-2xl p-5 shadow-lg 
                    hover:shadow-xl hover:scale-[1.02] 
                    transition-all duration-300">

      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm tracking-wide">{title}</p>

          <p className="text-3xl font-bold text-white mt-1">
            {value}
          </p>

          {subtitle && (
            <p className="text-slate-500 text-xs mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div className="w-12 h-12 flex items-center justify-center 
                        rounded-xl bg-slate-700/50 text-2xl">
          {icon}
        </div>
      </div>

      {trend !== undefined && (
        <div className={`mt-4 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium
                        ${isPositive 
                          ? 'bg-green-500/10 text-green-400' 
                          : 'bg-red-500/10 text-red-400'}`}>
          
          <span>{isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend)}%</span>
          <span className="text-slate-400 text-xs">vs last period</span>
        </div>
      )}
    </div>
  );
}
