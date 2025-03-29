import React from 'react';
import { Bell, AlertCircle } from 'lucide-react';
import { useAlertsProvider } from '../providers/alerts/AlertsProvider';

interface AlertsIndicatorProps {
  onClick?: () => void;
  showCount?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Componente que mostra um indicador de alertas não lidos
 * Pode ser usado em qualquer parte da interface para indicar alertas pendentes
 */
export const AlertsIndicator: React.FC<AlertsIndicatorProps> = ({
  onClick,
  showCount = true,
  size = 'md',
  className = ''
}) => {
  const { unreadCount, highPriorityCount } = useAlertsProvider();
  
  // Se não houver alertas não lidos, não mostrar nada
  if (unreadCount === 0) {
    return null;
  }

  // Determinar classes com base no tamanho
  const sizeClasses = {
    sm: {
      container: 'w-5 h-5',
      icon: 'h-3 w-3',
      badge: 'w-4 h-4 text-[9px]',
      text: 'text-xs'
    },
    md: {
      container: 'w-7 h-7',
      icon: 'h-4 w-4',
      badge: 'w-5 h-5 text-[10px]',
      text: 'text-sm'
    },
    lg: {
      container: 'w-9 h-9',
      icon: 'h-5 w-5',
      badge: 'w-6 h-6 text-xs',
      text: 'text-base'
    }
  };

  // Aplicar animação pulsante se houver alertas de alta prioridade
  const pulseAnimation = highPriorityCount > 0 ? 'animate-pulse' : '';

  return (
    <div 
      className={`relative inline-flex ${className}`}
      onClick={onClick}
    >
      {/* Ícone de sino */}
      <div className={`
        ${sizeClasses[size].container} 
        ${highPriorityCount > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-blue-100 dark:bg-blue-900/30'} 
        rounded-full flex items-center justify-center 
        ${highPriorityCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}
        ${pulseAnimation}
        ${onClick ? 'cursor-pointer hover:bg-opacity-80 transition-colors' : ''}
      `}>
        {highPriorityCount > 0 ? (
          <AlertCircle className={sizeClasses[size].icon} />
        ) : (
          <Bell className={sizeClasses[size].icon} />
        )}
      </div>

      {/* Badge com contador */}
      {showCount && (
        <div className={`
          absolute -top-1 -right-1 
          ${sizeClasses[size].badge} 
          rounded-full bg-red-500 text-white 
          flex items-center justify-center font-medium
        `}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </div>
      )}
    </div>
  );
};

// Este é um componente simples que mostra apenas um dot vermelho para indicar alertas
export const AlertsDot: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { unreadCount, highPriorityCount } = useAlertsProvider();
  
  if (unreadCount === 0) {
    return null;
  }

  return (
    <div className={`
      w-2 h-2 rounded-full 
      ${highPriorityCount > 0 ? 'bg-red-500' : 'bg-blue-500'}
      ${highPriorityCount > 0 ? 'animate-pulse' : ''}
      ${className}
    `} />
  );
};