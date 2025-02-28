/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useAmbulanceData.ts
import { useState, useEffect, useCallback } from 'react';
import { 
  IAmbulanceData, 
  IAmbulance, 
  IAmbulanceRoute, 
  IAmbulanceRequest, 
  TEmergengyLevel,
  TAmbulanceStatus,
  TRouteStatus
} from '@/types/ambulance-types';
import { calculateDistance } from '@/utils/calculateDistance';
import { IHospital } from '@/types/hospital-network-types';
import { IAppUser } from '@/types/auth-types';
import { AxiosError } from 'axios';
import api from '@/services/api';

// Função auxiliar para calcular tempo estimado (velocidade média de 60km/h)
const calculateEstimatedTime = (distanceKm: number): number => {
  // Retorna tempo em minutos, assumindo velocidade média de 60km/h
  return Math.round((distanceKm / 60) * 60);
};

// Função auxiliar para gerar um ID único
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

export const useAmbulanceData = (selectedHospitalId: string | null) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ambulanceData, setAmbulanceData] = useState<IAmbulanceData | null>(null);
  const [activeRoutes, setActiveRoutes] = useState<IAmbulanceRoute[]>([]);
  const [availableAmbulances, setAvailableAmbulances] = useState<IAmbulance[]>([]);
  const [pendingRequests, setPendingRequests] = useState<IAmbulanceRequest[]>([]);

  // Efeito para carregar dados iniciais
  useEffect(() => {
    const fetchAmbulanceData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/ambulanceData');
        setAmbulanceData(response.data.ambulanceData);
        setError(null);
      } catch (err) {
        console.error('Error fetching ambulance data:', err);
        
        if (err instanceof AxiosError) {
          setError(
            err.response?.data?.message || 
            'Falha na comunicação com o servidor'
          );
        } else {
          setError('Erro ao carregar dados das ambulâncias');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulanceData();
  }, []);

  // Filtra dados relevantes com base no hospital selecionado
  useEffect(() => {
    if (!ambulanceData || !selectedHospitalId) {
      setActiveRoutes([]);
      setAvailableAmbulances([]);
      setPendingRequests([]);
      return;
    }

    // Filtrar ambulâncias disponíveis para o hospital selecionado
    const ambulances = ambulanceData.ambulances[selectedHospitalId] || [];
    const filteredAmbulances = ambulances.filter(amb => amb.status === 'available');
    setAvailableAmbulances(filteredAmbulances);

    // Filtrar rotas ativas para o hospital selecionado
    const routes = ambulanceData.routes[selectedHospitalId] || [];
    const filteredRoutes = routes.filter(route => 
      route.status === 'in_progress' || route.status === 'planned'
    );
    setActiveRoutes(filteredRoutes);

    // Filtrar solicitações pendentes para o hospital selecionado
    const requests = ambulanceData.requests[selectedHospitalId] || [];
    const filteredRequests = requests.filter(req => req.status === 'pending');
    setPendingRequests(filteredRequests);
  }, [ambulanceData, selectedHospitalId]);

  // Função para criar uma nova solicitação de ambulância
  const createAmbulanceRequest = useCallback(async (
    request: Omit<IAmbulanceRequest, 'id' | 'timestamp' | 'status'>
  ) => {
    if (!selectedHospitalId) {
      throw new Error('Nenhum hospital selecionado');
    }

    try {
      const newRequest: IAmbulanceRequest = {
        ...request,
        id: `req-${selectedHospitalId.toLowerCase()}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };

      // Enviar a nova solicitação para a API
      await api.post(`/ambulanceData/requests/${selectedHospitalId}`, newRequest);
      
      // Atualizar estado local
      setAmbulanceData(prevData => {
        if (!prevData) return prevData;
        
        const hospitalRequests = [...(prevData.requests[selectedHospitalId] || [])];
        hospitalRequests.push(newRequest);
        
        return {
          ...prevData,
          requests: {
            ...prevData.requests,
            [selectedHospitalId]: hospitalRequests
          }
        };
      });
      
      setPendingRequests(prev => [...prev, newRequest]);
      
      return newRequest;
    } catch (err) {
      console.error('Error creating ambulance request:', err);
      
      // Para desenvolvimento, criar o objeto de qualquer maneira e continuar com o fluxo local
      const newRequest: IAmbulanceRequest = {
        ...request,
        id: `req-${selectedHospitalId.toLowerCase()}-${Date.now()}`,
        timestamp: new Date().toISOString(),
        status: 'pending'
      };
      
      // Atualizar estado local
      setAmbulanceData(prevData => {
        if (!prevData) return prevData;
        
        const hospitalRequests = [...(prevData.requests[selectedHospitalId] || [])];
        hospitalRequests.push(newRequest);
        
        return {
          ...prevData,
          requests: {
            ...prevData.requests,
            [selectedHospitalId]: hospitalRequests
          }
        };
      });
      
      setPendingRequests(prev => [...prev, newRequest]);
      
      return newRequest;
    }
  }, [selectedHospitalId]);

  // Função para despachar uma ambulância
  const dispatchAmbulance = useCallback(async (
    requestId: string,
    ambulanceId: string,
    hospitals: IHospital[],
    destination?: { name: string; address: string; coordinates: { lat: number; lng: number }; hospitalId?: string }
  ) => {
    if (!selectedHospitalId || !ambulanceData) {
      throw new Error('Dados insuficientes para despachar ambulância');
    }

    try {
      // Encontrar a solicitação
      const request = ambulanceData.requests[selectedHospitalId]?.find(r => r.id === requestId);
      if (!request) {
        throw new Error('Solicitação não encontrada');
      }

      // Encontrar a ambulância
      const ambulance = ambulanceData.ambulances[selectedHospitalId]?.find(a => a.id === ambulanceId);
      if (!ambulance) {
        throw new Error('Ambulância não encontrada');
      }

      // Encontrar o hospital de origem
      const hospital = hospitals.find(h => h.id === selectedHospitalId);
      if (!hospital) {
        throw new Error('Hospital não encontrado');
      }

      // Usar localização do hospital como origem se ambulância estiver na base
      const origin = {
        name: hospital.name,
        address: hospital.unit.address,
        coordinates: hospital.unit.coordinates,
        hospitalId: hospital.id
      };

      // Usar destino fornecido ou da solicitação
      const routeDestination = destination || {
        name: `Emergência - ${request.callerName}`,
        address: request.location.address,
        coordinates: request.location.coordinates || { lat: 0, lng: 0 }
      };

      // Calcular distância e duração estimada
      const distance = calculateDistance(
        origin.coordinates.lat,
        origin.coordinates.lng,
        routeDestination.coordinates.lat,
        routeDestination.coordinates.lng
      );
      
      const duration = calculateEstimatedTime(distance);

      // Criar nova rota
      const newRoute: IAmbulanceRoute = {
        id: `route-${selectedHospitalId.toLowerCase()}-${Date.now()}`,
        ambulanceId,
        origin,
        destination: routeDestination,
        patient: request.patientInfo ? {
          id: request.id, // ID temporário baseado no request
          name: request.patientInfo.name || 'Paciente não identificado',
          age: request.patientInfo.age || 0,
          condition: request.patientInfo.condition,
          emergencyLevel: request.patientInfo.emergencyLevel
        } : undefined,
        status: 'planned',
        dispatchTime: new Date().toISOString(),
        estimatedArrivalTime: new Date(Date.now() + duration * 60000).toISOString(),
        distance,
        duration,
        callOperatorId: 'staff-004', // TODO: Obter ID do operador atual
        notes: request.notes
      };

      // Atualizar status da ambulância
      const updatedAmbulance: IAmbulance = {
        ...ambulance,
        status: 'dispatched',
        currentRoute: newRoute.id
      };

      // Atualizar status da solicitação
      const updatedRequest: IAmbulanceRequest = {
        ...request,
        status: 'assigned',
        assignedAmbulanceId: ambulanceId,
        routeId: newRoute.id
      };

      // Enviar para API
      try {
        await Promise.all([
          api.post(`/ambulanceData/routes/${selectedHospitalId}`, newRoute),
          api.put(`/ambulanceData/ambulances/${selectedHospitalId}/${ambulanceId}`, updatedAmbulance),
          api.put(`/ambulanceData/requests/${selectedHospitalId}/${requestId}`, updatedRequest)
        ]);
      } catch (apiError) {
        console.warn('API error (continuing with local state):', apiError);
      }

      // Atualizar estado local
      setAmbulanceData(prevData => {
        if (!prevData) return prevData;
        
        // Atualizar ambulâncias
        const ambulances = [...(prevData.ambulances[selectedHospitalId] || [])];
        const ambulanceIndex = ambulances.findIndex(a => a.id === ambulanceId);
        if (ambulanceIndex !== -1) {
          ambulances[ambulanceIndex] = updatedAmbulance;
        }
        
        // Atualizar rotas
        const routes = [...(prevData.routes[selectedHospitalId] || [])];
        routes.push(newRoute);
        
        // Atualizar solicitações
        const requests = [...(prevData.requests[selectedHospitalId] || [])];
        const requestIndex = requests.findIndex(r => r.id === requestId);
        if (requestIndex !== -1) {
          requests[requestIndex] = updatedRequest;
        }
        
        return {
          ...prevData,
          ambulances: {
            ...prevData.ambulances,
            [selectedHospitalId]: ambulances
          },
          routes: {
            ...prevData.routes,
            [selectedHospitalId]: routes
          },
          requests: {
            ...prevData.requests,
            [selectedHospitalId]: requests
          }
        };
      });
      
      setActiveRoutes(prev => [...prev, newRoute]);
      setAvailableAmbulances(prev => prev.filter(a => a.id !== ambulanceId));
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      
      return newRoute;
    } catch (err) {
      console.error('Error dispatching ambulance:', err);
      throw new Error('Erro ao despachar ambulância');
    }
  }, [selectedHospitalId, ambulanceData]);

  // Função para atualizar status de uma rota
  const updateRouteStatus = useCallback(async (
    routeId: string,
    status: TRouteStatus,
    ambulanceStatus?: TAmbulanceStatus
  ) => {
    if (!selectedHospitalId || !ambulanceData) {
      throw new Error('Dados insuficientes para atualizar rota');
    }

    try {
      // Encontrar a rota
      const route = ambulanceData.routes[selectedHospitalId]?.find(r => r.id === routeId);
      if (!route) {
        throw new Error('Rota não encontrada');
      }

      // Atualizar rota
      const updatedRoute: IAmbulanceRoute = {
        ...route,
        status,
        actualArrivalTime: status === 'completed' ? new Date().toISOString() : route.actualArrivalTime
      };

      // Encontrar e atualizar ambulância se necessário
      let updatedAmbulance: IAmbulance | undefined;
      if (ambulanceStatus) {
        const ambulance = ambulanceData.ambulances[selectedHospitalId]?.find(a => a.id === route.ambulanceId);
        if (ambulance) {
          updatedAmbulance = {
            ...ambulance,
            status: ambulanceStatus,
            currentRoute: ambulanceStatus === 'available' ? undefined : ambulance.currentRoute
          };
        }
      }

      // Encontrar e atualizar solicitação se existir
      let updatedRequest: IAmbulanceRequest | undefined;
      const request = ambulanceData.requests[selectedHospitalId]?.find(r => r.routeId === routeId);
      if (request) {
        updatedRequest = {
          ...request,
          status: status === 'completed' ? 'completed' : 
                 status === 'cancelled' ? 'cancelled' : 
                 'in_progress'
        };
      }

      // Enviar para API
      try {
        const promises = [api.put(`/ambulanceData/routes/${selectedHospitalId}/${routeId}`, updatedRoute)];
        
        if (updatedAmbulance) {
          promises.push(api.put(`/ambulanceData/ambulances/${selectedHospitalId}/${updatedAmbulance.id}`, updatedAmbulance));
        }
        
        if (updatedRequest) {
          promises.push(api.put(`/ambulanceData/requests/${selectedHospitalId}/${updatedRequest.id}`, updatedRequest));
        }
        
        await Promise.all(promises);
      } catch (apiError) {
        console.warn('API error (continuing with local state):', apiError);
      }

      // Atualizar estado local
      setAmbulanceData(prevData => {
        if (!prevData) return prevData;
        
        // Atualizar rotas
        const routes = [...(prevData.routes[selectedHospitalId] || [])];
        const routeIndex = routes.findIndex(r => r.id === routeId);
        if (routeIndex !== -1) {
          routes[routeIndex] = updatedRoute;
        }
        
        // Preparar objeto de retorno
        const newData = {
          ...prevData,
          routes: {
            ...prevData.routes,
            [selectedHospitalId]: routes
          }
        };
        
        // Atualizar ambulâncias se necessário
        if (updatedAmbulance) {
          const ambulances = [...(prevData.ambulances[selectedHospitalId] || [])];
          const ambulanceIndex = ambulances.findIndex(a => a.id === updatedAmbulance!.id);
          if (ambulanceIndex !== -1) {
            ambulances[ambulanceIndex] = updatedAmbulance;
          }
          
          newData.ambulances = {
            ...prevData.ambulances,
            [selectedHospitalId]: ambulances
          };
        }
        
        // Atualizar solicitações se necessário
        if (updatedRequest) {
          const requests = [...(prevData.requests[selectedHospitalId] || [])];
          const requestIndex = requests.findIndex(r => r.id === updatedRequest!.id);
          if (requestIndex !== -1) {
            requests[requestIndex] = updatedRequest;
          }
          
          newData.requests = {
            ...prevData.requests,
            [selectedHospitalId]: requests
          };
        }
        
        return newData;
      });
      
      // Atualizar listas filtradas
      setActiveRoutes(prev => {
        if (status === 'completed' || status === 'cancelled') {
          return prev.filter(r => r.id !== routeId);
        } else {
          return prev.map(r => r.id === routeId ? updatedRoute : r);
        }
      });
      
      if (updatedAmbulance && updatedAmbulance.status === 'available') {
        setAvailableAmbulances(prev => [...prev, updatedAmbulance!]);
      }
      
      return updatedRoute;
    } catch (err) {
      console.error('Error updating route status:', err);
      throw new Error('Erro ao atualizar status da rota');
    }
  }, [selectedHospitalId, ambulanceData]);

  return {
    ambulanceData,
    loading,
    error,
    activeRoutes,
    availableAmbulances,
    pendingRequests,
    createAmbulanceRequest,
    dispatchAmbulance,
    updateRouteStatus,
    getHospitalAmbulanceStats: useCallback((hospitalId: string) => {
      return ambulanceData?.stats[hospitalId] || null;
    }, [ambulanceData]),
    getAmbulanceById: useCallback((hospitalId: string, ambulanceId: string) => {
      return ambulanceData?.ambulances[hospitalId]?.find(a => a.id === ambulanceId) || null;
    }, [ambulanceData]),
    getRouteById: useCallback((hospitalId: string, routeId: string) => {
      return ambulanceData?.routes[hospitalId]?.find(r => r.id === routeId) || null;
    }, [ambulanceData])
  };
};