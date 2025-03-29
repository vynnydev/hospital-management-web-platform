import { useCalendarEvents } from '@/services/hooks/calendar/useCalendarEvents';
import { useCalendarNotifications } from '@/services/hooks/calendar/useCalendarNotifications';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import React, { useState, useEffect } from 'react';
import { CalendarNotifications } from './CalendarNotifications';
import { HospitalaryCalendarModule } from './HospitalaryCalendarModule';

/**
 * Módulo Completo do Calendário Hospitalar
 * 
 * Este componente integra todos os subcomponentes necessários para a
 * funcionalidade completa do calendário hospitalar, incluindo o calendário
 * mensal, lista de eventos, formulário de eventos, notificações e filtros.
 */
export const CalendarTab: React.FC = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFullScreenEvent, setIsFullScreenEvent] = useState(false);
  
  // Hooks para dados
  const { events, isLoading: isLoadingEvents } = useCalendarEvents(currentDate);
  const { loading: isLoadingStaff } = useStaffData();
  const { notifications, unreadCount } = useCalendarNotifications();
  
  // Verificar se há notificações novas
  useEffect(() => {
    // Exibir notificação no navegador se suportado
    if (unreadCount > 0 && 'Notification' in window && Notification.permission === 'granted') {
      const latestNotification = notifications.filter(n => !n.isRead)[0];
      
      if (latestNotification) {
        new Notification('Calendário Hospitalar', {
          body: latestNotification.message,
          icon: '/logo.png'
        });
      }
    }
  }, [unreadCount, notifications]);
  
  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);
  
  // Manipular clique em um evento a partir de uma notificação
  const handleEventFromNotification = (eventId: string) => {
    setSelectedEventId(eventId);
    setIsFullScreenEvent(true);
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendário principal (3 colunas) */}
        <div className="lg:col-span-3">
          <HospitalaryCalendarModule />
        </div>
        
        {/* Painel de notificações (1 coluna) */}
        <div className="lg:col-span-1">
          <CalendarNotifications 
            onEventClick={handleEventFromNotification}
          />
        </div>
      </div>
      
      {/* Rodapé com estatísticas */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Estatísticas do Calendário</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Total de Eventos</h3>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{events.length}</p>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <h3 className="text-sm font-medium text-green-800 dark:text-green-300">Eventos Hoje</h3>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200">
              {events.filter(e => {
                const today = new Date();
                const eventDate = new Date(e.date || '');
                return eventDate.toDateString() === today.toDateString();
              }).length}
            </p>
          </div>
          
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <h3 className="text-sm font-medium text-purple-800 dark:text-purple-300">Notificações</h3>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">{unreadCount}</p>
          </div>
          
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-4 border border-amber-200 dark:border-amber-800">
            <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">Alta Prioridade</h3>
            <p className="text-2xl font-bold text-amber-900 dark:text-amber-200">
              {events.filter(e => e.priority === 'high').length}
            </p>
          </div>
        </div>
        
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
          <span>Última atualização: {new Date().toLocaleString('pt-BR')}</span>
          <span>
            Status: {isLoadingEvents || isLoadingStaff ? (
              <span className="text-amber-600 dark:text-amber-400">Atualizando...</span>
            ) : (
              <span className="text-green-600 dark:text-green-400">Sincronizado</span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};