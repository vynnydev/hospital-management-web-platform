import React from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/organisms/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/organisms/popover';

// Em um ambiente real, esses dados viriam do servidor/API
const MOCK_NOTIFICATIONS = [
  { 
    id: 1, 
    title: 'Novo paciente admitido', 
    message: 'João Silva foi admitido na UTI', 
    time: '5 min atrás', 
    read: false 
  },
  { 
    id: 2, 
    title: 'Ambulância chegando', 
    message: 'Ambulância AMB-1234 chegará em 10 minutos', 
    time: '12 min atrás', 
    read: false 
  },
  { 
    id: 3, 
    title: 'Alerta de leito', 
    message: 'UTI chegou a 90% da capacidade', 
    time: '25 min atrás', 
    read: true 
  },
  { 
    id: 4, 
    title: 'Transferência concluída', 
    message: 'Maria Santos foi transferida com sucesso', 
    time: '1 hora atrás', 
    read: true 
  },
];

export const NotificationsPopover: React.FC = () => {
  const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="relative bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
        >
          <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">Notificações</h4>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs text-blue-600 dark:text-blue-400 h-auto py-1"
          >
            Marcar todas como lidas
          </Button>
        </div>
        <div className="max-h-80 overflow-auto">
          {MOCK_NOTIFICATIONS.length > 0 ? (
            MOCK_NOTIFICATIONS.map((notification) => (
              <div 
                key={notification.id} 
                className={`px-4 py-3 border-b border-gray-200 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 ${
                  notification.read ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${notification.read ? 'bg-gray-300 dark:bg-gray-600' : 'bg-blue-500'}`} />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">{notification.title}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{notification.message}</p>
                    <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              Nenhuma notificação no momento
            </div>
          )}
        </div>
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 text-center">
          <button className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Ver todas as notificações
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};