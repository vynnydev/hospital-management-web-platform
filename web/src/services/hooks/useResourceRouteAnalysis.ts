// hooks/useResourceRouteAnalysis.ts
import { useState, useEffect } from 'react';
import { IHospital } from '@/types/hospital-network-types';
import { IHospitalResources } from '@/types/resources-types';
import { 
  ICriticalShortage, 
  IResourceRouteRecommendation, 
  IResourceRouteAnalysis, 
  ISupplierRecommendation,
  TEquipmentType,
} from '@/types/resource-route-analysis-types';

interface IRouteEstimation {
  distance: number;
  duration: number;
  coordinates: [number, number][];
  trafficLevel: 'low' | 'medium' | 'high';
}

export const useResourceRouteAnalysis = (
  hospitals: IHospital[],
  resources: Record<string, IHospitalResources>,
  maxTransferDistance: number = 50 // km
) => {
  const [analysis, setAnalysis] = useState<IResourceRouteAnalysis>({
    transferRecommendations: [],
    supplierRecommendations: [],
    criticalShortages: []
  });

  const equipTypes: TEquipmentType[] = ['respirators', 'monitors', 'defibrillators', 'imagingDevices'];

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const estimateRouteDetails = async (
    source: IHospital,
    target: IHospital
  ): Promise<IRouteEstimation> => {
    const distance = calculateDistance(
      source.unit.coordinates.lat,
      source.unit.coordinates.lng,
      target.unit.coordinates.lat,
      target.unit.coordinates.lng
    );

    // Estimativa de tráfego baseada na hora do dia
    const hour = new Date().getHours();
    const trafficLevel = 
      (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19) 
        ? 'high'
        : (hour >= 10 && hour <= 16) 
          ? 'medium' 
          : 'low';

    // Fatores de multiplicação baseados no tráfego
    const trafficFactors = {
      low: 1.2,
      medium: 1.5,
      high: 2.0
    };

    const duration = Math.round((distance / 50) * 60 * trafficFactors[trafficLevel]);

    // Gerar coordenadas da rota (simplificado - linha reta)
    const coordinates: [number, number][] = [
      [source.unit.coordinates.lng, source.unit.coordinates.lat],
      [target.unit.coordinates.lng, target.unit.coordinates.lat]
    ];

    return {
      distance,
      duration,
      coordinates,
      trafficLevel
    };
  };

  const analyzeResourceRoutes = async () => {
    const transferRecs: IResourceRouteRecommendation[] = [];
    const criticalShorts: ICriticalShortage[] = [];
    const supplierRecs: ISupplierRecommendation[] = [];

    for (const hospital of hospitals) {
      const hospitalResources = resources[hospital.id];
      if (!hospitalResources) continue;

      for (const equipType of equipTypes) {
        const equipment = hospitalResources.equipmentStatus[equipType];
        const availabilityRate = equipment.available / equipment.total;

        if (availabilityRate < 0.2) {
          criticalShorts.push({
            hospitalId: hospital.id,
            resourceRouteType: equipType,
            severity: availabilityRate < 0.1 ? 'critical' : 'warning'
          });

          // Encontrar hospitais próximos com recursos disponíveis
          const nearbyHospitals = await Promise.all(
            hospitals
              .filter(h => h.id !== hospital.id)
              .map(async (h) => {
                const routeDetails = await estimateRouteDetails(hospital, h);
                return {
                  hospital: h,
                  resources: resources[h.id],
                  routeDetails
                };
              })
          );

          // Filtrar e ordenar por melhor opção
          const viableHospitals = nearbyHospitals
            .filter(({ routeDetails, resources }) => 
              routeDetails.distance <= maxTransferDistance &&               
              resources?.equipmentStatus[equipType].available > 
              resources?.equipmentStatus[equipType].total * 0.3
            )
            .sort((a, b) => 
              a.routeDetails.duration - b.routeDetails.duration
            );

          if (viableHospitals.length > 0) {
            const best = viableHospitals[0];
            const recommendation: IResourceRouteRecommendation = {
              sourceHospitalId: best.hospital.id,
              targetHospitalId: hospital.id,
              resourceRouteType: equipType,
              quantity: Math.floor(
                best.resources.equipmentStatus[equipType].available * 0.2
              ),
              priority: availabilityRate < 0.1 ? 'high' : 'medium',
              distance: best.routeDetails.distance,
              estimatedTime: best.routeDetails.duration,
              routeDetails: {
                trafficLevel: best.routeDetails.trafficLevel,
                coordinates: best.routeDetails.coordinates,
                alternativeRoutes: viableHospitals.slice(1, 3).map(alt => ({
                  hospitalId: alt.hospital.id,
                  distance: alt.routeDetails.distance,
                  estimatedTime: alt.routeDetails.duration,
                  coordinates: alt.routeDetails.coordinates
                }))
              }
            };

            transferRecs.push(recommendation);
          }
        }
      }
    }

    setAnalysis({
      transferRecommendations: transferRecs,
      supplierRecommendations: supplierRecs,
      criticalShortages: criticalShorts
    });
  };

  useEffect(() => {
    analyzeResourceRoutes();
  }, [hospitals, resources]);

  return {
    ...analysis,
    getHospitalShortages: (hospitalId: string) => 
      analysis.criticalShortages.filter(shortage => 
        shortage.hospitalId === hospitalId
      ),
    getRecommendedTransfers: (hospitalId: string) =>
      analysis.transferRecommendations.filter(rec => 
        rec.sourceHospitalId === hospitalId || 
        rec.targetHospitalId === hospitalId
      ),
    getPriorityLevel: (hospitalId: string) => {
      const shortages = analysis.criticalShortages.filter(
        s => s.hospitalId === hospitalId
      );
      if (shortages.some(s => s.severity === 'critical')) return 'critical';
      if (shortages.some(s => s.severity === 'warning')) return 'warning';
      return 'normal';
    },
    getRouteDetails: (sourceId: string, targetId: string) => {
      const transfer = analysis.transferRecommendations.find(
        t => t.sourceHospitalId === sourceId && t.targetHospitalId === targetId
      );
      return transfer?.routeDetails;
    }
  };
};