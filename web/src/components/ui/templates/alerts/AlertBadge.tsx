import React from 'react';
import { 
  AlertTriangle, 
  Ambulance, 
  Bell, 
  Users
} from 'lucide-react';
import { useAlerts } from '../providers/alerts/AlertsProvider';

interface AlertBadgeProps {
  hospitalId?: string;
  onClick?: () => void;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  position?: 'relative' | 'fixed';
  className?: string;
}

export const AlertBadge: React.FC<AlertBadgeProps> = ({
  hospitalId,
  onClick,
  showCount = true,
  size = 'md',
  position = 'relative',
  className = ''
}) => {
  const { alerts, unreadCount, highPriorityCount } = useAlerts();
  
  // Filtrar alertas por hospital, se fornecido
  const filteredUnreadCount = hospitalId 
    ? alerts.filter(a => !a.read && a.hospitalId === hospitalId && (a.status === 'pending' || a.status === 'acknowledged')).length
    : unreadCount;
  
  const filteredHighPriorityCount = hospitalId
    ? alerts.filter(a => a.priority === 'high' && !a.read && a.hospitalId === hospitalId && (a.status === 'pending' || a.status === 'acknowledged')).length
    : highPriorityCount;

  // Se não houver alertas, não mostrar o badge
  if (filteredUnreadCount === 0) {
    return (
      <button
        onClick={onClick}
        className={`text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 ${className}`}
      >
        <Bell className={
          size === 'sm' ? 'w-4 h-4' :
          size === 'lg' ? 'w-6 h-6' :
          'w-5 h-5'
        } />
      </button>
    );
  }

  // Configurações de tamanho
  const badgeSizes = {
    sm: {
      button: 'p-1',
      icon: 'w-4 h-4',
      badge: 'w-4 h-4 text-[8px]',
      alertIcon: 'w-3 h-3'
    },
    md: {
      button: 'p-1.5',
      icon: 'w-5 h-5',
      badge: 'w-5 h-5 text-[10px]',
      alertIcon: 'w-3.5 h-3.5'
    },
    lg: {
      button: 'p-2',
      icon: 'w-6 h-6',
      badge: 'w-6 h-6 text-xs',
      alertIcon: 'w-4 h-4'
    }
  };

  // Determinar se deve pulsar com base na prioridade
  const shouldPulse = filteredHighPriorityCount > 0;
  
  // Determinar o ícone com base na prioridade
  let AlertIcon = Bell;
  
  // Verificar se há alertas de alta prioridade e seu tipo
  if (filteredHighPriorityCount > 0) {
    // Verificar por tipo de alerta de alta prioridade
    const highPriorityAlerts = alerts.filter(a => 
      a.priority === 'high' && 
      !a.read && 
      (hospitalId ? a.hospitalId === hospitalId : true) &&
      (a.status === 'pending' || a.status === 'acknowledged')
    );
    
    if (highPriorityAlerts.length > 0) {
      const firstAlert = highPriorityAlerts[0];
      switch (firstAlert.type) {
        case 'emergency':
          AlertIcon = AlertTriangle;
          break;
        case 'ambulance':
          AlertIcon = Ambulance;
          break;
        case 'patient-arrival':
          AlertIcon = Users;
          break;
        default:
          AlertIcon = Bell;
      }
    }
  }

  return (
    <button
      onClick={onClick}
      className={`relative ${position === 'fixed' ? 'fixed top-4 right-4 z-50' : ''} ${className}`}
    >
      <div className={`${badgeSizes[size].button} ${
        shouldPulse ? 'animate-pulse' : ''
      } rounded-full ${
        filteredHighPriorityCount > 0 
          ? 'text-red-500 dark:text-red-400' 
          : 'text-amber-500 dark:text-amber-400'
      }`}>
        <AlertIcon className={badgeSizes[size].icon} />
      </div>
      
      {showCount && (
        <div className={`absolute -top-1 -right-1 ${badgeSizes[size].badge} rounded-full bg-red-600 text-white flex items-center justify-center font-bold`}>
          {filteredUnreadCount > 9 ? '9+' : filteredUnreadCount}
        </div>
      )}
    </button>
  );
};