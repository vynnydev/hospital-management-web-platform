import { useState, useEffect, useCallback } from 'react';
import { IFinanceData, IFinanceSettings } from '@/types/finance-types';
import { authService } from '@/services/general/auth/AuthService';
import { usePermissions } from '@/hooks/auth/usePermissions';
import { AxiosError } from 'axios';
import api from '@/services/api';

// Hook para gerenciar configurações financeiras
export const useFinanceData = (selectedHospitalId?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [financeData, setFinanceData] = useState<IFinanceData | null>(null);
  const [currentHospitalId, setCurrentHospitalId] = useState<string | undefined>(selectedHospitalId);
  
  const { permissions, loading: permissionsLoading } = usePermissions();
  
  // Função para obter configurações para o hospital selecionado
  const getHospitalSettings = useCallback((hospitalId?: string) => {
    if (!financeData || !hospitalId) return null;
    
    // Retorna as configurações específicas do hospital ou as configurações padrão da rede
    return financeData.settings[hospitalId] || financeData.networkDefaults;
  }, [financeData]);
  
  // Função para atualizar configurações financeiras
  const updateFinanceSettings = useCallback(async (
    hospitalId: string,
    settings: Partial<IFinanceSettings>
  ) => {
    try {
      setLoading(true);
      
      // Verificar se o usuário tem permissões para atualizar configurações
      const hasAdminPermission = permissions?.includes('MANAGE_FINANCIAL_SETTINGS');
      if (!hasAdminPermission) {
        throw new Error('Permissão negada: Você não tem direitos para modificar configurações financeiras');
      }
      
      // Obter configurações atuais e mesclá-las com as novas configurações
      const currentSettings = getHospitalSettings(hospitalId);
      
      if (!currentSettings) {
        throw new Error('Configurações não encontradas para este hospital');
      }
      
      const updatedSettings: IFinanceSettings = {
        ...currentSettings,
        ...settings,
        lastUpdated: new Date().toISOString(),
        updatedBy: authService.getCurrentUser()?.id || 'unknown'
      };
      
      // Enviar para a API
      const response = await api.put(`/financeSettings/${hospitalId}`, updatedSettings);
      
      if (response.status === 200) {
        // Atualizar estado local após confirmação do servidor
        setFinanceData(prevData => {
          if (!prevData) return prevData;
          
          return {
            ...prevData,
            settings: {
              ...prevData.settings,
              [hospitalId]: updatedSettings
            }
          };
        });
        
        setError(null);
        return updatedSettings;
      } else {
        throw new Error('Falha ao atualizar configurações financeiras');
      }
    } catch (err) {
      console.error('Erro ao atualizar configurações financeiras:', err);
      
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || 
          'Falha na comunicação com o servidor'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao atualizar configurações');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [permissions, getHospitalSettings]);
  
  // Função para definir configurações padrão para toda a rede
  const setNetworkDefaults = useCallback(async (settings: Partial<IFinanceSettings>) => {
    try {
      setLoading(true);
      
      // Verificar se o usuário tem permissões para atualizar configurações da rede
      const hasAdminPermission = permissions?.includes('MANAGE_NETWORK_SETTINGS');
      if (!hasAdminPermission) {
        throw new Error('Permissão negada: Você não tem direitos para modificar configurações da rede');
      }
      
      // Obter configurações atuais e mesclá-las com as novas configurações
      const currentSettings = financeData?.networkDefaults;
      
      if (!currentSettings) {
        throw new Error('Configurações padrão da rede não encontradas');
      }
      
      const updatedSettings: IFinanceSettings = {
        ...currentSettings,
        ...settings,
        lastUpdated: new Date().toISOString(),
        updatedBy: authService.getCurrentUser()?.id || 'unknown'
      };
      
      // Enviar para a API
      const response = await api.put('/financeSettings/network/defaults', updatedSettings);
      
      if (response.status === 200) {
        // Atualizar estado local após confirmação do servidor
        setFinanceData(prevData => {
          if (!prevData) return prevData;
          
          return {
            ...prevData,
            networkDefaults: updatedSettings
          };
        });
        
        setError(null);
        return updatedSettings;
      } else {
        throw new Error('Falha ao atualizar configurações padrão da rede');
      }
    } catch (err) {
      console.error('Erro ao atualizar configurações padrão da rede:', err);
      
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || 
          'Falha na comunicação com o servidor'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao atualizar configurações');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [permissions, financeData]);
  
  // Função para aplicar configurações de um hospital para toda a rede
  const applyHospitalSettingsToNetwork = useCallback(async (hospitalId: string) => {
    try {
      const hospitalSettings = getHospitalSettings(hospitalId);
      
      if (!hospitalSettings) {
        throw new Error('Configurações do hospital não encontradas');
      }
      
      await setNetworkDefaults(hospitalSettings);
      
      return true;
    } catch (err) {
      console.error('Erro ao aplicar configurações hospitalares como padrão da rede:', err);
      throw err;
    }
  }, [getHospitalSettings, setNetworkDefaults]);
  
  // Função para verificar se um hospital usa as configurações padrão da rede
  const usesNetworkDefaults = useCallback((hospitalId: string) => {
    if (!financeData) return true;
    
    // Se o hospital não tem configurações próprias, usa as padrão da rede
    return !financeData.settings[hospitalId];
  }, [financeData]);
  
  // Função para resetar as configurações de um hospital para as padrão da rede
  const resetToNetworkDefaults = useCallback(async (hospitalId: string) => {
    try {
      setLoading(true);
      
      // Enviar para a API
      const response = await api.delete(`/financeSettings/${hospitalId}`);
      
      if (response.status === 200) {
        // Atualizar estado local após confirmação do servidor
        setFinanceData(prevData => {
          if (!prevData) return prevData;
          
          const newSettings = { ...prevData.settings };
          delete newSettings[hospitalId];
          
          return {
            ...prevData,
            settings: newSettings
          };
        });
        
        setError(null);
        return true;
      } else {
        throw new Error('Falha ao resetar configurações');
      }
    } catch (err) {
      console.error('Erro ao resetar configurações:', err);
      
      if (err instanceof AxiosError) {
        setError(
          err.response?.data?.message || 
          'Falha na comunicação com o servidor'
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro desconhecido ao resetar configurações');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Efeito para carregar dados iniciais
  useEffect(() => {
    let mounted = true;
    
    const fetchFinanceData = async () => {
      if (permissionsLoading) return;
      
      try {
        setLoading(true);
        
        // Verificar se o usuário está autenticado
        const user = authService.getCurrentUser();
        if (!user) {
          throw new Error('Usuário não autenticado');
        }
        
        // Fazer requisição para a API
        const response = await api.get('/financeSettings');
        
        if (!mounted) return;
        
        if (response.data) {
          setFinanceData({
            settings: response.data.settings || {},
            networkDefaults: response.data.networkDefaults || {},
            loading: false
          });
          setError(null);
        } else {
          throw new Error('Formato de dados inválido');
        }
      } catch (err) {
        console.error('Erro ao carregar configurações financeiras:', err);
        
        if (mounted) {
          if (err instanceof AxiosError) {
            setError(
              err.response?.data?.message || 
              'Falha na comunicação com o servidor'
            );
          } else if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Erro desconhecido ao carregar configurações');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    fetchFinanceData();
    
    return () => {
      mounted = false;
    };
  }, [permissionsLoading]);
  
  // Efeito para atualizar o hospital selecionado atual
  useEffect(() => {
    if (selectedHospitalId !== currentHospitalId) {
      setCurrentHospitalId(selectedHospitalId);
    }
  }, [selectedHospitalId, currentHospitalId]);
  
  return {
    financeData,
    loading,
    error,
    getHospitalSettings,
    updateFinanceSettings,
    setNetworkDefaults,
    applyHospitalSettingsToNetwork,
    usesNetworkDefaults,
    resetToNetworkDefaults,
    currentSettings: getHospitalSettings(currentHospitalId)
  };
};