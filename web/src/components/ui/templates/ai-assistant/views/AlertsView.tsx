import React from 'react';
import { 
  BellRing, 
  AlertTriangle, 
  Ambulance, 
  Layers, 
  Users, 
  ChevronRight 
} from 'lucide-react';
import { IAlert } from '@/types/alert-types';

interface AlertsViewProps {
  alerts: IAlert[];
  setCurrentView: (view: 'welcome' | 'recommendations' | 'alerts') => void;
  onViewAllAlerts?: () => void;
}

export const AlertsView: React.FC<AlertsViewProps> = ({
  alerts,
  setCurrentView,
  onViewAllAlerts
}) => {
  // Formatação da data/hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
          <BellRing className="h-5 w-5 mr-1 text-red-500" />
          Alertas Ativos
        </h3>
        <button 
          className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
          onClick={() => setCurrentView('welcome')}
        >
          Voltar
        </button>
      </div>
      
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map(alert => (
            <div 
              key={alert.id}
              className={`p-3 ${
                alert.priority === 'high'
                  ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  : alert.priority === 'medium'
                    ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800'
                    : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
              } border rounded-lg ${alert.read ? 'opacity-75' : ''}`}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3 
                  ${alert.type === 'ambulance' 
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300' 
                    : alert.type === 'resource'
                      ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300'
                      : alert.type === 'patient-arrival'
                        ? 'bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300'
                  }`}
                >
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
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {alert.title}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(new Date(alert.timestamp))}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {alert.message}
                  </p>
                  
                  {alert.actionRequired && (
                    <div className="mt-2 flex justify-between items-center">
                      <span className={`
                        text-xs px-1.5 py-0.5 rounded
                        ${alert.priority === 'high' 
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' 
                          : alert.priority === 'medium'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                        }
                      `}>
                        {alert.priority === 'high' ? 'Urgente' : alert.priority === 'medium' ? 'Importante' : 'Informativo'}
                      </span>
                      
                      <button 
                        className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
                        onClick={onViewAllAlerts}
                      >
                        Ver detalhes
                        <ChevronRight className="h-3 w-3 ml-0.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
            <div className="w-12 h-12 mx-auto bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
              <BellRing className="h-6 w-6 text-gray-400 dark:text-gray-500" />
            </div>
            <p>Nenhum alerta ativo no momento</p>
            <p className="text-xs mt-1">Você será notificado quando surgirem novos alertas</p>
          </div>
        )}
      </div>
    </div>
  );
};