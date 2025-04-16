/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRef, useState, useEffect } from 'react';
import { 
  IExceptionFlow, 
  ISavedWorkflow, 
  ISLASettings, 
  IWorkflowNode, 
} from '@/types/workflow/customize-process-by-workflow-types';
import { IWorkflowTemplate } from '@/types/workflow/workflow-types';
import { workflowTemplates } from '@/utils/workflowTemplates';
import { 
  Clipboard, FileCheck, UserCheck, BookOpen, Stethoscope, 
  Hospital, Pill, ClipboardCheck, FileText, CalendarCheck,
  LucideIcon
} from 'lucide-react';

// Mapa de nomes de ícones para componentes Lucide reais
const iconNameToComponent: Record<string, LucideIcon> = {
  'Clipboard': Clipboard,
  'FileCheck': FileCheck,
  'UserCheck': UserCheck,
  'BookOpen': BookOpen,
  'Stethoscope': Stethoscope,
  'Hospital': Hospital,
  'Pill': Pill,
  'ClipboardCheck': ClipboardCheck,
  'FileText': FileText,
  'CalendarCheck': CalendarCheck,
};

// Hook modificado para garantir a propagação correta dos templates para o workflow
// e integração com useWorkflowActions
export const useTemplateWorkflowIntegration = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<IWorkflowTemplate | null>(null);
  const [workflow, setWorkflow] = useState<IWorkflowNode[]>([]);
  const [slaSettings, setSlaSettings] = useState<ISLASettings[]>([]);
  const [exceptionFlows, setExceptionFlows] = useState<IExceptionFlow[]>([]);
  const [processInProgress, setprocessInProgress] = useState<boolean>(false);
  
  // Referência para rastrear se a atualização do workflow já foi feita
  const workflowUpdatedRef = useRef<boolean>(false);

  // Ouvir eventos de workflow para sincronização
  useEffect(() => {
    const handleProcessCanceled = () => {
      console.log("useTemplateWorkflowIntegration: Processo cancelado detectado");
      // Limpar o template e o workflow
      setSelectedTemplate(null);
      setWorkflow([]);
      setSlaSettings([]);
      setExceptionFlows([]);
      setprocessInProgress(false);
      workflowUpdatedRef.current = false;
    };
    
    const handleProcessStarted = (e: Event) => {
      // Se o processo foi iniciado manualmente pelo DepartmentsList,
      // precisamos manter o estado de processo em andamento
      setprocessInProgress(true);
    };
    
    window.addEventListener('workflow-process-canceled', handleProcessCanceled);
    window.addEventListener('workflow-process-started', handleProcessStarted);
    
    return () => {
      window.removeEventListener('workflow-process-canceled', handleProcessCanceled);
      window.removeEventListener('workflow-process-started', handleProcessStarted);
    };
  }, []);

  // Função para garantir que os ícones são componentes React válidos
  const processNodeIcons = (nodes: IWorkflowNode[]): IWorkflowNode[] => {
    return nodes.map(node => {
      let iconComponent;
      
      // Se o ícone for uma string, tente encontrar o componente correspondente
      if (typeof node.icon === 'string') {
        const iconName = node.icon;
        iconComponent = iconNameToComponent[iconName] || Clipboard; // Fallback para Clipboard
      } else {
        // Se já for um componente, mantenha-o
        iconComponent = node.icon;
      }
      
      return {
        ...node,
        icon: iconComponent
      };
    });
  };

  // Quando um template é selecionado, carrega seu fluxo de trabalho imediatamente
  useEffect(() => {
    if (selectedTemplate) {
      console.log("Template selecionado para carregar:", selectedTemplate.name);
      console.log("Nodes a serem carregados:", selectedTemplate.baseNodes.length);
      
      try {
        // Importante: Precisamos garantir que os nós tenham IDs únicos
        // Cria uma cópia profunda dos nós para evitar problemas de referência
        const baseNodesCopy = JSON.parse(JSON.stringify(selectedTemplate.baseNodes)).map(
          (node: IWorkflowNode, index: number) => ({
            ...node,
            // Adiciona um timestamp ao ID para garantir unicidade se necessário
            id: node.id.includes('-') ? node.id : `${node.id}-${Date.now()}-${index}`
          })
        );
        
        // Processa os ícones para garantir que são componentes React válidos
        const processedNodes = processNodeIcons(baseNodesCopy);
        
        console.log("Nós preparados para renderização:", processedNodes);
        
        // Atualiza o workflow com os nós do template
        setWorkflow(processedNodes);
        
        // Carrega as configurações de SLA e exceções, se existirem
        const templateSlaSettings = selectedTemplate.slaSettings || [];
        const templateExceptionFlows = selectedTemplate.exceptionFlows || [];
        
        setSlaSettings(templateSlaSettings.map(setting => ({
          ...setting,
          timeUnit: setting.timeUnit === 'month' ? 'day' : 
                    setting.timeUnit === 'week' ? 'day' : 
                    setting.timeUnit
        })));
        setExceptionFlows([...templateExceptionFlows]);
        
        // Marca que o processo está em andamento
        setprocessInProgress(true);
        
        // Dispara evento para sincronizar com outros componentes
        const processStartedEvent = new CustomEvent('workflow-process-started', {
          detail: { name: selectedTemplate.name }
        });
        window.dispatchEvent(processStartedEvent);
        
        workflowUpdatedRef.current = true;
        console.log("Workflow atualizado com sucesso:", processedNodes.length, "nós");
      } catch (error) {
        console.error("Erro ao processar template:", error);
      }
    } else {
      // Limpa o workflow quando nenhum template está selecionado
      // (mas somente se não estiver sendo manipulado por cancelWorkflow)
      if (!workflowUpdatedRef.current) {
        setWorkflow([]);
        setSlaSettings([]);
        setExceptionFlows([]);
        setprocessInProgress(false);
      }
    }
  }, [selectedTemplate]); // Importante: Só depende do selectedTemplate

  // Função para selecionar um template
  const selectTemplate = (template: IWorkflowTemplate | null) => {
    console.log("Selecionando template:", template?.name || "nenhum");
    
    // Reseta o controle de atualização quando um novo template é selecionado
    workflowUpdatedRef.current = false;
    
    // Limpa o workflow existente antes de selecionar um novo template
    if (template) {
      setWorkflow([]);
    }
    
    // Agora define o novo template
    setSelectedTemplate(template);
  };

  // Função para selecionar um template por ID
  const selectTemplateById = (templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (template) {
      selectTemplate(template);
    }
  };

  // Função para gerar um SavedWorkflow a partir do template atual
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

  // Função para cancelar o processo atual
  const cancelProcess = () => {
    console.log("useTemplateWorkflowIntegration: Cancelando processo");
    
    // Limpar o template
    setSelectedTemplate(null);
    
    // Limpar o workflow
    setWorkflow([]);
    
    // Limpar outras configurações
    setSlaSettings([]);
    setExceptionFlows([]);
    setprocessInProgress(false);
    
    // Disparar evento para comunicação entre componentes
    const processCanceledEvent = new CustomEvent('workflow-process-canceled');
    window.dispatchEvent(processCanceledEvent);
  };

  return {
    selectedTemplate,
    workflow,
    slaSettings,
    exceptionFlows,
    processInProgress,
    selectTemplate,
    selectTemplateById,
    setWorkflow,
    setSlaSettings,
    setExceptionFlows,
    generateSavedWorkflow,
    cancelProcess
  };
};