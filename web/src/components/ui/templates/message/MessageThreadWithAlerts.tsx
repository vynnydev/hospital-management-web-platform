/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { 
  AlertCircle,
  AlertTriangle, 
  Ambulance, 
  Bed, 
  Bell, 
  Bot, 
  CheckCircle, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  Cpu, 
  Heart, 
  Info, 
  Paperclip, 
  Server, 
  Settings, 
  Sparkles, 
  User, 
  UserCog, 
  Users,
  XCircle
} from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/organisms/scroll-area';
import { Button } from '@/components/ui/organisms/button';
import type { IMessage, IAttachment } from '@/types/app-types';
import type { IAppUser } from '@/types/auth-types';
import { useAlertsProvider } from '../providers/alerts/AlertsProvider';
import { IAlert, TAlertType } from '@/types/alert-types';

interface MessageThreadWithAlertsProps {
  messages: IMessage[];
  currentUser: IAppUser;
  hospitalId?: string;
  showAlerts?: boolean;
  onReplyToAlert?: (alert: IAlert) => void;
  onTakeAction?: (alert: IAlert, action: string) => void;
  className?: string;
}

// Tipo estendido para mensagens que podem incluir alertas
interface IExtendedMessage extends IMessage {
  isAlert?: boolean;
  alertData?: IAlert;
  isEmergency?: boolean;
}

