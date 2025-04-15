/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import { 
  ISecurityComplianceData, 
  IAuditLog, 
  ISecurityAlert,
  IVulnerabilityScan,
  IPasswordPolicy,
  IComplianceConfig,
  IConsentConfig,
  IRBAPolicy
} from '@/types/security-compliance-types';
import api from '@/services/api';
import { AxiosError } from 'axios';

const API_BASE_PATH = '/security';

export const useSecurityCompliance = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [securityData, setSecurityData] = useState<ISecurityComplianceData | null>(null);
  const [auditLogs, setAuditLogs] = useState<IAuditLog[]>([]);
  const [securityAlerts, setSecurityAlerts] = useState<ISecurityAlert[]>([]);
  const [vulnerabilityScans, setVulnerabilityScans] = useState<IVulnerabilityScan[]>([]);
  
  // Paginação para logs
  const [logsPagination, setLogsPagination] = useState({
    page: 1,
    perPage: 20,
    totalItems: 0,
    totalPages: 0
  });

  // Filtros para logs
  const [logsFilter, setLogsFilter] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    action: '',
    severity: '',
    category: '',
    result: '',
    search: ''
  });

  // Carrega todos os dados de segurança e conformidade
  const fetchSecurityData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`config`);
      
      if (response.data) {
        setSecurityData(response.data);
        setError(null);
      } else {
        throw new Error('Dados de segurança inválidos');
      }
    } catch (err) {
      console.error('Erro ao carregar dados de segurança:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao exportar logs de auditoria');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Executa um scan de vulnerabilidade
  const runVulnerabilityScan = useCallback(async (scanType: 'automated' | 'manual' | 'penetration_test', scanTool?: string) => {
    try {
      setLoading(true);
      
      const response = await api.post(`vulnerability-scans`, {
        scanType,
        scanTool
      });
      
      if (response.data) {
        // Adiciona o novo scan ao estado
        setVulnerabilityScans(prev => [response.data, ...prev]);
        
        setError(null);
        return response.data;
      } else {
        throw new Error('Falha ao iniciar scan de vulnerabilidade');
      }
    } catch (err) {
      console.error('Erro ao iniciar scan de vulnerabilidade:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao iniciar scan de vulnerabilidade');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza configuração de monitoramento de ameaças
  const updateThreatMonitoring = useCallback(async (config: any) => {
    try {
      setLoading(true);
      
      const response = await api.put(`threat-monitoring`, config);
      
      if (response.data && securityData) {
        setSecurityData({
          ...securityData,
          threatMonitoring: response.data
        });
        
        setError(null);
        return response.data;
      } else {
        throw new Error('Falha ao atualizar configuração de monitoramento de ameaças');
      }
    } catch (err) {
      console.error('Erro ao atualizar configuração de monitoramento de ameaças:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao atualizar monitoramento de ameaças');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [securityData]);

  // Gera um relatório de compliance
  const generateComplianceReport = useCallback(async (regulationType: string, format: 'pdf' | 'html' | 'csv' | 'json') => {
    try {
      setLoading(true);
      
      const response = await api.get(
        `compliance/${regulationType}/report?format=${format}`,
        { responseType: 'blob' }
      );
      
      setError(null);
      
      // Cria URL para download do arquivo
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', `compliance-report-${regulationType}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (err) {
      console.error('Erro ao gerar relatório de compliance:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao gerar relatório de compliance');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Atualiza configurações de controle de acesso
  const updateAccessControlConfig = useCallback(async (config: any) => {
    try {
      setLoading(true);
      
      const response = await api.put(`access-control`, config);
      
      if (response.data && securityData) {
        setSecurityData({
          ...securityData,
          accessControlConfig: response.data
        });
        
        setError(null);
        return response.data;
      } else {
        throw new Error('Falha ao atualizar configuração de controle de acesso');
      }
    } catch (err) {
      console.error('Erro ao atualizar configuração de controle de acesso:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao atualizar controle de acesso');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [securityData]);

  // Atualiza configurações de retenção de logs
  const updateLogRetentionPolicy = useCallback(async (config: any) => {
    try {
      setLoading(true);
      
      const response = await api.put(`log-retention`, config);
      
      if (response.data && securityData) {
        setSecurityData({
          ...securityData,
          logRetentionPolicy: response.data
        });
        
        setError(null);
        return response.data;
      } else {
        throw new Error('Falha ao atualizar política de retenção de logs');
      }
    } catch (err) {
      console.error('Erro ao atualizar política de retenção de logs:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao atualizar política de retenção de logs');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [securityData]);

  // Atualiza configurações de API
  const updateAPISecurityConfig = useCallback(async (config: any) => {
    try {
      setLoading(true);
      
      const response = await api.put(`api-security`, config);
      
      if (response.data && securityData) {
        setSecurityData({
          ...securityData,
          apiSecurityConfig: response.data
        });
        
        setError(null);
        return response.data;
      } else {
        throw new Error('Falha ao atualizar configuração de segurança da API');
      }
    } catch (err) {
      console.error('Erro ao atualizar configuração de segurança da API:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao atualizar segurança da API');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [securityData]);

  // Calcular estatísticas de logs
  const getAuditLogStats = useCallback(async (timeframe: 'day' | 'week' | 'month' | 'year' = 'week') => {
    try {
      const response = await api.get(`audit-logs/stats?timeframe=${timeframe}`);
      
      if (response.data) {
        return response.data;
      } else {
        throw new Error('Falha ao obter estatísticas de logs');
      }
    } catch (err) {
      console.error('Erro ao obter estatísticas de logs:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao obter estatísticas de logs');
      }
      throw err;
    }
  }, []);

  // Executa uma avaliação de compliance
  const runComplianceAssessment = useCallback(async (regulationType: string) => {
    try {
      setLoading(true);
      
      const response = await api.post(`compliance/${regulationType}/assessment`);
      
      if (response.data && securityData) {
        // Atualiza o status da configuração de compliance
        const updatedConfigs = securityData.complianceConfigs.map(config => 
          config.regulation === regulationType 
            ? { ...config, lastAudit: new Date().toISOString(), ...response.data }
            : config
        );
        
        setSecurityData({
          ...securityData,
          complianceConfigs: updatedConfigs
        });
        
        setError(null);
        return response.data;
      } else {
        throw new Error('Falha ao executar avaliação de compliance');
      }
    } catch (err) {
      console.error('Erro ao executar avaliação de compliance:', err);
      
      if (err instanceof AxiosError) {
        setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
      } else {
        setError('Erro ao executar avaliação de compliance');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [securityData]);

  // Carrega dados iniciais
  useEffect(() => {
    fetchSecurityData();
  }, [fetchSecurityData]);

    // Carrega logs de auditoria com paginação e filtros
    const fetchAuditLogs = useCallback(async (
        page = logsPagination.page,
        perPage = logsPagination.perPage,
        filters = logsFilter
      ) => {
        try {
          setLoading(true);
          
          const queryParams = new URLSearchParams({
            page: page.toString(),
            perPage: perPage.toString(),
            ...Object.entries(filters)
              .filter(([_, value]) => value !== '')
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
          });
          
          const response = await api.get(`audit-logs?${queryParams}`);
          
          if (response.data) {
            setAuditLogs(response.data.logs || []);
            setLogsPagination({
              page: response.data.page || 1,
              perPage: response.data.perPage || 20,
              totalItems: response.data.totalItems || 0,
              totalPages: response.data.totalPages || 0
            });
            setError(null);
          } else {
            throw new Error('Dados de logs inválidos');
          }
        } catch (err) {
          console.error('Erro ao carregar logs de auditoria:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao carregar logs de auditoria');
          }
        } finally {
          setLoading(false);
        }
      }, [logsPagination.page, logsPagination.perPage, logsFilter]);
    
      // Carrega alertas de segurança
      const fetchSecurityAlerts = useCallback(async (status?: string) => {
        try {
          setLoading(true);
          
          const queryParams = status ? `?status=${status}` : '';
          const response = await api.get(`alerts${queryParams}`);
          
          if (response.data) {
            setSecurityAlerts(response.data);
            setError(null);
          } else {
            throw new Error('Dados de alertas inválidos');
          }
        } catch (err) {
          console.error('Erro ao carregar alertas de segurança:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao carregar alertas de segurança');
          }
        } finally {
          setLoading(false);
        }
      }, []);
    
      // Carrega dados de scans de vulnerabilidade
      const fetchVulnerabilityScans = useCallback(async () => {
        try {
          setLoading(true);
          
          const response = await api.get(`vulnerability-scans`);
          
          if (response.data) {
            setVulnerabilityScans(response.data);
            setError(null);
          } else {
            throw new Error('Dados de scans inválidos');
          }
        } catch (err) {
          console.error('Erro ao carregar scans de vulnerabilidade:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao carregar scans de vulnerabilidade');
          }
        } finally {
          setLoading(false);
        }
      }, []);
    
      // Atualiza política de senhas
      const updatePasswordPolicy = useCallback(async (policy: IPasswordPolicy) => {
        try {
          setLoading(true);
          
          const response = await api.put(`password-policy/${policy.id}`, policy);
          
          if (response.data && securityData) {
            // Atualiza o estado com a nova política
            const updatedPolicies = securityData.passwordPolicies.map(p => 
              p.id === policy.id ? response.data : p
            );
            
            setSecurityData({
              ...securityData,
              passwordPolicies: updatedPolicies
            });
            
            setError(null);
            return response.data;
          } else {
            throw new Error('Falha ao atualizar política de senhas');
          }
        } catch (err) {
          console.error('Erro ao atualizar política de senhas:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao atualizar política de senhas');
          }
          throw err;
        } finally {
          setLoading(false);
        }
      }, [securityData]);
    
      // Cria nova política de senhas
      const createPasswordPolicy = useCallback(async (policy: Omit<IPasswordPolicy, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
          setLoading(true);
          
          const response = await api.post(`password-policy`, policy);
          
          if (response.data && securityData) {
            // Adiciona a nova política ao estado
            setSecurityData({
              ...securityData,
              passwordPolicies: [...securityData.passwordPolicies, response.data]
            });
            
            setError(null);
            return response.data;
          } else {
            throw new Error('Falha ao criar política de senhas');
          }
        } catch (err) {
          console.error('Erro ao criar política de senhas:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao criar política de senhas');
          }
          throw err;
        } finally {
          setLoading(false);
        }
      }, [securityData]);
    
      // Atualiza configuração de MFA
      const updateMFAConfig = useCallback(async (updatedConfig: any) => {
        try {
          setLoading(true);
          
          const response = await api.put(`mfa-config`, updatedConfig);
          
          if (response.data && securityData) {
            setSecurityData({
              ...securityData,
              mfaConfig: response.data
            });
            
            setError(null);
            return response.data;
          } else {
            throw new Error('Falha ao atualizar configuração de MFA');
          }
        } catch (err) {
          console.error('Erro ao atualizar configuração de MFA:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao atualizar configuração de MFA');
          }
          throw err;
        } finally {
          setLoading(false);
        }
      }, [securityData]);
    
      // Atualiza configuração de sessão
      const updateSessionConfig = useCallback(async (updatedConfig: any) => {
        try {
          setLoading(true);
          
          const response = await api.put(`session-config`, updatedConfig);
          
          if (response.data && securityData) {
            setSecurityData({
              ...securityData,
              sessionConfig: response.data
            });
            
            setError(null);
            return response.data;
          } else {
            throw new Error('Falha ao atualizar configuração de sessão');
          }
        } catch (err) {
          console.error('Erro ao atualizar configuração de sessão:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao atualizar configuração de sessão');
          }
          throw err;
        } finally {
          setLoading(false);
        }
      }, [securityData]);
    
      // Atualiza configuração de compliance
      const updateComplianceConfig = useCallback(async (config: IComplianceConfig) => {
        try {
          setLoading(true);
          
          const response = await api.put(`compliance/${config.id}`, config);
          
          if (response.data && securityData) {
            // Atualiza a configuração específica
            const updatedConfigs = securityData.complianceConfigs.map(c => 
              c.id === config.id ? response.data : c
            );
            
            setSecurityData({
              ...securityData,
              complianceConfigs: updatedConfigs
            });
            
            setError(null);
            return response.data;
          } else {
            throw new Error('Falha ao atualizar configuração de compliance');
          }
        } catch (err) {
          console.error('Erro ao atualizar configuração de compliance:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao atualizar configuração de compliance');
          }
          throw err;
        } finally {
          setLoading(false);
        }
      }, [securityData]);
    
      // Atualiza configuração de consentimento
      const updateConsentConfig = useCallback(async (config: IConsentConfig) => {
        try {
          setLoading(true);
          
          const response = await api.put(`consent-config`, config);
          
          if (response.data && securityData) {
            setSecurityData({
              ...securityData,
              consentConfig: response.data
            });
            
            setError(null);
            return response.data;
          } else {
            throw new Error('Falha ao atualizar configuração de consentimento');
          }
        } catch (err) {
          console.error('Erro ao atualizar configuração de consentimento:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao atualizar configuração de consentimento');
          }
          throw err;
        } finally {
          setLoading(false);
        }
      }, [securityData]);
    
      // Atualiza política de acesso RBAC
      const updateRBAPolicy = useCallback(async (policy: IRBAPolicy) => {
        try {
          setLoading(true);
          
          const response = await api.put(`rbac-policy/${policy.id}`, policy);
          
          if (response.data && securityData && securityData.rbaPolicy) {
            // Atualiza a política específica
            const updatedPolicies = securityData.rbaPolicy.map(p => 
              p.id === policy.id ? response.data : p
            );
            
            setSecurityData({
              ...securityData,
              rbaPolicy: updatedPolicies
            });
            
            setError(null);
            return response.data;
          } else {
            throw new Error('Falha ao atualizar política RBAC');
          }
        } catch (err) {
          console.error('Erro ao atualizar política RBAC:', err);
          
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao atualizar política RBAC');
          }
          throw err;
        } finally {
          setLoading(false);
        }
      }, [securityData]);

        // Cria novo log de auditoria
    const createAuditLog = useCallback(async (log: Omit<IAuditLog, 'id' | 'timestamp'>) => {
        try {
        const response = await api.post(`audit-logs`, log);
        
        if (response.data) {
            // Não atualizamos o estado aqui para evitar conflitos com a paginação
            return response.data;
        } else {
            throw new Error('Falha ao criar log de auditoria');
        }
        } catch (err) {
        console.error('Erro ao criar log de auditoria:', err);
        
        if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
        } else {
            setError('Erro ao criar log de auditoria');
        }
        throw err;
        }
    }, []);

    // Atualiza status de um alerta de segurança
    const updateAlertStatus = useCallback(async (
        alertId: string, 
        status: 'new' | 'investigating' | 'resolved' | 'false_positive',
        notes?: string
    ) => {
        try {
        setLoading(true);
        
        const response = await api.patch(`alerts/${alertId}`, {
            status,
            resolutionNotes: notes,
            resolvedAt: status === 'resolved' || status === 'false_positive' ? new Date().toISOString() : undefined
        });
        
        if (response.data) {
            // Atualiza o status do alerta no estado
            setSecurityAlerts(prev => prev.map(alert => 
            alert.id === alertId ? response.data : alert
            ));
            
            setError(null);
            return response.data;
        } else {
            throw new Error('Falha ao atualizar status do alerta');
        }
        } catch (err) {
        console.error('Erro ao atualizar status do alerta:', err);
        
        if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
        } else {
            setError('Erro ao atualizar status do alerta');
        }
        throw err;
        } finally {
        setLoading(false);
        }
    }, []);

    // Exporta logs de auditoria
    const exportAuditLogs = useCallback(async (format: 'csv' | 'json' | 'pdf', filters = logsFilter) => {
        try {
          setLoading(true);
          
          const queryParams = new URLSearchParams({
            format,
            ...Object.entries(filters)
              .filter(([_, value]) => value !== '')
              .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {})
          });
          
          const response = await api.get(
            `audit-logs/export?${queryParams}`,
            { responseType: 'blob' }
          );
          
          setError(null);
          
          // Cria URL para download do arquivo
          const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.setAttribute('download', `audit-logs.${format}`);
          document.body.appendChild(link);
          link.click();
          link.remove();
          
          return true;
        } catch (err) {
          console.error('Erro ao exportar logs de auditoria:', err);
          if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
          } else {
            setError('Erro ao carregar configurações de segurança');
        }
      } finally {
        setLoading(false);
      }
    }, [logsFilter]);

    // Atualiza configurações de exportação de logs
    const updateLogExportConfig = useCallback(async (config: any) => {
        try {
        setLoading(true);
        
        const response = await api.put(`log-export`, config);
        
        if (response.data && securityData) {
            setSecurityData({
            ...securityData,
            logExportConfig: response.data
            });
            
            setError(null);
            return response.data;
        } else {
            throw new Error('Falha ao atualizar configuração de exportação de logs');
        }
        } catch (err) {
        console.error('Erro ao atualizar configuração de exportação de logs:', err);
        
        if (err instanceof AxiosError) {
            setError(err.response?.data?.message || 'Erro na comunicação com o servidor');
        } else {
            setError('Erro ao atualizar exportação de logs');
        }
        throw err;
        } finally {
        setLoading(false);
        }
    }, [securityData]);

    // Retorna dados e funções
    return {
        // Estado
        loading,
        error,
        securityData,
        auditLogs,
        securityAlerts,
        vulnerabilityScans,
        logsPagination,
        logsFilter,
        
        // Funções de carregamento
        fetchSecurityData,
        fetchAuditLogs,
        fetchSecurityAlerts,
        fetchVulnerabilityScans,
        
        // Ações de configuração
        updatePasswordPolicy,
        createPasswordPolicy,
        updateMFAConfig,
        updateSessionConfig,
        updateComplianceConfig, 
        updateConsentConfig,
        updateRBAPolicy,
        updateThreatMonitoring,
        updateAccessControlConfig,
        updateLogRetentionPolicy,
        updateAPISecurityConfig,
        
        // Ações de log e auditoria
        createAuditLog,
        setLogsFilter,
        exportAuditLogs,
        getAuditLogStats,
        
        // Ações de segurança
        updateAlertStatus,
        runVulnerabilityScan,
        
        // Ações de compliance
        generateComplianceReport,
        runComplianceAssessment,

        // Atualiza configurações de exportação de logs
        updateLogExportConfig
    };
};