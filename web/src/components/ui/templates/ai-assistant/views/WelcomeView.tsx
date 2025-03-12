import React from 'react';
import { 
  LineChart, 
  AlertTriangle, 
  Lightbulb, 
  ArrowRight, 
  Check, 
  Ambulance, 
  Layers, 
  Users 
} from 'lucide-react';
import { IRecommendation, IStatistics } from '@/types/ai-assistant-types';
import { IHospital } from '@/types/hospital-network-types';
import { Alert } from '../../chat/integration-hub/alerts/AlertsProvider';

interface WelcomeViewProps {
  userGreeting: string;
  formattedDate: string;
  statistics: IStatistics | null;
  recommendations: IRecommendation[];
  highPriorityAlerts: Alert[];
  unreadCount: number;
  onApplyRecommendation: (recommendation: IRecommendation) => void;
  setCurrentView: (view: 'welcome' | 'recommendations' | 'alerts') => void;
  hospital?: IHospital;
}

export const WelcomeView: React.FC<WelcomeViewProps> = ({
  userGreeting,
  formattedDate,
  statistics,
  recommendations,
  highPriorityAlerts,
  unreadCount,
  onApplyRecommendation,
  setCurrentView,
  hospital
}) => {
  return (
    <div className="p-4">
      <div className="mb-4">
        <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-1">
          {userGreeting}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formattedDate}
        </p>
      </div>
      
      {/* Card de estatísticas */}
      {statistics && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-4 border border-indigo-100 dark:border-indigo-800">
          <h3 className="font-medium text-indigo-800 dark:text-indigo-300 flex items-center mb-3">
            <LineChart className="h-4 w-4 mr-1" />
            Visão Geral de {hospital?.name || 'Hospital'}
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Ocupação:</span>
              <span className={`font-medium ${
                statistics.bedOccupancy > 90 
                  ? 'text-red-600 dark:text-red-400' 
                  : statistics.bedOccupancy > 80 
                    ? 'text-amber-600 dark:text-amber-400' 
                    : 'text-green-600 dark:text-green-400'
              }`}>
                {statistics.bedOccupancy.toFixed(1)}%
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tempo médio:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {statistics.averageWaitTime} min
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Recursos críticos:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {statistics.criticalResourcesNeeded}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Fluxo de pacientes:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {statistics.patientFlow}/hora
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Alertas de alta prioridade */}
      {highPriorityAlerts.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center mb-2">
            <AlertTriangle className="h-4 w-4 mr-1 text-red-500" />
            Alertas Prioritários
          </h3>
          
          <div className="space-y-2">
            {highPriorityAlerts.map(alert => (
              <div 
                key={alert.id}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mr-2">
                    {alert.type === 'ambulance' ? (
                      <Ambulance className="h-4 w-4" />
                    ) : alert.type === 'resource' ? (
                      <Layers className="h-4 w-4" />
                    ) : alert.type === 'patient-arrival' ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {alert.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                      {alert.message}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {unreadCount > highPriorityAlerts.length && (
            <button 
              className="w-full mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              onClick={() => setCurrentView('alerts')}
            >
              Ver todos os {unreadCount} alertas
            </button>
          )}
        </div>
      )}
      
      {/* Recomendações principais */}
      {recommendations.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center mb-2">
            <Lightbulb className="h-4 w-4 mr-1 text-amber-500" />
            Recomendações Inteligentes
          </h3>
          
          <div className="space-y-2">
            {recommendations.slice(0, 2).map(recommendation => (
              <div 
                key={recommendation.id}
                className={`p-3 ${
                  recommendation.applied 
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                } border rounded-lg`}
              >
                <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-start">
                  {recommendation.applied ? (
                    <Check className="h-4 w-4 text-green-500 dark:text-green-400 mr-1 flex-shrink-0 mt-0.5" />
                  ) : (
                    <Lightbulb className="h-4 w-4 text-amber-500 dark:text-amber-400 mr-1 flex-shrink-0 mt-0.5" />
                  )}
                  <span>{recommendation.title}</span>
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 ml-5">
                  {recommendation.description}
                </p>
                
                {!recommendation.applied && (
                  <button 
                    className="mt-2 ml-5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
                    onClick={() => onApplyRecommendation(recommendation)}
                  >
                    {recommendation.actionText}
                    <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {recommendations.length > 2 && (
            <button 
              className="w-full mt-2 text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
              onClick={() => setCurrentView('recommendations')}
            >
              Ver todas as {recommendations.length} recomendações
            </button>
          )}
        </div>
      )}
    </div>
  );
};