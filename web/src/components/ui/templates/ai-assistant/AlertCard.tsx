import React from 'react';
import {
  Ambulance,
  Layers,
  Users,
  AlertTriangle,
  ChevronRight,
  CheckCircle,
  X,
  MessageSquare
} from 'lucide-react';
import { Alert } from '../chat/integration-hub/alerts/AlertsProvider';

interface AlertCardProps {
  alert: Alert;
  onMarkAsRead?: (id: string) => void;
  onDismiss?: (id: string) => void;
  onCreateChat?: (alert: Alert) => void;
  onViewDetails?: (alert: Alert) => void;
  compact?: boolean;
}

/**
 * Componente para exibir um alerta em formato de cartão
 */
export const AlertCard: React.FC<AlertCardProps> = ({
  alert,
  onMarkAsRead,
  onDismiss,
  onCreateChat,
  onViewDetails,
  compact = false
}) => {
  // Configuração com base no tipo de alerta
  const getAlertConfig = () => {
    switch (alert.type) {
      case 'ambulance':
        return {
          icon: <Ambulance className="h-4 w-4" />,
          bgColor: 'bg-blue-100 dark:bg-blue-900/40',
          textColor: 'text-blue-600 dark:text-blue-300',
          borderColor: 'border-blue-200 dark:border-blue-800'
        };
      case 'resource':
        return {
          icon: <Layers className="h-4 w-4" />,
          bgColor: 'bg-amber-100 dark:bg-amber-900/40',
          textColor: 'text-amber-600 dark:text-amber-300',
          borderColor: 'border-amber-200 dark:border-amber-800'
        };
      case 'patient-arrival':
        return {
          icon: <Users className="h-4 w-4" />,
          bgColor: 'bg-green-100 dark:bg-green-900/40',
          textColor: 'text-green-600 dark:text-green-300',
          borderColor: 'border-green-200 dark:border-green-800'
        };
      case 'emergency':
      default:
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          bgColor: 'bg-red-100 dark:bg-red-900/40',
          textColor: 'text-red-600 dark:text-red-300',
          borderColor: 'border-red-200 dark:border-red-800'
        };
    }
  };
  
  // Obter classe principal com base no tipo e prioridade
  const getCardClasses = () => {
    const baseClasses = `p-3 border rounded-lg ${alert.read ? 'opacity-75' : ''}`;
    
    switch (alert.priority) {
      case 'high':
        return `${baseClasses} bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800`;
      case 'medium':
        return `${baseClasses} bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800`;
      case 'low':
        return `${baseClasses} bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800`;
      default:
        return `${baseClasses} bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700`;
    }
  };
  
  // Formatação da data/hora
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Determinar se o alerta é recente (menos de 15 minutos)
  const isRecent = () => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return new Date(alert.timestamp) > fifteenMinutesAgo;
  };
  
  // Obter badge de prioridade
  const getPriorityBadge = () => {
    let bgColor, textColor;
    
    switch (alert.priority) {
      case 'high':
        bgColor = 'bg-red-100 dark:bg-red-900/30';
        textColor = 'text-red-800 dark:text-red-300';
        break;
      case 'medium':
        bgColor = 'bg-amber-100 dark:bg-amber-900/30';
        textColor = 'text-amber-800 dark:text-amber-300';
        break;
      case 'low':
        bgColor = 'bg-blue-100 dark:bg-blue-900/30';
        textColor = 'text-blue-800 dark:text-blue-300';
        break;
      default:
        bgColor = 'bg-gray-100 dark:bg-gray-800';
        textColor = 'text-gray-700 dark:text-gray-300';
    }
    
    return (
      <span className={`text-xs px-1.5 py-0.5 rounded ${bgColor} ${textColor}`}>
        {alert.priority === 'high' ? 'Urgente' : alert.priority === 'medium' ? 'Importante' : 'Informativo'}
      </span>
    );
  };
  
  const config = getAlertConfig();
  
  // Versão compacta do cartão de alerta
  if (compact) {
    return (
      <div 
        className={getCardClasses()}
        onClick={() => !alert.read && onMarkAsRead?.(alert.id)}
      >
        <div className="flex items-start">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor} ${config.textColor} mr-3 flex-shrink-0`}>
            {config.icon}
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {alert.title}
              {isRecent() && !alert.read && (
                <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  Novo
                </span>
              )}
            </h4>
            
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 line-clamp-1">
              {alert.message}
            </p>
            
            {alert.actionRequired && (
              <button 
                className="mt-1 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails?.(alert);
                }}
              >
                Ver detalhes
                <ChevronRight className="h-3 w-3 ml-0.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Versão completa do cartão de alerta
  return (
    <div className={getCardClasses()}>
      <div className="flex items-start">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor} ${config.textColor} mr-3 flex-shrink-0`}>
          {config.icon}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {alert.title}
              {isRecent() && !alert.read && (
                <span className="ml-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  Novo
                </span>
              )}
            </h4>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(new Date(alert.timestamp))}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {alert.message}
          </p>
          
          <div className="flex justify-between items-center mt-2">
            {alert.actionRequired && getPriorityBadge()}
            
            <div className="flex space-x-1 ml-auto">
              {/* Botão para criar chat relacionado a este alerta */}
              {onCreateChat && (
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
              )}
              
              {/* Botão para marcar como lido/não lido */}
              {onMarkAsRead && (
                <button 
                  className="p-1 rounded-full hover:bg-white/50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(alert.id);
                  }}
                  title={alert.read ? "Marcar como não lido" : "Marcar como lido"}
                >
                  <CheckCircle className={`h-4 w-4 ${alert.read ? 'text-green-500 dark:text-green-400' : ''}`} />
                </button>
              )}
              
              {/* Botão para descartar alerta */}
              {onDismiss && (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};