/* eslint-disable @typescript-eslint/no-unused-vars */
import { Badge } from '@/components/ui/organisms/badge';
import { CustomTooltip } from '@/components/ui/organisms/CustomTooltip';
import { IStaffTeam } from '@/types/staff-types';
import { useMemo } from 'react';
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

interface AnalysisChartStaffPredictiveProps {
    hospitalId: string;
    hospitalName: string;
    staffTeams: { [hospitalId: string]: IStaffTeam[] };
}

export const AnalysisChartStaffPredictive: React.FC<AnalysisChartStaffPredictiveProps> = ({ 
    hospitalId, 
    hospitalName, 
    staffTeams 
  }) => {
    // Gerar dados do gráfico baseado nas equipes do hospital
    const chartData = useMemo(() => {
      const hospitalTeams = staffTeams[hospitalId] || [];
      
      // Horários padrão
      const timeSlots = [
        '08:00', '10:00', '12:00', '14:00', 
        '16:00', '18:00', '20:00'
      ];
  
      // Calcular métricas agregadas
      return timeSlots.map(time => {
        const teamMetrics = hospitalTeams.map(team => ({
          demanda: team.metrics.taskCompletion,
          capacidade: 100, // Capacidade máxima
          eficiencia: team.metrics.taskCompletion
        }));
  
        // Média das métricas
        return {
          time,
          demanda: Math.round(teamMetrics.reduce((sum, metric) => sum + metric.demanda, 0) / teamMetrics.length),
          capacidade: Math.round(teamMetrics.reduce((sum, metric) => sum + metric.capacidade, 0) / teamMetrics.length),
          eficiencia: Math.round(teamMetrics.reduce((sum, metric) => sum + metric.eficiencia, 0) / teamMetrics.length)
        };
      });
    }, [hospitalId, staffTeams]);
  
    return (
      <div className="bg-gradient-to-br bg-white/40 dark:from-gray-800/50 dark:bg-gray-700/50 rounded-3xl p-6
        border border-slate-200/20 dark:border-slate-700/20">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Análise de Demanda vs. Capacidade
              </h3>
              <Badge 
                variant="outline" 
                className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
              >
                {hospitalName}
              </Badge>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Desempenho consolidado de todas as equipes do hospital
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
              {/* Configurações existentes do gráfico */}
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
    );
};