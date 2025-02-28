// hooks/useResourceRouteAnalysis.ts
import { useState, useEffect, useCallback } from 'react';
import { IHospital } from '@/types/hospital-network-types';
import { IHospitalResources } from '@/types/resources-types';
import { calculateDistance } from '@/utils/calculateDistance';
import {
  ICriticalShortage,
  IResourceRouteRecommendation,
  IResourceRouteAnalysis,
  ISupplierRecommendation,
  TEquipmentType,
  TSupplyType
} from '@/types/resource-route-analysis-types';

const MINIMUM_LEVELS = {
  equipment: {
    respirators: 0.3,
    monitors: 0.25,
    defibrillators: 0.2,
    imagingDevices: 0.15
  } as const,
  supplies: {
    medications: 10,
    bloodBank: 5,
    ppe: 15
  } as const
};

const MOCK_SUPPLIERS: ISupplierRecommendation[] = [
  {
    id: 'sup-1',
    name: 'Medical Supplies Co.',
    coordinates: [-46.6338, -23.5479],
    resourceType: 'respirators',
    estimatedPrice: 45000,
    availability: 'immediate'
  },
  {
    id: 'sup-2',
    name: 'Healthcare Equipment Ltd',
    coordinates: [-46.6288, -23.5589],
    resourceType: 'monitors',
    estimatedPrice: 28000,
    availability: '24h'
  }
];

