import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

// Define type for chart data
interface ChartDataItem {
    time: string;
    demanda: number;
    capacidade: number;
    eficiencia: number;
}
  
// Define type for CustomTooltip props
interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      color?: string;
      name?: string;
      value?: number;
    }>;
    label?: string;
}

export const AnalysisChartStaffPredictive = () => {
    // Dados simulados para o gráfico com mais detalhes
    const chartData: ChartDataItem[] = [
        { time: '08:00', demanda: 40, capacidade: 50, eficiencia: 80 },
        { time: '10:00', demanda: 65, capacidade: 50, eficiencia: 70 },
        { time: '12:00', demanda: 85, capacidade: 50, eficiencia: 60 },
        { time: '14:00', demanda: 45, capacidade: 50, eficiencia: 90 },
        { time: '16:00', demanda: 55, capacidade: 50, eficiencia: 85 },
        { time: '18:00', demanda: 75, capacidade: 50, eficiencia: 65 },
        { time: '20:00', demanda: 35, capacidade: 50, eficiencia: 95 }
    ];
      
    const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 dark:bg-slate-800/90 p-3 rounded-lg shadow-lg border border-slate-200/20 dark:border-slate-700/20">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">{label}</p>
                    {payload.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                        <div 
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: item.color }}
                        />
                        <span className="text-slate-600 dark:text-slate-400">{item.name}:</span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                            {item.value}%
                        </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gradient-to-br bg-white/40 dark:from-gray-800/50 dark:bg-gray-700/50 rounded-3xl p-6
            border border-slate-200/20 dark:border-slate-700/20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                        Análise de Demanda vs. Capacidade
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                        Monitoramento de performance das últimas 24 horas
                    </p>
                </div>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Demanda</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Capacidade</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">Eficiência</span>
                    </div>
                </div>
            </div>
    
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200/50 dark:stroke-slate-700/50" />
                        <XAxis 
                            dataKey="time" 
                            className="text-slate-600 dark:text-slate-400"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis 
                            className="text-slate-600 dark:text-slate-400"
                            tick={{ fontSize: 12 }}
                            unit="%"
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Line 
                            type="monotone" 
                            dataKey="demanda" 
                            stroke="#3B82F6" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#3B82F6" }}
                            name="Demanda"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="capacidade" 
                            stroke="#10B981" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#10B981" }}
                            name="Capacidade"
                        />
                        <Line 
                            type="monotone" 
                            dataKey="eficiencia" 
                            stroke="#8B5CF6" 
                            strokeWidth={2}
                            dot={{ r: 4, fill: "#8B5CF6" }}
                            name="Eficiência"
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>         
        </div>
    )
}