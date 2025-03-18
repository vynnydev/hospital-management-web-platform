/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
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
import { X, BarChart2, Plus, RefreshCw, Activity, Clock, History } from 'lucide-react';
import { useTemplateWorkflowIntegration } from '@/services/hooks/workflow-templates/useTemplateWorkflowIntegration';
import { findTemplateById } from '@/utils/findTemplateById';
import { workflowTemplates } from '@/utils/workflowTemplates';
import { TemplatesSidebar } from './TemplatesSidebar';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { AlertsProvider, useAlerts } from '@/components/ui/templates/providers/alerts/AlertsProvider';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { SmartTemplateRecommendations } from '@/components/ui/templates/process-templates/SmartTemplateRecommendations';
import { EnhancedTemplateCarousel } from '@/components/ui/templates/process-templates/EnhancedTemplateCarousel';
import { IStaffData } from '@/types/staff-types';
import { DynamicWorkflowProcessMetricsPanel } from './DynamicWorkflowProcessMetricsPanel';

interface UseStaffDataReturn {
  staffData: IStaffData | null;
  loading: boolean;
  error: string | null;
}

// Componente principal WorkflowTab
export const WorkflowTab = () => {
  // Use os hooks personalizados para gerenciar os dados
  const {
    selectedTemplate,
    workflow,
    slaSettings,
    exceptionFlows,
    processoEmAndamento,
    selectTemplate,
    selectTemplateById,
    setWorkflow,
    setSlaSettings,
    setExceptionFlows,
    generateSavedWorkflow,
    cancelProcess
  } = useTemplateWorkflowIntegration();

  // Hooks para obter dados do sistema para as recomendações inteligentes
  const { networkData, currentUser } = useNetworkData();
  const { alerts, getFilteredAlerts } = useAlerts();
  const ambulanceData = useAmbulanceData(currentUser?.hospitalId || null);

  const { 
    staffData, 
    loading: staffLoading, 
    error: staffError 
  }: UseStaffDataReturn = useStaffData(currentUser?.hospitalId);

  // Estado para armazenar a referência do HospitalWorkflowEditor
  const [workflowEditorKey, setWorkflowEditorKey] = useState(0);
  
  // Estado para controlar qual categoria de templates está selecionada
  const [currentCategory, setCurrentCategory] = useState('all');
  
  // Estado para controlar a exibição das recomendações inteligentes
  const [showRecommendations, setShowRecommendations] = useState(false);

  // Filtra templates com base na categoria selecionada
  const filteredTemplates = currentCategory === 'all' 
    ? workflowTemplates 
    : workflowTemplates.filter(t => t.category === currentCategory);

  // Verifica se há um workflow ativo sempre que o workflow muda
  useEffect(() => {
    console.log("WorkflowTab - Workflow atualizado, nodes:", workflow.length);
    
    // Debug: Verifica o conteúdo do workflow
    if (workflow && workflow.length > 0) {
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
      
      // Oculta as recomendações quando um template é selecionado
      setShowRecommendations(false);
    }
  };

  // Função para cancelar o processo/template selecionado
  const handleCancelProcess = () => {
    console.log("WorkflowTab - Cancelando processo/template");
    
    // Usa a função do hook para cancelar o processo
    cancelProcess();
    
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

  // Função para alternar a visibilidade das recomendações inteligentes
  const toggleRecommendations = () => {
    setShowRecommendations(prev => !prev);
  };

  if (!staffData) return null;

  return (
    <div className="space-y-8 ">
      {/* Cabeçalho com título e botões de ação */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className='mt-8'>
          <h1 className="text-2xl font-bold">Gestão de Processos Hospitalares</h1>
          <p className="text-gray-500">Personalize fluxos de trabalho para melhorar a eficiência operacional</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline"
            className="flex items-center gap-2"
            onClick={toggleRecommendations}
          >
            {showRecommendations ? <X size={16} /> : <BarChart2 size={16} />}
            <span>{showRecommendations ? "Ocultar Recomendações" : "Sugestões Inteligentes"}</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={forceEditorRemount}
          >
            <RefreshCw size={16} />
            <span>Atualizar Editor</span>
          </Button>
        </div>
      </div>
      
      {/* Seção de Recomendações Inteligentes - Visível apenas quando ativada */}
      {showRecommendations && (
        <SmartTemplateRecommendations 
          networkData={networkData}
          ambulanceData={{
            ambulanceData: ambulanceData.ambulanceData,
            loading: ambulanceData.loading,
            error: ambulanceData.error
          }}
          staffData={{
            staffData: staffData,
            loading: staffData.loading
          }}
          alerts={alerts ? getFilteredAlerts() : []}
          onTemplateSelect={handleTemplateSelect}
        />
      )}
      
      {/* Layout de duas colunas para Categorias e Carrossel de Templates */}
      <div className="pt-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Coluna da esquerda: Filtros de categoria */}
        <div className="lg:col-span-1">
          <TemplatesSidebar
            templates={workflowTemplates}
            currentCategory={currentCategory}
            setCurrentCategory={setCurrentCategory}
            onTemplateSelect={handleTemplateSelect}
          />
        </div>
        
        {/* Coluna da direita: Carrossel de templates */}
        <div className="mb-20 lg:col-span-3">
        {/* Painel de métricas dinâmicas */}
          <DynamicWorkflowProcessMetricsPanel 
            networkData={networkData}
            staffData={{
              staffData: staffData, 
              loading: staffLoading,
              error: staffError || null
            }}
            ambulanceData={{
              ambulanceData: ambulanceData.ambulanceData,
              loading: ambulanceData.loading,
              error: ambulanceData.error
            }}
            alerts={alerts || []}
            templates={workflowTemplates}
            activeTemplateId={selectedTemplate?.id}
          />

          <Card className="p-4 bg-gradient-to-r from-blue-950 to-indigo-900 border-none shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Templates Disponíveis</h2>
            <div className={processoEmAndamento ? 'opacity-50 pointer-events-none' : ''}>               
              <EnhancedTemplateCarousel 
                templates={filteredTemplates}
                onSelectTemplate={handleTemplateSelect}
                maxVisibleItems={3}
              />
            </div>
          </Card>

        </div>
      </div>
      
      {/* Seção Processo em Andamento */}
      {processoEmAndamento && selectedTemplate && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 rounded-lg shadow-md flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
              Processo Ativo: {selectedTemplate.name}
            </h2>
            <p className="text-blue-100">
              {workflow.length} etapas configuradas • {slaSettings.length} alertas SLA • {exceptionFlows.length} fluxos de exceção
            </p>
          </div>
          <Button 
            variant="destructive" 
            className="flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
            onClick={handleCancelProcess}
          >
            <X size={16} />
            <span>Cancelar Processo</span>
          </Button>
        </div>
      )}

      {/* Layout aprimorado para SLAs, Exceções e Editor de Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-12 border-t border-gray-700">
        {/* Coluna da esquerda: SLAs e Exceções */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-gray-900 border-gray-700 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-800 to-indigo-800 p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Editor de SLAs</h2>
              <p className="text-blue-200 text-sm">Configure alertas e prazos para cada etapa</p>
            </div>
            <div className="p-4">
              {selectedTemplate ? (
                <SLAEditor 
                  template={selectedTemplate} 
                  onUpdateSLA={handleUpdateSLA}
                />
              ) : (
                <div className="p-4 bg-gray-800 text-white rounded-md border border-gray-700">
                  <p className="text-center">Selecione um template para editar SLAs</p>
                </div>
              )}
            </div>
          </Card>
          
          <Card className="bg-gray-900 border-gray-700 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-700 to-orange-700 p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white">Fluxos de Exceção</h2>
              <p className="text-amber-200 text-sm">Defina caminhos alternativos para casos excepcionais</p>
            </div>
            <div className="p-4">
              {selectedTemplate ? (
                <ExceptionFlowsEditor 
                  template={selectedTemplate}
                  onUpdateExceptions={handleUpdateExceptions}
                />
              ) : (
                <div className="p-4 bg-gray-800 text-white rounded-md border border-gray-700">
                  <p className="text-center">Selecione um template para editar fluxos de exceção</p>
                </div>
              )}
            </div>
          </Card>
        </div>
        
        {/* Coluna da direita: Editor de Workflow */}
        <div className="mb-20 lg:col-span-3">
          <Card className="overflow-hidden border-gray-700 shadow-lg">
            <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-16a2 2 0 0 1-2-2z"></path>
                  <line x1="2" y1="10" x2="22" y2="10"></line>
                </svg>
                Editor de Workflow
              </h2>
              {selectedTemplate && (
                <p className="text-gray-400 text-sm">{selectedTemplate.description}</p>
              )}
            </div>
            <div className="p-1 bg-gray-950">
              {/* Aumentando a altura para 700px */}
              <div className="h-[700px] rounded-md overflow-hidden">
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
            </div>
          </Card>
        </div>
      </div>
      
      {/* Protocolos Clínicos */}
      <div className="border-t border-gray-700">
        <ClinicalProtocols />
      </div>
    </div>
  );
};