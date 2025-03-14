/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  Sparkles, 
  Ambulance, 
  Layers, 
  Bell,
  Users,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { AlertsProvider } from './providers/alerts/AlertsProvider';
import { AlertsBadge, AlertsChatManager } from './chat/integration-hub/integrations-notifications/AlertsChatManager';
import { ChatButton } from './chat/ChatButton';
import { ResourceMonitor } from './chat/integration-hub/real-time-monitoring/ResourceMonitor';
import { AmbulanceLiveTracker } from './chat/integration-hub/real-time-monitoring/AmbulanceLiveTracker';

// Importar componentes do sistema de chat

// Interface para o hub de comunicação
interface HospitalChatHubProps {
  hospitalId: string;
  userId: string;
  userRole: string;
  containerClassName?: string;
}

/**
 * Hub de comunicação hospitalar integrado
 * 
 * Este componente integra todos os sistemas de comunicação em uma única interface:
 * - Chat entre profissionais de saúde
 * - Alertas de ambulâncias, recursos e emergências
 * - Monitoramento de recursos hospitalares em tempo real
 * - Rastreamento de ambulâncias
 */
export const HospitalChatHub: React.FC<HospitalChatHubProps> = ({
  hospitalId,
  userId,
  userRole,
  containerClassName = ''
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [showSidePanels, setShowSidePanels] = useState(false);
  const [activeSidePanel, setActiveSidePanel] = useState<'ambulance' | 'resources' | 'none'>('none');
  
  // Função para abrir o chat com um ID específico
  const openChatWithId = (chatId: string) => {
    setIsModalOpen(true);
    setSelectedChatId(chatId);
  };
  
  // Função para criar um novo chat
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
    
    // Simular a abertura do chat recém-criado
    setTimeout(() => {
      openChatWithId(chatId);
    }, 300);
    
    return chatId;
  };
  
  // Alternar os painéis laterais ao abrir o modal de chat
  useEffect(() => {
    if (isModalOpen) {
      setShowSidePanels(true);
    } else {
      // Resetar painel ao fechar o chat
      setActiveSidePanel('none');
    }
  }, [isModalOpen]);
  
  // Função para alternar entre os painéis laterais
  const toggleSidePanel = (panel: 'ambulance' | 'resources') => {
    if (activeSidePanel === panel) {
      setActiveSidePanel('none');
    } else {
      setActiveSidePanel(panel);
    }
  };
  
  return (
    <AlertsProvider hospitalId={hospitalId} checkInterval={30000}>
      <div className={containerClassName}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Sistema de Comunicação Hospitalar
          </h2>
          
          <div className="flex items-center space-x-2">
            {/* Badge/indicador de alertas */}
            <AlertsBadge 
              onClick={() => setIsModalOpen(true)} 
              className="mr-2"
            />
            
            {/* Botão principal do chat */}
            <ChatButton />
          </div>
        </div>
        
        {/* Modal principal do chat */}
        <div className={`
          fixed inset-0 z-50 overflow-hidden bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm
          transition-opacity duration-300
          ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}>
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden flex">
              
              {/* Painel lateral esquerdo para recursos (condicional) */}
              <div className={`
                relative w-96 flex-shrink-0 transform transition-transform duration-300 ease-in-out
                ${activeSidePanel === 'resources' ? 'translate-x-0' : '-translate-x-full'}
                ${showSidePanels ? 'block' : 'hidden'}
              `}>
                <div className="absolute inset-0 overflow-y-auto">
                  <div className="h-full bg-white dark:bg-gray-900 shadow-xl">
                    {/* Cabeçalho do painel */}
                    <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <Layers className="mr-2 h-5 w-5 text-amber-600 dark:text-amber-400" />
                        Monitoramento de Recursos
                      </h3>
                      <button 
                        onClick={() => setActiveSidePanel('none')}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {/* Conteúdo do painel */}
                    <div className="p-4">
                      <ResourceMonitor 
                        hospitalId={hospitalId} 
                        onStartChat={(resourceType, departmentId) => {
                          // Lógica para iniciar chat sobre recurso
                          const chatId = createNewChat(
                            `Recurso: ${resourceType} (${departmentId})`,
                            `Discussão sobre o recurso ${resourceType} no departamento ${departmentId}.`,
                            [`${departmentId}-team`, 'resource-management', userId]
                          );
                          setSelectedChatId(chatId);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Painel principal do chat */}
              <div className="w-full h-full flex justify-center items-center p-4">
                <div className={`
                  w-full max-w-7xl h-[85vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden
                  transform transition-transform duration-300
                  ${activeSidePanel !== 'none' ? 'scale-95' : 'scale-100'}
                `}>
                  {/* Cabeçalho do chat */}
                  <div className="py-4 px-6 border-b dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white">
                    <div className="flex items-center">
                      <MessageCircle className="mr-2 h-6 w-6" />
                      <h2 className="text-xl font-semibold">H24 Chat</h2>
                    </div>
                    
                    <div className="flex items-center">
                      {/* Botões para alternar painéis laterais */}
                      <button 
                        className="p-2 mr-2 rounded-full text-white hover:bg-white/10"
                        onClick={() => toggleSidePanel('resources')}
                        title="Monitoramento de recursos"
                      >
                        <Layers className="h-5 w-5" />
                      </button>
                      
                      <button 
                        className="p-2 mr-2 rounded-full text-white hover:bg-white/10"
                        onClick={() => toggleSidePanel('ambulance')}
                        title="Rastreamento de ambulâncias"
                      >
                        <Ambulance className="h-5 w-5" />
                      </button>
                      
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="p-1 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        aria-label="Fechar"
                      >
                        <Settings className="h-5 w-5 mr-2" />
                      </button>
                      
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="p-1 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
                        aria-label="Fechar"
                      >
                        <ChevronRight className="h-6 w-6" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Corpo do chat */}
                  <div className="flex-1 flex overflow-hidden">
                    {/* Implementação do chat aqui */}
                    
                    {/* Integramos o AlertsChatManager para gerenciar alertas dentro do chat */}
                    <AlertsChatManager
                      hospitalId={hospitalId}
                      currentUserId={userId}
                      onOpenChat={openChatWithId}
                      onCreateChat={createNewChat}
                      showAlertBanner={true}
                      showNotifications={true}
                    />
                    
                    {/* Renderizar o conteúdo do chat aqui */}
                    <div className="flex-1 flex flex-col">
                      {/* Os componentes internos do chat seriam renderizados aqui */}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Painel lateral direito para ambulâncias (condicional) */}
              <div className={`
                relative w-96 flex-shrink-0 transform transition-transform duration-300 ease-in-out
                ${activeSidePanel === 'ambulance' ? 'translate-x-0' : 'translate-x-full'}
                ${showSidePanels ? 'block' : 'hidden'}
              `}>
                <div className="absolute inset-0 overflow-y-auto">
                  <div className="h-full bg-white dark:bg-gray-900 shadow-xl">
                    {/* Cabeçalho do painel */}
                    <div className="p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 dark:text-gray-100 flex items-center">
                        <Ambulance className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        Rastreamento de Ambulâncias
                      </h3>
                      <button 
                        onClick={() => setActiveSidePanel('none')}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {/* Conteúdo do painel */}
                    <div className="p-4">
                      <AmbulanceLiveTracker 
                        hospitalId={hospitalId}
                        onStartChat={(routeId, patientId) => {
                          // Lógica para iniciar chat sobre ambulância
                          const chatId = createNewChat(
                            `Ambulância: Rota ${routeId}`,
                            `Monitoramento da ambulância em rota ${routeId}${patientId ? ` com paciente ID ${patientId}` : ''}.`,
                            ['emergency-team', 'ambulance-control', userId]
                          );
                          setSelectedChatId(chatId);
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AlertsProvider>
  );
};