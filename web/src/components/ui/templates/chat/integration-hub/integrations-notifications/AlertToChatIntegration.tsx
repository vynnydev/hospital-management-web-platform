/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';
import { Alert, useAlerts } from '../../../providers/alerts/AlertsProvider';


interface AlertToChatIntegrationProps {
  hospitalId: string;
  createChat: (title: string, initialMessage: string, participants: string[], metadata?: Record<string, any>) => void;
  autoCreateChatForPriority?: ('high' | 'medium' | 'low')[];
}

/**
 * Componente para integrar alertas ao sistema de chat
 * 
 * Este componente monitora alertas e cria automaticamente chats 
 * para alertas de alta prioridade ou quando solicitado explicitamente
 */
export const AlertToChatIntegration: React.FC<AlertToChatIntegrationProps> = ({
  hospitalId,
  createChat,
  autoCreateChatForPriority = ['high']
}) => {
  const { alerts, markAsRead } = useAlerts();
  
  // Monitorar alertas de alta prioridade e criar chats automaticamente
  useEffect(() => {
    const unreadHighPriorityAlerts = alerts.filter(
      alert => !alert.read && 
      autoCreateChatForPriority.includes(alert.priority) &&
      alert.actionRequired
    );
    
    if (unreadHighPriorityAlerts.length > 0) {
      unreadHighPriorityAlerts.forEach(alert => {
        createChatForAlert(alert);
        markAsRead(alert.id);
      });
    }
  }, [alerts, autoCreateChatForPriority]);
  
  // Função para criar um chat a partir de um alerta
  const createChatForAlert = (alert: Alert) => {
    // Determinar participantes com base no tipo de alerta
    const participants = getRelevantParticipantsForAlert(alert);
    
    // Criar título para o chat
    const chatTitle = getChatTitleForAlert(alert);
    
    // Criar mensagem inicial
    const initialMessage = getInitialMessageForAlert(alert);
    
    // Criar o chat
    createChat(
      chatTitle,
      initialMessage,
      participants,
      {
        alertId: alert.id,
        alertType: alert.type,
        alertPriority: alert.priority,
        ...alert.metadata
      }
    );
  };
  
  // Determinar participantes relevantes com base no tipo de alerta
  const getRelevantParticipantsForAlert = (alert: Alert): string[] => {
    // Em um sistema real, esta função usaria lógica de regras de negócio 
    // para determinar quem deve ser incluído no chat
    
    // Por exemplo, para alertas de ambulância, incluiria o médico responsável,
    // enfermeiros da emergência, etc.
    
    switch (alert.type) {
      case 'ambulance':
        return ['emergency-team', 'ambulance-control', 'reception'];
        
      case 'patient-arrival':
        const department = alert.metadata?.department || 'emergency';
        return [`${department}-team`, 'reception', 'ambulance-control'];
        
      case 'resource':
        const resourceDept = alert.metadata?.department?.toLowerCase() || '';
        return [
          `${resourceDept}-team`, 
          'resource-management',
          alert.priority === 'high' ? 'hospital-admin' : null
        ].filter(Boolean) as string[];
        
      case 'emergency':
        return ['emergency-team', 'medical-director', 'nursing-supervisor'];
        
      default:
        return ['hospital-admin'];
    }
  };
  
  // Criar título para o chat com base no tipo de alerta
  const getChatTitleForAlert = (alert: Alert): string => {
    switch (alert.type) {
      case 'ambulance':
        return `🚑 Ambulância ${alert.metadata?.ambulanceId || ''}: ${alert.title}`;
        
      case 'patient-arrival':
        return `🏥 Chegada de Paciente: ${alert.metadata?.patientId || 'Não identificado'}`;
        
      case 'resource':
        return `🔧 ${alert.metadata?.department || ''}: ${alert.metadata?.resourceName || 'Recurso'} (${alert.priority === 'high' ? 'CRÍTICO' : 'Alerta'})`;
        
      case 'emergency':
        return `⚠️ EMERGÊNCIA: ${alert.title}`;
        
      default:
        return alert.title;
    }
  };
  
  // Criar mensagem inicial para o chat com base no tipo de alerta
  const getInitialMessageForAlert = (alert: Alert): string => {
    const timestamp = alert.timestamp.toLocaleString();
    
    let message = `[Sistema] Alerta automático criado em ${timestamp}.\n\n`;
    message += `${alert.message}\n\n`;
    
    switch (alert.type) {
      case 'ambulance':
        message += `Detalhes da ambulância:\n`;
        message += `- ID: ${alert.metadata?.ambulanceId || 'N/A'}\n`;
        message += `- Paciente: ${alert.metadata?.patientId || 'Não identificado'}\n`;
        message += `- Chegada estimada: ${new Date(alert.metadata?.estimatedArrival || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
        message += `\nPor favor, confirme o preparo para recebimento.`;
        break;
        
      case 'patient-arrival':
        message += `Detalhes do paciente:\n`;
        message += `- ID: ${alert.metadata?.patientId || 'Não identificado'}\n`;
        message += `- Condição: ${alert.metadata?.condition || 'Não especificada'}\n`;
        message += `- Nível de emergência: ${alert.metadata?.emergencyLevel || 'Não especificado'}\n`;
        message += `\nPor favor, confirme recebimento e designação de leito.`;
        break;
        
      case 'resource':
        message += `Detalhes do recurso:\n`;
        message += `- Departamento: ${alert.metadata?.department || 'N/A'}\n`;
        message += `- Recurso: ${alert.metadata?.resourceName || 'N/A'}\n`;
        message += `- Disponível: ${alert.metadata?.current || 0} de ${alert.metadata?.total || 0}\n`;
        message += `\nPor favor, indique as ações que serão tomadas para resolver esta situação.`;
        break;
        
      case 'emergency':
        message += `ATENÇÃO: Este é um alerta de emergência que requer ação imediata!\n\n`;
        message += `Detalhes da emergência:\n`;
        message += `- Condição: ${alert.metadata?.patientCondition || 'Não especificada'}\n`;
        message += `- Nível: ${alert.metadata?.emergencyLevel || 'Não especificado'}\n`;
        message += `\nPor favor, coordene a resposta imediatamente e mantenha este chat atualizado.`;
        break;
    }
    
    return message;
  };
  
  // Este componente não renderiza nada visualmente, apenas processa a lógica
  return null;
};

/**
 * Hook para criar chat a partir de alertas
 * 
 * Exemplo de uso:
 * 
 * const { createChatFromAlert } = useAlertToChatIntegration({
 *   hospitalId: 'hospital-123',
 *   createChat: (title, initialMessage, participants, metadata) => {
 *     // Lógica para criar o chat
 *   }
 * });
 * 
 * // Em algum evento de UI
 * createChatFromAlert(alertObject);
 */
export const useAlertToChatIntegration = ({
  hospitalId,
  createChat
}: {
  hospitalId: string;
  createChat: (title: string, initialMessage: string, participants: string[], metadata?: Record<string, any>) => void;
}) => {
  const { markAsRead } = useAlerts();
  
  const createChatFromAlert = (alert: Alert) => {
    // Determinar participantes com base no tipo de alerta
    const participants = getRelevantParticipantsForAlert(alert);
    
    // Criar título para o chat
    const chatTitle = getChatTitleForAlert(alert);
    
    // Criar mensagem inicial
    const initialMessage = getInitialMessageForAlert(alert);
    
    // Criar o chat
    createChat(
      chatTitle,
      initialMessage,
      participants,
      {
        alertId: alert.id,
        alertType: alert.type,
        alertPriority: alert.priority,
        ...alert.metadata
      }
    );
    
    // Marcar o alerta como lido
    markAsRead(alert.id);
  };
  
  // Funções auxiliares (idênticas às do componente)
  const getRelevantParticipantsForAlert = (alert: Alert): string[] => {
    switch (alert.type) {
      case 'ambulance':
        return ['emergency-team', 'ambulance-control', 'reception'];
        
      case 'patient-arrival':
        const department = alert.metadata?.department || 'emergency';
        return [`${department}-team`, 'reception', 'ambulance-control'];
        
      case 'resource':
        const resourceDept = alert.metadata?.department?.toLowerCase() || '';
        return [
          `${resourceDept}-team`, 
          'resource-management',
          alert.priority === 'high' ? 'hospital-admin' : null
        ].filter(Boolean) as string[];
        
      case 'emergency':
        return ['emergency-team', 'medical-director', 'nursing-supervisor'];
        
      default:
        return ['hospital-admin'];
    }
  };
  
  const getChatTitleForAlert = (alert: Alert): string => {
    switch (alert.type) {
      case 'ambulance':
        return `🚑 Ambulância ${alert.metadata?.ambulanceId || ''}: ${alert.title}`;
        
      case 'patient-arrival':
        return `🏥 Chegada de Paciente: ${alert.metadata?.patientId || 'Não identificado'}`;
        
      case 'resource':
        return `🔧 ${alert.metadata?.department || ''}: ${alert.metadata?.resourceName || 'Recurso'} (${alert.priority === 'high' ? 'CRÍTICO' : 'Alerta'})`;
        
      case 'emergency':
        return `⚠️ EMERGÊNCIA: ${alert.title}`;
        
      default:
        return alert.title;
    }
  };
  
  const getInitialMessageForAlert = (alert: Alert): string => {
    const timestamp = alert.timestamp.toLocaleString();
    
    let message = `[Sistema] Alerta automático criado em ${timestamp}.\n\n`;
    message += `${alert.message}\n\n`;
    
    switch (alert.type) {
      case 'ambulance':
        message += `Detalhes da ambulância:\n`;
        message += `- ID: ${alert.metadata?.ambulanceId || 'N/A'}\n`;
        message += `- Paciente: ${alert.metadata?.patientId || 'Não identificado'}\n`;
        message += `- Chegada estimada: ${new Date(alert.metadata?.estimatedArrival || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}\n`;
        message += `\nPor favor, confirme o preparo para recebimento.`;
        break;
        
      case 'patient-arrival':
        message += `Detalhes do paciente:\n`;
        message += `- ID: ${alert.metadata?.patientId || 'Não identificado'}\n`;
        message += `- Condição: ${alert.metadata?.condition || 'Não especificada'}\n`;
        message += `- Nível de emergência: ${alert.metadata?.emergencyLevel || 'Não especificado'}\n`;
        message += `\nPor favor, confirme recebimento e designação de leito.`;
        break;
        
      case 'resource':
        message += `Detalhes do recurso:\n`;
        message += `- Departamento: ${alert.metadata?.department || 'N/A'}\n`;
        message += `- Recurso: ${alert.metadata?.resourceName || 'N/A'}\n`;
        message += `- Disponível: ${alert.metadata?.current || 0} de ${alert.metadata?.total || 0}\n`;
        message += `\nPor favor, indique as ações que serão tomadas para resolver esta situação.`;
        break;
        
      case 'emergency':
        message += `ATENÇÃO: Este é um alerta de emergência que requer ação imediata!\n\n`;
        message += `Detalhes da emergência:\n`;
        message += `- Condição: ${alert.metadata?.patientCondition || 'Não especificada'}\n`;
        message += `- Nível: ${alert.metadata?.emergencyLevel || 'Não especificado'}\n`;
        message += `\nPor favor, coordene a resposta imediatamente e mantenha este chat atualizado.`;
        break;
    }
    
    return message;
  };
  
  return {
    createChatFromAlert
  };
};