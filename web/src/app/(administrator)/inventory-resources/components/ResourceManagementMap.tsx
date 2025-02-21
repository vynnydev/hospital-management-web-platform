/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import { useResourcesData } from '@/services/hooks/useResourcesData';
import { useResourceRouteAnalysis } from '@/services/hooks/useResourceRouteAnalysis';
import { ResourceFilterBar } from './resources/ResourceFilterBar';
import { ResourcesSidebar } from './resources/ResourcesSidebar';
import { ResourceRoutesRecommendations } from './resources/routes/recommendations/ResourceRoutesRecommendations';
import { TransferResourcesModal } from './resources/transfers/TransferResourcesModal';
import { TransferStatusPanel } from './resources/transfers/TransferStatusPanel';

import { INetworkData } from "@/types/hospital-network-types";
import { IStaffData } from "@/types/staff-types";
import { TResourceCategory, TDepartment } from '@/types/resources-types';
import { MapboxHospital } from '@/components/ui/templates/map/MapboxHospital';

interface IResourceManagementMapProps {
  networkData: INetworkData;
  staffData: IStaffData;
  selectedHospitalId: string | null;
  setSelectedHospitalId: (id: string | null) => void;
}

export const ResourceManagementMap: React.FC<IResourceManagementMapProps> = ({
  networkData,
  staffData,
  selectedHospitalId,
  setSelectedHospitalId
}) => {
  // Estados
  const [selectedCategory, setSelectedCategory] = useState<TResourceCategory>('all');
  const [selectedDepartment, setSelectedDepartment] = useState<TDepartment>('all');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<{sourceId: string; targetId: string} | null>(null);
  const [preselectedResource, setPreselectedResource] = useState<{
    resourceType: string;
    category: 'equipment' | 'supplies';
    hospitalId: string;
  } | null>(null);
  const [activeTransfers, setActiveTransfers] = useState<any[]>([]);

  // Hooks
  const { resourcesData, loading, error } = useResourcesData();
  const resourceRouteAnalysis = useResourceRouteAnalysis(
    networkData?.hospitals || [],
    resourcesData?.resources || {},
    50 // raio de 50km para busca
  );

  // Selecionar primeiro hospital automaticamente
  useEffect(() => {
    if (!selectedHospitalId && networkData?.hospitals?.length > 0) {
      setSelectedHospitalId(networkData.hospitals[0].id);
    }
  }, [networkData?.hospitals, selectedHospitalId, setSelectedHospitalId]);

  // Atualiza visualização do mapa com recomendações
  useEffect(() => {
    if (selectedHospitalId) {
      const recommendations = resourceRouteAnalysis.getRecommendedTransfers(selectedHospitalId);
      if (recommendations.length > 0) {
        const firstRec = recommendations[0];
        setSelectedTransfer({
          sourceId: firstRec.sourceHospitalId,
          targetId: firstRec.targetHospitalId
        });
      }
    }
  }, [selectedHospitalId, resourceRouteAnalysis]);

  // Handlers
  const handleHospitalSelect = (id: string) => {
    setSelectedHospitalId(id);
  };

  const handleTransferResourceClick = (
    resourceType: string,
    category: 'equipment' | 'supplies',
    hospitalId: string
  ) => {
    setPreselectedResource({ resourceType, category, hospitalId });
    setShowTransferModal(true);
  };

  const handleTransferRequest = (transferRequest: any) => {
    setActiveTransfers(prev => [...prev, transferRequest]);
    setShowTransferModal(false);
    setSelectedTransfer({
      sourceId: transferRequest.sourceId,
      targetId: transferRequest.targetId
    });

    // Simular conclusão da transferência
    setTimeout(() => {
      setActiveTransfers(prev => 
        prev.filter(t => t.id !== transferRequest.id)
      );
      if (activeTransfers.length <= 1) {
        setSelectedTransfer(null);
      }
    }, transferRequest.estimatedTime * 1000);
  };

  // Encontrar hospitais fonte e alvo
  const sourceHospital = networkData?.hospitals.find(h => 
    h.id === (selectedTransfer?.sourceId || selectedHospitalId)
  );

  const targetHospitals = networkData?.hospitals.filter(h => 
    h.id !== (selectedTransfer?.sourceId || selectedHospitalId)
  ) || [];

  if (!sourceHospital) return null

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-gray-900 rounded-xl overflow-hidden">
      {/* Barra de Filtros */}
      <ResourceFilterBar 
        hospitals={networkData?.hospitals || []}
        selectedHospital={selectedHospitalId}
        setSelectedHospital={setSelectedHospitalId}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
      />

      {/* Sidebar com Recursos */}
      <ResourcesSidebar 
        hospitals={networkData?.hospitals || []}
        staffData={staffData}
        resourcesData={resourcesData}
        loading={loading}
        error={error}
        selectedHospital={selectedHospitalId}
        selectedCategory={selectedCategory}
        selectedDepartment={selectedDepartment}
        onHospitalSelect={handleHospitalSelect}
        onTransferResourceClick={handleTransferResourceClick}
        resourceRouteAnalysis={resourceRouteAnalysis}
      />

      {/* Painel de Recomendações */}
      {selectedHospitalId && (
        <div className="absolute right-4 top-[650px] w-80 z-20">
          <ResourceRoutesRecommendations
            hospitalId={selectedHospitalId}
            recommendations={resourceRouteAnalysis}
            onTransferSelect={(sourceId, targetId) => {
              setSelectedTransfer({ sourceId, targetId });
              setShowTransferModal(true);
            }}
          />
        </div>
      )}

      {/* Modal de Transferência */}
      {showTransferModal && selectedHospitalId && (
        <TransferResourcesModal
          sourceHospital={sourceHospital}
          targetHospitals={targetHospitals}
          sourceResources={resourcesData?.resources[sourceHospital.id] || null}
          resourcesData={resourcesData?.resources || {}}
          preselectedResource={preselectedResource}
          resourceRouteAnalysis={resourceRouteAnalysis}
          onClose={() => {
            setShowTransferModal(false);
            setPreselectedResource(null);
          }}
          onTransfer={handleTransferRequest}
        />
      )}

      {/* Painel de Status das Transferências */}
      <TransferStatusPanel 
        transfers={activeTransfers}
        hospitals={networkData?.hospitals || []}
        onTransferClick={(sourceId, targetId) => 
          setSelectedTransfer({ sourceId, targetId })
        }
      />

      {/* Mapa Principal */}
      <div className="absolute inset-0 z-10">
        <MapboxHospital 
          hospitals={networkData?.hospitals || []}
          selectedHospital={selectedHospitalId}
          setSelectedHospital={setSelectedHospitalId}
          currentUser={null}
          activeRoute={selectedTransfer}
          resourceRouteAnalysis={resourceRouteAnalysis}
        />
      </div>
    </div>
  );
};