export const MessageThreadWithAlerts: React.FC<MessageThreadWithAlertsProps> = ({ 
  messages, 
  currentUser, 
  hospitalId,
  showAlerts = true,
  onReplyToAlert,
  onTakeAction,
  className = ''
}) => {
  // Estado local para gerenciar mensagens com alertas integrados
  const [extendedMessages, setExtendedMessages] = useState<IExtendedMessage[]>([]);
  
  // Ref para rolar para a última mensagem
  const messageEndRef = useRef<HTMLDivElement>(null);
  
  // Obter alertas do contexto
  const { alerts, markAsRead, updateAlertStatus } = useAlertsProvider();
  
  // Ícones por tipo de alerta
  const alertIcons: Record<TAlertType, React.FC<any>> = {
    'ambulance': Ambulance,
    'patient-arrival': Users,
    'resource': Bell,
    'emergency': AlertTriangle,
    'occupancy': Bed,
    'staff': UserCog,
    'operational': Settings,
    'equipment': Cpu,
    'warning': AlertCircle,
    'info': Info,
    'success': CheckCircle,
    'error': XCircle,
    'system': Server
  };

  // Cores por tipo de alerta
  const alertColors: Record<TAlertType, string> = {
    'ambulance': 'from-blue-600 to-blue-700',
    'patient-arrival': 'from-green-600 to-green-700',
    'resource': 'from-amber-600 to-amber-700',
    'emergency': 'from-red-600 to-red-700',
    'occupancy': 'from-purple-600 to-purple-700',
    'staff': 'from-indigo-600 to-indigo-700',
    'operational': 'from-teal-600 to-teal-700',
    'equipment': 'from-cyan-600 to-cyan-700',
    'warning': 'from-yellow-600 to-yellow-700',
    'info': 'from-sky-600 to-sky-700',
    'success': 'from-emerald-600 to-emerald-700',
    'error': 'from-rose-600 to-rose-700',
    'system': 'from-gray-600 to-gray-700'
  };

  // Cores para o modo escuro
  const darkAlertColors: Record<TAlertType, string> = {
    'ambulance': 'dark:from-blue-700 dark:to-blue-800',
    'patient-arrival': 'dark:from-green-700 dark:to-green-800',
    'resource': 'dark:from-amber-700 dark:to-amber-800',
    'emergency': 'dark:from-red-700 dark:to-red-800',
    'occupancy': 'dark:from-purple-700 dark:to-purple-800',
    'staff': 'dark:from-indigo-700 dark:to-indigo-800',
    'operational': 'dark:from-teal-700 dark:to-teal-800',
    'equipment': 'dark:from-cyan-700 dark:to-cyan-800',
    'warning': 'dark:from-yellow-700 dark:to-yellow-800',
    'info': 'dark:from-sky-700 dark:to-sky-800',
    'success': 'dark:from-emerald-700 dark:to-emerald-800',
    'error': 'dark:from-rose-700 dark:to-rose-800',
    'system': 'dark:from-gray-700 dark:to-gray-800'
  };
  
  // Integrar alertas às mensagens de chat
  useEffect(() => {
    if (!showAlerts) {
      // Converte as mensagens normais para o tipo estendido
      setExtendedMessages(messages.map(msg => ({ ...msg, isAlert: false })));
      return;
    }
    
    // Clonar as mensagens originais
    let newMessages: IExtendedMessage[] = messages.map(msg => ({ ...msg, isAlert: false }));
    
    // Adicionar alertas não lidos como mensagens especiais
    if (alerts && alerts.length > 0) {
      const alertMessages = alerts
        .filter(alert => 
          !alert.read && 
          (alert.status === 'pending' || alert.status === 'acknowledged') &&
          (hospitalId ? alert.hospitalId === hospitalId : true)
        )
        .map(alert => {
          // Determinar o remetente com base no tipo de alerta
          let sender: IAppUser = {
            id: 'system-alerts',
            name: 'Sistema de Alertas',
            role: 'system',
            permissions: []
          };
          
          // Para alertas de ambulância, personalizar o remetente
          if (alert.type === 'ambulance') {
            sender = {
              id: 'ambulance-system',
              name: 'Central de Ambulâncias',
              role: 'system',
              permissions: []
            };
          }
          
          // Para alertas de emergência, usar um nome mais urgente
          if (alert.priority === 'high') {
            sender = {
              id: 'emergency-system',
              name: 'Alerta de Emergência',
              role: 'system',
              permissions: []
            };
          }
          
          // Criar uma "mensagem" a partir do alerta
          const alertMessage: IExtendedMessage = {
            id: `alert-${alert.id}`,
            content: alert.message,
            user: sender,
            timestamp: new Date(alert.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            }),
            createdAt: alert.timestamp.toString(),
            isAlert: true,
            alertData: alert,
            isEmergency: alert.priority === 'high'
          };
          
          return alertMessage;
        });
      
      // Intercalar alertas com mensagens, ordenando por data
      newMessages = [...newMessages, ...alertMessages].sort((a, b) => {
        const dateA = a.isAlert && a.alertData
          ? new Date(a.alertData.timestamp).getTime() 
          : new Date(a.createdAt || a.timestamp).getTime();
          
        const dateB = b.isAlert && b.alertData
          ? new Date(b.alertData.timestamp).getTime() 
          : new Date(b.createdAt || b.timestamp).getTime();
          
        return dateA - dateB;
      });
    }
    
    setExtendedMessages(newMessages);
  }, [messages, alerts, showAlerts, hospitalId]);
  
  // Rolar para a última mensagem quando novas mensagens forem adicionadas
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [extendedMessages]);
  
  // Manipular a interação com um alerta
  const handleAlertClick = (alert: IAlert) => {
    // Marcar o alerta como lido
    markAsRead(alert.id);
    
    // Chamar o callback se fornecido
    if (onReplyToAlert) {
      onReplyToAlert(alert);
    }
  };
  
  // Manipular a ação em um alerta
  const handleTakeAction = (e: React.MouseEvent, alert: IAlert, action: string) => {
    e.stopPropagation();
    
    // Atualizar status do alerta
    updateAlertStatus(alert.id, 'acknowledged');
    
    // Chamar o callback se fornecido
    if (onTakeAction) {
      onTakeAction(alert, action);
    }
  };
  
  // Formatar data para exibição em grupos
  const formatMessageDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
  };
  
  // Agrupar mensagens por data
  const messageGroups = extendedMessages.reduce((groups, message) => {
    const date = message.isAlert 
      ? formatMessageDate(message.alertData!.timestamp.toString())
      : formatMessageDate(message.createdAt || message.timestamp);
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(message);
    return groups;
  }, {} as Record<string, IExtendedMessage[]>);
  
  // Renderizar uma mensagem normal ou de alerta
  const renderMessage = (msg: IExtendedMessage) => {
    const isCurrentUser = msg.user.id === currentUser.id;
    const isAlert = Boolean(msg.isAlert);
    const isEmergency = Boolean(msg.isEmergency);
    const isAI = msg.user.role === 'ai';
    
    // Determinar a classe de cor para mensagens
    let bgColorClass = isCurrentUser 
      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white dark:from-blue-700 dark:to-blue-800' 
      : isAI 
        ? 'bg-gradient-to-r from-indigo-600 to-purple-700 text-white dark:from-indigo-700 dark:to-purple-800'
        : 'bg-gray-100 dark:bg-gray-700 dark:text-gray-100';
    
    // Para alertas, usar cores específicas por tipo
    if (isAlert && msg.alertData) {
      const alertType = msg.alertData.type;
      bgColorClass = `bg-gradient-to-r ${alertColors[alertType]} ${darkAlertColors[alertType]} text-white`;
      
      // Para emergências, adicionar pulsação sutil
      if (isEmergency) {
        bgColorClass += ' animate-pulse';
      }
    }
    
    // Determinar o ícone para alertas ou IA
    let IconComponent = null;
    
    if (isAlert && msg.alertData) {
      const AlertIconComponent = alertIcons[msg.alertData.type];
      IconComponent = <AlertIconComponent className="w-5 h-5 mr-2 flex-shrink-0" />;
    } else if (isAI) {
      IconComponent = <Sparkles className="w-5 h-5 mr-2 flex-shrink-0" />;
    }
    
    return (
      <div
        key={msg.id}
        className={`flex gap-4 ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-6`}
      >
        {!isCurrentUser && (
          <div className="flex-shrink-0">
            {isAlert ? (
              <div className={`w-10 h-10 rounded-full flex items-center justify-center
                ${msg.alertData?.type === 'emergency' 
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : msg.alertData?.type === 'ambulance'
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                    : msg.alertData?.type === 'patient-arrival'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                }`}
              >
                {IconComponent}
              </div>
            ) : isAI ? (
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-5 h-5" />
              </div>
            ) : (
              <Image
                src={msg.user.profileImage || '/images/default-avatar.png'}
                alt={msg.user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </div>
        )}
        
        <div className={`max-w-[75%] ${bgColorClass} rounded-xl p-4 shadow-sm`}>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              {(isAlert || isAI) && IconComponent}
              <span className="font-medium text-sm">{msg.user.name}</span>
              {isAlert && msg.alertData?.priority === 'high' && (
                <span className="ml-2 px-1.5 py-0.5 bg-white/20 rounded-full text-xs font-medium">
                  Urgente
                </span>
              )}
            </div>
            <span className="text-xs opacity-70 ml-2">{msg.timestamp}</span>
          </div>
          
          <p className="text-sm">{msg.content}</p>
          
          {/* Mostrar anexos para mensagens normais */}
          {!isAlert && msg.attachments && msg.attachments.length > 0 && (
            <div className="mt-3 space-y-2">
              {msg.attachments.map((attachment: IAttachment, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-white/10 rounded-lg p-2 text-sm"
                >
                  <Paperclip className="w-4 h-4" />
                  <span className="truncate">{attachment.name}</span>
                </div>
              ))}
            </div>
          )}
          
          {/* Interface especial para alertas */}
          {isAlert && msg.alertData && (
            <div className="mt-3 pt-2 border-t border-white/20 space-y-2">
              {/* Detalhes específicos por tipo de alerta */}
              {msg.alertData.type === 'ambulance' && msg.alertData.metadata?.estimatedArrival && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>ETA: {new Date(msg.alertData.metadata.estimatedArrival).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
              
              {/* Botões de ação para o alerta */}
              <div className="flex flex-wrap gap-2 mt-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 text-white text-xs py-1 h-auto"
                  onClick={() => handleAlertClick(msg.alertData!)}
                >
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Confirmar
                </Button>
                
                {msg.alertData.type === 'ambulance' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white text-xs py-1 h-auto"
                    onClick={(e) => handleTakeAction(e, msg.alertData!, 'preparar-recepção')}
                  >
                    <Users className="w-3 h-3 mr-1" />
                    Preparar recepção
                  </Button>
                )}
                
                {msg.alertData.type === 'emergency' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white text-xs py-1 h-auto"
                    onClick={(e) => handleTakeAction(e, msg.alertData!, 'protocolo-emergência')}
                  >
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Iniciar protocolo
                  </Button>
                )}
                
                {msg.alertData.type === 'resource' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white text-xs py-1 h-auto"
                    onClick={(e) => handleTakeAction(e, msg.alertData!, 'solicitar-recursos')}
                  >
                    <Bell className="w-3 h-3 mr-1" />
                    Solicitar recursos
                  </Button>
                )}
                
                <Button
                  variant="link"
                  size="sm"
                  className="text-white/90 hover:text-white text-xs p-0 h-auto"
                  onClick={(e) => handleTakeAction(e, msg.alertData!, 'detalhes')}
                >
                  Detalhes
                  <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </div>
          )}
          
          {/* Interface especial para mensagens de IA */}
          {isAI && (
            <div className="mt-3 pt-2 border-t border-white/20">
              <div className="flex items-center gap-2 text-sm">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white/90 text-xs">
                  Assistente IA
                </span>
                <span className="text-white/80 text-xs">
                  Confiança: 92%
                </span>
              </div>
            </div>
          )}
        </div>
        
        {isCurrentUser && (
          <div className="flex-shrink-0">
            <Image
              src={currentUser.profileImage || '/images/default-avatar.png'}
              alt={currentUser.name}
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        )}
      </div>
    );
  };

  // Função para renderizar um alerta de sistema no topo
  const renderSystemAlert = () => {
    // Verificar se há alertas de emergência não lidos
    const emergencyAlerts = alerts.filter(alert => 
      alert.type === 'emergency' && 
      alert.priority === 'high' && 
      !alert.read &&
      (alert.status === 'pending' || alert.status === 'acknowledged') &&
      (hospitalId ? alert.hospitalId === hospitalId : true)
    );
    
    if (emergencyAlerts.length > 0) {
      const firstAlert = emergencyAlerts[0];
      
      return (
        <div className="mb-4 p-4 bg-gradient-to-r from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 text-white rounded-xl shadow-sm animate-pulse">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-medium text-lg">{firstAlert.title}</h3>
              <p className="text-sm text-white/90">Alerta de emergência de alta prioridade</p>
            </div>
          </div>
          
          <p className="mb-3 text-sm">{firstAlert.message}</p>
          
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white text-xs"
              onClick={() => handleTakeAction({ stopPropagation: () => {} } as React.MouseEvent, firstAlert, 'protocolo-emergência')}
            >
              <AlertTriangle className="w-3 h-3 mr-1" />
              Iniciar protocolo de emergência
            </Button>
            
            <Button
              variant="secondary"
              size="sm"
              className="bg-white/20 hover:bg-white/30 text-white text-xs"
              onClick={() => handleAlertClick(firstAlert)}
            >
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Confirmar visualização
            </Button>
          </div>
        </div>
      );
    }
    
    // Se não houver alerta crítico, não mostrar nada
    return null;
  };
  
  return (
    <ScrollArea className={`h-96 bg-white dark:bg-gray-800 rounded-xl shadow-sm ${className}`}>
      <div className="space-y-2 p-4">
        {/* Alerta de sistema no topo, se houver */}
        {renderSystemAlert()}
        
        {/* Mensagens agrupadas por data */}
        {Object.entries(messageGroups).map(([date, msgs]) => (
          <div key={date} className="mb-8">
            {/* Cabeçalho da data */}
            <div className="flex justify-center mb-6">
              <div className="px-4 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300 font-medium">
                {date}
              </div>
            </div>
            
            {/* Mensagens do dia */}
            <div className="space-y-6">
              {msgs.map(renderMessage)}
            </div>
          </div>
        ))}
        
        {/* Espaço em branco no final para garantir rolagem adequada */}
        <div className="h-4" ref={messageEndRef}></div>
      </div>
    </ScrollArea>
  );
};