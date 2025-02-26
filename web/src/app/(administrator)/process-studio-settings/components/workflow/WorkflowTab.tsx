/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/organisms/card';
import { SLAEditor } from './SLAEditor';
import { ExceptionFlowsEditor } from './ExceptionFlowsEditor';
import { ClinicalProtocols } from './ClinicalProtocols';
import { HospitalWorkflowEditor } from '../HospitalWorkflowEditor';
import { 
  IWorkflowNode, 
  ISavedWorkflow, 
  IWorkflowTemplate,
  ISLASettings,
  IExceptionFlow
} from '@/types/workflow/customize-process-by-workflow-types';
import { Button } from '@/components/ui/organisms/button';
import { X } from 'lucide-react';
import { TemplateCarousel } from './TemplateCarousel';
import { useTemplateWorkflowIntegration } from '@/services/hooks/useTemplateWorkflowIntegration';
import { findTemplateById } from '@/utils/findTemplateById';
import { workflowTemplates } from '@/utils/workflowTemplates';

// Definição do componente WorkflowTab
export const WorkflowTab = () => {
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
    setExceptionFlows,
    generateSavedWorkflow
  } = useTemplateWorkflowIntegration();

  // Estado para armazenar a referência do HospitalWorkflowEditor
  const [workflowEditorKey, setWorkflowEditorKey] = useState<number>(0);
  
  // Estado para controlar se um processo está em andamento
  const [processoEmAndamento, setProcessoEmAndamento] = useState<boolean>(false);

  // Verifica se há um workflow ativo sempre que o workflow muda
  useEffect(() => {
    const hasWorkflow = workflow && workflow.length > 0;
    setProcessoEmAndamento(hasWorkflow);
    console.log("WorkflowTab - Workflow atualizado, nodes:", workflow.length);
    
    // Debug: Verifica o conteúdo do workflow
    if (hasWorkflow) {
      console.log("Primeiro nó:", workflow[0]);
    }
  }, [workflow]);

  // Função para forçar a remontagem do editor
  const forceEditorRemount = useCallback(() => {
    setWorkflowEditorKey(prev => prev + 1);
  }, []);

  // Função para selecionar um template
  const handleTemplateSelect = (templateId: string) => {
    console.log("WorkflowTab - Template selecionado:", templateId);
    
    const template = findTemplateById(templateId);
    if (template) {
      console.log("WorkflowTab - Template encontrado:", template.name);
      
      // Seleciona o template (isso dispara o useEffect no hook que carrega os nós)
      selectTemplate(template);
      
      // Forçar remontagem do HospitalWorkflowEditor
      setTimeout(forceEditorRemount, 100);
    }
  };

  // Função para cancelar o processo/template selecionado
  const handleCancelProcess = () => {
    console.log("WorkflowTab - Cancelando processo/template");
    
    // Limpar o template
    selectTemplate(null as unknown as IWorkflowTemplate);
    
    // Forçar remontagem do HospitalWorkflowEditor
    setTimeout(forceEditorRemount, 100);
  };

  // Função para atualizar o workflow quando o usuário edita no canvas
  const handleWorkflowUpdate = (updatedWorkflow: IWorkflowNode[]) => {
    console.log("WorkflowTab - Workflow atualizado pelo canvas:", updatedWorkflow.length, "nodes");
    if (updatedWorkflow && updatedWorkflow.length > 0) {
      setWorkflow(updatedWorkflow);
    }
  };

  // Função para atualizar as configurações de SLA
  const handleUpdateSLA = (newSettings: ISLASettings[]) => {
    console.log("WorkflowTab - SLA atualizado:", newSettings.length, "configurações");
    setSlaSettings(newSettings);
  };

  // Função para atualizar os fluxos de exceção
  const handleUpdateExceptions = (newExceptions: IExceptionFlow[]) => {
    console.log("WorkflowTab - Exceções atualizadas:", newExceptions.length, "fluxos");
    setExceptionFlows(newExceptions);
  };

  return (
    <div className="space-y-6">
      {/* Título da seção */}
      <div>
        <h1 className="text-2xl font-bold mb-2">Templates de Processos</h1>
        <p className="text-gray-500">Selecione um template para começar a editar o workflow</p>
      </div>
      
      {/* Carousel de templates - limitado a 5 cards visíveis */}
      <div className={processoEmAndamento ? 'opacity-50 pointer-events-none' : ''}>
        <TemplateCarousel 
          templates={workflowTemplates}
          onSelectTemplate={handleTemplateSelect}
          maxVisibleItems={5}
        />
      </div>
      
      {/* Seção Processo em Andamento */}
      {processoEmAndamento && selectedTemplate && (
        <div className="bg-blue-900 p-4 rounded-md flex justify-between items-center">
          <div>
            <h2 className="text-lg font-medium text-white">
              Workflow: {selectedTemplate.name} ({workflow.length} nós)
            </h2>
            <p className="text-sm text-gray-300">
              Um processo está em andamento. Conclua ou cancele para selecionar outro template.
            </p>
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
      
      {/* Debug info (remover em produção) */}
      {/* <div className="bg-gray-800 p-2 text-xs text-gray-400 rounded">
        <div>Template: {selectedTemplate?.name || 'Nenhum'}</div>
        <div>Workflow: {workflow.length} nós</div>
        <div>Editor Key: {workflowEditorKey}</div>
      </div>
       */}

      {/* Grid layout para SLAs, Exceções e Editor de Workflow */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 p-4">
        {/* Coluna da esquerda: SLAs */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-4">Editor de SLAs</h2>
          {selectedTemplate ? (
            <SLAEditor 
              template={selectedTemplate} 
              onUpdateSLA={handleUpdateSLA}
            />
          ) : (
            <Card className="p-4 bg-gray-800 text-white">
              <p className="text-center">Selecione um template para editar SLAs</p>
            </Card>
          )}
          
          <h2 className="text-xl font-semibold my-4">Fluxos de Exceção</h2>
          {selectedTemplate ? (
            <ExceptionFlowsEditor 
              template={selectedTemplate}
              onUpdateExceptions={handleUpdateExceptions}
            />
          ) : (
            <Card className="p-4 bg-gray-800 text-white">
              <p className="text-center">Selecione um template para editar fluxos de exceção</p>
            </Card>
          )}
        </div>
        
        {/* Coluna da direita: Editor de Workflow */}
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Editor de Workflow</h2>
          <Card className="p-4 h-[600px]">
            <HospitalWorkflowEditor 
              key={workflowEditorKey}
              initialWorkflow={workflow}
              onWorkflowUpdate={handleWorkflowUpdate}
              readOnly={false}
              savedWorkflow={generateSavedWorkflow()}
              onCancelProcess={handleCancelProcess}
              processName={selectedTemplate?.name}
            />
          </Card>
        </div>
      </div>
      
      {/* Protocolos Clínicos */}
      <ClinicalProtocols />
    </div>
  );
};