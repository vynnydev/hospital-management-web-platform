/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { useAmbulanceData } from '@/hooks/ambulance/useAmbulanceData';
import { IAlert, TAlertPriority, TAlertStatus, TAlertType } from '@/types/alert-types';

// Interface para o contexto de alertas
interface AlertsContextType {
  alerts: IAlert[];
  unreadCount: number;
  highPriorityCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateAlertStatus: (id: string, status: TAlertStatus) => void;
  dismissAlert: (id: string) => void;
  getFilteredAlerts: (type?: TAlertType, priority?: TAlertPriority, status?: TAlertStatus) => IAlert[];
  addCustomAlert: (alert: Omit<IAlert, 'id' | 'timestamp' | 'read' | 'status'>) => void;
  sendAlertToHospitals: (alert: Omit<IAlert, 'id' | 'timestamp' | 'read' | 'status'>, hospitalIds: string[]) => void;
}

// Criação do contexto
export const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

// Hook para usar o contexto de alertas
export const useAlertsProvider = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};

// Props para o provedor de alertas
interface AlertsProviderProps {
  children: ReactNode;
  hospitalId?: string;
  checkInterval?: number; // intervalo em milissegundos para verificar novos alertas
}

// Componente provedor de alertas - CORRIGIDO para resolver os erros das imagens
export const AlertsProvider: React.FC<AlertsProviderProps> = ({
  children,
  hospitalId,
  checkInterval = 30000 // 30 segundos padrão
}) => {
  const [alerts, setAlerts] = useState<IAlert[]>([]);
  const { networkData } = useNetworkData();
  const { ambulanceData, activeRoutes, pendingRequests } = useAmbulanceData(hospitalId ? hospitalId : null);

  // Gerar ID único para alertas
  const generateAlertId = () => {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Marcar alerta como lido
  const markAsRead = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  // Marcar todos alertas como lidos
  const markAllAsRead = () => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => ({ ...alert, read: true }))
    );
  };

  // Atualizar status do alerta
  const updateAlertStatus = (id: string, status: TAlertStatus) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === id ? { ...alert, status, read: true } : alert
      )
    );
  };

  // Descartar alerta
  const dismissAlert = (id: string) => {
    updateAlertStatus(id, 'dismissed');
  };

  // Obter alertas filtrados por tipo e/ou prioridade
  const getFilteredAlerts = (type?: TAlertType, priority?: TAlertPriority, status?: TAlertStatus) => {
    let filtered = [...alerts];
    
    if (type) {
      filtered = filtered.filter(alert => alert.type === type);
    }
    
    if (priority) {
      filtered = filtered.filter(alert => alert.priority === priority);
    }
    
    if (status) {
      filtered = filtered.filter(alert => alert.status === status);
    } else {
      // Por padrão, mostrar apenas alertas pendentes ou confirmados
      filtered = filtered.filter(alert => 
        alert.status === 'pending' || alert.status === 'acknowledged'
      );
    }
    
    return filtered.sort((a, b) => {
      // Ordenar por prioridade (high > medium > low)
      const priorityOrder = { high: 0, medium: 1, low: 2, critical: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      // Se a prioridade for igual, ordenar por data (mais recente primeiro)
      if (priorityDiff === 0) {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      
      return priorityDiff;
    });
  };

  // Adicionar alerta personalizado
  const addCustomAlert = (alertData: Omit<IAlert, 'id' | 'timestamp' | 'read' | 'status'>) => {
    const newAlert: IAlert = {
      ...alertData,
      id: generateAlertId(),
      timestamp: new Date(),
      read: false,
      status: 'pending'
    };

    setAlerts(prev => [...prev, newAlert]);
  };

  // Enviar alerta para múltiplos hospitais
  const sendAlertToHospitals = (
    alertData: Omit<IAlert, 'id' | 'timestamp' | 'read' | 'status'>, 
    hospitalIds: string[]
  ) => {
    hospitalIds.forEach(hId => {
      const newAlert: IAlert = {
        ...alertData,
        id: generateAlertId(),
        timestamp: new Date(),
        read: false,
        status: 'pending',
        hospitalId: hId
      };

      setAlerts(prev => [...prev, newAlert]);
    });
  };

  // Calcular contadores para o contexto
  const unreadCount = alerts.filter(alert => 
    !alert.read && 
    (alert.status === 'pending' || alert.status === 'acknowledged') &&
    (hospitalId ? alert.hospitalId === hospitalId : true)
  ).length;
  
  const highPriorityCount = alerts.filter(alert => 
    alert.priority === 'high' && 
    !alert.read && 
    (alert.status === 'pending' || alert.status === 'acknowledged') &&
    (hospitalId ? alert.hospitalId === hospitalId : true)
  ).length;

  // Valores para o contexto
  const contextValue: AlertsContextType = {
    alerts,
    unreadCount,
    highPriorityCount,
    markAsRead,
    markAllAsRead,
    updateAlertStatus,
    dismissAlert,
    getFilteredAlerts,
    addCustomAlert,
    sendAlertToHospitals
  };

  return (
    <AlertsContext.Provider value={contextValue}>
      {children}
    </AlertsContext.Provider>
  );
};