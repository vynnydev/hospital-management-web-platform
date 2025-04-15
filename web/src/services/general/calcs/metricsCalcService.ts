// metricsCalcService.ts
import api from '@/services/api'
import { HospitalMetrics } from '@/types/hospital-metrics-types'

export const metricsCalcService = {
  getMetrics: async (): Promise<HospitalMetrics> => {
    const response = await api.get<HospitalMetrics>('/metrics')
    return response.data;
  },

  calculateRotationRate: (admissions: number, discharges: number, maxBeds: number): number => {
    const effectiveCapacity = Math.min(admissions + discharges, maxBeds * 2);
    return (effectiveCapacity / 2);
  },

  calculateOccupancyStatus: (
    rate: number, 
    recommendedMax: number = 85, 
    absoluteMax: number = 95
  ): 'normal' | 'warning' | 'critical' => {
    if (rate >= absoluteMax) return 'critical';
    if (rate >= recommendedMax) return 'warning';
    return 'normal';
  },

  calculateAvailableCapacity: (
    currentOccupancy: number,
    maxBeds: number,
    departmentCapacity?: {
      maxOccupancy: number;
      recommendedMaxOccupancy: number;
    }
  ) => {
    const absoluteAvailable = maxBeds - currentOccupancy;
    
    if (departmentCapacity) {
      const recommendedAvailable = Math.floor(
        maxBeds * (departmentCapacity.recommendedMaxOccupancy / 100) - currentOccupancy
      );
      
      return {
        absolute: Math.max(absoluteAvailable, 0),
        recommended: Math.max(recommendedAvailable, 0),
        isOverRecommended: currentOccupancy > (maxBeds * departmentCapacity.recommendedMaxOccupancy / 100),
        isOverCapacity: currentOccupancy > (maxBeds * departmentCapacity.maxOccupancy / 100)
      };
    }

    return {
      absolute: Math.max(absoluteAvailable, 0),
      isOverCapacity: currentOccupancy > maxBeds
    };
  }
};