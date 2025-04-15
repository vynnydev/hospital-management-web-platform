import React, { useState, useEffect, useRef, useCallback } from 'react';
import { authService } from '@/services/general/auth/AuthService';
import { integrationService } from '@/services/general/integration/IntegrationService';
import { Integration } from '@/types/integration-types';
import { 
  FileSpreadsheet, BarChart3, MessageCircle, 
  Mail, FileText, Bell, FileSignature,
  ShieldCheck, BookOpen
} from 'lucide-react';

// Integração aprimorada com ícones e cores de gradiente
export interface EnhancedIntegration extends Integration {
  icon: React.ReactNode;
  gradientColors: string;
}

/**
 * Hook para gerenciar integrações
 * 
 * Este hook fornece acesso e funções para interagir com as integrações do sistema
 */
export const useIntegrations = () => {
  // Estado para armazenar as integrações
  const [integrations, setIntegrations] = useState<EnhancedIntegration[]>([]);
  
  // Estado para controlar carregamento e erros
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Referência ao usuário atual
  const user = authService.getCurrentUser();
  
  // Referência para controlar requisições em andamento e evitar loops
  const isRequestPending = useRef(false);

  // Função para obter o ícone baseado no ID da integração
  const getIntegrationIcon = useCallback((id: string): JSX.Element => {
    switch (id) {
      case 'docsign':
        return React.createElement(FileSignature, { className: "w-6 h-6 text-teal-600" });
      case 'word':
        return React.createElement(FileText, { className: "w-6 h-6 text-blue-600" });
      case 'excel':
        return React.createElement(FileSpreadsheet, { className: "w-6 h-6 text-green-600" });
      case 'pdf':
        return React.createElement(FileText, { className: "w-6 h-6 text-orange-600" });
      case 'powerbi':
        return React.createElement(BarChart3, { className: "w-6 h-6 text-purple-600" });
      case 'slack':
        return React.createElement(MessageCircle, { className: "w-6 h-6 text-blue-600" });
      case 'teams':
        return React.createElement(Bell, { className: "w-6 h-6 text-indigo-600" });
      case 'whatsapp':
        return React.createElement(MessageCircle, { className: "w-6 h-6 text-green-600" });
      case 'email':
        return React.createElement(Mail, { className: "w-6 h-6 text-red-600" });
      case 'jira':
        return React.createElement(FileSpreadsheet, { className: "w-6 h-6 text-blue-600" });
      case 'ehr':
        return React.createElement(BookOpen, { className: "w-6 h-6 text-blue-600" });
      case 'security':
        return React.createElement(ShieldCheck, { className: "w-6 h-6 text-red-600" });
      default:
        return React.createElement(FileText, { className: "w-6 h-6 text-gray-600" });
    }
  }, []);

  // Função para obter o gradiente baseado na categoria
  const getCategoryGradient = useCallback((category: string): string => {
    switch (category) {
      case 'export':
        return 'bg-gradient-to-br from-green-600 to-emerald-600';
      case 'analytics':
        return 'bg-gradient-to-br from-purple-600 to-indigo-600';
      case 'communication':
        return 'bg-gradient-to-br from-blue-600 to-cyan-600';
      case 'security':
        return 'bg-gradient-to-br from-red-600 to-rose-600';
      case 'interoperability':
        return 'bg-gradient-to-br from-blue-600 to-indigo-600';
      default:
        return 'bg-gradient-to-br from-gray-600 to-gray-700';
    }
  }, []);

  // Função para buscar integrações
  const fetchIntegrations = useCallback(async () => {
    // Não fazer nada se uma requisição já estiver em andamento
    if (isRequestPending.current) return;
    
    // Marcar que uma requisição está em andamento
    isRequestPending.current = true;
    
    // Indicar carregamento e limpar erros
    setIsLoading(true);
    setError(null);
    
    try {
      let fetchedIntegrations: Integration[] = [];
      
      if (user) {
        // Busca integrações específicas para o usuário logado
        fetchedIntegrations = await integrationService.getIntegrationsForUser(user.id);
      } else {
        // Busca todas as integrações se não houver usuário
        fetchedIntegrations = await integrationService.getIntegrations();
      }
      
      // Aprimorar as integrações com ícones e gradientes
      const enhancedIntegrations: EnhancedIntegration[] = fetchedIntegrations.map(integration => ({
        ...integration,
        icon: getIntegrationIcon(integration.id),
        gradientColors: getCategoryGradient(integration.category)
      }));
      
      // Atualizar o estado com as integrações aprimoradas
      setIntegrations(enhancedIntegrations);
    } catch (err) {
      console.error('Erro ao buscar integrações:', err);
      setError('Não foi possível carregar as integrações. Tente novamente mais tarde.');
    } finally {
      // Terminar o carregamento e marcar que a requisição terminou
      setIsLoading(false);
      isRequestPending.current = false;
    }
  }, [user, getIntegrationIcon, getCategoryGradient]);

  // Carregar integrações ao inicializar o hook
  useEffect(() => {
    fetchIntegrations();
  }, [fetchIntegrations]);

  // Alternar estado ativo/inativo da integração
  const toggleIntegrationStatus = useCallback(async (id: string): Promise<boolean> => {
    try {
      const integration = integrations.find(i => i.id === id);
      
      if (!integration) {
        throw new Error(`Integração ${id} não encontrada`);
      }
      
      const newStatus = !integration.isActive;
      const success = await integrationService.toggleIntegrationStatus(id, newStatus);
      
      if (success) {
        // Atualiza o estado local
        setIntegrations(prevIntegrations => 
          prevIntegrations.map(item =>
            item.id === id ? { ...item, isActive: newStatus } : item
          )
        );
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao alternar status da integração:', error);
      setError('Falha ao ativar/desativar a integração. Tente novamente.');
      return false;
    }
  }, [integrations]);

  // Atualizar configurações de uma integração
  const updateIntegrationConfig = useCallback(async (id: string, configData: Record<string, any>): Promise<boolean> => {
    try {
      const success = await integrationService.updateIntegrationConfig(id, configData);
      
      if (success) {
        // Atualiza o estado local
        setIntegrations(prevIntegrations => 
          prevIntegrations.map(integration =>
            integration.id === id
              ? { 
                  ...integration, 
                  config: { ...(integration.config || {}), ...configData },
                  updatedAt: new Date().toISOString()
                }
              : integration
          )
        );
      }
      
      return success;
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      setError('Falha ao salvar configurações da integração. Tente novamente.');
      return false;
    }
  }, []);

  // Testar conexão com uma integração
  const testIntegrationConnection = useCallback(async (id: string): Promise<{ success: boolean; message: string }> => {
    try {
      return await integrationService.testIntegrationConnection(id);
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      return { 
        success: false, 
        message: 'Falha ao testar a conexão. Verifique sua conexão de rede.'
      };
    }
  }, []);

  // Obter configurações de uma integração
  const getIntegrationConfig = useCallback((id: string): Record<string, any> | null => {
    const integration = integrations.find(i => i.id === id);
    return integration?.config || null;
  }, [integrations]);

  // Recarregar integrações manualmente
  const refreshIntegrations = useCallback(async (): Promise<void> => {
    await fetchIntegrations();
  }, [fetchIntegrations]);

  // Retornar os dados e funções do hook
  return {
    integrations,
    isLoading,
    error,
    toggleIntegrationStatus,
    updateIntegrationConfig,
    getIntegrationConfig,
    testIntegrationConnection,
    refreshIntegrations
  };
};