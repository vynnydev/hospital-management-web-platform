import React, { useState, useEffect, useMemo } from 'react';
import { useResourcesData } from '@/services/hooks/resources/useResourcesData';
import { useResourceRouteAnalysis } from '@/services/hooks/resources/useResourceRouteAnalysis';
import { ResourceFilterBar } from './resources/ResourceFilterBar';
import { ResourcesSidebar } from '../../../../components/ui/templates/resources/ResourcesSidebar';
import { ResourceRoutesRecommendations } from './resources/routes/recommendations/ResourceRoutesRecommendations';
import { TransferResourcesModal } from './resources/transfers/TransferResourcesModal';
import { TransferStatusPanel } from './resources/transfers/TransferStatusPanel';
import { SupplierRecommendationsPanel } from './resources/suppliers/recommendations/SupplierRecommendationsPanel';
import { SupplierRouteInfo } from './resources/suppliers/routes/SupplierRouteInfo';

import { INetworkData } from "@/types/hospital-network-types";
import { IStaffData } from "@/types/staff-types";
import { TResourceCategory, TDepartment } from '@/types/resources-types';
import { MapboxHospitalResouces } from '@/components/ui/templates/map/resources/MapboxHospitalResources';
import { TransferResourcesButton } from './resources/transfers/TransferResourcesButton';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { ISupplierCoordinates } from '@/types/supplier-types';

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
  const { currentUser } = useNetworkData(); 
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
  
  // Estados para fornecedores
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [supplierRoute, setSupplierRoute] = useState<{
    supplierId: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    distance?: number;
    duration?: number;
    supplierName?: string;
  } | null>(null);
  
  // Hooks
  const { resourcesData, loading: resourcesLoading, error: resourcesError } = useResourcesData();
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

  // Atualiza visualização do mapa com recomendações de transferência quando o hospital muda
  useEffect(() => {
    if (selectedHospitalId) {
      const recommendations = resourceRouteAnalysis.getRecommendedTransfers(selectedHospitalId);
      if (recommendations.length > 0) {
        const firstRec = recommendations[0];
        setSelectedTransfer({
          sourceId: firstRec.sourceHospitalId,
          targetId: firstRec.targetHospitalId
        });
      } else {
        setSelectedTransfer(null);
      }
    }
  }, [selectedHospitalId, resourceRouteAnalysis]);

  // Obter recomendações de fornecedores baseadas no hospital selecionado
  const supplierRecommendations = useMemo(() => {
    if (!selectedHospitalId || !resourcesData?.resources) return [];
    
    // Obter recursos críticos do hospital selecionado
    const hospitalResources = resourcesData.resources[selectedHospitalId];
    if (!hospitalResources) return [];
    
    // Verificar quais equipamentos estão em nível crítico
    const criticalEquipment: {type: string; category: 'equipment' | 'supplies'}[] = [];
    
    // Verificar equipamentos críticos
    Object.entries(hospitalResources.equipmentStatus).forEach(([type, status]) => {
      const availabilityRate = status.available / status.total;
      if (availabilityRate < 0.3) {
        criticalEquipment.push({
          type,
          category: 'equipment'
        });
      }
    });
    
    // Verificar suprimentos críticos
    Object.entries(hospitalResources.suppliesStatus).forEach(([type, status]) => {
      if (status.criticalLow > 0) {
        criticalEquipment.push({
          type,
          category: 'supplies'
        });
      }
    });
    
    // Se não houver equipamentos críticos, retornar lista vazia
    if (criticalEquipment.length === 0) return [];
    
    // Gerar fornecedores para os equipamentos críticos
    const selectedHospital = networkData.hospitals.find(h => h.id === selectedHospitalId);
    if (!selectedHospital) return [];
    
    // Gerar recomendações simuladas de fornecedores para os recursos críticos
    const recommendations = criticalEquipment.flatMap(equipment => {
      // Fornecedores simulados com base no tipo de equipamento
      const supplierNames: Record<string, string[]> = {
        respirators: ['RespiraCare', 'OxygenPlus'],
        monitors: ['MedTech Equipamentos', 'CardioSystem'],
        defibrillators: ['HeartSave', 'CardioTech'],
        imagingDevices: ['ImagePro Medical', 'DiagnosticVision'],
        medications: ['MediSupply', 'FarmaBrasil'],
        bloodBank: ['HemoLife', 'BloodCenter'],
        ppe: ['SafetyFirst', 'MedProtect']
      };
      
      const names = supplierNames[equipment.type] || ['Medical Supplier'];
      
      return names.map((name, index) => {
        // Gera uma pequena variação de localização para os fornecedores
        const latVariation = (Math.random() - 0.5) * 0.05;
        const lngVariation = (Math.random() - 0.5) * 0.05;
        
        const lat = selectedHospital.unit.coordinates.lat + latVariation;
        const lng = selectedHospital.unit.coordinates.lng + lngVariation;
        
        // Calcular distância aproximada
        const R = 6371; // raio da Terra em km
        const dLat = (lat - selectedHospital.unit.coordinates.lat) * Math.PI / 180;
        const dLon = (lng - selectedHospital.unit.coordinates.lng) * Math.PI / 180;
        const a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(selectedHospital.unit.coordinates.lat * Math.PI / 180) * 
          Math.cos(lat * Math.PI / 180) * 
          Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const distance = Math.round(R * c * 10) / 10; // km com 1 casa decimal
        
        return {
          supplier: {
            id: `sup-${equipment.type}-${index}`,
            name: name,
            distance: distance,
            coordinates: {
              lat,
              lng
            },
            contactInfo: {
              phone: `(11) ${Math.floor(9000 + Math.random() * 1000)}-${Math.floor(1000 + Math.random() * 9000)}`,
              email: `contato@${name.toLowerCase().replace(/\s+/g, '')}.com.br`
            },
            rating: Math.floor(4 + Math.random() * 2) as 4 | 5
          },
          resourceType: equipment.type,
          category: equipment.category,
          inStock: Math.random() > 0.2, // 80% de chance de estar em estoque
          estimatedDelivery: Math.floor(3 + Math.random() * 9), // 3-12 horas
          price: equipment.category === 'equipment' 
            ? Math.floor(10000 + Math.random() * 15000) 
            : Math.floor(500 + Math.random() * 1500),
          priorityScore: 10 - distance + (Math.random() * 2) // Quanto maior o score, melhor a recomendação
        };
      });
    });
    
    // Ordenar por prioridade
    return recommendations.sort((a, b) => b.priorityScore - a.priorityScore);
  }, [selectedHospitalId, resourcesData, networkData]);

  // Mostrar automaticamente a rota para o primeiro fornecedor quando mudar o hospital ou as recomendações
  useEffect(() => {
    if (supplierRecommendations.length > 0) {
      const firstRec = supplierRecommendations[0];
      
      // Atualize a rota para o primeiro fornecedor
      setSupplierRoute({
        supplierId: firstRec.supplier.id,
        supplierName: firstRec.supplier.name,
        coordinates: firstRec.supplier.coordinates
      });
      setSelectedSupplier(firstRec.supplier.id);
    } else {
      setSupplierRoute(null);
      setSelectedSupplier(null);
    }
  }, [supplierRecommendations, selectedHospitalId]);

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
        // Não limpa o selectedTransfer para manter a rota visível
      }
    }, transferRequest.estimatedTime * 1000);
  };
  
  // Handler para mostrar rota até fornecedor
  const handleShowSupplierRoute = (supplierId: string, coordinates: ISupplierCoordinates) => {
    const supplierInfo = supplierRecommendations.find(rec => rec.supplier.id === supplierId);
    
    setSupplierRoute({
      supplierId,
      coordinates,
      supplierName: supplierInfo?.supplier.name
    });
    setSelectedSupplier(supplierId);
  };
  
  // Handler para atualizar informações da rota após cálculo
  const handleRouteCalculated = (distance: number, duration: number) => {
    if (supplierRoute) {
      setSupplierRoute(prev => prev ? {
        ...prev,
        distance,
        duration
      } : null);
    }
  };

  // Encontrar hospitais fonte e alvo
  const sourceHospital = networkData?.hospitals.find(h => 
    h.id === (selectedTransfer?.sourceId || selectedHospitalId)
  );

  const targetHospitals = networkData?.hospitals.filter(h => 
    h.id !== (selectedTransfer?.sourceId || selectedHospitalId)
  ) || [];

  if (!sourceHospital) return null;

  // Obter nome do hospital selecionado
  const selectedHospitalName = networkData.hospitals.find(h => h.id === selectedHospitalId)?.name;

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
        loading={resourcesLoading}
        error={resourcesError}
        selectedHospital={selectedHospitalId}
        selectedCategory={selectedCategory}
        selectedDepartment={selectedDepartment}
        onHospitalSelect={handleHospitalSelect}
        onTransferResourceClick={handleTransferResourceClick}
        resourceRouteAnalysis={resourceRouteAnalysis}
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

      {/* Painel de informação de rota do fornecedor */}
      {supplierRoute && (
        <div className="absolute right-4 top-[310px] z-30">
          <SupplierRouteInfo
            supplierId={supplierRoute.supplierId}
            supplierName={supplierRoute.supplierName}
            distance={supplierRoute.distance}
            duration={supplierRoute.duration}
            onClose={() => {
              setSupplierRoute(null);
              setSelectedSupplier(null);
            }}
          />
        </div>
      )}

      {/* Painel de Recomendações de Fornecedores */}
      {selectedHospitalId && (
        <div className="absolute right-4 top-[445px] w-80 z-50">
          <SupplierRecommendationsPanel
            recommendations={supplierRecommendations}
            loading={resourcesLoading}
            onContactSupplier={(supplierId, resourceType) => {
              console.log(`Contato com fornecedor ${supplierId} para ${resourceType}`);
              // Implementar ação de contato aqui
            }}
            onShowRoute={handleShowSupplierRoute}
            selectedSupplierId={selectedSupplier}
            hospitalId={selectedHospitalId}
            hospitalName={selectedHospitalName}
            className="shadow-lg"
          />
        </div>
      )}

      {/* Painel de Recomendações */}
      {selectedHospitalId && (
        <div className="absolute right-4 top-[530px] w-80 z-20">
          <ResourceRoutesRecommendations
            hospitalId={selectedHospitalId}
            recommendations={resourceRouteAnalysis}
            onTransferSelect={(sourceId, targetId) => {
              setSelectedTransfer({ sourceId, targetId });
              setShowTransferModal(true);
            }} 
            hospitals={networkData?.hospitals || []}         
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

      {/* Status de Recursos */}
      <div className="absolute right-4 top-[610px] w-80 z-20 bg-gray-900 dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
        {/* Aqui você deve inserir o componente StatusPanel existente */}
      </div>

      {/* Mapa Principal */}
      <div className="absolute inset-0 z-10">
        <MapboxHospitalResouces 
          hospitals={networkData?.hospitals || []}
          selectedHospital={selectedHospitalId}
          setSelectedHospital={setSelectedHospitalId}
          currentUser={currentUser}
          activeRoute={selectedTransfer}
          resourceRouteAnalysis={resourceRouteAnalysis}
          supplierRoute={supplierRoute}
          onClearSupplierRoute={() => {
            setSupplierRoute(null);
            setSelectedSupplier(null);
          }}
          onRouteCalculated={handleRouteCalculated}
          showBothRoutes={true} // Garanta que esse valor seja true
        />
      </div>
    </div>
  );
};