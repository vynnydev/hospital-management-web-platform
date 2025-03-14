/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Ambulance, 
  Bell, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  Filter, 
  Heart, 
  User, 
  Users
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { useAlerts } from '../providers/alerts/AlertsProvider';
import { IAlert, TAlertPriority, TAlertType } from '@/types/alert-types';


interface AlertListProps {
  selectedHospitalId?: string;
  onAlertSelect: (alert: IAlert) => void;
  className?: string;
}

export const AlertList: React.FC<AlertListProps> = ({ 
  selectedHospitalId,
  onAlertSelect,
  className
}) => {
  const { alerts, getFilteredAlerts, markAsRead, updateAlertStatus } = useAlerts();
  const [filterType, setFilterType] = useState<TAlertType | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState<TAlertPriority | undefined>(undefined);
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar alertas com base nos filtros selecionados e hospital
  const filteredAlerts = getFilteredAlerts(filterType, filterPriority)
    .filter(alert => !selectedHospitalId || alert.hospitalId === selectedHospitalId);

  // Agrupar alertas por tipo para exibição
  const alertsByType = filteredAlerts.reduce((acc, alert) => {
    if (!acc[alert.type]) {
      acc[alert.type] = [];
    }
    acc[alert.type].push(alert);
    return acc;
  }, {} as Record<string, IAlert[]>);

  // Configurações de cor e ícone por tipo de alerta
  const alertTypeConfig: Record<TAlertType, { 
    icon: React.FC<any>, 
    bgClass: string, 
    darkBgClass: string,
    label: string
  }> = {
    'ambulance': { 
      icon: Ambulance,
      bgClass: 'bg-blue-100',
      darkBgClass: 'dark:bg-blue-900/30',
      label: 'Ambulâncias'
    },
    'patient-arrival': { 
      icon: Users,
      bgClass: 'bg-green-100',
      darkBgClass: 'dark:bg-green-900/30',
      label: 'Chegada de Pacientes'
    },
    'resource': { 
      icon: Bell,
      bgClass: 'bg-amber-100',
      darkBgClass: 'dark:bg-amber-900/30',
      label: 'Recursos'
    },
    'emergency': { 
      icon: AlertTriangle,
      bgClass: 'bg-red-100',
      darkBgClass: 'dark:bg-red-900/30', 
      label: 'Emergências'
    }
  };

  // Cores de prioridade
  const priorityColors = {
    'high': 'text-red-600 dark:text-red-400',
    'medium': 'text-amber-600 dark:text-amber-400',
    'low': 'text-blue-600 dark:text-blue-400'
  };

  // Labels de prioridade
  const priorityLabels = {
    'high': 'Alta',
    'medium': 'Média',
    'low': 'Baixa'
  };

  // Formatar a data de um alerta
  const formatAlertTime = (timestamp: Date) => {
    const now = new Date();
    const alertDate = new Date(timestamp);
    
    const diffMs = now.getTime() - alertDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) {
      return 'agora';
    } else if (diffMins < 60) {
      return `${diffMins}m atrás`;
    } else if (diffMins < 1440) {
      const hours = Math.floor(diffMins / 60);
      return `${hours}h atrás`;
    } else {
      return alertDate.toLocaleDateString();
    }
  };

  // Manipular reconhecimento rápido de alerta
  const handleAcknowledge = (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    updateAlertStatus(alertId, 'acknowledged');
  };

  // Limpar todos os filtros
  const clearFilters = () => {
    setFilterType(undefined);
    setFilterPriority(undefined);
  };

  // Verificar se existem alertas para mostrar
  const hasAlerts = Object.keys(alertsByType).length > 0;

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden ${className || ''}`}>
      {/* Header com filtros */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
            <Bell className="w-4 h-4 mr-2" />
            Alertas e Notificações
          </h3>
          
          <div className="flex items-center gap-2">
            {(filterType || filterPriority) && (
              <button 
                onClick={clearFilters}
                className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Limpar filtros
              </button>
            )}
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        {/* Área de filtros */}
        {showFilters && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-3">
            <div>
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Tipo de Alerta</h4>
              <div className="flex flex-wrap gap-2">
                {Object.keys(alertTypeConfig).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(filterType === type as TAlertType ? undefined : type as TAlertType)}
                    className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${
                      filterType === type 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {React.createElement(alertTypeConfig[type as TAlertType].icon, { 
                      className: "w-3 h-3" 
                    })}
                    <span>{alertTypeConfig[type as TAlertType].label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Prioridade</h4>
              <div className="flex gap-2">
                {(['high', 'medium', 'low'] as TAlertPriority[]).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setFilterPriority(filterPriority === priority ? undefined : priority)}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      filterPriority === priority 
                        ? `bg-${priority === 'high' ? 'red' : priority === 'medium' ? 'amber' : 'blue'}-100 
                           text-${priority === 'high' ? 'red' : priority === 'medium' ? 'amber' : 'blue'}-800
                           dark:bg-${priority === 'high' ? 'red' : priority === 'medium' ? 'amber' : 'blue'}-900 
                           dark:text-${priority === 'high' ? 'red' : priority === 'medium' ? 'amber' : 'blue'}-100` 
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {priorityLabels[priority]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Lista de alertas */}
      <ScrollArea className="max-h-96">
        {hasAlerts ? (
          <div className="p-2">
            {Object.entries(alertsByType).map(([type, typeAlerts]) => (
              <div key={type} className="mb-4">
                <div className="px-3 py-2 flex items-center gap-2">
                  {React.createElement(alertTypeConfig[type as TAlertType].icon, { 
                    className: `w-4 h-4 ${
                      type === 'emergency' ? 'text-red-500 dark:text-red-400' :
                      type === 'ambulance' ? 'text-blue-500 dark:text-blue-400' :
                      type === 'patient-arrival' ? 'text-green-500 dark:text-green-400' :
                      'text-amber-500 dark:text-amber-400'
                    }` 
                  })}
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {alertTypeConfig[type as TAlertType].label}
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                    {typeAlerts.length}
                  </span>
                </div>
                
                <div className="space-y-2 px-2">
                  {typeAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        markAsRead(alert.id);
                        onAlertSelect(alert);
                      }}
                      className={`p-3 rounded-lg border ${
                        !alert.read ? 'border-l-4' : 'border'
                      } ${
                        alert.priority === 'high' 
                          ? !alert.read ? 'border-l-red-500' : 'border-gray-200 dark:border-gray-700'
                          : !alert.read ? `border-l-${alert.priority === 'medium' ? 'amber' : 'blue'}-500` : 'border-gray-200 dark:border-gray-700'
                      } bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors shadow-sm`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                          {alert.title}
                        </h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatAlertTime(alert.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                        {alert.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${priorityColors[alert.priority]}`}>
                            Prioridade {priorityLabels[alert.priority]}
                          </span>
                          
                          {alert.status === 'acknowledged' && (
                            <span className="text-xs flex items-center gap-1 text-green-600 dark:text-green-400">
                              <CheckCircle2 className="w-3 h-3" />
                              Confirmado
                            </span>
                          )}
                        </div>
                        
                        {alert.status === 'pending' && (
                          <button
                            onClick={(e) => handleAcknowledge(e, alert.id)}
                            className="text-xs px-2 py-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-100 dark:hover:bg-green-800/30 transition-colors flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Confirmar
                          </button>
                        )}
                        
                        {alert.status === 'acknowledged' && (
                          <button
                            className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="w-14 h-14 mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-gray-500 dark:text-gray-400 font-medium mb-1">Sem alertas ativos</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              {filterType || filterPriority ? 
                'Tente remover os filtros para ver mais alertas' : 
                'Alertas de emergência, ambulâncias e recursos aparecerão aqui'}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};