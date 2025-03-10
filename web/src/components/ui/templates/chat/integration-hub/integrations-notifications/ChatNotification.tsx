/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { MessageCircle, User, Users, X, Bell, Ambulance, Sparkles, AlertTriangle, Layers } from 'lucide-react';

// Interface para dados da notificação
export interface ChatNotificationData {
  id: string;
  chatId: string;
  message: string;
  senderName: string;
  senderRole?: 'médico' | 'enfermeiro' | 'atendente' | 'administrador' | 'ai' | 'system';
  timestamp: Date;
  chatType?: 'direct' | 'group' | 'alert' | 'ai' | 'system';
  alertType?: 'ambulance' | 'patient-arrival' | 'resource' | 'emergency';
  priority?: 'high' | 'medium' | 'low';
  isRead?: boolean;
}

interface ChatNotificationProps {
  notification: ChatNotificationData;
  onOpen: (chatId: string) => void;
  onDismiss: (notificationId: string) => void;
  autoCloseAfter?: number; // em milissegundos, 0 para não fechar
  className?: string;
}

/**
 * Componente de notificação de nova mensagem de chat
 */
export const ChatNotification: React.FC<ChatNotificationProps> = ({
  notification,
  onOpen,
  onDismiss,
  autoCloseAfter = 10000, // 10 segundos
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  // Auto-fechar após o tempo especificado
  useEffect(() => {
    if (autoCloseAfter > 0) {
      const timeoutId = setTimeout(() => {
        setIsVisible(false);
        
        // Pequeno atraso para a animação de fade-out
        setTimeout(() => {
          onDismiss(notification.id);
        }, 300);
      }, autoCloseAfter);
      
      return () => clearTimeout(timeoutId);
    }
  }, [autoCloseAfter, onDismiss, notification.id]);
  
  // Determinar o ícone com base no tipo de chat
  const getNotificationIcon = () => {
    if (notification.chatType === 'ai') {
      return <Sparkles className="h-5 w-5 text-indigo-500 dark:text-indigo-400" />;
    } else if (notification.chatType === 'group') {
      return <Users className="h-5 w-5 text-green-500 dark:text-green-400" />;
    } else if (notification.chatType === 'alert') {
      if (notification.alertType === 'ambulance') {
        return <Ambulance className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
      } else if (notification.alertType === 'emergency') {
        return <AlertTriangle className="h-5 w-5 text-red-500 dark:text-red-400" />;
      } else if (notification.alertType === 'resource') {
        return <Layers className="h-5 w-5 text-amber-500 dark:text-amber-400" />;
      } else {
        return <Bell className="h-5 w-5 text-purple-500 dark:text-purple-400" />;
      }
    } else {
      return <User className="h-5 w-5 text-blue-500 dark:text-blue-400" />;
    }
  };
  
  // Determinar cores com base na prioridade e tipo
  const getNotificationStyles = () => {
    // Para alertas, usar cores baseadas na prioridade
    if (notification.chatType === 'alert') {
      if (notification.priority === 'high') {
        return {
          border: 'border-red-300 dark:border-red-800',
          background: 'bg-red-50 dark:bg-red-900/20',
          badge: 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
        };
      } else if (notification.priority === 'medium') {
        return {
          border: 'border-amber-300 dark:border-amber-800',
          background: 'bg-amber-50 dark:bg-amber-900/20',
          badge: 'bg-amber-100 dark:bg-amber-800 text-amber-800 dark:text-amber-200'
        };
      } else {
        return {
          border: 'border-blue-300 dark:border-blue-800',
          background: 'bg-blue-50 dark:bg-blue-900/20',
          badge: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
        };
      }
    }
    
    // Para diferentes tipos de chat
    switch (notification.chatType) {
      case 'ai':
        return {
          border: 'border-indigo-300 dark:border-indigo-800',
          background: 'bg-indigo-50 dark:bg-indigo-900/20',
          badge: 'bg-indigo-100 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200'
        };
      case 'group':
        return {
          border: 'border-green-300 dark:border-green-800',
          background: 'bg-green-50 dark:bg-green-900/20',
          badge: 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
        };
      case 'system':
        return {
          border: 'border-purple-300 dark:border-purple-800',
          background: 'bg-purple-50 dark:bg-purple-900/20',
          badge: 'bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200'
        };
      default:
        return {
          border: 'border-blue-300 dark:border-blue-800',
          background: 'bg-blue-50 dark:bg-blue-900/20',
          badge: 'bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
        };
    }
  };
  
  // Formatar a hora da mensagem
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Truncar mensagem se for muito longa
  const truncateMessage = (message: string, maxLength = 100) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  };
  
  const styles = getNotificationStyles();
  
  // Se não estiver visível, não renderizar
  if (!isVisible) return null;
  
  return (
    <div 
      className={`
        fixed bottom-4 right-4 w-80 rounded-lg shadow-lg overflow-hidden
        border ${styles.border} ${styles.background}
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}
        ${className}
      `}
      style={{ zIndex: 1000 }}
    >
      {/* Cabeçalho */}
      <div className="p-3 flex items-center justify-between border-b border-opacity-50">
        <div className="flex items-center">
          <div className="mr-2 h-8 w-8 rounded-full flex items-center justify-center bg-white dark:bg-gray-700 shadow-sm">
            {getNotificationIcon()}
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center">
              {notification.senderName}
              {notification.chatType === 'alert' && notification.priority && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${styles.badge}`}>
                  {notification.priority === 'high' ? 'Urgente' : 
                   notification.priority === 'medium' ? 'Importante' : 'Informativo'}
                </span>
              )}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {notification.chatType === 'group' ? 'Grupo' : 
               notification.chatType === 'ai' ? 'Assistente IA' :
               notification.chatType === 'alert' ? 'Alerta' : 'Mensagem'} • {formatTime(notification.timestamp)}
            </p>
          </div>
        </div>
        
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onDismiss(notification.id), 300);
          }}
          className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          aria-label="Fechar notificação"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      
      {/* Conteúdo */}
      <div 
        className="p-3 cursor-pointer hover:bg-white/50 dark:hover:bg-black/5"
        onClick={() => onOpen(notification.chatId)}
      >
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {truncateMessage(notification.message)}
        </p>
      </div>
      
      {/* Rodapé com ações */}
      <div className="px-3 py-2 bg-black/5 dark:bg-white/5 flex justify-between items-center">
        <span className="text-xs text-gray-500 dark:text-gray-400">
          Clique para responder
        </span>
        
        <button
          onClick={() => onOpen(notification.chatId)}
          className="px-3 py-1 rounded text-xs font-medium bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Abrir
        </button>
      </div>
    </div>
  );
};

/**
 * Contêiner para gerenciar múltiplas notificações
 */
interface ChatNotificationsContainerProps {
  notifications: ChatNotificationData[];
  onOpen: (chatId: string) => void;
  onDismiss: (notificationId: string) => void;
  maxVisible?: number;
  stackDirection?: 'vertical' | 'horizontal';
  spacing?: number; // em pixels
}

export const ChatNotificationsContainer: React.FC<ChatNotificationsContainerProps> = ({
  notifications,
  onOpen,
  onDismiss,
  maxVisible = 3,
  stackDirection = 'vertical',
  spacing = 16
}) => {
  // Mostrar apenas as notificações mais recentes
  const visibleNotifications = notifications
    .slice(0, maxVisible)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  if (visibleNotifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {visibleNotifications.map((notification, index) => (
        <ChatNotification
          key={notification.id}
          notification={notification}
          onOpen={onOpen}
          onDismiss={onDismiss}
          className={stackDirection === 'vertical' 
            ? `${index > 0 ? `mb-${spacing}` : ''}`
            : `${index > 0 ? `mr-${spacing}` : ''}`
          }
          autoCloseAfter={10000 + (index * 1000)} // Escalonar o tempo de fechamento
        />
      ))}
      
      {notifications.length > maxVisible && (
        <div className="absolute bottom-0 right-0 transform translate-y-full mt-2 text-center w-full">
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-2 py-1 rounded-full shadow-sm">
            +{notifications.length - maxVisible} mais notificações
          </span>
        </div>
      )}
    </div>
  );
};