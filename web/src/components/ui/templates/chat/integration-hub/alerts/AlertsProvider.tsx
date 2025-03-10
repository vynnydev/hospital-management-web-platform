/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';

// Tipos de alertas
export type AlertPriority = 'high' | 'medium' | 'low';
export type AlertType = 'ambulance' | 'patient-arrival' | 'resource' | 'emergency';

// Interfaces para os dados de alertas
export interface Alert {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  timestamp: Date;
  priority: AlertPriority;
  read: boolean;
  actionRequired: boolean;
  metadata?: {
    patientId?: string;
    ambulanceId?: string;
    resourceId?: string;
    bedId?: string;
    departmentId?: string;
    routeId?: string;
    staffId?: string;
    estimatedArrival?: string;
    [key: string]: any;
  };
}

// Interface para o contexto de alertas
interface AlertsContextType {
  alerts: Alert[];
  unreadCount: number;
  highPriorityCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  dismissAlert: (id: string) => void;
  getFilteredAlerts: (type?: AlertType, priority?: AlertPriority) => Alert[];
  addCustomAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void;
}

// Criação do contexto
export const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

// Hook para usar o contexto de alertas
export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertsProvider');
  }
  return context;
};

// Props para o provedor de alertas
interface AlertsProviderProps {
  children: ReactNode;
  hospitalId: string;
  checkInterval?: number; // intervalo em milissegundos para verificar novos alertas
}

