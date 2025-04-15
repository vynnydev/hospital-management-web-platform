/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, MessageCircle, BellRing } from 'lucide-react';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { useAlertsProvider } from '../providers/alerts/AlertsProvider';
import { CognitivaAssistant, assistantController } from '../CognitivaAssistant';
import { ChatButton } from '../chat/ChatButton';
import { eventService } from '@/services/general/events/EventService';
import { LOGIN_SUCCESS_EVENT } from '@/hooks/auth/useAuth';

interface CognitivaAssistantBarProps {
  showTitle?: boolean;
  className?: string;
  autoOpenOnLogin?: boolean;
}

export interface CognitivaAssistantHandle {
  openAssistant: () => void;
}

/**
 * Componente para integrar o assistente de IA e o chat na barra de navegação
 * Mostra o botão de assistente, botão de chat e notificação de alertas
 */
export const CognitivaAssistantBar: React.FC<CognitivaAssistantBarProps> = ({
  showTitle = true,
  className = '',
  autoOpenOnLogin = true
}) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const assistantRef = useRef<CognitivaAssistantHandle>(null);
  const { networkData, currentUser } = useNetworkData();
  const { unreadCount, highPriorityCount } = useAlertsProvider();
  
  const selectedHospitalId = networkData?.hospitals[0]?.id || '';
  const userId = currentUser?.id || 'current-user';
  
  // Registrar a função para abrir o assistente externamente
  useEffect(() => {
    assistantController.registerOpenFunction(() => {
      // Acesse o método através da ref atual
      assistantRef.current?.openAssistant();
    });
    
    // Escutar evento de login se autoOpenOnLogin estiver habilitado
    if (autoOpenOnLogin) {
      const unsubscribe = eventService.subscribe(LOGIN_SUCCESS_EVENT, (user) => {
        // Pequeno atraso para garantir que o componente esteja montado
        setTimeout(() => {
          assistantController.openAssistant();
        }, 1500);
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [autoOpenOnLogin]);
  
  // Função para abrir o assistente
  const openAssistant = () => {
    assistantController.openAssistant();
  };
  
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showTitle && (
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mr-2">
          Sistema de Comunicação Hospitalar
        </h2>
      )}
      
      {/* Botão de chat */}
      <ChatButton 
        userId={userId}
        userRole={currentUser?.role || 'médico'}
      />

      {/* Assistente de IA */}
      <CognitivaAssistant 
        ref={assistantRef}
        userId={userId}
        hospitalId={selectedHospitalId}
        onShowChat={() => setIsChatOpen(true)}
        autoOpenOnLogin={autoOpenOnLogin}
      />
      
      {/* Indicador de notificações (Se necessário exibir separadamente) */}
      {highPriorityCount > 0 && (
        <div className="relative">
          <button
            className="p-2 text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20 rounded-full hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
            title={`${highPriorityCount} alerta${highPriorityCount > 1 ? 's' : ''} urgente${highPriorityCount > 1 ? 's' : ''}`}
            onClick={openAssistant}
          >
            <BellRing className="h-5 w-5" />
          </button>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
            {highPriorityCount > 9 ? '9+' : highPriorityCount}
          </span>
        </div>
      )}
    </div>
  );
};

/**
 * Botão flutuante do assistente para telas menores ou layout minimalista
 */
export const FloatingAssistantButton: React.FC<{ 
  className?: string;
  autoOpenOnLogin?: boolean;
}> = ({ 
  className = '',
  autoOpenOnLogin = true
}) => {
  const assistantRef = useRef<CognitivaAssistantHandle>(null);
  const { networkData, currentUser } = useNetworkData();
  const { unreadCount } = useAlertsProvider();
  
  const selectedHospitalId = networkData?.hospitals[0]?.id || '';
  const userId = currentUser?.id || 'current-user';
  
  // Registrar a função para abrir o assistente externamente
  useEffect(() => {
    assistantController.registerOpenFunction(() => {
      assistantRef.current?.openAssistant();
    });
    
    // Escutar evento de login se autoOpenOnLogin estiver habilitado
    if (autoOpenOnLogin) {
      const unsubscribe = eventService.subscribe(LOGIN_SUCCESS_EVENT, (user) => {
        // Pequeno atraso para garantir que o componente esteja montado
        setTimeout(() => {
          assistantController.openAssistant();
        }, 1500);
      });
      
      return () => {
        unsubscribe();
      };
    }
  }, [autoOpenOnLogin]);
  
  return (
    <div className={`fixed bottom-6 right-6 z-40 ${className}`}>
      <div className="flex flex-col items-end space-y-3">
        {/* Botão do chat */}
        <button
          className="p-3 bg-blue-600 dark:bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
          title="Chat Cognitiva"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
        
        {/* Botão do assistente */}
        <div className="relative">
          <CognitivaAssistant 
            ref={assistantRef}
            userId={userId}
            hospitalId={selectedHospitalId}
            autoOpenOnLogin={autoOpenOnLogin}
          />
          
          {/* Badge de notificação */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};