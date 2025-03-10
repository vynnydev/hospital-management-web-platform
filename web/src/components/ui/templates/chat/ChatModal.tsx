/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Sparkles, Bell, Clock } from 'lucide-react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { IChatContact, IMessage } from '@/types/chat-types';
import { ChatSidebar } from './ChatSidebar';
import { ContactAvatar } from './ContactAvatar';
import { MessageArea } from './MessageArea';
import { MessageInput } from './MessageInput';
import { EmptyState } from './EmptyState';
import { AiPanel } from './AiPanel';

// Componentes importados

// Tipos importados


// Props para o componente ChatModal
interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitalId: string;
}

/**
 * Componente principal do chat que integra todos os outros subcomponentes
 * 
 * O ChatModal gerencia o estado global do chat, incluindo:
 * - Lista de contatos
 * - Contato selecionado
 * - Mensagens
 * - Entrada de texto
 * - Painel de IA
 */
export const ChatModal: React.FC<ChatModalProps> = ({ 
  isOpen, 
  onClose, 
  hospitalId
}) => {
  // Estados do chat
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
  
  // Referências para elementos do DOM
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Hooks de dados da aplicação
  const { networkData, currentUser } = useNetworkData();
  const { staffData } = useStaffData(hospitalId);
  const { ambulanceData } = useAmbulanceData(hospitalId);
  
  // Carregar contatos quando os dados estiverem disponíveis
  useEffect(() => {
    if (networkData && staffData) {
      // Neste exemplo, estamos usando dados mockados
      // Em um ambiente real, você extrairia esses dados dos hooks
      // Poderia ser algo como: networkData.staff.map(...)
      const mockContacts: IChatContact[] = [
        {
          id: '1',
          name: 'Dra. Ana Santos',
          role: 'médico',
          avatar: '',
          lastMessage: 'Os resultados do ECG do paciente João chegaram',
          lastMessageTime: new Date(Date.now() - 15 * 60000), // 15 minutos atrás
          unreadCount: 3,
          online: true
        },
        {
          id: '2',
          name: 'Enf. Carlos Oliveira',
          role: 'enfermeiro',
          avatar: '',
          lastMessage: 'Medicação administrada conforme prescrito',
          lastMessageTime: new Date(Date.now() - 45 * 60000), // 45 minutos atrás
          unreadCount: 0,
          online: true
        },
        {
          id: '3',
          name: 'Dr. Ricardo Ortiz',
          role: 'médico',
          avatar: '',
          lastMessage: 'Precisamos avaliar o paciente do leito 201',
          lastMessageTime: new Date(Date.now() - 2 * 60 * 60000), // 2 horas atrás
          unreadCount: 1,
          online: false
        },
        {
          id: 'g1',
          name: 'Equipe UTI Manhã',
          role: 'médico',
          avatar: '',
          lastMessage: 'Round às 8h na UTI',
          lastMessageTime: new Date(Date.now() - 1 * 60 * 60000), // 1 hora atrás
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
          name: 'Assistente H24',
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
  }, [networkData, staffData, hospitalId]);
  
  // Carregar mensagens quando um contato for selecionado
  useEffect(() => {
    if (selectedContact) {
      setIsLoading(true);
      
      // Simular atraso de rede para dar feedback visual
      setTimeout(() => {
        // Dados mockados para demonstração
        // Em um cenário real, você buscaria as mensagens da API
        const mockMessages: IMessage[] = [
          {
            id: '1',
            content: `Olá! Em que posso ajudar?`,
            sender: {
              id: selectedContact.id,
              name: selectedContact.name,
              role: selectedContact.role
            },
            timestamp: new Date(Date.now() - 30 * 60000), // 30 minutos atrás
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
            timestamp: new Date(Date.now() - 25 * 60000), // 25 minutos atrás
            type: 'text',
            isRead: true
          }
        ];
        
        // Adicionar mensagens específicas para o assistente de IA
        if (selectedContact.id === 'ai') {
          mockMessages.push({
            id: '3',
            content: `Analisei os dados vitais do paciente João Silva. Os registros indicam uma pressão arterial de 150/90, frequência cardíaca de 88bpm e saturação de 95%. Baseado no histórico médico, sugiro monitoramento contínuo e avaliação da medicação anti-hipertensiva.`,
            sender: {
              id: 'ai',
              name: 'Assistente H24',
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
        
        // Atualizar contatos para marcar mensagens como lidas
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
  
  // Função para enviar uma nova mensagem
  const sendMessage = (text: string) => {
    if (!text.trim() || !selectedContact) return;
    
    // Criar objeto de mensagem
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
            name: 'Assistente H24',
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
  
  // Filtrar contatos com base na pesquisa e aba ativa
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'individual' ? !contact.isGroup : contact.isGroup;
    return matchesSearch && matchesTab;
  });
  
  // Rolar para a última mensagem quando receber novas mensagens
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Funções de formatação para timestamps
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
  
  // Se o modal não estiver aberto, não renderizar nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-50 overflow-hidden">
      <div className="w-full max-w-7xl h-[85vh] bg-white dark:bg-gray-900 rounded-lg shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="py-4 px-6 border-b dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900 text-white">
          <div className="flex items-center">
            <MessageCircle className="mr-2 h-6 w-6" />
            <h2 className="text-xl font-semibold">H24 Chat</h2>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-full hover:bg-blue-700 dark:hover:bg-blue-800 transition-colors"
            aria-label="Fechar"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar com lista de contatos */}
          <ChatSidebar 
            contacts={filteredContacts}
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
                    
                    <button
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors ml-1"
                      aria-label="Mais opções"
                    >
                      <Bell className="h-5 w-5" />
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
      </div>
    </div>
  );
};