// Network Interfaces
export type Occupancy = 'normal' | 'attention' | 'critical';

interface NetworkInfo {
    id: string;
    name: string;
    logo: string;
    totalHospitals: number;
    networkMetrics: {
      totalBeds: number;
      totalPatients: number;
      averageOccupancy: number;
      networkEfficiency: {
        avgWaitTime: number;
        bedTurnover: number;
        resourceUtilization: number;
      };
      regionalMetrics: {
        [key: string]: {
          hospitals: number;
          totalBeds: number;
          avgOccupancy: number;
        };
      };
    };
}
  
interface Coordinates {
    lat: number;
    lng: number;
}
  
interface Unit {
    address: string;
    city: string;
    state: string;
    coordinates: Coordinates;
}
  
interface DepartmentalCapacity {
    maxBeds: number;
    maxOccupancy: number;
    recommendedMaxOccupancy: number;
}
  
interface Metrics {
    capacity: {
      total: {
        maxBeds: number;
        maxOccupancy: number;
      };
      departmental: {
        uti: DepartmentalCapacity;
        enfermaria: DepartmentalCapacity;
      };
    };
    overall: {
      occupancyRate: number;
      totalPatients: number;
      availableBeds: number;
      avgStayDuration: number;
      turnoverRate: number;
      lastUpdate: string;
      totalBeds: number;
      periodComparison: {
        occupancy: {
          value: number;
          trend: "up" | "down";
        };
        patients: {
          value: number;
          trend: "up" | "down";
        };
        beds: {
          value: number;
          trend: "up" | "down";
        };
      };
    };
    departmental?: {
      uti: {
        occupancy: Occupancy;
        beds: number;
        patients: number;
        validStatuses: string[];
      };
      enfermaria: {
        occupancy: Occupancy;
        beds: number;
        patients: number;
        validStatuses: string[];
      };
    };
}
  
interface Hospital {
    id: string;
    name: string;
    unit: Unit;
    type: string;
    specialties: string[];
    metrics: Metrics;
    networkRank?: {
      occupancy: number;
      efficiency: number;
      quality: number;
    };
}
  
interface NetworkData {
    networkInfo: NetworkInfo;
    hospitals: Hospital[];
}
  
export type { NetworkInfo, Hospital, NetworkData };