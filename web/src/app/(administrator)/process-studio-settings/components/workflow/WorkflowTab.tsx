/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/organisms/card';
import { SLAEditor } from './SLAEditor';
import { ExceptionFlowsEditor } from './ExceptionFlowsEditor';
import { ClinicalProtocols } from './ClinicalProtocols';
import { 
  IWorkflowNode, 
  ISavedWorkflow 
} from '@/types/workflow/customize-process-by-workflow-types';
import { TemplatesSidebar } from './TemplatesSidebar';
import { Button } from '@/components/ui/organisms/button';
import { X } from 'lucide-react';
import { useTemplateWorkflowIntegration } from '@/services/hooks/useTemplateWorkflowIntegration';
import { workflowTemplates } from '@/utils/workflowTemplates';
import { findTemplateById } from '@/utils/findTemplateById';
import { HospitalWorkflowEditor } from '../HospitalWorkflowEditor';

// Interface para as Props
interface WorkflowTabProps {
  // Você pode adicionar props aqui se necessário no futuro
}

// Definição do componente WorkflowTab
export const WorkflowTab: React.FC<WorkflowTabProps> = () => {
  // Estado para controlar a categoria selecionada no seletor de templates
  const [currentCategory, setCurrentCategory] = useState<string>('all');
  
  // Use o hook personalizado para gerenciar a integração de templates
  const {
    selectedTemplate,
    workflow,
    slaSettings,
    exceptionFlows,
    selectTemplate,
    selectTemplateById,
    setWorkflow,
    setSlaSettings,
    setExceptionFlows
  } = useTemplateWorkflowIntegration();

  // Mock de templates para o TemplatesSidebar
  const templates = workflowTemplates.map(t => ({
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category
  }));

  // Estado para armazenar a referência do HospitalWorkflowEditor
  const [workflowEditorKey, setWorkflowEditorKey] = useState<number>(0);
  // Estado para controlar se um processo está em andamento
  const [processoEmAndamento, setProcessoEmAndamento] = useState<boolean>(false);

  // Verifica se há um workflow ativo sempre que o workflow muda
  useEffect(() => {
    setProcessoEmAndamento(workflow.length > 0);
  }, [workflow]);

  // Função para selecionar um template a partir do sidebar
  const handleTemplateSelect = (templateId: string) => {
    console.log("Template selecionado:", templateId);
    const template = findTemplateById(templateId);
    if (template) {
      selectTemplate(template);
      // Forçar remontagem do HospitalWorkflowEditor
      setWorkflowEditorKey(prev => prev + 1);
    }
  };

  // Função para cancelar o processo/template selecionado
  const handleCancelProcess = () => {
    console.log("Cancelando processo/template");
    // Limpa o template selecionado
    selectTemplate(null);
    // Limpa o workflow
    setWorkflow([]);
    // Reseta o estado de processo em andamento
    setProcessoEmAndamento(false);
    // Forçar remontagem do HospitalWorkflowEditor
    setWorkflowEditorKey(prev => prev + 1);
  };

  // Função para atualizar o workflow quando o usuário edita no canvas
  const handleWorkflowUpdate = (updatedWorkflow: IWorkflowNode[]) => {
    console.log("Workflow atualizado:", updatedWorkflow);
    setWorkflow(updatedWorkflow);
  };

  // Gera um SavedWorkflow a partir do template atual
  const generateSavedWorkflow = (): ISavedWorkflow | null => {
    if (!selectedTemplate) return null;
    
    return {
      id: selectedTemplate.id,
      name: selectedTemplate.name,
      nodes: workflow,
      createdAt: new Date(),
      description: selectedTemplate.description
    };
  };

  // Determina a altura do editor de workflow
  const editorHeight = processoEmAndamento ? 'h-[800px]' : 'h-[600px]';

  return (
    <div className="space-y-6">
      {/* Templates na parte superior - desativados quando um processo está em andamento */}
      <div className={processoEmAndamento ? 'opacity-50 pointer-events-none' : ''}>
        <TemplatesSidebar 
          templates={templates}
          currentCategory={currentCategory}
          setCurrentCategory={setCurrentCategory}
          onTemplateSelect={handleTemplateSelect}
        />
      </div>
      
      {/* Seção Processo em Andamento */}
      {processoEmAndamento && selectedTemplate && (
        <div className="bg-blue-900 p-4 rounded-md flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-white">Workflow: {selectedTemplate.name}</h2>
            <p className="text-sm text-gray-300">Um processo está em andamento. Conclua ou cancele para selecionar outro template.</p>
          </div>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2"
            onClick={handleCancelProcess}
          >
            <X size={16} />
            <span>Cancelar Processo</span>
          </Button>
        </div>
      )}

      {/* SLAs e Fluxos de Exceção */}
      {selectedTemplate && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SLAEditor 
            template={selectedTemplate} 
            onUpdateSLA={setSlaSettings}
          />
          
          <ExceptionFlowsEditor 
            template={selectedTemplate}
            onUpdateExceptions={setExceptionFlows}
          />
        </div>
      )}
      
      {/* Editor de Workflow com altura aumentada */}
      <div>
        <h2 className="text-xl font-semibold">Editor de Workflow</h2>
        <Card className={`p-4 ${editorHeight} transition-all duration-300`}>
          <div className="h-full w-full">
            <HospitalWorkflowEditor 
              key={workflowEditorKey}
              initialWorkflow={workflow}
              onWorkflowUpdate={handleWorkflowUpdate}
              readOnly={false}
              savedWorkflow={generateSavedWorkflow()}
              onCancelProcess={handleCancelProcess}
              processName={selectedTemplate?.name}
            />
          </div>
        </Card>
      </div>
      
      {/* Protocolos Clínicos */}
      <div className='pt-[530px]'>
        <ClinicalProtocols />
      </div>
    </div>
  );
};