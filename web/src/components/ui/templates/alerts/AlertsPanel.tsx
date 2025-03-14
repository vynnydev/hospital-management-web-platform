/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { 
  Bell, 
  Ambulance, 
  AlertTriangle, 
  Layers, 
  UserPlus, 
  CheckCircle, 
  X, 
  ChevronRight,
  AlertCircle,
  Calendar,
  Clock,
  Clipboard,
  UserCog,
  Share2,
  MessageSquare
} from 'lucide-react';
import { useAlerts } from '../providers/alerts/AlertsProvider';
import { IAlert, TAlertPriority, TAlertType } from '@/types/alert-types';

// Props para o componente de painel de alertas
interface AlertsPanelProps {
  onAlertClick?: (alert: IAlert) => void;
  onCreateChatFromAlert?: (alert: IAlert) => void;
}

// Componente para um único item de alerta
const AlertItem: React.FC<{ 
  alert: IAlert; 
  onAlertClick?: (alert: IAlert) => void;
  onMarkAsRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onCreateChat: (alert: IAlert) => void;
}> = ({ 
  alert, 
  onAlertClick, 
  onMarkAsRead, 
  onDismiss,
  onCreateChat
}) => {
  // Ícones e cores para cada tipo de alerta
  const alertConfig = {
    ambulance: {
      icon: <Ambulance className="h-5 w-5" />,
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-600 dark:text-blue-300',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    'patient-arrival': {
      icon: <UserPlus className="h-5 w-5" />,
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-600 dark:text-green-300',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    resource: {
      icon: <Layers className="h-5 w-5" />,
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
      textColor: 'text-amber-600 dark:text-amber-300',
      borderColor: 'border-amber-200 dark:border-amber-800'
    },
    emergency: {
      icon: <AlertTriangle className="h-5 w-5" />,
      bgColor: 'bg-red-100 dark:bg-red-900/30',
      textColor: 'text-red-600 dark:text-red-300',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  };

  // Configuração com base no tipo de alerta
  const config = alertConfig[alert.type];

  // Formatação da data/hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Determinar se o alerta é recente (menos de 15 minutos)
  const isRecent = () => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return alert.timestamp > fifteenMinutesAgo;
  };

  return (
    <div 
      className={`
        p-3 mb-2 rounded-lg border ${alert.read ? 'opacity-75' : ''}
        ${config.borderColor} ${alert.read ? 'bg-gray-50 dark:bg-gray-800/30' : config.bgColor}
        hover:shadow-sm transition-all cursor-pointer
      `}
      onClick={() => {
        onAlertClick?.(alert);
        if (!alert.read) {
          onMarkAsRead(alert.id);
        }
      }}
    >
      <div className="flex items-start">
        {/* Ícone */}
        <div className={`
          w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center mr-3
          ${config.bgColor} ${config.textColor}
        `}>
          {config.icon}
        </div>
        
        {/* Conteúdo */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className={`font-medium ${alert.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-gray-100'}`}>
              {alert.title}
              {isRecent() && !alert.read && (
                <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  Novo
                </span>
              )}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(alert.timestamp)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {alert.message}
          </p>
          
          {/* Ações para o alerta */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex space-x-1">
              {alert.actionRequired && (
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
              )}
            </div>
            
            <div className="flex space-x-1">
              {/* Botão para criar chat relacionado a este alerta */}
              <button 
                className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onCreateChat(alert);
                }}
                title="Iniciar chat relacionado"
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              
              {/* Botão para marcar como lido/não lido */}
              <button 
                className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  if (alert.read) {
                    // Lógica para marcar como não lido (seria implementada no AlertsProvider)
                  } else {
                    onMarkAsRead(alert.id);
                  }
                }}
                title={alert.read ? "Marcar como não lido" : "Marcar como lido"}
              >
                <CheckCircle className={`h-4 w-4 ${alert.read ? 'text-green-500 dark:text-green-400' : ''}`} />
              </button>
              
              {/* Botão para descartar alerta */}
              <button 
                className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss(alert.id);
                }}
                title="Descartar alerta"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente principal do painel de alertas
