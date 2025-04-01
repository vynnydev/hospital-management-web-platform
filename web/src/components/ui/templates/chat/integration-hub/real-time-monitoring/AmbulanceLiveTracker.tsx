/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { 
  Ambulance, 
  MapPin, 
  Clock, 
  ChevronRight, 
  User, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  MessageSquare,
  Phone,
  Heart,
  Route
} from 'lucide-react';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { useAlertsProvider } from '../../../providers/alerts/AlertsProvider';
import { IAlert } from '@/types/alert-types';

interface AmbulanceLiveTrackerProps {
  hospitalId: string;
  onStartChat?: (routeId: string, patientId?: string) => void;
  className?: string;
}

/**
 * Componente que mostra informações em tempo real das ambulâncias ativas para o hospital
 */
export const AmbulanceLiveTracker: React.FC<AmbulanceLiveTrackerProps> = ({
  hospitalId,
  onStartChat,
  className = ''
}) => {
  const { ambulanceData, activeRoutes, updateRouteStatus, getAmbulanceById } = useAmbulanceData(hospitalId);
  const { addCustomAlert } = useAlertsProvider();
  
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Filtrar rotas relevantes para o hospital: chegando ao hospital ou partindo dele
  const relevantRoutes = activeRoutes.filter(route => 
    route.status === 'in_progress' && (
      route.destination.hospitalId === hospitalId ||
      route.origin.hospitalId === hospitalId
    )
  );

  // Rotas de ambulâncias chegando ao hospital
  const incomingRoutes = relevantRoutes.filter(route => 
    route.destination.hospitalId === hospitalId
  );

  // Rotas de ambulâncias saindo do hospital
  const outgoingRoutes = relevantRoutes.filter(route => 
    route.origin.hospitalId === hospitalId && 
    route.destination.hospitalId !== hospitalId
  );

  // Atualizar dados a cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Função para atualizar os dados manualmente
  const refreshData = () => {
    setLoading(true);
    
    // Aqui você faria uma chamada para atualizar os dados de ambulância
    // Simulando com um timeout
    setTimeout(() => {
      setLoading(false);
      setLastUpdate(new Date());
    }, 1000);
  };

  // Formatar tempo restante estimado
  const formatTimeRemaining = (arrivalTime: string) => {
    const arrival = new Date(arrivalTime);
    const now = new Date();
    const diffMs = arrival.getTime() - now.getTime();
    const diffMins = Math.round(diffMs / 60000);
    
    if (diffMins <= 0) {
      return 'Chegando agora';
    } else if (diffMins === 1) {
      return '1 minuto';
    } else {
      return `${diffMins} minutos`;
    }
  };

  // Iniciar um chat sobre uma rota específica
  const handleStartChat = (routeId: string, patientId?: string) => {
    if (onStartChat) {
      onStartChat(routeId, patientId);
    }
  };

  // Marcar uma ambulância como chegada e notificar a equipe
  const handleAmbulanceArrival = (routeId: string, ambulanceId: string) => {
    // Atualizar o status da rota
    updateRouteStatus(routeId, 'completed', 'available');
    
    // Obter detalhes da rota antes de atualizá-la
    const route = activeRoutes.find(r => r.id === routeId);
    if (!route) return;
    
    // Criar um alerta de chegada de paciente
    const newAlert: Omit<IAlert, 'id' | 'timestamp' | 'read'> = {
      type: 'patient-arrival',
      title: 'Paciente chegou ao hospital',
      message: `Ambulância ${ambulanceId} chegou com ${route.patient?.name || 'paciente'} (${route.patient?.condition || 'condição não especificada'}).`,
      priority: route.patient?.emergencyLevel === 'critical' || route.patient?.emergencyLevel === 'high'
        ? 'high'
        : route.patient?.emergencyLevel === 'medium' ? 'medium' : 'low',
      actionRequired: true,
      metadata: {
        patientId: route.patient?.id,
        ambulanceId: ambulanceId,
        routeId: routeId,
        condition: route.patient?.condition,
        emergencyLevel: route.patient?.emergencyLevel
      },
      status: 'pending'
    };
    
    addCustomAlert(newAlert);
  };

  if (!ambulanceData) {
    return (
      <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
        <div className="flex items-center justify-center h-20 text-gray-400 dark:text-gray-500">
          Carregando dados das ambulâncias...
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Cabeçalho */}
      <div className="p-3 border-b dark:border-gray-700 bg-blue-50 dark:bg-blue-900/20 flex justify-between items-center">
        <h3 className="font-medium text-blue-900 dark:text-blue-100 flex items-center">
          <Ambulance className="h-5 w-5 mr-2 text-blue-700 dark:text-blue-400" />
          Ambulâncias em Trânsito
        </h3>
        
        <button 
          className={`p-1.5 rounded-full text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/50 ${loading ? 'animate-spin' : ''}`}
          onClick={refreshData}
          disabled={loading}
          title="Atualizar dados"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      
      {/* Conteúdo */}
      <div className="divide-y dark:divide-gray-700">
        {/* Ambulâncias chegando */}
        {incomingRoutes.length > 0 && (
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chegando ao Hospital ({incomingRoutes.length})
            </h4>
            
            <div className="space-y-2">
              {incomingRoutes.map(route => {
                const ambulance = getAmbulanceById(hospitalId, route.ambulanceId);
                const estimatedTime = formatTimeRemaining(route.estimatedArrivalTime);
                const isUrgent = route.patient?.emergencyLevel === 'critical' || route.patient?.emergencyLevel === 'high';
                
                return (
                  <div 
                    key={route.id}
                    className={`
                      p-3 rounded-lg border 
                      ${isUrgent 
                        ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' 
                        : 'border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/10'
                      }
                    `}
                  >
                    <div className="flex items-start">
                      {/* Informações do paciente/ambulância */}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Ambulance className={`
                            h-4 w-4 mr-1.5 
                            ${isUrgent ? 'text-red-600 dark:text-red-400' : 'text-blue-600 dark:text-blue-400'}
                          `} />
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {ambulance?.vehicleId || route.ambulanceId}
                            {isUrgent && (
                              <span className="ml-2 text-xs bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-300 px-1.5 py-0.5 rounded">
                                {route.patient?.emergencyLevel === 'critical' ? 'Crítico' : 'Urgente'}
                              </span>
                            )}
                          </h5>
                        </div>
                        
                        {route.patient && (
                          <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <User className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                            <span>{route.patient.name}</span>
                            {route.patient.age && (
                              <span className="ml-1 text-gray-500 dark:text-gray-400">
                                ({route.patient.age} anos)
                              </span>
                            )}
                          </div>
                        )}
                        
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[180px]">{route.origin.name}</span>
                        </div>
                        
                        <div className="mt-1 flex items-center text-sm">
                          <Clock className={`
                            h-3.5 w-3.5 mr-1 
                            ${estimatedTime === 'Chegando agora' 
                              ? 'text-green-600 dark:text-green-400' 
                              : 'text-blue-600 dark:text-blue-400'
                            }
                          `} />
                          <span className={`
                            ${estimatedTime === 'Chegando agora' 
                              ? 'text-green-700 dark:text-green-300 font-medium' 
                              : 'text-blue-700 dark:text-blue-300'
                            }
                          `}>
                            {estimatedTime}
                          </span>
                        </div>
                        
                        {route.patient?.condition && (
                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-1.5 rounded">
                            {route.patient.condition}
                          </div>
                        )}
                      </div>
                      
                      {/* Ações */}
                      <div className="flex flex-col space-y-1">
                        <button
                          className={`
                            p-1.5 rounded-full 
                            ${isUrgent 
                              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300' 
                              : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                            }
                          `}
                          onClick={() => handleStartChat(route.id, route.patient?.id)}
                          title="Iniciar chat sobre esta ambulância"
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                        
                        <button
                          className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          onClick={() => handleAmbulanceArrival(route.id, route.ambulanceId)}
                          title="Marcar como chegada"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Ambulâncias saindo */}
        {outgoingRoutes.length > 0 && (
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Saindo do Hospital ({outgoingRoutes.length})
            </h4>
            
            <div className="space-y-2">
              {outgoingRoutes.map(route => {
                const ambulance = getAmbulanceById(hospitalId, route.ambulanceId);
                
                return (
                  <div 
                    key={route.id}
                    className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                  >
                    <div className="flex items-start">
                      {/* Informações */}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Ambulance className="h-4 w-4 mr-1.5 text-gray-600 dark:text-gray-400" />
                          <h5 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {ambulance?.vehicleId || route.ambulanceId}
                          </h5>
                        </div>
                        
                        {route.patient && (
                          <div className="mt-1 flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <User className="h-3.5 w-3.5 mr-1 text-gray-500 dark:text-gray-400" />
                            <span>{route.patient.name}</span>
                          </div>
                        )}
                        
                        <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span className="truncate max-w-[180px]">{route.destination.name}</span>
                        </div>
                      </div>
                      
                      {/* Ações */}
                      <button
                        className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        onClick={() => handleStartChat(route.id, route.patient?.id)}
                        title="Iniciar chat sobre esta ambulância"
                      >
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Mensagem quando não há ambulâncias em trânsito */}
        {relevantRoutes.length === 0 && (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <Ambulance className="h-10 w-10 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
            <p>Nenhuma ambulância em trânsito no momento.</p>
          </div>
        )}
      </div>
      
      {/* Rodapé */}
      <div className="p-2 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400 flex justify-between items-center">
        <div>
          Total em trânsito: {relevantRoutes.length}
        </div>
        <div className="flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Atualizado: {lastUpdate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
      </div>
    </div>
  );
};