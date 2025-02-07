import React from 'react';
import { 
  Users, AlertTriangle, Activity, Clock, Brain,
  TrendingUp, Calendar, UserPlus, ArrowUpRight,
  Star, Shield
} from 'lucide-react';
import { Progress } from '@/components/ui/organisms/progress';
import { Badge } from '@/components/ui/organisms/badge';
import type { IStaffTeam, TTeamCapacityStatus } from '@/types/staff-types';
import { IAIRecommendation, TAIRecommendationsMap } from '@/types/ai-types';

interface TeamAnalyticsBoardProps {
  teams: IStaffTeam[];
  department: string;
}

// Mock das recomendações da IA por tipo de status
const aiRecommendations: TAIRecommendationsMap = {
  high_demand: {
    staffing: "Recomendada a contratação de mais profissionais para esta equipe",
    workload: "Considere redistribuir algumas tarefas entre as equipes",
    priority: "Alta prioridade para ação imediata"
  },
  optimal: {
    staffing: "Equipe bem dimensionada para a demanda atual",
    workload: "Distribuição de trabalho adequada",
    priority: "Manter monitoramento regular"
  },
  low_demand: {
    staffing: "Possibilidade de realocação de alguns membros para áreas mais demandadas",
    workload: "Capacidade ociosa identificada",
    priority: "Considerar reorganização da equipe"
  }
} as const;

const getRecommendation = (status: TTeamCapacityStatus): IAIRecommendation => {
    return aiRecommendations[status];
};

const TeamMetricsCard = ({ team }: { team: IStaffTeam }) => (
  <div className="bg-gradient-to-br from-slate-50/10 to-slate-100/5 dark:from-slate-800/40 dark:to-slate-900/20
    backdrop-blur-sm rounded-3xl p-6 border border-slate-200/10 dark:border-slate-700/30
    transition-all hover:border-slate-200/20 dark:hover:border-slate-600/40">
    {/* Header */}
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200">
          {team.name}
        </h3>
        <div className="flex gap-2 mt-2">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-500">
            {team.shift}
          </Badge>
          <Badge 
            variant="outline" 
            className={
              team.capacityStatus === 'high_demand' 
                ? 'bg-red-500/10 text-red-500'
                : team.capacityStatus === 'low_demand'
                  ? 'bg-yellow-500/10 text-yellow-500'
                  : 'bg-emerald-500/10 text-emerald-500'
            }
          >
            {team.capacityStatus === 'high_demand' 
              ? 'Alta Demanda' 
              : team.capacityStatus === 'low_demand'
                ? 'Baixa Demanda'
                : 'Capacidade Ideal'}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-500" />
        <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">
          {team.members.length} membros
        </span>
      </div>
    </div>

    {/* Metrics Grid */}
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Conclusão de Tarefas
          </span>
        </div>
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {team.metrics.taskCompletion}%
        </div>
        <Progress value={team.metrics.taskCompletion} className="h-1.5 mt-2" />
      </div>

      <div className="bg-emerald-50/50 dark:bg-emerald-900/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Satisfação
          </span>
        </div>
        <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          {team.metrics.patientSatisfaction}
        </div>
        <Progress 
          value={team.metrics.patientSatisfaction * 20} 
          className="h-1.5 mt-2" 
        />
      </div>

      <div className="bg-purple-50/50 dark:bg-purple-900/20 rounded-2xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Clock className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Tempo de Resposta
          </span>
        </div>
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {team.metrics.avgResponseTime}min
        </div>
        <Progress 
          value={100 - (team.metrics.avgResponseTime / 30 * 100)} 
          className="h-1.5 mt-2" 
        />
      </div>
    </div>

    {/* Tasks and AI Insights */}
    <div className="grid grid-cols-2 gap-6">
      <div>
        <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-500" />
          Tarefas Pendentes
        </h4>
        <div className="space-y-3">
          {team.tasks
            .filter(task => task.status === 'pending' || task.status === 'in_progress')
            .map(task => (
              <div key={task.id} className="bg-white/40 dark:bg-slate-800/40 rounded-xl p-3 
                border border-slate-200/20 dark:border-slate-700/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      {task.title}
                    </p>
                    <span className="text-sm text-slate-500">
                      {new Date(task.scheduledFor).toLocaleDateString()}
                    </span>
                  </div>
                  <Badge 
                    variant="outline"
                    className={task.priority === 'high' 
                      ? 'bg-red-500/10 text-red-500'
                      : 'bg-blue-500/10 text-blue-500'
                    }
                  >
                    {task.priority}
                  </Badge>
                </div>
              </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
          <Brain className="w-4 h-4 text-blue-500" />
          MediMind Insights
        </h4>
        <div className="bg-blue-50/50 dark:bg-blue-900/20 rounded-xl p-4 space-y-4
          border border-blue-200/20 dark:border-blue-700/20">
          <div>
            <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
              Recomendações
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {getRecommendation(team.capacityStatus).staffing}
            </p>
          </div>
          <div>
            <h5 className="font-medium text-slate-700 dark:text-slate-300 mb-2">
              Análise de Carga
            </h5>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {getRecommendation(team.capacityStatus).workload}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Shield className={`w-4 h-4 ${
              team.capacityStatus === 'high_demand' 
                ? 'text-red-500' 
                : team.capacityStatus === 'low_demand'
                  ? 'text-yellow-500'
                  : 'text-emerald-500'
            }`} />
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
              {getRecommendation(team.capacityStatus).priority}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const TeamAnalyticsBoard: React.FC<TeamAnalyticsBoardProps> = ({
  teams,
  department
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">
            Análise de Equipes - {department}
          </h2>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            {teams.length} equipes ativas
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {teams.map(team => (
          <TeamMetricsCard key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
};