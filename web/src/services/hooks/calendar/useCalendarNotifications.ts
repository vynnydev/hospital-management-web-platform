/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { format, addMinutes, isBefore, isAfter, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCalendarEvents } from './useCalendarEvents';
import api from '@/services/api';

// Interface para notificações
export interface INotification {
  id: string;
  eventId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  createdAt: string;
  readAt?: string;
  scheduledFor: string;
  isRead: boolean;
  isArchived: boolean;
  metadata?: Record<string, any>;
}

// Hook para gerenciar notificações de eventos do calendário
export const useCalendarNotifications = () => {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [upcomingEventNotifications, setUpcomingEventNotifications] = useState<INotification[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obter eventos do calendário
  const { events } = useCalendarEvents(new Date());

  // Buscar notificações da API
  const fetchNotifications = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Buscar notificações do servidor
      const response = await api.get('/notifications', {
        params: {
          type: 'calendar',
          limit: 50,
          isArchived: false
        }
      });
      
      const serverNotifications = response.data || [];
      
      setNotifications(serverNotifications);
      setIsLoading(false);
    } catch (err) {
      console.error('Erro ao buscar notificações:', err);
      setError('Não foi possível carregar as notificações');
      setIsLoading(false);
    }
  }, []);

  // Gerar notificações para eventos próximos
  const generateUpcomingEventNotifications = useCallback(() => {
    if (!events || events.length === 0) return;
    
    const now = new Date();
    const upcomingNotifications: INotification[] = [];
    
    events.forEach(event => {
      if (!event.notification) return;
      
      const eventDate = parseISO(`${event.date}T${event.startTime}`);
      const notificationTime = addMinutes(eventDate, -event.notification);
      
      // Verificar se está dentro da janela de notificação
      // Considerar apenas eventos que estão próximos (notificação ainda não passou)
      // mas que ainda não começaram
      if (isAfter(notificationTime, now) && isBefore(now, eventDate)) {
        const timeToEvent = Math.floor((eventDate.getTime() - now.getTime()) / (1000 * 60));
        const formattedDate = format(eventDate, "dd 'de' MMMM 'às' HH:mm", { locale: ptBR });
        
        upcomingNotifications.push({
          id: `upcoming-${event.id}`,
          eventId: event.id,
          title: `Evento em breve: ${event.title}`,
          message: `O evento "${event.title}" está agendado para ${formattedDate}`,
          type: 'info',
          createdAt: format(now, 'yyyy-MM-dd\'T\'HH:mm:ss'),
          scheduledFor: format(eventDate, 'yyyy-MM-dd\'T\'HH:mm:ss'),
          isRead: false,
          isArchived: false,
          metadata: {
            timeToEvent,
            location: event.location,
            department: event.department,
            type: event.type
          }
        });
      }
    });
    
    // Ordenar por proximidade
    const sortedNotifications = upcomingNotifications.sort((a, b) => {
      return parseISO(a.scheduledFor).getTime() - parseISO(b.scheduledFor).getTime();
    });
    
    setUpcomingEventNotifications(sortedNotifications);
  }, [events]);

  // Marcar notificação como lida
  const markAsRead = async (notificationId: string) => {
    try {
      // Atualizar localmente primeiro para feedback imediato
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isRead: true, readAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss') } 
            : notification
        )
      );
      
      // Atualizar no servidor
      await api.put(`/notifications/${notificationId}/read`);
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
      // Reverter alteração em caso de erro
      fetchNotifications();
    }
  };

  // Arquivar notificação
  const archiveNotification = async (notificationId: string) => {
    try {
      // Atualizar localmente primeiro para feedback imediato
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, isArchived: true } 
            : notification
        )
      );
      
      // Remover notificações arquivadas da lista visível
      setNotifications(prev => prev.filter(notification => !notification.isArchived));
      
      // Atualizar no servidor
      await api.put(`/notifications/${notificationId}/archive`);
    } catch (err) {
      console.error('Erro ao arquivar notificação:', err);
      // Reverter alteração em caso de erro
      fetchNotifications();
    }
  };

  // Criar notificação personalizada
  const createNotification = async (data: Omit<INotification, 'id' | 'createdAt' | 'isRead' | 'isArchived'>) => {
    try {
      const newNotification = {
        ...data,
        createdAt: format(new Date(), 'yyyy-MM-dd\'T\'HH:mm:ss'),
        isRead: false,
        isArchived: false
      };
      
      // Enviar para o servidor
      const response = await api.post('/notifications', newNotification);
      
      // Adicionar à lista com ID retornado pelo servidor
      setNotifications(prev => [...prev, { ...newNotification, id: response.data.id }]);
      
      return response.data;
    } catch (err) {
      console.error('Erro ao criar notificação:', err);
      setError('Não foi possível criar a notificação');
      throw err;
    }
  };

  // Efeito para buscar notificações iniciais
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Efeito para atualizar notificações de eventos próximos
  useEffect(() => {
    generateUpcomingEventNotifications();
    
    // Atualizar notificações de eventos a cada minuto
    const interval = setInterval(() => {
      generateUpcomingEventNotifications();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [generateUpcomingEventNotifications, events]);

  // Combinar notificações do servidor com notificações de eventos próximos
  const allNotifications = [
    ...upcomingEventNotifications,
    ...notifications.filter(n => !upcomingEventNotifications.some(un => un.eventId === n.eventId))
  ];

  // Obter contagem de notificações não lidas
  const unreadCount = allNotifications.filter(n => !n.isRead).length;

  return {
    notifications: allNotifications,
    unreadCount,
    isLoading,
    error,
    markAsRead,
    archiveNotification,
    createNotification,
    refreshNotifications: fetchNotifications
  };
};