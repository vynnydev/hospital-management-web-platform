/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { Save, X } from 'lucide-react';
import { IAutomationRule, IMessageTemplate } from '@/types/integrations-configs/whatsapp-types';
import { TriggerFieldset } from './automation-rule/TriggerFieldset';
import { ActionFieldset } from './automation-rule/ActionFieldset';

interface AutomationRuleFormProps {
  rule: IAutomationRule;
  templates: IMessageTemplate[];
  isEdit: boolean;
  onCancel: () => void;
  onChange: (rule: IAutomationRule) => void;
  onSave: () => void;
}

export const AutomationRuleForm: React.FC<AutomationRuleFormProps> = ({
  rule,
  templates,
  isEdit,
  onCancel,
  onChange,
  onSave
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white">
          {isEdit ? 'Editar Regra' : 'Nova Regra'}
        </h4>
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="rule-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Nome da Regra
          </label>
          <input
            id="rule-name"
            type="text"
            value={rule.name}
            onChange={(e) => onChange({ ...rule, name: e.target.value })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            placeholder="Nome da regra de automação"
          />
        </div>
        
        <div>
          <label htmlFor="rule-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Descrição
          </label>
          <textarea
            id="rule-description"
            value={rule.description}
            onChange={(e) => onChange({ ...rule, description: e.target.value })}
            rows={2}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
            placeholder="Descreva o propósito desta regra"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="rule-trigger" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Gatilho
          </label>
          <select
            id="rule-trigger"
            value={rule.trigger}
            onChange={(e) => onChange({ ...rule, trigger: e.target.value as any })}
            className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md"
          >
            <option value="message_received">Mensagem Recebida</option>
            <option value="keyword">Palavra-chave Detectada</option>
            <option value="scheduled">Agendado</option>
            <option value="no_response">Sem Resposta</option>
          </select>
        </div>
        
        {/* Campos específicos para cada tipo de gatilho */}
        <TriggerFieldset
          trigger={rule.trigger as 'message_received' | 'keyword' | 'scheduled' | 'no_response'}
          condition={rule.condition}
          onChange={(condition) => onChange({ ...rule, condition })}
        />
        
        {/* Campos de ação */}
        <ActionFieldset
          action={rule.action}
          templateId={rule.templateId}
          templates={templates}
          onActionChange={(action) => onChange({ ...rule, action })}
          onTemplateChange={(templateId) => onChange({ ...rule, templateId })}
        />
        
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="rule-active"
            checked={rule.isActive}
            onChange={(e) => onChange({ ...rule, isActive: e.target.checked })}
            className="h-4 w-4 text-blue-600 dark:text-blue-500 rounded"
          />
          <label htmlFor="rule-active" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
            Regra ativa
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 mt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
            disabled={!rule.name || (rule.action === 'send_template' && !rule.templateId)}
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Regra
          </button>
        </div>
      </div>
    </div>
  );
};