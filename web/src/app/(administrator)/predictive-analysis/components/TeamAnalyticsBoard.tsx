import React, { useState, useMemo } from 'react';
import { 
  Users, Shield, ChevronLeft, ChevronRight, 
  AlertOctagon, Brain, Clock, Activity, Star 
} from 'lucide-react';
import { Badge } from '@/components/ui/organisms/badge';
import { Progress } from '@/components/ui/organisms/progress';
import type { IStaffTeam, TTeamCapacityStatus } from '@/types/staff-types';
import { IAIRecommendation, TAIRecommendationsMap } from '@/types/ai-types';
import { AnalysisChartStaffPredictive } from './AnalysisChartStaffPredictive';
import { motion } from 'framer-motion';
import { TeamPerformanceChart } from './TeamPerformanceChart';

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

interface TeamAnalyticsBoardProps {
  teams: IStaffTeam[];
  department: string;
  onTeamSelect?: (team: IStaffTeam) => void;
}

export const TeamAnalyticsBoard: React.FC<TeamAnalyticsBoardProps> = ({
  teams,
  department,
  onTeamSelect
}) => {
  const [selectedTeamIndex, setSelectedTeamIndex] = useState(0);

  // Determina se há equipes disponíveis
  const hasTeams = teams && teams.length > 0;

  // Equipe selecionada atual
  const selectedTeam = hasTeams ? teams[selectedTeamIndex] : null;

  // Navegação entre equipes
  const handlePreviousTeam = () => {
    setSelectedTeamIndex(prev => 
      prev > 0 ? prev - 1 : teams.length - 1
    );
  };

  const handleNextTeam = () => {
    setSelectedTeamIndex(prev => 
      prev < teams.length - 1 ? prev + 1 : 0
    );
  };

  const handleTeamSelection = (team: IStaffTeam) => {
    // Chama a função onTeamSelect se ela existir
    onTeamSelect?.(team);
    
    // Outras lógicas de seleção
    setSelectedTeamIndex(teams.indexOf(team));
  };

  // Renderização de conteúdo quando não há equipes
  const renderNoTeamsContent = () => (
    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 dark:bg-slate-900 rounded-3xl space-y-6 text-center">
      <AlertOctagon className="w-16 h-16 text-slate-400 dark:text-slate-600" />
      <div>
        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">
          Nenhuma equipe encontrada
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          Não existem equipes cadastradas para o departamento de {department}. 
          Verifique com o administrador do sistema sobre o cadastramento de equipes.
        </p>
      </div>
    </div>
  );

  // Renderização do slider de equipes
  const renderTeamSlider = () => (
    <div className="relative bg-blue-500/10 rounded-xl p-4 flex items-center">
      {/* Seta de navegação para a esquerda */}
      <button 
        onClick={handlePreviousTeam}
        className="absolute left-0 z-10 p-2 bg-white/20 rounded-full hover:bg-white/30 
          transition-colors transform -translate-x-1/2"
      >
        <ChevronLeft className="w-6 h-6 text-blue-300" />
      </button>
  
      <div className="overflow-x-auto scroll-smooth hide-scrollbar flex-grow mx-8">
        <div className="inline-flex space-x-4 w-full">
          {teams.map((team, index) => (
            <motion.div 
              key={team.id}
              whileHover={{ scale: 1.03 }}
              className={`
                flex-shrink-0 w-[280px] rounded-2xl p-4 cursor-pointer 
                transition-all duration-300 
                ${index === selectedTeamIndex 
                  ? 'bg-gray-400/20 ring-2 ring-blue-500/50' 
                  : 'bg-gray-400/10 hover:bg-gray-400/20'}
              `}
              onClick={() => {
                setSelectedTeamIndex(index);
                onTeamSelect?.(team);
              }}
            >
              {/* Conteúdo do card existente */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {team.name}
                </h3>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={`
                      ${team.shift === 'Manhã' ? 'bg-blue-500/10 text-blue-300' : 
                        team.shift === 'Tarde' ? 'bg-green-500/10 text-green-300' : 
                        'bg-purple-500/10 text-purple-300'}
                    `}
                  >
                    {team.shift}
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-white/70" />
                  <span className="text-sm text-white/80">
                    {team.members.length} membros
                  </span>
                </div>
                <Badge 
                  variant="outline" 
                  className={
                    team.capacityStatus === 'high_demand' 
                      ? 'bg-red-500/10 text-red-300'
                      : team.capacityStatus === 'low_demand'
                        ? 'bg-yellow-500/10 text-yellow-300'
                        : 'bg-emerald-500/10 text-emerald-300'
                  }
                >
                  {team.capacityStatus === 'high_demand' 
                    ? 'Alta Demanda' 
                    : team.capacityStatus === 'low_demand'
                      ? 'Baixa Demanda'
                      : 'Capacidade Ideal'}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
  
      {/* Seta de navegação para a direita */}
      <button 
        onClick={handleNextTeam}
        className="absolute right-0 z-10 p-2 bg-white/20 rounded-full hover:bg-white/30 
          transition-colors transform translate-x-1/2"
      >
        <ChevronRight className="w-6 h-6 text-blue-300" />
      </button>
    </div>
  );

  // Renderização do conteúdo da equipe
  const renderTeamContent = () => {
    if (!selectedTeam) return null;
  
    return (
      <div className="grid grid-cols-3 gap-6 mt-6">
        {/* Métricas */}
        <div className="space-y-4">
          <div className="bg-slate-800/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-medium text-slate-300">
                Conclusão de Tarefas
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-400">
              {selectedTeam.metrics.taskCompletion}%
            </div>
            <Progress value={selectedTeam.metrics.taskCompletion} className="h-2 mt-2" />
          </div>
  
          <div className="bg-slate-800/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="w-5 h-5 text-emerald-500" />
              <span className="text-sm font-medium text-slate-300">
                Satisfação
              </span>
            </div>
            <div className="text-3xl font-bold text-emerald-400">
              {selectedTeam.metrics.patientSatisfaction}
            </div>
            <Progress 
              value={selectedTeam.metrics.patientSatisfaction * 20} 
              className="h-2 mt-2" 
            />
          </div>
  
          <div className="bg-slate-800/40 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-purple-500" />
              <span className="text-sm font-medium text-slate-300">
                Tempo de Resposta
              </span>
            </div>
            <div className="text-3xl font-bold text-purple-400">
              {selectedTeam.metrics.avgResponseTime}min
            </div>
            <Progress 
              value={100 - (selectedTeam.metrics.avgResponseTime / 30 * 100)} 
              className="h-2 mt-2" 
            />
          </div>
        </div>
  
        {/* Tarefas Pendentes */}
        <div>
          <h4 className="font-medium text-slate-200 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Tarefas Pendentes
          </h4>
          <div className="space-y-3">
            {renderPendingTasks()}
          </div>
        </div>
  
        {/* Insights de IA */}
        <div>
          <h4 className="font-medium text-slate-200 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-blue-500" />
            MediMind Insights
          </h4>
          <div className="bg-slate-800/40 rounded-xl p-4 space-y-4
            border border-slate-700/20">
            <div>
              <h5 className="font-medium text-slate-300 mb-2">
                Recomendações
              </h5>
              <p className="text-sm text-slate-400">
                {getRecommendation(selectedTeam.capacityStatus).staffing}
              </p>
            </div>
            <div>
              <h5 className="font-medium text-slate-300 mb-2">
                Análise de Carga
              </h5>
              <p className="text-sm text-slate-400">
                {getRecommendation(selectedTeam.capacityStatus).workload}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Shield className={`w-4 h-4 ${
                selectedTeam.capacityStatus === 'high_demand' 
                  ? 'text-red-500' 
                  : selectedTeam.capacityStatus === 'low_demand'
                    ? 'text-yellow-500'
                    : 'text-emerald-500'
              }`} />
              <span className="text-sm font-medium text-slate-400">
                {getRecommendation(selectedTeam.capacityStatus).priority}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Modificação na renderização de tarefas pendentes
  const renderPendingTasks = () => {
    const pendingTasks = selectedTeam?.tasks
      .filter(task => task.status === 'pending' || task.status === 'in_progress');
  
    if (!pendingTasks || pendingTasks.length === 0) {
      return (
        <div className="bg-slate-800/40 rounded-xl p-4 
          border border-slate-700/20 text-center">
          <p className="text-slate-400">
            Não há tarefas pendentes para esta equipe.
          </p>
        </div>
      );
    }
  
    return pendingTasks.map(task => (
      <div 
        key={task.id} 
        className="bg-slate-800/40 rounded-xl p-3 
          border border-slate-700/20"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-slate-300">
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
    ));
  };

  return (
    <div className="space-y-6 bg-gradient-to-br from-slate-50/10 to-slate-100/5 dark:from-slate-800/40 dark:to-slate-900/20
    backdrop-blur-sm rounded-3xl p-6 border border-slate-200/10 dark:border-slate-700/30
    transition-all hover:border-slate-200/20 dark:hover:border-slate-600/40">
      {/* Cabeçalho */}
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

      {/* Conteúdo principal */}
      <div className="space-y-20">
        {/* Slider ou Mensagem de Sem Equipes */}
        <div className='mt-16'>
          {hasTeams ? renderTeamSlider() : renderNoTeamsContent()}
        </div>

        {/* Conteúdo da Equipe */}
        <div>
          {hasTeams && renderTeamContent()}
        </div>
      </div>

      {/* Gráfico de Atividade */}
      {/* Gráfico de Desempenho */}
      {teams.length > 0 && (
        <div className="mt-8">
          <TeamPerformanceChart teams={teams} />
        </div>
      )}
    </div>
  );
};