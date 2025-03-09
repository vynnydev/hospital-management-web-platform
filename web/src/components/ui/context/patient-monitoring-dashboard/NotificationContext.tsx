import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Definição da interface de notificação
export interface Notification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type?: 'info' | 'warning' | 'success' | 'error';
}

// Interface para o contexto
interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markAsRead: (id: string | number) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string | number) => void;
  clearAllNotifications: () => void;
}

// Criar o contexto de notificações
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  removeNotification: () => {},
  clearAllNotifications: () => {},
});

// Hook para usar o contexto de notificações
export const useNotifications = () => useContext(NotificationContext);

// Notificações de exemplo para demonstração
const demoNotifications: Notification[] = [
  { 
    id: 1, 
    title: 'Novo paciente admitido', 
    message: 'João Silva foi admitido na UTI', 
    time: '5 min atrás', 
    read: false,
    type: 'info'
  },
  { 
    id: 2, 
    title: 'Ambulância chegando', 
    message: 'Ambulância AMB-1234 chegará em 10 minutos', 
    time: '12 min atrás', 
    read: false,
    type: 'warning'
  },
  { 
    id: 3, 
    title: 'Alerta de leito', 
    message: 'UTI chegou a 90% da capacidade', 
    time: '25 min atrás', 
    read: true,
    type: 'error'
  },
  { 
    id: 4, 
    title: 'Transferência concluída', 
    message: 'Maria Santos foi transferida com sucesso', 
    time: '1 hora atrás', 
    read: true,
    type: 'success'
  },
];

// Provider para o contexto de notificações
interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(demoNotifications);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Calcular o número de notificações não lidas ao carregar e quando houver alterações
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);

  // Adicionar nova notificação
  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      time: 'agora mesmo',
      read: false,
    };
    
    setNotifications([newNotification, ...notifications]);
  };

  // Marcar uma notificação como lida
  const markAsRead = (id: string | number) => {
    setNotifications(
      notifications.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  // Marcar todas as notificações como lidas
  const markAllAsRead = () => {
    setNotifications(
      notifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Remover uma notificação
  const removeNotification = (id: string | number) => {
    setNotifications(
      notifications.filter(notification => notification.id !== id)
    );
  };

  // Limpar todas as notificações
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Simular recebimento de notificações em tempo real (apenas para demonstração)
  useEffect(() => {
    const interval = setInterval(() => {
      // 10% de chance de receber uma nova notificação a cada 30 segundos
      if (Math.random() < 0.1) {
        const demoMessages = [
          { title: 'Novo paciente', message: 'Carlos Ferreira foi admitido', type: 'info' as const },
          { title: 'Alerta de ocupação', message: 'Enfermaria com 80% de ocupação', type: 'warning' as const },
          { title: 'Alta médica', message: 'Ana Paula recebeu alta médica', type: 'success' as const },
          { title: 'Equipamento em manutenção', message: 'Respirador #3 necessita manutenção', type: 'error' as const },
        ];
        
        const randomMessage = demoMessages[Math.floor(Math.random() * demoMessages.length)];
        addNotification(randomMessage);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};