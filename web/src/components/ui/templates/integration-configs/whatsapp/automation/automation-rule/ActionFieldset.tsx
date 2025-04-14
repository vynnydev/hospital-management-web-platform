import React from 'react';
import { IMessageTemplate } from '@/types/integrations-configs/whatsapp-types';

interface ActionFieldsetProps {
  action: string;
  templateId?: string;
  templates: IMessageTemplate[];
  onActionChange: (action: string) => void;
  onTemplateChange: (templateId: string) => void;
}

export const ActionFieldset: React.FC<ActionFieldsetProps> = ({
  action,
  templateId,
  templates,
  onActionChange,
  onTemplateChange
}) => {
  return (
    <>
      <div>
        <label htmlFor="rule-action" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Ação
        </label>
        <select
          id="rule-action"
          value={action}
          onChange={(e) => onActionChange(e.target.value)}
          className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
        >
          <option value="send_template">Enviar Template</option>
          <option value="tag_contact">Marcar Contato</option>
          <option value="add_to_group">Adicionar a Grupo</option>
          <option value="notify_agent">Notificar Agente</option>
        </select>
      </div>
      
      {/* Campos específicos para cada tipo de ação */}
      {action === 'send_template' && (
        <div>
          <label htmlFor="template-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Template de Mensagem
          </label>
          <select
            id="template-id"
            value={templateId}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
          >
            <option value="" disabled>Selecione um template</option>
            {templates.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}{!template.isActive && ' (Inativo)'}
              </option>
            ))}
          </select>
          {templates.length === 0 && (
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">
              Nenhum template disponível. Crie templates na aba &quot;Templates&quot;.
            </p>
          )}
        </div>
      )}
      
      {action === 'tag_contact' && (
        <div>
          <label htmlFor="tag-value" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Tag a ser aplicada
          </label>
          <input
            id="tag-value"
            type="text"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            placeholder="Ex: lead_quente, cliente_prioritario"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Tag que será aplicada ao contato quando a regra for acionada
          </p>
        </div>
      )}
      
      {action === 'add_to_group' && (
        <div>
          <label htmlFor="group-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Grupo de Contatos
          </label>
          <select
            id="group-id"
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
          >
            <option value="" disabled selected>Selecione um grupo</option>
            <option value="leads">Leads</option>
            <option value="clientes">Clientes</option>
            <option value="pacientes">Pacientes</option>
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            O contato será adicionado a este grupo quando a regra for acionada
          </p>
        </div>
      )}
      
      {action === 'notify_agent' && (
        <div>
          <label htmlFor="notification-message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Mensagem de Notificação
          </label>
          <textarea
            id="notification-message"
            rows={2}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            placeholder="Mensagem que será enviada ao agente"
          ></textarea>
          
          <div className="mt-3">
            <label htmlFor="agent-id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Agente a ser Notificado
            </label>
            <select
              id="agent-id"
              className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            >
              <option value="" disabled selected>Selecione um agente</option>
              <option value="all">Todos os agentes disponíveis</option>
              <option value="admin">Administradores</option>
              <option value="support">Equipe de Suporte</option>
            </select>
          </div>
        </div>
      )}
    </>
  );
};