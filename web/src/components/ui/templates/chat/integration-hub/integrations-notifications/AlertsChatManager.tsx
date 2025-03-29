/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { AlertToChatIntegration } from './AlertToChatIntegration';
import { ChatNotificationData, ChatNotificationsContainer } from './ChatNotification';
import { Bell, MessageCircle } from 'lucide-react';
import { useAlertsProvider } from '../../../providers/alerts/AlertsProvider';
import { AlertBanner } from '../../../alerts/AlertBanner';
import { AlertsPanel } from '../../../alerts/AlertsPanel';
import { IAlert } from '@/types/alert-types';

// Interface para o grupo/canal de chat
interface ChatGroup {
  id: string;
  title: string;
  members: string[];
  lastActivity: Date;
  metadata?: Record<string, any>;
  isAlert?: boolean;
}

// Interface para o gerenciador
interface AlertsChatManagerProps {
  hospitalId: string;
  currentUserId: string;
  onOpenChat: (chatId: string) => void;
  onCreateChat?: (
    title: string, 
    initialMessage: string, 
    participants: string[], 
    metadata?: Record<string, any>
  ) => string; // retorna o ID do chat criado
  showAlertBanner?: boolean;
  showNotifications?: boolean;
  className?: string;
}

/**
 * Componente que gerencia a integração entre o sistema de alertas e o chat
 * 
 * Este componente:
 * 1. Monitora alertas e cria chats automaticamente quando necessário
 * 2. Exibe banner de alertas críticos no topo do chat
 * 3. Gerencia notificações de novos alertas
 * 4. Fornece um botão para abrir o painel de alertas
 */