// Componente provedor de alertas
export const AlertsProvider: React.FC<AlertsProviderProps> = ({
  children,
  hospitalId,
  checkInterval = 30000 // 30 segundos padrão
}) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const { networkData } = useNetworkData();
  const { ambulanceData, activeRoutes, pendingRequests } = useAmbulanceData(hospitalId);

  // Gerar ID único para alertas
  const generateAlertId = () => {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Verificar dados de ambulâncias e gerar alertas
  useEffect(() => {
    if (ambulanceData && activeRoutes) {
      // Verificar ambulâncias a caminho
      const incomingAmbulances = activeRoutes.filter(route => 
        route.status === 'in_progress' && 
        route.destination.hospitalId === hospitalId
      );

      // Criar alertas para ambulâncias que vão chegar em breve (menos de 10 minutos)
      incomingAmbulances.forEach(route => {
        const arrivalTime = new Date(route.estimatedArrivalTime);
        const now = new Date();
        const minutesUntilArrival = Math.floor((arrivalTime.getTime() - now.getTime()) / 60000);

        if (minutesUntilArrival <= 10 && minutesUntilArrival > 0) {
          // Verificar se já existe um alerta para esta rota
          const existingAlert = alerts.find(alert => 
            alert.metadata?.routeId === route.id && 
            alert.type === 'ambulance'
          );

          if (!existingAlert) {
            const patientInfo = route.patient 
              ? `${route.patient.name} (${route.patient.condition})` 
              : 'Paciente não identificado';
              
            const newAlert: Alert = {
              id: generateAlertId(),
              type: 'ambulance',
              title: 'Ambulância a caminho',
              message: `Ambulância chegando em aproximadamente ${minutesUntilArrival} minutos com ${patientInfo}. Prioridade: ${route.patient?.emergencyLevel || 'não especificada'}.`,
              timestamp: new Date(),
              priority: (route.patient?.emergencyLevel === 'critical' || route.patient?.emergencyLevel === 'high') 
                ? 'high' 
                : route.patient?.emergencyLevel === 'medium' ? 'medium' : 'low',
              read: false,
              actionRequired: true,
              metadata: {
                ambulanceId: route.ambulanceId,
                patientId: route.patient?.id,
                routeId: route.id,
                estimatedArrival: route.estimatedArrivalTime
              }
            };

            setAlerts(prev => [...prev, newAlert]);
          }
        }
      });

      // Verificar solicitações pendentes de ambulância
      const urgentRequests = pendingRequests.filter(req => 
        req.patientInfo.emergencyLevel === 'critical' || 
        req.patientInfo.emergencyLevel === 'high'
      );

      urgentRequests.forEach(request => {
        // Verificar se já existe um alerta para esta solicitação
        const existingAlert = alerts.find(alert => 
          alert.metadata?.requestId === request.id && 
          alert.type === 'emergency'
        );

        if (!existingAlert) {
          const newAlert: Alert = {
            id: generateAlertId(),
            type: 'emergency',
            title: 'Solicitação urgente de ambulância',
            message: `Solicitação pendente: ${request.patientInfo.condition}. Local: ${request.location.address}`,
            timestamp: new Date(),
            priority: 'high',
            read: false,
            actionRequired: true,
            metadata: {
              requestId: request.id,
              patientCondition: request.patientInfo.condition,
              emergencyLevel: request.patientInfo.emergencyLevel
            }
          };

          setAlerts(prev => [...prev, newAlert]);
        }
      });
    }
  }, [ambulanceData, activeRoutes, pendingRequests, hospitalId, alerts]);

  // Verificar dados de recursos e ocupação de leitos
  useEffect(() => {
    if (networkData && networkData.hospitals) {
      const hospital = networkData.hospitals.find(h => h.id === hospitalId);
      
      if (hospital && hospital.metrics) {
        // Verificar ocupação de UTI
        const utiMetrics = hospital.metrics.departmental?.uti;
        if (utiMetrics && utiMetrics.occupancy >= 90) {
          // Verificar se já existe um alerta para alta ocupação de UTI
          const existingAlert = alerts.find(alert => 
            alert.type === 'resource' && 
            alert.metadata?.resourceType === 'bed' &&
            alert.metadata?.department === 'uti' &&
            alert.metadata?.alertType === 'high-occupancy'
          );

          if (!existingAlert) {
            const newAlert: Alert = {
              id: generateAlertId(),
              type: 'resource',
              title: 'Ocupação crítica de UTI',
              message: `A ocupação da UTI está em ${utiMetrics.occupancy}%, acima do limite recomendado de 90%. Avalie transferências ou ampliação.`,
              timestamp: new Date(),
              priority: 'high',
              read: false,
              actionRequired: true,
              metadata: {
                resourceType: 'bed',
                department: 'uti',
                occupancy: utiMetrics.occupancy,
                alertType: 'high-occupancy'
              }
            };

            setAlerts(prev => [...prev, newAlert]);
          }
        }
      }
    }
  }, [networkData, hospitalId, alerts]);

  // Verificar pacientes que precisam de recursos/equipamentos
  useEffect(() => {
    // Esta função seria implementada integrando com um sistema de monitoramento de recursos
    // Para este exemplo, vamos simular com um timer
    const checkResourceNeeds = () => {
      // Simular necessidade de equipamentos (em uma implementação real, isso viria da API)
      const resourceNeeds = [
        { 
          id: 'res-001', 
          name: 'Respirador', 
          department: 'UTI', 
          urgency: 'high',
          patient: 'João Silva',
          patientId: 'P001'
        }
      ];

      // Apenas para demonstração - em um caso real, você verificaria os dados do backend
      if (Math.random() > 0.7) { // Simulando uma chance aleatória de precisar de recursos
        resourceNeeds.forEach(resource => {
          // Verificar se já existe um alerta para este recurso
          const existingAlert = alerts.find(alert => 
            alert.type === 'resource' && 
            alert.metadata?.resourceId === resource.id
          );

          if (!existingAlert) {
            const newAlert: Alert = {
              id: generateAlertId(),
              type: 'resource',
              title: `Necessidade de ${resource.name}`,
              message: `O paciente ${resource.patient} na ${resource.department} necessita de ${resource.name} com urgência.`,
              timestamp: new Date(),
              priority: resource.urgency === 'high' ? 'high' : 'medium',
              read: false,
              actionRequired: true,
              metadata: {
                resourceId: resource.id,
                resourceName: resource.name,
                department: resource.department,
                patientId: resource.patientId
              }
            };

            setAlerts(prev => [...prev, newAlert]);
          }
        });
      }
    };

    // Verificar recursos periodicamente
    const interval = setInterval(checkResourceNeeds, checkInterval);

    // Limpar o intervalo quando o componente é desmontado
    return () => clearInterval(interval);
  }, [checkInterval, alerts]);

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

  // Descartar alerta
  const dismissAlert = (id: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.filter(alert => alert.id !== id)
    );
  };

  // Obter alertas filtrados por tipo e/ou prioridade
  const getFilteredAlerts = (type?: AlertType, priority?: AlertPriority) => {
    let filtered = [...alerts];
    
    if (type) {
      filtered = filtered.filter(alert => alert.type === type);
    }
    
    if (priority) {
      filtered = filtered.filter(alert => alert.priority === priority);
    }
    
    return filtered.sort((a, b) => {
      // Ordenar por prioridade (high > medium > low)
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      
      // Se a prioridade for igual, ordenar por data (mais recente primeiro)
      if (priorityDiff === 0) {
        return b.timestamp.getTime() - a.timestamp.getTime();
      }
      
      return priorityDiff;
    });
  };

  // Adicionar alerta personalizado
  const addCustomAlert = (alertData: Omit<Alert, 'id' | 'timestamp' | 'read'>) => {
    const newAlert: Alert = {
      ...alertData,
      id: generateAlertId(),
      timestamp: new Date(),
      read: false
    };

    setAlerts(prev => [...prev, newAlert]);
  };

  // Calcular contadores para o contexto
  const unreadCount = alerts.filter(alert => !alert.read).length;
  const highPriorityCount = alerts.filter(alert => alert.priority === 'high' && !alert.read).length;

  // Valores para o contexto
  const contextValue: AlertsContextType = {
    alerts,
    unreadCount,
    highPriorityCount,
    markAsRead,
    markAllAsRead,
    dismissAlert,
    getFilteredAlerts,
    addCustomAlert
  };

  return (
    <AlertsContext.Provider value={contextValue}>
      {children}
    </AlertsContext.Provider>
  );
};