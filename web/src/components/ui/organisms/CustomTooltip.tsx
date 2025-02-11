/* eslint-disable @typescript-eslint/no-explicit-any */
export const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-3xl p-6 space-y-6 
          backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/30 
          hover:bg-slate-200/70 dark:hover:bg-slate-800/60 
          transition-all duration-300 ease-in-out">
            <p className="font-medium text-slate-700 dark:text-slate-200 mb-2">
              Mês: {label}
            </p>
            {payload.map((entry: any) => (
            <div key={entry.dataKey} className="flex justify-between items-center mt-1">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 dark:text-slate-400">
                  {entry.dataKey}:
                </span>
              </div>
              <span className="font-semibold text-slate-700 dark:text-slate-200">
                {entry.value.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
};