/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { AlertsProvider } from '@/components/ui/templates/providers/alerts/AlertsProvider';
import { AlertCenter } from '@/components/ui/templates/alerts/AlertCenter';
import { IAlert } from '@/types/alert-types';
import { ChatAlertsTab } from './chat/ChatAlertsTab';


/**
 * AlertCenterHub - Componente central que coordena os sistemas de alertas
 * 
 * Este componente serve como hub central para diferentes interfaces 
 * de alertas, permitindo que o usuário escolha entre a visão de chat 
 * e a visualização de centro de alertas.
 */
interface AlertCenterHubProps {
  hospitalId?: string;
  initialView?: 'chat' | 'center';
  onSendMessage?: (message: string) => void;
  floatingButton?: boolean;
  position?: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

export const AlertCenterHub: React.FC<AlertCenterHubProps> = ({
  hospitalId,
  initialView = 'chat',
  onSendMessage,
  floatingButton = true,
  position = 'bottom-right'
}) => {
  const [currentView, setCurrentView] = useState<'chat' | 'center'>(initialView);
  const [selectedAlert, setSelectedAlert] = useState<IAlert | null>(null);

  // Função para lidar com a seleção de alertas em qualquer componente
  const handleAlertSelect = (alert: IAlert) => {
    setSelectedAlert(alert);
    
    // Se estiver na visualização do centro, mudar para a visão de chat
    if (currentView === 'center') {
      setCurrentView('chat');
    }
  };

  // Função para enviar mensagens relacionadas a alertas
  const handleSendAlertMessage = (message: string) => {
    if (onSendMessage) {
      onSendMessage(message);
    }
  };

  return (
    <AlertsProvider hospitalId={hospitalId}>
      <div className="alert-hub-container">
        {/* Abas para alternar entre visualizações */}
        {!floatingButton && (
          <div className="mb-4 flex justify-center">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => setCurrentView('chat')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  currentView === 'chat'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } border border-gray-200 dark:border-gray-700`}
              >
                Chat e Alertas
              </button>
              <button
                onClick={() => setCurrentView('center')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  currentView === 'center'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                } border border-l-0 border-gray-200 dark:border-gray-700`}
              >
                Centro de Alertas
              </button>
            </div>
          </div>
        )}

        {/* Componente principal baseado na visualização atual */}
        {currentView === 'chat' ? (
          <ChatAlertsTab
            initialHospital={hospitalId}
            onSendMessage={handleSendAlertMessage}
          />
        ) : (
          <div className="hidden"> {/* Escondido quando não na visualização de chat */}
            <ChatAlertsTab
              initialHospital={hospitalId}
              onSendMessage={handleSendAlertMessage}
            />
          </div>
        )}

        {/* O centro de alertas sempre está presente, mas como botão flutuante quando não é a visualização principal */}
        <AlertCenter
          hospitalId={hospitalId}
          onSendMessage={handleSendAlertMessage}
          position={position}
          showFloatingButton={floatingButton || currentView !== 'center'}
        />
      </div>
    </AlertsProvider>
  );
};