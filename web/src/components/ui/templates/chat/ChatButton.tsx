/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Bell, Ambulance, Layers, Clock, Sparkles } from 'lucide-react';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { useStaffData } from '@/hooks/staffs/useStaffData';
import { useAmbulanceData } from '@/hooks/ambulance/useAmbulanceData';
import { useAlertsProvider } from '../providers/alerts/AlertsProvider';
import { IChatContact, IMessage } from '@/types/chat-types';

import { ChatModal } from './ChatModal';
import { ChatSidebar } from './ChatSidebar';
import { MessageArea } from './MessageArea';
import { MessageInput } from './MessageInput';
import { AiPanel } from './AiPanel';
import { EmptyState } from './EmptyState';
import { ContactAvatar } from './ContactAvatar';
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
  const [activePanel, setActivePanel] = useState<'chat' | 'alerts' | 'ambulances' | 'resources'>('chat');
  
  // Estados para o chat
  const [contacts, setContacts] = useState<IChatContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<IChatContact | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'individual' | 'groups'>('individual');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAiPanel, setShowAiPanel] = useState(false);
  
  const messageEndRef = useRef<HTMLDivElement>(null);
  const { networkData } = useNetworkData();
  const { staffData } = useStaffData(networkData?.hospitals[0]?.id || '');
  const { unreadCount } = useAlertsProvider();
  
  const selectedHospitalId = networkData?.hospitals[0]?.id || 'RD4H-SP-ITAIM';

  // Carregar contatos quando os dados estiverem disponíveis
  useEffect(() => {
    if (networkData && staffData) {
      // Simulação de dados de contatos
      const mockContacts: IChatContact[] = [
        {
          id: '1',
          name: 'Dra. Ana Santos',
          role: 'médico',
          avatar: '',
          lastMessage: 'Os resultados do ECG do paciente João chegaram',
          lastMessageTime: new Date(Date.now() - 15 * 60000),
          unreadCount: 3,
          online: true
        },
        {
          id: '2',
          name: 'Enf. Carlos Oliveira',
          role: 'enfermeiro',
          avatar: '',
          lastMessage: 'Medicação administrada conforme prescrito',
          lastMessageTime: new Date(Date.now() - 45 * 60000),
          unreadCount: 0,
          online: true
        },
        {
          id: '3',
          name: 'Dr. Ricardo Ortiz',
          role: 'médico',
          avatar: '',
          lastMessage: 'Precisamos avaliar o paciente do leito 201',
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60000),
          unreadCount: 1,
          online: false
        },
        {
          id: 'g1',
          name: 'Equipe UTI Manhã',
          role: 'médico',
          avatar: '',
          lastMessage: 'Round às 8h na UTI',
          lastMessageTime: new Date(Date.now() - 1 * 60 * 60000),
          unreadCount: 5,
          online: true,
          isGroup: true,
          members: [
            {id: '1', name: 'Dra. Ana Santos'},
            {id: '3', name: 'Dr. Ricardo Ortiz'},
            {id: '4', name: 'Enf. Maria Silva'}
          ]
        },
        {
          id: 'ai',
          name: 'Assistente Cognitiva',
          role: 'ai',
          avatar: '',
          lastMessage: 'Como posso ajudar hoje?',
          lastMessageTime: new Date(),
          unreadCount: 0,
          online: true
        }
      ];
      
      setContacts(mockContacts);
    }
  }, [networkData, staffData]);

  // Função para abrir o chat com um ID específico
  const openChatWithId = (chatId: string) => {
    setSelectedChatId(chatId);
    setActivePanel('chat');
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

  // Carregar mensagens quando um contato for selecionado
  useEffect(() => {
    if (selectedContact) {
      setIsLoading(true);
      
      // Simular atraso de rede
      setTimeout(() => {
        const mockMessages: IMessage[] = [
          {
            id: '1',
            content: `Olá! Em que posso ajudar?`,
            sender: {
              id: selectedContact.id,
              name: selectedContact.name,
              role: selectedContact.role
            },
            timestamp: new Date(Date.now() - 30 * 60000),
            type: 'text',
            isRead: true
          },
          {
            id: '2',
            content: `Gostaria de discutir sobre o paciente João Silva do leito UTI-101. Ele apresentou elevação nos níveis de pressão arterial.`,
            sender: {
              id: 'current-user',
              name: 'Você',
              role: 'médico'
            },
            timestamp: new Date(Date.now() - 25 * 60000),
            type: 'text',
            isRead: true
          }
        ];
        
        // Mensagens específicas para assistente IA
        if (selectedContact.id === 'ai') {
          mockMessages.push({
            id: '3',
            content: `Analisei os dados vitais do paciente João Silva. Os registros indicam uma pressão arterial de 150/90, frequência cardíaca de 88bpm e saturação de 95%. Baseado no histórico médico, sugiro monitoramento contínuo e avaliação da medicação anti-hipertensiva.`,
            sender: {
              id: 'ai',
              name: 'Assistente Cognitiva',
              role: 'ai'
            },
            timestamp: new Date(Date.now() - 24 * 60000),
            type: 'ai-suggestion',
            isRead: true,
            metadata: {
              patientId: 'P001',
              aiConfidence: 0.92,
              suggestion: 'Avaliar ajuste de medicação anti-hipertensiva'
            }
          });
        } else {
          mockMessages.push({
            id: '3',
            content: `Vou revisar o prontuário dele agora. Você já falou com o Dr. Carlos sobre ajustar a medicação?`,
            sender: {
              id: selectedContact.id,
              name: selectedContact.name,
              role: selectedContact.role
            },
            timestamp: new Date(Date.now() - 20 * 60000),
            type: 'text',
            isRead: true
          });
        }
        
        setMessages(mockMessages);
        setIsLoading(false);
        
        // Marcar mensagens como lidas
        setContacts(prevContacts => 
          prevContacts.map(contact => 
            contact.id === selectedContact.id 
              ? {...contact, unreadCount: 0} 
              : contact
          )
        );
      }, 800);
    }
  }, [selectedContact]);

  // Formatadores de data/hora para o chat
  const formatters = {
    formatTime: (date: Date) => {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    formatDate: (date: Date) => {
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Hoje';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Ontem';
      } else {
        return date.toLocaleDateString();
      }
    }
  };

  // Função para enviar mensagem
  const sendMessage = (text: string) => {
    if (!text.trim() || !selectedContact) return;
    
    // Criar nova mensagem
    const newMessage: IMessage = {
      id: Date.now().toString(),
      content: text,
      sender: {
        id: 'current-user',
        name: 'Você',
        role: 'médico'
      },
      timestamp: new Date(),
      type: 'text',
      isRead: false
    };
    
    // Adicionar à lista de mensagens
    setMessages(prev => [...prev, newMessage]);
    setMessageInput('');
    
    // Simular resposta automática para o assistente de IA
    if (selectedContact.id === 'ai') {
      setIsTyping(true);
      
      // Simular tempo de resposta
      setTimeout(() => {
        setIsTyping(false);
        
        // Criar resposta da IA
        const aiResponse: IMessage = {
          id: Date.now().toString(),
          content: `Baseado nas informações fornecidas, recomendo verificar os sinais vitais recentes e o histórico de medicação do paciente. Se necessário, considere consultar o protocolo institucional para manejo de hipertensão em pacientes pós-cirúrgicos cardíacos.`,
          sender: {
            id: 'ai',
            name: 'Assistente Cognitiva',
            role: 'ai'
          },
          timestamp: new Date(),
          type: 'ai-suggestion',
          isRead: true,
          metadata: {
            aiConfidence: 0.88,
            suggestion: 'Verificar sinais vitais e histórico de medicação'
          }
        };
        
        setMessages(prev => [...prev, aiResponse]);
        
        // Gerar sugestões da IA após resposta
        setAiSuggestion("Gostaria de ver o histórico de medicação do paciente João Silva?");
      }, 1500);
    }
  };

  // Rolar para a última mensagem
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-full shadow-md transition-all duration-300 hover:shadow-lg dark:from-blue-800 dark:to-indigo-900 dark:hover:from-blue-900 dark:hover:to-indigo-950"
        >
          <MessageCircle className="h-5 w-5" />
          <span>Chat Cognitiva</span>
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
        <div className="flex w-full h-full">
          {/* Barra lateral de controle para os painéis */}
          <div className="w-12 bg-gray-100 dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col items-center py-4 space-y-6">
            <button 
              className={`p-2 rounded-full ${activePanel === 'chat' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setActivePanel('chat')}
              title="Chat"
            >
              <MessageCircle className="h-5 w-5" />
            </button>
            
            <button 
              className={`p-2 rounded-full ${activePanel === 'ambulances' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setActivePanel('ambulances')}
              title="Ambulâncias"
            >
              <Ambulance className="h-5 w-5" />
            </button>
            
            <button 
              className={`p-2 rounded-full ${activePanel === 'resources' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              onClick={() => setActivePanel('resources')}
              title="Recursos"
            >
              <Layers className="h-5 w-5" />
            </button>
          </div>
          
          {/* Conteúdo principal */}
          <div className="flex-1 flex overflow-hidden">
            {/* Renderização condicional com base no painel ativo */}
            {activePanel === 'chat' && (
              // Interface padrão do chat
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar com lista de contatos */}
                <ChatSidebar 
                  contacts={contacts}
                  selectedContact={selectedContact}
                  setSelectedContact={setSelectedContact}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  formatTime={formatters.formatTime}
                />
                
                {/* Área principal de chat */}
                <div className="flex-1 flex flex-col">
                  {selectedContact ? (
                    <>
                      {/* Cabeçalho do contato/conversa */}
                      <div className="py-3 px-6 border-b dark:border-gray-700 flex items-center justify-between bg-white dark:bg-gray-800">
                        <div className="flex items-center">
                          <ContactAvatar contact={selectedContact} size="md" />
                          
                          <div className="ml-3">
                            <h3 className="font-medium text-gray-900 dark:text-gray-100">{selectedContact.name}</h3>
                            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                              {selectedContact.online ? (
                                <>
                                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                                  Online
                                </>
                              ) : (
                                <>
                                  <Clock className="h-3 w-3 mr-1" />
                                  Visto por último: {formatters.formatTime(selectedContact.lastMessageTime || new Date())}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
                            onClick={() => setShowAiPanel(!showAiPanel)}
                            aria-label="Assistente IA"
                          >
                            <Sparkles className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Área de mensagens */}
                      <MessageArea
                        messages={messages}
                        isLoading={isLoading}
                        isTyping={isTyping}
                        formatTime={formatters.formatTime}
                        formatDate={formatters.formatDate}
                        messageEndRef={messageEndRef}
                      />
                      
                      {/* Campo de entrada de mensagem */}
                      <MessageInput
                        messageInput={messageInput}
                        setMessageInput={setMessageInput}
                        sendMessage={sendMessage}
                        placeholder={`Mensagem para ${selectedContact.name}...`}
                        aiSuggestion={aiSuggestion}
                        setAiSuggestion={setAiSuggestion}
                      />
                    </>
                  ) : (
                    <EmptyState />
                  )}
                </div>
                
                {/* Painel de IA (condicional) */}
                {showAiPanel && selectedContact && (
                  <AiPanel />
                )}
              </div>
            )}
            
            {/* Painel de Ambulâncias */}
            {activePanel === 'ambulances' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Rastreamento de Ambulâncias</h3>
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
            
            {/* Painel de Recursos */}
            {activePanel === 'resources' && (
              <div className="flex-1 p-4 overflow-y-auto">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Monitor de Recursos</h3>
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
        </div>
      </ChatModal>
    </>
  );
};