export const AlertsPanel: React.FC<AlertsPanelProps> = ({
  onAlertClick,
  onCreateChatFromAlert
}) => {
  const { 
    alerts, 
    unreadCount, 
    highPriorityCount, 
    markAsRead, 
    markAllAsRead, 
    dismissAlert, 
    getFilteredAlerts 
  } = useAlerts();
  
  const [activeFilter, setActiveFilter] = useState<TAlertType | 'all'>('all');
  const [activePriority, setActivePriority] = useState<TAlertPriority | 'all'>('all');

  // Filtros para tipos de alerta
  const filters = [
    { id: 'all', label: 'Todos', icon: <Bell className="h-4 w-4" /> },
    { id: 'ambulance', label: 'Ambulâncias', icon: <Ambulance className="h-4 w-4" /> },
    { id: 'patient-arrival', label: 'Chegadas', icon: <UserPlus className="h-4 w-4" /> },
    { id: 'resource', label: 'Recursos', icon: <Layers className="h-4 w-4" /> },
    { id: 'emergency', label: 'Emergências', icon: <AlertTriangle className="h-4 w-4" /> }
  ];

  // Filtros para prioridades
  const priorities = [
    { id: 'all', label: 'Todas' },
    { id: 'high', label: 'Urgentes', color: 'text-red-600 dark:text-red-400' },
    { id: 'medium', label: 'Importantes', color: 'text-amber-600 dark:text-amber-400' },
    { id: 'low', label: 'Informativas', color: 'text-blue-600 dark:text-blue-400' }
  ];

  // Obter alertas filtrados
  const filteredAlerts = activeFilter === 'all' && activePriority === 'all'
    ? alerts
    : getFilteredAlerts(
        activeFilter === 'all' ? undefined : activeFilter as TAlertType,
        activePriority === 'all' ? undefined : activePriority as TAlertPriority
      );

  // Criar chat a partir de um alerta
  const handleCreateChat = (alert: IAlert) => {
    if (onCreateChatFromAlert) {
      onCreateChatFromAlert(alert);
    }

    // Marcar o alerta como lido
    markAsRead(alert.id);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
      {/* Cabeçalho */}
      <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Alertas e Notificações
            {unreadCount > 0 && (
              <span className="ml-2 text-xs bg-blue-600 dark:bg-blue-500 text-white px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h3>

          {/* Marcar todos como lidos */}
          <button 
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed"
            onClick={markAllAsRead}
            disabled={unreadCount === 0}
          >
            Marcar todos como lidos
          </button>
        </div>

        {/* Avisos de alta prioridade */}
        {highPriorityCount > 0 && (
          <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm flex items-center mb-3">
            <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>Você tem {highPriorityCount} {highPriorityCount === 1 ? 'alerta' : 'alertas'} urgente{highPriorityCount === 1 ? '' : 's'} não {highPriorityCount === 1 ? 'lido' : 'lidos'}</span>
          </div>
        )}

        {/* Filtros de tipo */}
        <div className="flex space-x-1 overflow-x-auto pb-2 mb-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              className={`
                px-2 py-1 text-xs font-medium rounded-full flex items-center whitespace-nowrap
                ${activeFilter === filter.id
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
              onClick={() => setActiveFilter(filter.id as TAlertType | 'all')}
            >
              <span className="mr-1">{filter.icon}</span>
              {filter.label}
            </button>
          ))}
        </div>

        {/* Filtros de prioridade */}
        <div className="flex space-x-1 overflow-x-auto">
          {priorities.map(priority => (
            <button
              key={priority.id}
              className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${activePriority === priority.id
                  ? priority.id === 'all'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                    : `bg-${priority.id === 'high' ? 'red' : priority.id === 'medium' ? 'amber' : 'blue'}-100 
                       text-${priority.id === 'high' ? 'red' : priority.id === 'medium' ? 'amber' : 'blue'}-800 
                       dark:bg-${priority.id === 'high' ? 'red' : priority.id === 'medium' ? 'amber' : 'blue'}-900/50 
                       dark:text-${priority.id === 'high' ? 'red' : priority.id === 'medium' ? 'amber' : 'blue'}-300`
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }
              `}
              onClick={() => setActivePriority(priority.id as TAlertPriority | 'all')}
            >
              {priority.label}
            </button>
          ))}
        </div>
      </div>

      {/* Lista de alertas */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map(alert => (
            <AlertItem
              key={alert.id}
              alert={alert}
              onAlertClick={onAlertClick}
              onMarkAsRead={markAsRead}
              onDismiss={dismissAlert}
              onCreateChat={handleCreateChat}
            />
          ))
        ) : (
          <div className="text-center p-6 text-gray-500 dark:text-gray-400">
            <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p>Nenhum alerta encontrado</p>
            <p className="text-xs mt-1">
              {activeFilter !== 'all' || activePriority !== 'all'
                ? 'Tente ajustar os filtros para ver mais resultados.'
                : 'Você receberá notificações aqui quando houver eventos importantes.'
              }
            </p>
          </div>
        )}
      </div>

      {/* Rodapé com estatísticas */}
      <div className="p-3 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <div>
          Total: {alerts.length} alertas
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          Atualizado: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};