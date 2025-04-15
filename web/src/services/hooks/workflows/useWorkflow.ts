import { useState, useEffect, useCallback } from 'react';
import { workflowService } from '@/services/general/workflow/WorkflowService';
import { 
  ICustomWorkflow, 
  IWorkflowSettings, 
  IWorkflowStats, 
  IWorkflowTemplate 
} from '@/types/workflow/workflow-types';

export const useWorkflow = () => {
  const [templates, setTemplates] = useState<IWorkflowTemplate[]>([]);
  const [customWorkflows, setCustomWorkflows] = useState<ICustomWorkflow[]>([]);
  const [settings, setSettings] = useState<IWorkflowSettings | null>(null);
  const [stats, setStats] = useState<IWorkflowStats | null>(null);
  const [isLoading, setIsLoading] = useState({
    templates: false,
    workflows: false,
    settings: false,
    stats: false
  });
  const [error, setError] = useState<string | null>(null);

  // Carregar templates de workflow
  const loadTemplates = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, templates: true }));
    setError(null);
    
    try {
      const data = await workflowService.getWorkflowTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar templates');
      console.error('Erro ao carregar templates:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, templates: false }));
    }
  }, []);

  // Carregar workflows personalizados
  const loadCustomWorkflows = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, workflows: true }));
    setError(null);
    
    try {
      const data = await workflowService.getCustomWorkflows();
      setCustomWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar workflows');
      console.error('Erro ao carregar workflows:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, workflows: false }));
    }
  }, []);

  // Carregar configurações
  const loadSettings = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, settings: true }));
    
    try {
      const data = await workflowService.getWorkflowSettings();
      setSettings(data);
    } catch (err) {
      console.error('Erro ao carregar configurações:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, settings: false }));
    }
  }, []);

  // Carregar estatísticas
  const loadStats = useCallback(async () => {
    setIsLoading(prev => ({ ...prev, stats: true }));
    
    try {
      const data = await workflowService.getWorkflowStats();
      setStats(data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setIsLoading(prev => ({ ...prev, stats: false }));
    }
  }, []);

  // Criar workflow personalizado
  const createCustomWorkflow = async (templateId: string, customizations: Partial<ICustomWorkflow> = {}) => {
    setError(null);
    
    try {
      const newWorkflow = await workflowService.createCustomWorkflow(templateId, customizations);
      setCustomWorkflows(prev => [...prev, newWorkflow]);
      return newWorkflow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar workflow');
      console.error('Erro ao criar workflow:', err);
      return null;
    }
  };

  // Atualizar workflow personalizado
  const updateCustomWorkflow = async (id: string, updates: Partial<ICustomWorkflow>) => {
    setError(null);
    
    try {
      const updatedWorkflow = await workflowService.updateCustomWorkflow(id, updates);
      setCustomWorkflows(prev => prev.map(w => w.id === id ? updatedWorkflow : w));
      return updatedWorkflow;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Erro ao atualizar workflow ${id}`);
      console.error(`Erro ao atualizar workflow ${id}:`, err);
      return null;
    }
  };

  // Excluir workflow personalizado
  const deleteCustomWorkflow = async (id: string) => {
    setError(null);
    
    try {
      const success = await workflowService.deleteCustomWorkflow(id);
      if (success) {
        setCustomWorkflows(prev => prev.filter(w => w.id !== id));
      }
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : `Erro ao excluir workflow ${id}`);
      console.error(`Erro ao excluir workflow ${id}:`, err);
      return false;
    }
  };

  // Atualizar configurações
  const updateSettings = async (newSettings: Partial<IWorkflowSettings>) => {
    setError(null);
    
    try {
      const updatedSettings = await workflowService.updateWorkflowSettings(newSettings);
      setSettings(updatedSettings);
      return updatedSettings;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar configurações');
      console.error('Erro ao atualizar configurações:', err);
      return null;
    }
  };

  // Exportar workflow
  const exportWorkflow = async (id: string) => {
    try {
      return await workflowService.exportWorkflow(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : `Erro ao exportar workflow ${id}`);
      console.error(`Erro ao exportar workflow ${id}:`, err);
      return null;
    }
  };

  // Importar workflow
  const importWorkflow = async (workflowJson: string) => {
    setError(null);
    
    try {
      const importedWorkflow = await workflowService.importWorkflow(workflowJson);
      setCustomWorkflows(prev => [...prev, importedWorkflow]);
      return importedWorkflow;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao importar workflow');
      console.error('Erro ao importar workflow:', err);
      return null;
    }
  };

  // Carregar todos os dados iniciais
  const loadAllData = useCallback(async () => {
    await Promise.all([
      loadTemplates(),
      loadCustomWorkflows(),
      loadSettings(),
      loadStats()
    ]);
  }, [loadTemplates, loadCustomWorkflows, loadSettings, loadStats]);

  // Recarregar as estatísticas
  const refreshStats = async () => {
    await loadStats();
  };

  // Filtrar templates por categoria
  const filterTemplatesByCategory = (category: string = 'all') => {
    if (category === 'all') {
      return templates;
    }
    return templates.filter(t => t.category === category);
  };

  // Obter estatísticas resumidas
  const getSummaryStats = () => {
    if (!stats) return null;
    
    return {
      activeProcesses: stats.activeProcesses,
      efficiency: Math.round(stats.efficiencyRate * 100),
      slasCompleted: Math.round((stats.slasCompleted / (stats.activeProcesses || 1)) * 100),
      occupancy: Math.round(stats.occupancyRate.overall * 100),
    };
  };

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    templates,
    customWorkflows,
    settings,
    stats,
    isLoading,
    error,
    loadTemplates,
    loadCustomWorkflows,
    loadSettings,
    loadStats,
    createCustomWorkflow,
    updateCustomWorkflow,
    deleteCustomWorkflow,
    updateSettings,
    exportWorkflow,
    importWorkflow,
    refreshStats,
    filterTemplatesByCategory,
    getSummaryStats
  };
};