export const AlertsChatManager: React.FC<AlertsChatManagerProps> = ({
  hospitalId,
  currentUserId,
  onOpenChat,
  onCreateChat,
  showAlertBanner = true,
  showNotifications = true,
  className = ''
}) => {
  const { alerts, unreadCount, highPriorityCount } = useAlertsProvider();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [chatGroups, setChatGroups] = useState<ChatGroup[]>([]);
  const [notifications, setNotifications] = useState<ChatNotificationData[]>([]);
  
  // Função para criar um novo chat
  const createChat = useCallback((
    title: string, 
    initialMessage: string, 
    participants: string[], 
    metadata?: Record<string, any>
  ): string => {
    // Se houver uma função de criação de chat fornecida via props, use-a
    if (onCreateChat) {
      return onCreateChat(title, initialMessage, participants, metadata);
    }
    
    // Caso contrário, simular a criação de um chat
    const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Adicionar o chat à lista de grupos
    const newChatGroup: ChatGroup = {
      id: chatId,
      title,
      members: participants,
      lastActivity: new Date(),
      metadata,
      isAlert: metadata?.alertId ? true : false
    };
    
    setChatGroups(prev => [...prev, newChatGroup]);
    
    // Criar uma notificação para o novo chat
    const chatType = metadata?.alertType 
      ? 'alert' 
      : participants.length > 2 
        ? 'group' 
        : 'direct';
    
    const newNotification: ChatNotificationData = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      chatId,
      message: initialMessage,
      senderName: 'Sistema',
      senderRole: 'system',
      timestamp: new Date(),
      chatType,
      alertType: metadata?.alertType,
      priority: metadata?.alertPriority,
      isRead: false
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    return chatId;
  }, [onCreateChat]);
  
  // Função para processar um alerta e criar um chat
  const handleCreateChatFromAlert = useCallback((alert: IAlert) => {
    // Lógica específica para cada tipo de alerta
    switch (alert.type) {
      case 'ambulance':
        createChat(
          `🚑 Ambulância ${alert.metadata?.ambulanceId}: ${alert.title}`,
          `[ALERTA] ${alert.message}\n\nDetalhes da ambulância:\n- ID: ${alert.metadata?.ambulanceId}\n- Chegada: ${alert.metadata?.estimatedArrival ? new Date(alert.metadata.estimatedArrival).toLocaleTimeString() : 'N/A'}`,
          ['emergency-team', 'reception', currentUserId],
          {
            alertId: alert.id,
            alertType: alert.type,
            alertPriority: alert.priority,
            ambulanceId: alert.metadata?.ambulanceId,
            routeId: alert.metadata?.routeId
          }
        );
        break;
        
      case 'patient-arrival':
        createChat(
          `🏥 Chegada de Paciente: ${alert.metadata?.patientId || 'Não identificado'}`,
          `[ALERTA] ${alert.message}\n\nAções necessárias:\n1. Confirmar recepção\n2. Designar leito\n3. Preparar equipe médica`,
          ['reception', 'nursing-team', currentUserId],
          {
            alertId: alert.id,
            alertType: alert.type,
            alertPriority: alert.priority,
            patientId: alert.metadata?.patientId
          }
        );
        break;
        
      case 'resource':
        createChat(
          `🔧 ${alert.metadata?.department || ''}: ${alert.metadata?.resourceName || 'Recurso'}`,
          `[ALERTA] ${alert.message}\n\nAções necessárias:\n1. Verificar disponibilidade em outros departamentos\n2. Priorizar uso do recurso\n3. Requisitar mais unidades se necessário`,
          ['resource-management', `${alert.metadata?.department?.toLowerCase()}-team`, currentUserId],
          {
            alertId: alert.id,
            alertType: alert.type,
            alertPriority: alert.priority,
            resourceId: alert.metadata?.resourceId,
            department: alert.metadata?.department
          }
        );
        break;
        
      case 'emergency':
        createChat(
          `⚠️ EMERGÊNCIA: ${alert.title}`,
          `[ALERTA URGENTE] ${alert.message}\n\nAções imediatas necessárias:\n1. Coordenar equipe de resposta\n2. Mobilizar recursos\n3. Confirmar leitura deste alerta`,
          ['emergency-team', 'medical-director', 'nursing-supervisor', currentUserId],
          {
            alertId: alert.id,
            alertType: alert.type,
            alertPriority: alert.priority,
            emergencyLevel: alert.metadata?.emergencyLevel
          }
        );
        break;
        
      default:
        createChat(
          alert.title,
          `[ALERTA] ${alert.message}`,
          ['hospital-admin', currentUserId],
          {
            alertId: alert.id,
            alertType: alert.type,
            alertPriority: alert.priority
          }
        );
    }
  }, [createChat, currentUserId]);
  
  // Função para fechar uma notificação
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  }, []);
  
  // Função para abrir um chat a partir de uma notificação
  const openChatFromNotification = useCallback((chatId: string) => {
    onOpenChat(chatId);
    
    // Marcar todas as notificações relacionadas como lidas
    setNotifications(prev => 
      prev.map(notif => 
        notif.chatId === chatId 
          ? { ...notif, isRead: true } 
          : notif
      )
    );
  }, [onOpenChat]);
  
  return (
    <div className={className}>
      {/* Integração para criação automatizada de chats a partir de alertas */}
      <AlertToChatIntegration
        hospitalId={hospitalId}
        createChat={createChat}
        autoCreateChatForPriority={['high']} // Criar chats automaticamente apenas para alertas de alta prioridade
      />
      
      {/* Banner de alertas no topo (opcional) */}
      {showAlertBanner && highPriorityCount > 0 && (
        <AlertBanner
          onCreateChat={handleCreateChatFromAlert}
          showOnlyPriority={['high']}
        />
      )}
      
      {/* Botão para mostrar painel de alertas */}
      <div className="relative">
        <button 
          className={`
            p-2 rounded-full relative
            ${unreadCount > 0 
              ? 'text-blue-600 bg-blue-100 hover:bg-blue-200 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-800/50' 
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200 dark:text-gray-400 dark:bg-blue-700 dark:hover:bg-blue-800'
            }
          `}
          onClick={() => setIsPanelOpen(prev => !prev)}
          aria-label="Mostrar alertas"
        >
          <Bell className="h-5 w-5" />
          
          {/* Indicador de alertas não lidos */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
        
        {/* Painel de alertas (condicional) */}
        {isPanelOpen && (
          <div className="absolute right-0 top-full mt-2 w-96 z-10 shadow-lg rounded-lg overflow-hidden">
            <AlertsPanel 
              onAlertClick={() => {}} 
              onCreateChatFromAlert={handleCreateChatFromAlert} 
            />
          </div>
        )}
      </div>
      
      {/* Container de notificações */}
      {showNotifications && notifications.length > 0 && (
        <ChatNotificationsContainer
          notifications={notifications.filter(n => !n.isRead)}
          onOpen={openChatFromNotification}
          onDismiss={dismissNotification}
          maxVisible={3}
        />
      )}
    </div>
  );
};

/**
 * Botão simples que exibe contagem de alertas não lidos
 */
export const AlertsBadge: React.FC<{
  onClick?: () => void;
  className?: string;
}> = ({
  onClick,
  className = ''
}) => {
  const { unreadCount, highPriorityCount } = useAlertsProvider();
  
  if (unreadCount === 0) {
    return (
      <button 
        className={`p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ${className}`}
        onClick={onClick}
        aria-label="Alertas"
      >
        <Bell className="h-5 w-5" />
      </button>
    );
  }
  
  return (
    <button 
      className={`
        p-2 rounded-full relative
        ${highPriorityCount > 0 
          ? 'text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300' 
          : 'text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
        }
        ${className}
      `}
      onClick={onClick}
      aria-label={`${unreadCount} alertas não lidos`}
    >
      <Bell className="h-5 w-5" />
      
      <span className={`
        absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center
        ${highPriorityCount > 0 ? 'bg-red-500' : 'bg-blue-500'}
      `}>
        {unreadCount > 9 ? '9+' : unreadCount}
      </span>
    </button>
  );
};