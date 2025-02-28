/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { useAmbulanceData } from '@/services/hooks/ambulance/useAmbulanceData';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { MapboxAmbulances } from '@/components/ui/templates/map/ambulances/MapboxAmbulances';
import { AmbulanceRequestForm } from './ambulances/AmbulanceRequestForm';
import { AmbulanceRouteDetails } from './ambulances/AmbulanceRouteDetails';
import { IAmbulanceRequest, TRouteStatus } from '@/types/ambulance-types';
import { AmbulanceSidebar } from './ambulances/AmbulanceSidebar';
import { Ambulance } from 'lucide-react';

export const AmbulanceManagement: React.FC = () => {
    const { networkData, currentUser } = useNetworkData();
    const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
    const [showRequestForm, setShowRequestForm] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const {
      ambulanceData,
      activeRoutes,
      availableAmbulances,
      pendingRequests,
      loading,
      error,
      createAmbulanceRequest,
      dispatchAmbulance,
      updateRouteStatus,
      getRouteById
    } = useAmbulanceData(selectedHospital);
  
    // Efeito para selecionar automaticamente o hospital do usuário atual
    useEffect(() => {
      if (currentUser?.hospitalId && networkData?.hospitals?.length) {
        setSelectedHospital(currentUser.hospitalId);
      } else if (networkData?.hospitals?.length && !selectedHospital) {
        setSelectedHospital(networkData.hospitals[0].id);
      }
    }, [currentUser, networkData, selectedHospital]);
  
    // Manipulador para criar nova solicitação
    const handleCreateRequest = useCallback(async (
      requestData: Omit<IAmbulanceRequest, 'id' | 'timestamp' | 'status'>
    ) => {
      try {
        setIsSubmitting(true);
        await createAmbulanceRequest(requestData);
        setShowRequestForm(false);
      } catch (error) {
        console.error('Erro ao criar solicitação:', error);
      } finally {
        setIsSubmitting(false);
      }
    }, [createAmbulanceRequest]);
  
    // Manipulador para atualizar status da rota
    const handleUpdateRouteStatus = useCallback(async (routeId: string, status: TRouteStatus) => {
      try {
        await updateRouteStatus(
          routeId, 
          status, 
          status === 'completed' || status === 'cancelled' ? 'available' : undefined
        );
        
        if (routeId === selectedRoute) {
          setSelectedRoute(null);
        }
      } catch (error) {
        console.error('Erro ao atualizar status da rota:', error);
      }
    }, [updateRouteStatus, selectedRoute]);
  
    // Manipulador para despachar ambulância
    const handleDispatchAmbulance = useCallback(async (requestId: string, ambulanceId: string) => {
      if (!networkData?.hospitals) return;
      
      try {
        setIsSubmitting(true);
        const route = await dispatchAmbulance(requestId, ambulanceId, networkData.hospitals);
        return route;
      } catch (error) {
        console.error('Erro ao despachar ambulância:', error);
        return null;
      } finally {
        setIsSubmitting(false);
      }
    }, [dispatchAmbulance, networkData]);
  
    // Renderizar detalhes da rota selecionada
    const renderRouteDetails = () => {
      if (!selectedRoute || !selectedHospital) return null;
      
      const route = getRouteById(selectedHospital, selectedRoute);
      if (!route) return null;
      
      return (
        <div className="absolute bottom-4 right-4 w-80">
          <AmbulanceRouteDetails
            route={route}
            onClose={() => setSelectedRoute(null)}
            onUpdateStatus={handleUpdateRouteStatus}
            ambulances={ambulanceData?.ambulances[selectedHospital] || []}
          />
        </div>
      );
    };
  
    // Renderizar formulário de solicitação
    const renderRequestForm = () => {
      if (!showRequestForm) return null;
      
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <AmbulanceRequestForm
            onSubmit={handleCreateRequest}
            onClose={() => setShowRequestForm(false)}
            availableAmbulances={availableAmbulances}
            isSubmitting={isSubmitting}
          />
        </div>
      );
    };
  
    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-lg">
            <h3 className="text-red-800 font-medium">Erro ao carregar dados</h3>
            <p className="text-red-600 mt-1">{error}</p>
            <button 
              className="mt-3 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }
  
    return (
      <div className="relative h-screen">
        {/* Título */}
        <div className="w-full bg-gradient-to-r from-blue-700 to-cyan-700 py-3 px-4 text-white">
            <h1 className="text-xl font-semibold flex items-center">
                <Ambulance className="mr-2" />
                Sistema de Gerenciamento de Ambulâncias
            </h1>
        </div>

        {/* Mapa como plano de fundo (z-index baixo) */}
        <div className="absolute inset-0 z-10">
          <MapboxAmbulances
            hospitals={networkData?.hospitals || []}
            selectedHospital={selectedHospital}
            setSelectedHospital={setSelectedHospital}
            currentUser={currentUser}
            ambulances={ambulanceData?.ambulances[selectedHospital || ''] || []}
            activeRoutes={activeRoutes}
            pendingRequests={pendingRequests}
            onUpdateRoute={handleUpdateRouteStatus}
            onCreateRoute={() => setShowRequestForm(true)}
          />
        </div>
        
        {/* Sidebar como camada superior (z-index maior) */}
        <AmbulanceSidebar
          hospitals={networkData?.hospitals || []}
          selectedHospital={selectedHospital}
          ambulanceData={ambulanceData}
          onHospitalSelect={setSelectedHospital}
          onCreateRequest={() => setShowRequestForm(true)}
        />
        
        {/* Detalhes da rota selecionada */}
        {renderRouteDetails()}
        
        {/* Formulário de solicitação */}
        {renderRequestForm()}
      </div>
    );
};