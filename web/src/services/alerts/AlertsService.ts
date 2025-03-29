import { 
  IAlert, 
  IAlertTemplate, 
  IAlertFilters,
  TAlertStatus,
  IUnreadAlertCount
} from '@/types/alert-types';
import api from '../api';
import { INotificationSettings } from '@/types/notification-settings-types';

// Serviço para API de Alertas
export const AlertsService = {
  // Métodos para Alertas
  alerts: {
    getAll: async (filters?: IAlertFilters): Promise<IAlert[]> => {
      try {
        const params = new URLSearchParams();
        
        if (filters) {
          if (filters.type && filters.type !== 'all') params.append('type', filters.type);
          if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
          if (filters.status && filters.status !== 'all') params.append('status', filters.status);
          if (filters.hospitalId) params.append('hospitalId', filters.hospitalId);
          if (filters.read !== undefined) params.append('read', String(filters.read));
          if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
          if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
        }
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await api.get<IAlert[]>(`alerts${queryString}`);
        
        return response.data.map(alert => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        }));
      } catch (error) {
        console.error('Error fetching alerts:', error);
        throw error;
      }
    },
    
    getById: async (id: string): Promise<IAlert> => {
      try {
        const response = await api.get<IAlert>(`alerts/${id}`);
        return {
          ...response.data,
          timestamp: new Date(response.data.timestamp)
        };
      } catch (error) {
        console.error(`Error fetching alert ${id}:`, error);
        throw error;
      }
    },
    
    getByHospital: async (hospitalId: string, filters?: IAlertFilters): Promise<IAlert[]> => {
      try {
        const params = new URLSearchParams();
        
        if (filters) {
          if (filters.type && filters.type !== 'all') params.append('type', filters.type);
          if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
          if (filters.status && filters.status !== 'all') params.append('status', filters.status);
          if (filters.read !== undefined) params.append('read', String(filters.read));
          if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
          if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
        }
        
        const queryString = params.toString() ? `?${params.toString()}` : '';
        const response = await api.get<IAlert[]>(`hospitals/${hospitalId}/alerts${queryString}`);
        
        return response.data.map(alert => ({
          ...alert,
          timestamp: new Date(alert.timestamp)
        }));
      } catch (error) {
        console.error(`Error fetching alerts for hospital ${hospitalId}:`, error);
        throw error;
      }
    },
    
    create: async (alertData: Omit<IAlert, 'id' | 'timestamp' | 'read' | 'status'>): Promise<IAlert> => {
      try {
        const response = await api.post<IAlert>(`alerts`, alertData);
        return {
          ...response.data,
          timestamp: new Date(response.data.timestamp)
        };
      } catch (error) {
        console.error('Error creating alert:', error);
        throw error;
      }
    },
    
    update: async (id: string, alertData: Partial<IAlert>): Promise<IAlert> => {
      try {
        const response = await api.patch<IAlert>(`alerts/${id}`, alertData);
        return {
          ...response.data,
          timestamp: new Date(response.data.timestamp)
        };
      } catch (error) {
        console.error(`Error updating alert ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id: string): Promise<void> => {
      try {
        await api.delete(`alerts/${id}`);
      } catch (error) {
        console.error(`Error deleting alert ${id}:`, error);
        throw error;
      }
    },
    
    markAsRead: async (id: string): Promise<void> => {
      try {
        await api.post(`alerts/${id}/read`);
      } catch (error) {
        console.error(`Error marking alert ${id} as read:`, error);
        throw error;
      }
    },
    
    markAllAsRead: async (hospitalId?: string): Promise<void> => {
      try {
        await api.post(`alerts/read-all`, { hospitalId });
      } catch (error) {
        console.error('Error marking all alerts as read:', error);
        throw error;
      }
    },
    
    updateStatus: async (id: string, status: TAlertStatus): Promise<IAlert> => {
      try {
        const response = await api.patch<IAlert>(`alerts/${id}`, { status });
        return {
          ...response.data,
          timestamp: new Date(response.data.timestamp)
        };
      } catch (error) {
        console.error(`Error updating status for alert ${id}:`, error);
        throw error;
      }
    },
    
    dismiss: async (id: string): Promise<void> => {
      try {
        await api.post(`alerts/${id}/dismiss`);
      } catch (error) {
        console.error(`Error dismissing alert ${id}:`, error);
        throw error;
      }
    },
    
    test: async (id: string): Promise<void> => {
      try {
        await api.post(`alerts/${id}/test`);
      } catch (error) {
        console.error(`Error testing alert ${id}:`, error);
        throw error;
      }
    },
    
    getUnreadCount: async (hospitalId?: string): Promise<IUnreadAlertCount> => {
      try {
        const params = hospitalId ? `?hospitalId=${hospitalId}` : '';
        const response = await api.get<IUnreadAlertCount>(`alerts/unread/count${params}`);
        return response.data;
      } catch (error) {
        console.error('Error getting unread alert count:', error);
        throw error;
      }
    }
  },
  
  // Métodos para Templates de Alertas
  templates: {
    getAll: async (): Promise<IAlertTemplate[]> => {
      try {
        const response = await api.get<IAlertTemplate[]>(`alert-templates`);
        return response.data;
      } catch (error) {
        console.error('Error fetching alert templates:', error);
        throw error;
      }
    },
    
    getById: async (id: string): Promise<IAlertTemplate> => {
      try {
        const response = await api.get<IAlertTemplate>(`alert-templates/${id}`);
        return response.data;
      } catch (error) {
        console.error(`Error fetching alert template ${id}:`, error);
        throw error;
      }
    },
    
    create: async (templateData: Omit<IAlertTemplate, 'id'>): Promise<IAlertTemplate> => {
      try {
        const response = await api.post<IAlertTemplate>(`alert-templates`, templateData);
        return response.data;
      } catch (error) {
        console.error('Error creating alert template:', error);
        throw error;
      }
    },
    
    update: async (id: string, templateData: Partial<IAlertTemplate>): Promise<IAlertTemplate> => {
      try {
        const response = await api.patch<IAlertTemplate>(`alert-templates/${id}`, templateData);
        return response.data;
      } catch (error) {
        console.error(`Error updating alert template ${id}:`, error);
        throw error;
      }
    },
    
    delete: async (id: string): Promise<void> => {
      try {
        await api.delete(`alert-templates/${id}`);
      } catch (error) {
        console.error(`Error deleting alert template ${id}:`, error);
        throw error;
      }
    }
  },
  
  // Métodos para Configurações de Notificação
  settings: {
    get: async (): Promise<INotificationSettings> => {
      try {
        const response = await api.get<INotificationSettings>(`notification-settings`);
        return response.data;
      } catch (error) {
        console.error('Error fetching notification settings:', error);
        throw error;
      }
    },
    
    update: async (settings: Partial<INotificationSettings>): Promise<INotificationSettings> => {
      try {
        const response = await api.patch<INotificationSettings>(`notification-settings`, settings);
        return response.data;
      } catch (error) {
        console.error('Error updating notification settings:', error);
        throw error;
      }
    }
  }
};