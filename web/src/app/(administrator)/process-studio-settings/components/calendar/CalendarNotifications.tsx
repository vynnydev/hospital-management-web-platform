/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Bell, Check, Archive, AlertCircle, Info, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/organisms/card';
import { Badge } from '@/components/ui/organisms/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { formatDistance, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useCalendarNotifications } from '@/services/hooks/calendar/useCalendarNotifications';

interface CalendarNotificationsProps {
  className?: string;
  onEventClick?: (eventId: string) => void;
}

export const CalendarNotifications: React.FC<CalendarNotificationsProps> = ({
  className,
  onEventClick
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const { notifications, unreadCount, markAsRead, archiveNotification, isLoading } = useCalendarNotifications();

  // Filtrar notificações por status
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 'all') return !notification.isArchived;
    if (activeTab === 'unread') return !notification.isRead && !notification.isArchived;
    if (activeTab === 'today') {
      const notifDate = parseISO(notification.scheduledFor).toDateString();
      const today = new Date().toDateString();
      return notifDate === today && !notification.isArchived;
    }
    if (activeTab === 'archived') return notification.isArchived;
    return true;
  });

  // Obter ícone com base no tipo de notificação
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  // Obter cor do badge com base no tipo de notificação
  const getNotificationBadgeClass = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'info':
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
    }
  };

  // Formatar data relativa
  const getRelativeTime = (date: string) => {
    try {
      const parsedDate = parseISO(date);
      return formatDistance(parsedDate, new Date(), { 
        addSuffix: true,
        locale: ptBR 
      });
    } catch (e) {
      return date;
    }
  };

  // Manipular clique na notificação
  const handleNotificationClick = (notification: any) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    
    if (notification.eventId && onEventClick) {
      onEventClick(notification.eventId);
    }
  };

  return (
    <Card className={`shadow-md overflow-hidden ${className || ''}`}>
      <CardHeader className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className="h-5 w-5 text-green-500" />
            Notificações
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-green-500">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 border-b border-gray-200 dark:border-gray-700">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="all" className="text-xs">Todas</TabsTrigger>
            <TabsTrigger value="unread" className="text-xs">Não lidas</TabsTrigger>
            <TabsTrigger value="today" className="text-xs">Hoje</TabsTrigger>
            <TabsTrigger value="archived" className="text-xs">Arquivadas</TabsTrigger>
          </TabsList>
        </div>

        <CardContent className="pt-2 px-2">
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <svg className="animate-spin h-8 w-8 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : filteredNotifications.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto py-2">
                {filteredNotifications.map((notification) => {
                  const isScheduledSoon = notification.metadata?.timeToEvent && notification.metadata.timeToEvent <= 60;
                  
                  return (
                    <div 
                      key={notification.id}
                      className={`p-3 rounded-lg border ${notification.isRead ? 'bg-white dark:bg-gray-900' : 'bg-green-50 dark:bg-green-900/10'} hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-1">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500 dark:text-gray-500">
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {getRelativeTime(notification.createdAt)}
                            </div>
                            {notification.metadata?.department && (
                              <Badge variant="outline" className="px-1.5 py-0 h-5 text-xs">
                                {notification.metadata.department}
                              </Badge>
                            )}
                            {isScheduledSoon && (
                              <Badge className={`px-1.5 py-0 h-5 text-xs ${getNotificationBadgeClass('warning')}`}>
                                Em breve
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            disabled={notification.isRead}
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span className="sr-only">Marcar como lida</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              archiveNotification(notification.id);
                            }}
                          >
                            <Archive className="h-3.5 w-3.5" />
                            <span className="sr-only">Arquivar</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <Calendar className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                <p>Nenhuma notificação encontrada</p>
              </div>
            )}
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};