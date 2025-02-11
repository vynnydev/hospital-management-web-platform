/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { Shield } from 'lucide-react';
import type { IStaffTeam } from '@/types/staff-types';

// Interface para dados de desempenho
interface PerformanceData {
  month: string;
  [teamName: string]: number | string;
}

interface TeamPerformanceChartProps {
  teams: IStaffTeam[];
}

// Função para gerar dados de desempenho histórico
const generatePerformanceHistoryData = (teams: IStaffTeam[]): PerformanceData[] => {
  // Meses dos últimos 6 meses
  const months = [
    'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'
  ];

  // Função para adicionar variação realista
  const generateVariation = (baseValue: number, variationRange: number = 5): number => {
    const variation = Math.random() * variationRange * 2 - variationRange;
    return Math.max(0, Math.min(100, baseValue + variation));
  };

  // Gera dados para cada mês
  return months.map(month => {
    const monthData: PerformanceData = { month };

    teams.forEach(team => {
      // Base no percentual de conclusão de tarefas
      const baseEfficiency = team.metrics.taskCompletion;
      monthData[team.name] = generateVariation(baseEfficiency);
    });

    return monthData;
  });
};

const CustomTooltip = ({ active, payload, label }: any) => {
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

export const TeamPerformanceChart: React.FC<TeamPerformanceChartProps> = ({ teams }) => {
  // Gera dados de desempenho
  const performanceData = useMemo(() => 
    generatePerformanceHistoryData(teams), 
    [teams]
  );

  // Não renderiza se não houver equipes
  if (teams.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-3xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-500" />
          <h2 className="text-xl font-bold text-slate-200">
            Proficiência das Equipes
          </h2>
        </div>
        <span className="text-sm text-slate-400">Últimos 6 meses</span>
      </div>

      {/* Modificação nas barras para efeito de hover */}
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={performanceData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgb(148, 163, 184)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {teams.map((team, index) => (
              <Bar
                key={team.id}
                dataKey={team.name}
                stackId="a"
                fill={
                  index === 0 ? '#3B82F6' : 
                  index === 1 ? '#10B981' : 
                  '#8B5CF6'
                }
                barSize={30}
                className="hover:opacity-80 transition-opacity duration-300"
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda das equipes */}
      <div className="flex justify-center gap-6">
        {teams.map((team, index) => (
          <div key={team.id} className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ 
                backgroundColor: 
                  index === 0 ? '#3B82F6' : 
                  index === 1 ? '#10B981' : 
                  '#8B5CF6'
              }}
            />
            <span className="text-sm text-slate-400">{team.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};