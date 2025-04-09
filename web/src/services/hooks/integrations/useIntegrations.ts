import { useState, useEffect } from 'react';
import { Integration } from '@/types/integration-types';
import { authService } from '@/services/auth/AuthService';
import { TPermission } from '@/types/auth-types';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const useIntegrations = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchIntegrations = async () => {
      setIsLoading(true);
      try {
        // Em um ambiente real, isso seria uma chamada à API
        const response = await fetch(`${BASE_URL}/api/integrations`);
        if (!response.ok) {
          throw new Error('Falha ao buscar integrações');
        }
        const data = await response.json();
        
        // Filtra integrações baseadas nas permissões e role do usuário
        const userRole = user?.role || 'paciente';
        const userPermissions: TPermission[] = authService.getUserPermissions();
        
        const filteredIntegrations = data.filter((integration: Integration) => {
          // Verifica se a integração está disponível para o role do usuário
          const roleAvailable = integration.availableForRoles.includes(userRole);
          
          // Verifica se o usuário tem todas as permissões necessárias
          const hasPermissions = integration.requiredPermissions.every(
            (permission) => userPermissions.includes(permission as any)
          );
          
          return roleAvailable && hasPermissions;
        });
        
        setIntegrations(filteredIntegrations);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchIntegrations();
    }
  }, [user]);

  const toggleIntegrationStatus = async (id: string) => {
    try {
      const updatedIntegrations = integrations.map(integration => 
        integration.id === id ? { ...integration, isActive: !integration.isActive } : integration
      );
      
      // Em um ambiente real, isso seria uma chamada à API para atualizar o status
      await fetch(`/api/integrations/${id}/toggle`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          isActive: updatedIntegrations.find(i => i.id === id)?.isActive 
        })
      });
      
      setIntegrations(updatedIntegrations);
      return true;
    } catch (error) {
      console.error('Erro ao ativar/desativar integração:', error);
      return false;
    }
  };

  const updateIntegrationConfig = async (id: string, configData: Record<string, any>) => {
    try {
      // Em um ambiente real, isso seria uma chamada à API para atualizar a configuração
      await fetch(`/api/integrations/${id}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configData)
      });
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      return false;
    }
  };

  return { 
    integrations, 
    isLoading, 
    error, 
    toggleIntegrationStatus, 
    updateIntegrationConfig 
  };
};