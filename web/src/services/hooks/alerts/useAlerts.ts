import { useState, useEffect, useCallback } from 'react';
import { 
  IAlert, 
  IAlertTemplate, 
  IAlertFilters, 
  TAlertStatus,
  IUnreadAlertCount,
  TAlertPriority,
  TAlertType
} from '@/types/alert-types';
import api from '@/services/api';

// Hook para gerenciar alertas
export const useAlerts = (hospitalId?: string) => {
    const [alerts, setAlerts] = useState<IAlert[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState<IUnreadAlertCount>({
      total: 0,
      highPriority: 0,
      byType: {
        resource: 0,
        'patient-arrival': 0,
        ambulance: 0,
        emergency: 0,
        system: 0,
        occupancy: 0,
        staff: 0,
        operational: 0,
        equipment: 0,
        warning: 0,
        info: 0,
        success: 0,
        error: 0
      }
    });
    
    // Função para buscar os alertas
    const fetchAlerts = useCallback(async (filters?: IAlertFilters) => {
      setLoading(true);
      setError(null);
      
      try {
        // Sempre usar o endpoint /alerts
        const url = '/alerts';
        
        // Usar any para evitar erros de tipagem
        const response = await api.get(url);
        const responseData = response.data as any;
        
        // Extrair os alertas da resposta
        let allAlerts: IAlert[] = [];
        
        if (Array.isArray(responseData)) {
          allAlerts = responseData;
        } else if (responseData && typeof responseData === 'object') {
          if (Array.isArray(responseData.alerts)) {
            allAlerts = responseData.alerts;
          } else {
            // Tentar encontrar a primeira propriedade que é um array
            const arrayProps = Object.keys(responseData).filter(key => 
              Array.isArray(responseData[key])
            );
            
            if (arrayProps.length > 0) {
              allAlerts = responseData[arrayProps[0]];
            }
          }
        }
        
        // Filtrar por hospitalId no lado do cliente se necessário
        let filteredAlerts = allAlerts;
        if (hospitalId) {
          filteredAlerts = allAlerts.filter(alert => alert.hospitalId === hospitalId);
        }
        
        // Aplicar filtros adicionais
        if (filters) {
          if (filters.type && filters.type !== 'all') {
            filteredAlerts = filteredAlerts.filter(alert => alert.type === filters.type);
          }
          
          if (filters.priority && filters.priority !== 'all') {
            filteredAlerts = filteredAlerts.filter(alert => alert.priority === filters.priority);
          }
          
          if (filters.status && filters.status !== 'all') {
            filteredAlerts = filteredAlerts.filter(alert => alert.status === filters.status);
          }
          
          if (filters.read !== undefined) {
            filteredAlerts = filteredAlerts.filter(alert => alert.read === filters.read);
          }
          
          if (filters.startDate) {
            filteredAlerts = filteredAlerts.filter(alert => 
              new Date(alert.timestamp) >= filters.startDate!
            );
          }
          
          if (filters.endDate) {
            filteredAlerts = filteredAlerts.filter(alert => 
              new Date(alert.timestamp) <= filters.endDate!
            );
          }
        }
        
        // Converter strings de data para objetos Date
        const alertsWithDates = filteredAlerts.map(alert => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        }));
        
        setAlerts(alertsWithDates);
        
        // Atualizar a contagem de não lidos manualmente
        const unreadAlerts = filteredAlerts.filter(a => !a.read);
        const highPriorityUnread = unreadAlerts.filter(a => 
          a.priority === 'high' || a.priority === 'critical'
        );
        
        // Contagem por tipo
        const byType: Record<TAlertType, number> = {
          resource: 0,
          'patient-arrival': 0,
          ambulance: 0,
          emergency: 0,
          system: 0,
          occupancy: 0,
          staff: 0,
          operational: 0,
          equipment: 0,
          warning: 0,
          info: 0,
          success: 0,
          error: 0
        };
        
        unreadAlerts.forEach(alert => {
          if (alert.type in byType) {
            byType[alert.type as TAlertType] += 1;
          }
        });
        
        setUnreadCount({
          total: unreadAlerts.length,
          highPriority: highPriorityUnread.length,
          byType
        });
        
      } catch (err) {
        console.error('Error fetching alerts:', err);
        setError('Falha ao carregar alertas. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    }, [hospitalId]);
    
    // Função para buscar a contagem de alertas não lidos - agora calculada localmente
    const fetchUnreadCount = useCallback(() => {
      // A contagem de não lidos já está sendo calculada em fetchAlerts
      // Esta função agora é apenas para compatibilidade
    }, []);
    
    // Marcar alerta como lido
    const markAsRead = useCallback(async (alertId: string) => {
      try {
        // Tentar atualizar na API se disponível
        try {
          await api.post(`/alerts/${alertId}/read`);
        } catch (apiErr) {
          console.warn('API call failed, updating state locally:', apiErr);
        }
        
        // Sempre atualizar o estado local
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId ? { ...alert, read: true } : alert
          )
        );
        
        // Atualizar a contagem
        setUnreadCount(prev => {
          const alert = alerts.find(a => a.id === alertId);
          if (!alert || alert.read) return prev;
          
          const newCount = { ...prev };
          newCount.total -= 1;
          
          if (alert.priority === 'high' || alert.priority === 'critical') {
            newCount.highPriority -= 1;
          }
          
          if (alert.type in newCount.byType) {
            newCount.byType[alert.type as TAlertType] -= 1;
          }
          
          return newCount;
        });
      } catch (err) {
        console.error('Error marking alert as read:', err);
        setError('Falha ao marcar alerta como lido.');
      }
    }, [alerts]);
    
    // Marcar todos os alertas como lidos
    const markAllAsRead = useCallback(async () => {
      try {
        // Tentar atualizar na API se disponível
        try {
          await api.post(`/alerts/read-all${hospitalId ? `?hospitalId=${hospitalId}` : ''}`);
        } catch (apiErr) {
          console.warn('API call failed, updating state locally:', apiErr);
        }
        
        // Sempre atualizar o estado local
        setAlerts(prev => 
          prev.map(alert => ({ ...alert, read: true }))
        );
        
        // Zerar a contagem de não lidos
        setUnreadCount(prev => ({
          ...prev,
          total: 0,
          highPriority: 0,
          byType: Object.keys(prev.byType).reduce((acc, key) => {
            acc[key as TAlertType] = 0;
            return acc;
          }, {} as Record<TAlertType, number>)
        }));
      } catch (err) {
        console.error('Error marking all alerts as read:', err);
        setError('Falha ao marcar todos os alertas como lidos.');
      }
    }, [hospitalId]);
    
    // Atualizar status do alerta
    const updateAlertStatus = useCallback(async (alertId: string, status: TAlertStatus) => {
      try {
        // Tentar atualizar na API se disponível
        try {
          await api.patch(`/alerts/${alertId}`, { status });
        } catch (apiErr) {
          console.warn('API call failed, updating state locally:', apiErr);
        }
        
        // Sempre atualizar o estado local
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId ? { ...alert, status, read: true } : alert
          )
        );
        
        // Atualizar a contagem
        setUnreadCount(prev => {
          const alert = alerts.find(a => a.id === alertId);
          if (!alert || alert.read) return prev;
          
          const newCount = { ...prev };
          newCount.total -= 1;
          
          if (alert.priority === 'high' || alert.priority === 'critical') {
            newCount.highPriority -= 1;
          }
          
          if (alert.type in newCount.byType) {
            newCount.byType[alert.type as TAlertType] -= 1;
          }
          
          return newCount;
        });
      } catch (err) {
        console.error('Error updating alert status:', err);
        setError('Falha ao atualizar status do alerta.');
      }
    }, [alerts]);
    
    // Descartar alerta
    const dismissAlert = useCallback(async (alertId: string) => {
      try {
        // Tentar atualizar na API se disponível
        try {
          await api.post(`/alerts/${alertId}/dismiss`);
        } catch (apiErr) {
          console.warn('API call failed, updating state locally:', apiErr);
        }
        
        // Sempre atualizar o estado local
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId ? { ...alert, status: 'dismissed', read: true } : alert
          )
        );
        
        // Atualizar a contagem
        setUnreadCount(prev => {
          const alert = alerts.find(a => a.id === alertId);
          if (!alert || alert.read) return prev;
          
          const newCount = { ...prev };
          newCount.total -= 1;
          
          if (alert.priority === 'high' || alert.priority === 'critical') {
            newCount.highPriority -= 1;
          }
          
          if (alert.type in newCount.byType) {
            newCount.byType[alert.type as TAlertType] -= 1;
          }
          
          return newCount;
        });
      } catch (err) {
        console.error('Error dismissing alert:', err);
        setError('Falha ao descartar alerta.');
      }
    }, [alerts]);
    
    // Obter alertas filtrados por tipo e/ou prioridade
    const getFilteredAlerts = useCallback((
      type?: TAlertType | 'all', 
      priority?: TAlertPriority | 'all', 
      status?: TAlertStatus | 'all'
    ) => {
      let filtered = [...alerts];
      
      if (type && type !== 'all') {
        filtered = filtered.filter(alert => alert.type === type);
      }
      
      if (priority && priority !== 'all') {
        filtered = filtered.filter(alert => alert.priority === priority);
      }
      
      if (status && status !== 'all') {
        filtered = filtered.filter(alert => alert.status === status);
      } else {
        // Por padrão, mostrar apenas alertas pendentes ou confirmados
        filtered = filtered.filter(alert => 
          alert.status === 'pending' || alert.status === 'acknowledged'
        );
      }
      
      return filtered.sort((a, b) => {
        // Ordenar por prioridade (critical > high > medium > low)
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
        
        // Se a prioridade for igual, ordenar por data (mais recente primeiro)
        if (priorityDiff === 0) {
          return b.timestamp.getTime() - a.timestamp.getTime();
        }
        
        return priorityDiff;
      });
    }, [alerts]);
    
    // Testar alerta
    const testAlert = useCallback(async (alertId: string) => {
      try {
        await api.post(`/alerts/${alertId}/test`);
        return true;
      } catch (err) {
        console.error('Error testing alert:', err);
        setError('Falha ao testar alerta.');
        return false;
      }
    }, []);
    
    // Criar um alerta personalizado
    const createAlert = useCallback(async (alertData: Omit<IAlert, 'id' | 'timestamp' | 'read' | 'status'>) => {
      try {
        // Tentar criar na API
        const newAlert: IAlert = {
          id: `alert-${Date.now()}`,
          timestamp: new Date(),
          read: false,
          status: 'pending',
          ...alertData
        };
        
        try {
          const response = await api.post<IAlert>(`/alerts`, alertData);
          if (response.data && response.data.id) {
            newAlert.id = response.data.id;
          }
        } catch (apiErr) {
          console.warn('API call failed, using local data:', apiErr);
        }
        
        // Atualizar o estado local
        setAlerts(prev => [newAlert, ...prev]);
        
        return newAlert;
      } catch (err) {
        console.error('Error creating alert:', err);
        setError('Falha ao criar alerta.');
        return null;
      }
    }, []);
    
    // Enviar alerta para múltiplos hospitais
    const sendAlertToHospitals = useCallback(async (
      alertData: Omit<IAlert, 'id' | 'timestamp' | 'read' | 'status'>, 
      hospitalIds: string[]
    ) => {
      try {
        const newAlerts: IAlert[] = [];
        
        // Criar alertas para cada hospital
        for (const hId of hospitalIds) {
          const newAlert: IAlert = {
            id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            read: false,
            status: 'pending',
            ...alertData,
            hospitalId: hId
          };
          
          try {
            const response = await api.post<IAlert>(`/alerts`, {
              ...alertData,
              hospitalId: hId
            });
            
            if (response.data && response.data.id) {
              newAlert.id = response.data.id;
            }
          } catch (apiErr) {
            console.warn('API call failed for hospital, using local data:', hId, apiErr);
          }
          
          newAlerts.push(newAlert);
        }
        
        // Atualizar o estado local se o alerta for para o hospital atual
        if (hospitalId && hospitalIds.includes(hospitalId)) {
          const relevantAlerts = newAlerts.filter(alert => alert.hospitalId === hospitalId);
          setAlerts(prev => [...relevantAlerts, ...prev]);
        }
        
        return newAlerts;
      } catch (err) {
        console.error('Error sending alerts to hospitals:', err);
        setError('Falha ao enviar alertas para hospitais.');
        return [];
      }
    }, [hospitalId]);
    
    // Efeito para carregar os alertas inicialmente
    useEffect(() => {
      fetchAlerts();
      
      // Configurar um intervalo para atualizar periodicamente
      const interval = setInterval(() => {
        fetchAlerts();
      }, 30000); // Atualizar a cada 30 segundos
      
      return () => clearInterval(interval);
    }, [fetchAlerts]);
    
    return {
      alerts,
      loading,
      error,
      unreadCount,
      fetchAlerts,
      markAsRead,
      markAllAsRead,
      updateAlertStatus,
      dismissAlert,
      getFilteredAlerts,
      testAlert,
      createAlert,
      sendAlertToHospitals
    };
};