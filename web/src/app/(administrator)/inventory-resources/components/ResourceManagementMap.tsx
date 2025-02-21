import React, { useState, useEffect } from 'react';
import { useResourcesData } from '@/services/hooks/useResourcesData';
import { ResourcesSidebar } from './resources/ResourcesSidebar';
import { ResourceFilterBar } from './resources/ResourceFilterBar';
import { TransferResourcesModal } from './resources/transfers/TransferResourcesModal';
import { TransferResourcesButton } from './resources/transfers/TransferResourcesButton';
import { TransferStatusPanel } from './resources/transfers/TransferStatusPanel';
import { INetworkData } from "@/types/hospital-network-types";
import { IStaffData } from "@/types/staff-types";
import { TDepartment, TResourceCategory } from '@/types/resources-types';
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

  const { resourcesData, loading, error } = useResourcesData();
  console.log("RESOURCES:", resourcesData)

  // Selecionar primeiro hospital automaticamente
  useEffect(() => {
    if (!selectedHospitalId && networkData?.hospitals?.length > 0) {
      setSelectedHospitalId(networkData.hospitals[0].id);
    }
  }, [networkData?.hospitals, selectedHospitalId, setSelectedHospitalId]);

  // Encontrar hospitais fonte e alvo
  const sourceHospital = networkData?.hospitals.find(h => 
    h.id === (preselectedResource?.hospitalId || selectedHospitalId)
  );

  const targetHospitals = networkData?.hospitals.filter(h => 
    h.id !== (preselectedResource?.hospitalId || selectedHospitalId)
  ) || [];

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

  const handleTransferRequest = (transferRequest: {
    sourceId: string;
    targetId: string;
  }) => {
    setSelectedTransfer(transferRequest);
    setShowTransferModal(false);
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-gray-900 rounded-xl overflow-hidden">
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
      />

      {/* Botão de Transferência */}
      {selectedHospitalId && targetHospitals.length > 0 && (
        <TransferResourcesButton 
          onClick={() => {
            setPreselectedResource(null);
            setShowTransferModal(true);
          }}
          position="top-right"
          className="shadow-lg"
        />
      )}

      {/* Modal de Transferência */}
      {showTransferModal && sourceHospital && (
        <TransferResourcesModal
          sourceHospital={sourceHospital}
          targetHospitals={targetHospitals}
          sourceResources={resourcesData?.resources[sourceHospital.id] || null}
          resourcesData={resourcesData?.resources || {}}
          preselectedResource={preselectedResource}
          onClose={() => {
            setShowTransferModal(false);
            setPreselectedResource(null);
          }}
          onTransfer={handleTransferRequest}
        />
      )}

      {/* Painel de Status de Transferência */}
      <TransferStatusPanel 
        transfers={[]}  // Adicione suas transferências ativas aqui
        hospitals={networkData?.hospitals || []}
        onTransferClick={(sourceId, targetId) => 
          setSelectedTransfer({ sourceId, targetId })
        }
      />

      <div className="absolute inset-0 z-10">
        <MapboxHospital 
          hospitals={networkData?.hospitals || []}
          selectedHospital={selectedHospitalId}
          setSelectedHospital={setSelectedHospitalId}
          currentUser={null}
          activeRoute={selectedTransfer}
        />
      </div>
    </div>
  );
};