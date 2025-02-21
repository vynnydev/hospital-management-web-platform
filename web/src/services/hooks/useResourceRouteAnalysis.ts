// hooks/useResourceRouteAnalysis.ts
import { useState, useEffect, useCallback } from 'react';
import { IHospital } from '@/types/hospital-network-types';
import { IHospitalResources } from '@/types/resources-types';
import { 
  ICriticalShortage, 
  IResourceRouteRecommendation, 
  IResourceRouteAnalysis, 
  ISupplierRecommendation,
  TEquipmentType, 
  IResourceRouteAnalysisState,
  IMinimumLevels,
  TSupplyType
} from '@/types/resource-route-analysis-types';
import { calculateDistance } from '@/utils/calculateDistance';

const MINIMUM_LEVELS: IMinimumLevels = {
  equipment: {
    respirators: 0.3,      // 30% disponível
    monitors: 0.25,        // 25% disponível
    defibrillators: 0.2,   // 20% disponível
    imagingDevices: 0.15   // 15% disponível
  },
  supplies: {
    medications: 10,     // Mínimo de 10 unidades normais
    bloodBank: 5,        // Mínimo de 5 unidades normais
    ppe: 15             // Mínimo de 15 unidades normais
  }
};

export const useResourceRouteAnalysis = (
  hospitals: IHospital[],
  resources: Record<string, IHospitalResources>,
  maxTransferDistance: number = 50 // km
): IResourceRouteAnalysis => {
  const [analysisState, setAnalysisState] = useState<IResourceRouteAnalysisState>({
    transferRecommendations: [],
    supplierRecommendations: [],
    criticalShortages: []
  });

  // Lista de tipos de equipamentos
  const equipTypes: TEquipmentType[] = ['respirators', 'monitors', 'defibrillators', 'imagingDevices'];

  // Avalia nível de prioridade baseado nos recursos
  // Funções de retorno que serão memoizadas para evitar recriações desnecessárias
  const getPriorityLevel = useCallback((hospitalId: string): 'critical' | 'warning' | 'normal' => {
    const hospitalResources = resources[hospitalId];
    if (!hospitalResources) return 'normal';

    let hasCritical = false;
    let hasWarning = false;

    for (const equipType of equipTypes) {
      const equipment = hospitalResources.equipmentStatus[equipType];
      const availabilityRate = equipment.available / equipment.total;

      if (availabilityRate < 0.2) {
        hasCritical = true;
        break;
      } else if (availabilityRate < 0.4) {
        hasWarning = true;
      }
    }

    if (hasCritical) return 'critical';
    if (hasWarning) return 'warning';
    return 'normal';
  }, [resources]);

  const getHospitalResources = useCallback((hospitalId: string): IHospitalResources | null => {
    return resources[hospitalId] || null;
  }, [resources]);

  // Análise principal dos recursos
  const analyzeResourceRoutes = async () => {
    const transferRecs: IResourceRouteRecommendation[] = [];
    const criticalShorts: ICriticalShortage[] = [];
    const supplierRecs: ISupplierRecommendation[] = [];

    const checkResourceLevels = (resources: IHospitalResources) => {
      const criticalResources: Array<{
        type: TEquipmentType | TSupplyType;
        category: 'equipment' | 'supplies';
        severity: 'critical' | 'warning';
      }> = [];
    
      // Verifica equipamentos
      (Object.entries(resources.equipmentStatus) as [TEquipmentType, typeof resources.equipmentStatus[TEquipmentType]][]).forEach(([type, status]) => {
        const minimumLevel = MINIMUM_LEVELS.equipment[type];
        if (minimumLevel) { // Verifica se existe nível mínimo definido
          const availabilityRate = status.available / status.total;
          if (availabilityRate < minimumLevel) {
            criticalResources.push({
              type,
              category: 'equipment',
              severity: availabilityRate < minimumLevel / 2 ? 'critical' : 'warning'
            });
          }
        }
      });
    
      // Verifica suprimentos
      (Object.entries(resources.suppliesStatus) as [TSupplyType, typeof resources.suppliesStatus[TSupplyType]][]).forEach(([type, status]) => {
        const minimumLevel = MINIMUM_LEVELS.supplies[type];
        if (minimumLevel) { // Verifica se existe nível mínimo definido
          if (status.normal < minimumLevel) {
            criticalResources.push({
              type,
              category: 'supplies',
              severity: status.criticalLow > 0 ? 'critical' : 'warning'
            });
          }
        }
      });
    
      return criticalResources;
    };

    for (const hospital of hospitals) {
      const hospitalResources = resources[hospital.id];
      if (!hospitalResources) continue;

      for (const equipType of equipTypes) {
        const equipment = hospitalResources.equipmentStatus[equipType];
        const availabilityRate = equipment.available / equipment.total;

        if (availabilityRate < 0.2) {
          // Adiciona escassez crítica
          criticalShorts.push({
            hospitalId: hospital.id,
            resourceRouteType: equipType,
            severity: availabilityRate < 0.1 ? 'critical' : 'warning'
          });

          // Encontra hospitais próximos com recursos disponíveis
          const nearbyHospitals = hospitals
            .filter(h => h.id !== hospital.id)
            .map(h => {
              const distance = calculateDistance(
                hospital.unit.coordinates.lat,
                hospital.unit.coordinates.lng,
                h.unit.coordinates.lat,
                h.unit.coordinates.lng
              );

              const trafficFactor = getTrafficFactor();
              return {
                hospital: h,
                resources: resources[h.id],
                distance,
                estimatedTime: Math.round((distance / 50) * 60 * trafficFactor)
              };
            })
            .filter(({ distance, resources }) => 
              distance <= maxTransferDistance &&
              resources?.equipmentStatus[equipType].available > 
              resources?.equipmentStatus[equipType].total * 0.3
            )
            .sort((a, b) => a.distance - b.distance);

          if (nearbyHospitals.length > 0) {
            const bestMatch = nearbyHospitals[0];
            transferRecs.push({
              sourceHospitalId: bestMatch.hospital.id,
              targetHospitalId: hospital.id,
              resourceRouteType: equipType,
              quantity: Math.floor(
                bestMatch.resources.equipmentStatus[equipType].available * 0.2
              ),
              priority: availabilityRate < 0.1 ? 'high' : 'medium',
              distance: bestMatch.distance,
              estimatedTime: bestMatch.estimatedTime,
              routeDetails: {
                coordinates: [
                  [bestMatch.hospital.unit.coordinates.lng, bestMatch.hospital.unit.coordinates.lat],
                  [hospital.unit.coordinates.lng, hospital.unit.coordinates.lat]
                ],
                trafficLevel: getTrafficLevel(bestMatch.estimatedTime, bestMatch.distance),
                alternativeRoutes: nearbyHospitals.slice(1, 3).map(alt => ({
                  hospitalId: alt.hospital.id,
                  distance: alt.distance,
                  estimatedTime: alt.estimatedTime,
                  coordinates: [
                    [alt.hospital.unit.coordinates.lng, alt.hospital.unit.coordinates.lat],
                    [hospital.unit.coordinates.lng, hospital.unit.coordinates.lat]
                  ]
                }))
              }
            });
          }
        }
      }
    }

    setAnalysisState({
      transferRecommendations: transferRecs,
      supplierRecommendations: supplierRecs,
      criticalShortages: criticalShorts
    });
  };

  // Helpers para cálculos de tráfego
  const getTrafficFactor = (): number => {
    const hour = new Date().getHours();
    if (hour >= 7 && hour <= 9) return 1.5;  // Rush da manhã
    if (hour >= 17 && hour <= 19) return 1.8;  // Rush da tarde
    return 1.2;  // Normal
  };

  const getTrafficLevel = (time: number, distance: number): 'low' | 'medium' | 'high' => {
    const baseTime = (distance / 50) * 60; // Tempo base em minutos
    const ratio = time / baseTime;
    
    if (ratio > 1.5) return 'high';
    if (ratio > 1.2) return 'medium';
    return 'low';
  };

  useEffect(() => {
    analyzeResourceRoutes();
  }, [hospitals, resources]);

  const getRecommendedTransfers = useCallback((hospitalId: string): IResourceRouteRecommendation[] => {
    return analysisState.transferRecommendations.filter(rec => 
      rec.sourceHospitalId === hospitalId || rec.targetHospitalId === hospitalId
    );
  }, [analysisState.transferRecommendations]);

  const getHospitalShortages = useCallback((hospitalId: string): ICriticalShortage[] => {
    return analysisState.criticalShortages.filter(shortage => 
      shortage.hospitalId === hospitalId
    );
  }, [analysisState.criticalShortages]);

  const getSupplierRecommendations = useCallback((hospitalId: string): ISupplierRecommendation[] => {
    // Mock de fornecedores (você pode substituir por dados reais)
    const mockSuppliers = [
      {
        id: 'supplier-1',
        name: 'Medical Equipment Co.',
        coordinates: [-46.6338, -23.5479] as [number, number],
        availability: 'immediate' as const,
        resourceType: 'respirators' as TEquipmentType,
        estimatedPrice: 50000,
        distance: 5.2
      },
      {
        id: 'supplier-2',
        name: 'Healthcare Supplies Ltd',
        coordinates: [-46.6288, -23.5589] as [number, number],
        availability: '24h' as const,
        resourceType: 'monitors' as TEquipmentType,
        estimatedPrice: 30000,
        distance: 7.8
      }
    ];
  
    const hospital = hospitals.find(h => h.id === hospitalId);
    if (!hospital) return [];
  
    // Filtrar fornecedores baseado nas necessidades do hospital
    const shortages = getHospitalShortages(hospitalId);
    const criticalEquipment = shortages
      .filter(s => s.severity === 'critical')
      .map(s => s.resourceRouteType);
  
    return mockSuppliers.filter(supplier => 
      criticalEquipment.includes(supplier.resourceType) &&
      calculateDistance(
        hospital.unit.coordinates.lat,
        hospital.unit.coordinates.lng,
        supplier.coordinates[1],
        supplier.coordinates[0]
      ) <= maxTransferDistance
    );
  }, [hospitals, getHospitalShortages, maxTransferDistance, calculateDistance]);

  return {
    ...analysisState,
    getPriorityLevel,
    getRecommendedTransfers,
    getHospitalShortages,
    getSupplierRecommendations,
    getHospitalResources
  };
};