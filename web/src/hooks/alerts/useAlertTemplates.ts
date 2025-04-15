import api from "@/services/api";
import { IAlertTemplate } from "@/types/alert-types";
import { useCallback, useEffect, useState } from "react";

// Hook para gerenciar templates de alerta
export const useAlertTemplates = () => {
    const [templates, setTemplates] = useState<IAlertTemplate[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    // Buscar todos os templates
    const fetchTemplates = useCallback(async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Buscando os dados reais da API
        const response = await api.get('/alert-templates');
        
        // Processar os dados da API se necessário
        const templatesData = response.data['alert-templates'] || response.data;
        
        // Verificar se os dados estão no formato esperado
        if (Array.isArray(templatesData)) {
          setTemplates(templatesData);
        } else {
          console.error('Formato de dados inesperado:', templatesData);
          setError('Formato de dados inesperado. Verifique o console para mais detalhes.');
        }
      } catch (err) {
        console.error('Error fetching templates:', err);
        setError('Falha ao carregar templates. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }, []);
    
    // Buscar um template específico
    const fetchTemplateById = useCallback(async (templateId: string) => {
      try {
        // Primeiro verificamos se já temos o template no estado
        const cachedTemplate = templates.find(t => t.id === templateId);
        if (cachedTemplate) {
          return cachedTemplate;
        }
        
        // Se não temos, buscamos da API
        const response = await api.get(`/alert-templates/${templateId}`);
        return response.data;
      } catch (err) {
        console.error('Error fetching template:', err);
        setError('Falha ao carregar template.');
        return null;
      }
    }, [templates]);
    
    // Criar um novo template
    const createTemplate = useCallback(async (templateData: Omit<IAlertTemplate, 'id'>) => {
      try {
        const response = await api.post('/alert-templates', templateData);
        
        // Atualizar o estado local
        setTemplates(prev => [...prev, response.data]);
        
        return response.data;
      } catch (err) {
        console.error('Error creating template:', err);
        setError('Falha ao criar template.');
        return null;
      }
    }, []);
    
    // Atualizar um template existente
    const updateTemplate = useCallback(async (templateId: string, templateData: Partial<IAlertTemplate>) => {
      try {
        const response = await api.patch(`/alert-templates/${templateId}`, templateData);
        
        // Atualizar o estado local
        setTemplates(prev => 
          prev.map(template => 
            template.id === templateId ? response.data : template
          )
        );
        
        return response.data;
      } catch (err) {
        console.error('Error updating template:', err);
        setError('Falha ao atualizar template.');
        return null;
      }
    }, []);
    
    // Excluir um template
    const deleteTemplate = useCallback(async (templateId: string) => {
      try {
        await api.delete(`/alert-templates/${templateId}`);
        
        // Atualizar o estado local
        setTemplates(prev => prev.filter(template => template.id !== templateId));
        
        return true;
      } catch (err) {
        console.error('Error deleting template:', err);
        setError('Falha ao excluir template.');
        return false;
      }
    }, []);
    
    // Efeito para carregar os templates inicialmente
    useEffect(() => {
      fetchTemplates();
    }, [fetchTemplates]);
    
    return {
      templates,
      loading,
      error,
      fetchTemplates,
      fetchTemplateById,
      createTemplate,
      updateTemplate,
      deleteTemplate
    };
};