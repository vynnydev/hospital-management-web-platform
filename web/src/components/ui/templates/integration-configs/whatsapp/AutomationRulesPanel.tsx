import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { IAutomationRule, IMessageTemplate } from '@/types/integrations-configs/whatsapp-types';
import { AutomationRuleForm } from './automation/AutomationRuleForm';
import { AutomationRuleCard } from './automation/AutomationRuleCard';
import { NoRulesMessage } from './automation/NoRulesMessage';

interface AutomationRulesPanelProps {
  rules: IAutomationRule[];
  templates: IMessageTemplate[];
  onChange: (rules: IAutomationRule[]) => void;
}

export const AutomationRulesPanel: React.FC<AutomationRulesPanelProps> = ({
  rules,
  templates,
  onChange
}) => {
  const [editMode, setEditMode] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Estado para a regra em edição ou nova regra
  const [currentRule, setCurrentRule] = useState<IAutomationRule>({
    id: '',
    name: '',
    description: '',
    trigger: 'message_received',
    condition: '',
    action: 'send_template',
    templateId: '',
    isActive: true
  });
  
  // Iniciar edição de uma regra existente
  const startEdit = (rule: IAutomationRule) => {
    setCurrentRule({ ...rule });
    setEditMode(rule.id);
    setShowAddForm(false);
  };
  
  // Iniciar criação de uma nova regra
  const startAdd = () => {
    // Gerar um ID único
    const newId = `rule_${Date.now()}`;
    // Usar o primeiro template disponível como padrão (se existir)
    const defaultTemplateId = templates.length > 0 ? templates[0].id : '';
    
    setCurrentRule({
      id: newId,
      name: '',
      description: '',
      trigger: 'message_received',
      condition: '',
      action: 'send_template',
      templateId: defaultTemplateId,
      isActive: true
    });
    setShowAddForm(true);
    setEditMode(null);
  };
  
  // Cancelar edição ou adição
  const cancelEdit = () => {
    setEditMode(null);
    setShowAddForm(false);
  };
  
  // Salvar uma regra (nova ou editada)
  const saveRule = () => {
    if (currentRule.name) {
      let newRules: IAutomationRule[];
      
      if (editMode) {
        // Editando uma regra existente
        newRules = rules.map(rule => 
          rule.id === editMode ? { ...currentRule } : rule
        );
      } else {
        // Adicionando uma nova regra
        newRules = [...rules, { ...currentRule }];
      }
      
      onChange(newRules);
      setEditMode(null);
      setShowAddForm(false);
    }
  };
  
  // Remover uma regra
  const removeRule = (id: string) => {
    onChange(rules.filter(rule => rule.id !== id));
  };
  
  // Alternar status ativo de uma regra
  const toggleRuleStatus = (id: string) => {
    onChange(rules.map(rule => 
      rule.id === id ? { ...rule, isActive: !rule.isActive } : rule
    ));
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Regras de Automação</h3>
        <button
          type="button"
          onClick={startAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          disabled={showAddForm || editMode !== null}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Regra
        </button>
      </div>
      
      {/* Formulário de adição/edição */}
      {(showAddForm || editMode) && (
        <AutomationRuleForm 
          rule={currentRule}
          templates={templates}
          isEdit={!!editMode}
          onCancel={cancelEdit}
          onChange={setCurrentRule}
          onSave={saveRule}
        />
      )}
      
      {/* Lista de regras */}
      <div className="space-y-3">
        {rules.map((rule) => (
          <AutomationRuleCard
            key={rule.id}
            rule={rule}
            templates={templates}
            onEdit={startEdit}
            onRemove={removeRule}
            onToggleStatus={toggleRuleStatus}
          />
        ))}
        
        {rules.length === 0 && <NoRulesMessage onAddClick={startAdd} />}
      </div>
    </div>
  );
};