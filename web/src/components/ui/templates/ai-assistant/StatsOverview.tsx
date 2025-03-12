import { 
    Activity, 
    Ambulance, 
    BarChart, 
    Clock, 
    Layers, 
    LineChart, 
    Users 
} from "lucide-react";
import { IStatistics } from "@/types/ai-assistant-types";

interface StatsOverviewProps {
    statistics: IStatistics;
    hospitalName?: string;
    showTitle?: boolean;
    compact?: boolean;
}

/**
 * Componente para exibir uma visão geral das métricas do hospital
 */
export const StatsOverview: React.FC<StatsOverviewProps> = ({
    statistics,
    hospitalName = 'Hospital',
    showTitle = true,
    compact = false
  }) => {
    // Determinar classes de cores para ocupação de leitos
    const getOccupancyColorClass = (value: number) => {
      if (value > 90) {
        return 'text-red-600 dark:text-red-400';
      } else if (value > 80) {
        return 'text-amber-600 dark:text-amber-400';
      } else {
        return 'text-green-600 dark:text-green-400';
      }
    };
    
    // Renderizar versão compacta
    if (compact) {
      return (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 border border-indigo-100 dark:border-indigo-800">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Ocupação:</span>
              <span className={`font-medium text-sm ${getOccupancyColorClass(statistics.bedOccupancy)}`}>
                {statistics.bedOccupancy.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Tempo médio:</span>
              <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                {statistics.averageWaitTime} min
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Recursos críticos:</span>
              <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                {statistics.criticalResourcesNeeded}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 dark:text-gray-400">Fluxo pacientes:</span>
              <span className="font-medium text-sm text-gray-800 dark:text-gray-200">
                {statistics.patientFlow}/hora
              </span>
            </div>
          </div>
        </div>
      );
    }
    
    // Renderizar versão completa
    return (
      <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800">
        {showTitle && (
          <h3 className="font-medium text-indigo-800 dark:text-indigo-300 flex items-center mb-3">
            <LineChart className="h-4 w-4 mr-1" />
            Visão Geral de {hospitalName}
          </h3>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {/* Ocupação de leitos */}
          <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Activity className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Ocupação</span>
            </div>
            <div className="flex items-end justify-between">
              <span className={`text-2xl font-bold ${getOccupancyColorClass(statistics.bedOccupancy)}`}>
                {statistics.bedOccupancy.toFixed(1)}%
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {statistics.bedOccupancy > 90 ? 'Crítico' : statistics.bedOccupancy > 80 ? 'Atenção' : 'Normal'}
              </div>
            </div>
          </div>
          
          {/* Tempo médio de espera */}
          <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Clock className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Tempo Médio</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {statistics.averageWaitTime}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">minutos</div>
            </div>
          </div>
          
          {/* Eficiência da equipe */}
          <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center text-green-600 dark:text-green-400">
                <Users className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Eficiência</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {statistics.staffEfficiency.toFixed(1)}%
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">equipe</div>
            </div>
          </div>
          
          {/* Recursos críticos */}
          <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Layers className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Recursos</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {statistics.criticalResourcesNeeded}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">críticos</div>
            </div>
          </div>
          
          {/* Fluxo de pacientes */}
          <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <BarChart className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Fluxo</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {statistics.patientFlow.toFixed(1)}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">pacientes/h</div>
            </div>
          </div>
          
          {/* Tempo de resposta a emergências */}
          <div className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center text-red-600 dark:text-red-400">
                <Ambulance className="h-4 w-4" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Resposta</span>
            </div>
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                {statistics.emergencyResponseTime.toFixed(1)}
              </span>
              <div className="text-xs text-gray-500 dark:text-gray-400">minutos</div>
            </div>
          </div>
        </div>
      </div>
    );
  };