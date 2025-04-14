import React from 'react';
import { Trash2, Edit2, MessageSquare, Clock, AlarmClock } from 'lucide-react';
import { IAutomationRule, IMessageTemplate } from '@/types/integrations-configs/whatsapp-types';

interface AutomationRuleCardProps {
  rule: IAutomationRule;
  templates: IMessageTemplate[];
  onEdit: (rule: IAutomationRule) => void;
  onRemove: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const AutomationRuleCard: React.FC<AutomationRuleCardProps> = ({
  rule,
  templates,
  onEdit,
  onRemove,
  onToggleStatus
}) => {
  // Função para renderizar o ícone correto com base no trigger
  const renderTriggerIcon = (trigger: string) => {
    switch (trigger) {
      case 'message_received':
        return <MessageSquare className="w-4 h-4 text-blue-500" />;
      case 'keyword':
        return <MessageSquare className="w-4 h-4 text-green-500" />;
      case 'scheduled':
        return <Clock className="w-4 h-4 text-purple-500" />;
      case 'no_response':
        return <AlarmClock className="w-4 h-4 text-orange-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };
  
  // Função para obter o rótulo legível do trigger
  const getTriggerLabel = (trigger: string) => {
    switch (trigger) {
      case 'message_received':
        return 'Mensagem Recebida';
      case 'keyword':
        return 'Palavra-chave';
      case 'scheduled':
        return 'Agendado';
      case 'no_response':
        return 'Sem Resposta';
      default:
        return trigger;
    }
  };
  
  // Função para obter o rótulo legível da ação
  const getActionLabel = (action: string) => {
    switch (action) {
      case 'send_template':
        return 'Enviar Template';
      case 'tag_contact':
        return 'Marcar Contato';
      case 'add_to_group':
        return 'Adicionar a Grupo';
      case 'notify_agent':
        return 'Notificar Agente';
      default:
        return action;
    }
  };
  
  // Encontrar o nome do template (se aplicável)
  const getTemplateName = () => {
    if (rule.action === 'send_template' && rule.templateId) {
      const template = templates.find(t => t.id === rule.templateId);
      return template ? template.name : 'Template não encontrado';
    }
    return null;
  };
  
  // Obter detalhes do gatilho
  const getTriggerDetails = () => {
    switch (rule.trigger) {
      case 'keyword':
        return `Palavras-chave: ${rule.condition || 'Nenhuma definida'}`;
      case 'scheduled':
        return `Agendamento: ${rule.condition || 'Nenhum definido'}`;
      case 'no_response':
        return `Após ${rule.condition || '0'} horas sem resposta`;
      default:
        return null;
    }
  };
  
  return (
    <div 
      className={`p-4 rounded-lg border ${
        rule.isActive 
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
          : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-70'
      }`}
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center">
            <h4 className="font-medium text-gray-900 dark:text-white">{rule.name}</h4>
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              rule.isActive 
                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            }`}>
              {rule.isActive ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          
          {rule.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {rule.description}
            </p>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => onToggleStatus(rule.id)}
            className={`p-1 rounded-full ${
              rule.isActive 
                ? 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300' 
                : 'text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300'
            }`}
            title={rule.isActive ? 'Desativar regra' : 'Ativar regra'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
              {rule.isActive && <path fillRule="evenodd" d="M10 4a6 6 0 100 12 6 6 0 000-12z" clipRule="evenodd" />}
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onEdit(rule)}
            className="p-1 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 rounded-full"
            title="Editar regra"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(rule.id)}
            className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full"
            title="Remover regra"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
          <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span className="mr-2">Gatilho:</span>
            <div className="flex items-center">
              {renderTriggerIcon(rule.trigger)}
              <span className="ml-1">{getTriggerLabel(rule.trigger)}</span>
            </div>
          </div>
          
          {getTriggerDetails() && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {getTriggerDetails()}
            </p>
          )}
        </div>
        
        <div className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ação: {getActionLabel(rule.action)}
          </div>
          
          {rule.action === 'send_template' && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Template: {getTemplateName()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};