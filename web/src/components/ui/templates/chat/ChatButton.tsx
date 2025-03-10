/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { MessageCircle, Bell, Ambulance, Layers } from 'lucide-react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useAlerts } from './integration-hub/alerts/AlertsProvider';
import { ChatModal } from './ChatModal';
import { AlertsChatManager } from './integration-hub/integrations-notifications/AlertsChatManager';
import { AmbulanceLiveTracker } from './integration-hub/real-time-monitoring/AmbulanceLiveTracker';
import { ResourceMonitor } from './integration-hub/real-time-monitoring/ResourceMonitor';

interface ChatButtonProps {
  userId?: string;
  userRole?: string;
}

export const ChatButton: React.FC<ChatButtonProps> = ({ 
  userId = 'current-user',
  userRole = 'médico'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showAlertPanel, setShowAlertPanel] = useState(false);
  const [showAmbulancePanel, setShowAmbulancePanel] = useState(false);
  const [showResourcePanel, setShowResourcePanel] = useState(false);
  
  const { networkData } = useNetworkData();
  const { unreadCount } = useAlerts();
  
  const selectedHospitalId = networkData?.hospitals[0]?.id || 'RD4H-SP-ITAIM';

  // Função para abrir o chat com um ID específico
  const openChatWithId = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsModalOpen(true);
  };

  // Função para criar um novo chat a partir de alerta ou outros componentes
  const createNewChat = (
    title: string, 
    initialMessage: string, 
    participants: string[], 
    metadata?: Record<string, any>
  ): string => {
    // Em uma implementação real, este código enviaria uma solicitação para a API
    // para criar um novo chat e retornar o ID gerado.
    
    // Para esta demonstração, vamos apenas gerar um ID
    const chatId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Abrir o chat recém-criado
    setTimeout(() => {
      openChatWithId(chatId);
    }, 300);
    
    return chatId;
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Chat H24</span>
        </button>
        
        {/* Indicador de alertas não lidos */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </div>
      
      {/* Modal principal do chat com componentes integrados */}
      <ChatModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        hospitalId={selectedHospitalId}
      >
        {/* Adicionando os componentes de alerta dentro do modal */}
        <div className="flex w-full h-full">
          {/* Barra lateral de controle para os painéis */}
          <div className="w-12 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col items-center py-4 space-y-6">
            <button 
              className={`p-2 rounded-full ${showAlertPanel ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setShowAlertPanel(!showAlertPanel)}
              title="Painel de Alertas"
            >
              <Bell className="h-5 w-5" />
            </button>
            
            <button 
              className={`p-2 rounded-full ${showAmbulancePanel ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setShowAmbulancePanel(!showAmbulancePanel)}
              title="Rastreador de Ambulâncias"
            >
              <Ambulance className="h-5 w-5" />
            </button>
            
            <button 
              className={`p-2 rounded-full ${showResourcePanel ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setShowResourcePanel(!showResourcePanel)}
              title="Monitor de Recursos"
            >
              <Layers className="h-5 w-5" />
            </button>
          </div>
          
          {/* Conteúdo principal */}
          <div className="flex-1 flex">
            {/* Componente de Chat */}
            <div className={`${showAlertPanel || showAmbulancePanel || showResourcePanel ? 'w-2/3' : 'w-full'} transition-all`}>
              {/* Integrador de alertas com o chat */}
              <AlertsChatManager
                hospitalId={selectedHospitalId}
                currentUserId={userId}
                onOpenChat={openChatWithId}
                onCreateChat={createNewChat}
                showAlertBanner={true}
                showNotifications={true}
              />
            </div>
            
            {/* Painéis laterais opcionais */}
            {(showAlertPanel || showAmbulancePanel || showResourcePanel) && (
              <div className="w-1/3 border-l dark:border-gray-700 overflow-auto">
                {showAlertPanel && (
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Alertas</h3>
                    <AlertsChatManager
                      hospitalId={selectedHospitalId}
                      currentUserId={userId}
                      onOpenChat={openChatWithId}
                      onCreateChat={createNewChat}
                      showAlertBanner={false}
                      showNotifications={false}
                    />
                  </div>
                )}
                
                {showAmbulancePanel && (
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Ambulâncias</h3>
                    <AmbulanceLiveTracker
                      hospitalId={selectedHospitalId}
                      onStartChat={(routeId, patientId) => {
                        // Lógica para criar um chat relacionado a uma ambulância
                        const chatId = createNewChat(
                          `Ambulância - Rota ${routeId}`,
                          `Chat para acompanhamento da ambulância em trânsito. Paciente ID: ${patientId || 'Não identificado'}`,
                          ['emergency-team', userId],
                          { routeId, patientId, type: 'ambulance' }
                        );
                        return chatId;
                      }}
                    />
                  </div>
                )}
                
                {showResourcePanel && (
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recursos</h3>
                    <ResourceMonitor
                      hospitalId={selectedHospitalId}
                      onStartChat={(resourceType, departmentId) => {
                        // Lógica para criar um chat relacionado a recursos
                        const chatId = createNewChat(
                          `Recursos - ${departmentId} - ${resourceType}`,
                          `Chat para gerenciamento de recursos do tipo ${resourceType} no departamento ${departmentId}.`,
                          [`${departmentId}-team`, 'resource-management', userId],
                          { resourceType, departmentId, type: 'resource' }
                        );
                        return chatId;
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </ChatModal>
    </>
  );
};