export const useResourceRouteAnalysis = (
  hospitals: IHospital[],
  resources: Record<string, IHospitalResources>,
  maxTransferDistance: number = 50
): IResourceRouteAnalysis => {
  const [transferRecommendations, setTransferRecommendations] = useState<IResourceRouteRecommendation[]>([]);
  const [supplierRecommendations, setSupplierRecommendations] = useState<ISupplierRecommendation[]>([]);
  const [criticalShortages, setCriticalShortages] = useState<ICriticalShortage[]>([]);

  const checkResourceLevels = useCallback((hospitalId: string): ICriticalShortage[] => {
    const hospitalResources = resources[hospitalId];
    if (!hospitalResources) return [];

    const shortages: ICriticalShortage[] = [];

    // Verifica equipamentos
    Object.entries(hospitalResources.equipmentStatus).forEach(([type, status]) => {
      const equipType = type as TEquipmentType;
      const availabilityRate = status.available / status.total;
      const minimumLevel = MINIMUM_LEVELS.equipment[equipType];

      if (availabilityRate < minimumLevel) {
        shortages.push({
          hospitalId,
          type: equipType,
          category: 'equipment',
          severity: availabilityRate < minimumLevel / 2 ? 'critical' : 'warning'
        });
      }
    });

    // Verifica suprimentos
    Object.entries(hospitalResources.suppliesStatus).forEach(([type, status]) => {
      const supplyType = type as TSupplyType;
      const minimumLevel = MINIMUM_LEVELS.supplies[supplyType];

      if (status.normal < minimumLevel) {
        shortages.push({
          hospitalId,
          type: supplyType,
          category: 'supplies',
          severity: status.criticalLow > 0 ? 'critical' : 'warning'
        });
      }
    });

    return shortages;
  }, [resources]);

  const findNearbyHospitals = useCallback((
    sourceHospital: IHospital,
    resourceType: TEquipmentType
  ) => {
    return hospitals
      .filter(h => h.id !== sourceHospital.id)
      .map(h => {
        const hospitalResources = resources[h.id];
        if (!hospitalResources) return null;

        const equipStatus = hospitalResources.equipmentStatus[resourceType];
        if (!equipStatus) return null;

        const availabilityRate = equipStatus.available / equipStatus.total;
        if (availabilityRate < 0.3) return null;

        const distance = calculateDistance(
          sourceHospital.unit.coordinates.lat,
          sourceHospital.unit.coordinates.lng,
          h.unit.coordinates.lat,
          h.unit.coordinates.lng
        );

        return distance <= maxTransferDistance ? {
          hospital: h,
          distance,
          estimatedTime: Math.round((distance / 50) * 60)
        } : null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .sort((a, b) => a.distance - b.distance);
  }, [hospitals, resources, maxTransferDistance]);

  const analyzeResourceRoutes = useCallback(() => {
    const newCriticalShortages: ICriticalShortage[] = [];
    const newTransferRecommendations: IResourceRouteRecommendation[] = [];
    const newSupplierRecommendations: ISupplierRecommendation[] = [];

    hospitals.forEach(hospital => {
      const shortages = checkResourceLevels(hospital.id);
      newCriticalShortages.push(...shortages);

      shortages
        .filter(shortage => shortage.severity === 'critical' && shortage.category === 'equipment')
        .forEach(shortage => {
          const nearbyHospitals = findNearbyHospitals(
            hospital,
            shortage.type as TEquipmentType
          );

          if (nearbyHospitals.length > 0) {
            const nearest = nearbyHospitals[0];
            
            newTransferRecommendations.push({
              sourceHospitalId: nearest.hospital.id,
              targetHospitalId: hospital.id,
              resourceType: shortage.type as TEquipmentType,
              resourceRouteType: shortage.type as TEquipmentType,
              quantity: Math.floor(resources[nearest.hospital.id]?.equipmentStatus[shortage.type as TEquipmentType].available * 0.2 || 0),
              priority: 'high',
              distance: nearest.distance,
              estimatedTime: nearest.estimatedTime,
              routeDetails: {
                coordinates: [
                  [nearest.hospital.unit.coordinates.lng, nearest.hospital.unit.coordinates.lat],
                  [hospital.unit.coordinates.lng, hospital.unit.coordinates.lat]
                ],
                trafficLevel: nearest.estimatedTime > nearest.distance * 2 ? 'high' : 'low',
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
          } else {
            const nearbySuppliers = MOCK_SUPPLIERS
              .filter(s => s.resourceType === shortage.type)
              .map(s => ({
                ...s,
                distance: calculateDistance(
                  hospital.unit.coordinates.lat,
                  hospital.unit.coordinates.lng,
                  s.coordinates[1],
                  s.coordinates[0]
                )
              }))
              .filter(s => s.distance <= maxTransferDistance);

            newSupplierRecommendations.push(...nearbySuppliers);
          }
        });
    });

    setCriticalShortages(newCriticalShortages);
    setTransferRecommendations(newTransferRecommendations);
    setSupplierRecommendations(newSupplierRecommendations);
  }, [hospitals, resources, checkResourceLevels, findNearbyHospitals]);

  useEffect(() => {
    analyzeResourceRoutes();
  }, [analyzeResourceRoutes]);

  return {
    transferRecommendations,
    supplierRecommendations,
    criticalShortages,
    getPriorityLevel: useCallback((hospitalId: string) => {
      const shortages = checkResourceLevels(hospitalId);
      if (shortages.some(s => s.severity === 'critical')) return 'critical';
      if (shortages.some(s => s.severity === 'warning')) return 'warning';
      return 'normal';
    }, [checkResourceLevels]),
    getRecommendedTransfers: useCallback((hospitalId: string) => 
      transferRecommendations.filter(rec => 
        rec.sourceHospitalId === hospitalId || rec.targetHospitalId === hospitalId
      ), [transferRecommendations]),
    getHospitalShortages: useCallback((hospitalId: string) => 
      criticalShortages.filter(shortage => shortage.hospitalId === hospitalId),
      [criticalShortages]),
    getHospitalResources: useCallback((hospitalId: string) => 
      resources[hospitalId] || null, [resources]),
    getSupplierRecommendations: useCallback((hospitalId: string) =>
      supplierRecommendations.filter(s => 
        checkResourceLevels(hospitalId)
          .some(shortage => shortage.type === s.resourceType)
      ), [supplierRecommendations, checkResourceLevels])
  };
};