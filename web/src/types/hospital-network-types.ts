import { AppUser } from "./auth-types";

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

export interface Patient {
  id: string;
  name: string;
  admissionDate: string;
  diagnosis: string;
  expectedDischarge: string;
}

export interface IBed {
  id: string;
  number: string;
  floor: string;
  status: 'occupied' | 'available' | 'maintenance';
  patient?: Patient;
  department: string;
  specialty: string;
  hospital: string;
}

interface Department {
  name: string;
  beds: IBed[];
  capacity: DepartmentalCapacity;
}

interface Coordinates {
  lat: number;
  lng: number;
}

interface Unit {
  longitude: number;
  latitude: number;
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
  departments: Department[];
}

interface NetworkData {
  networkInfo: NetworkInfo;
  hospitals: Hospital[];
}

export interface UseNetworkDataReturn {
  networkData: NetworkData | null;
  currentUser: AppUser | null;
  floors: string[];
  beds: IBed[];
  loading: boolean;
  error: string | null;
  getBedsForFloor: (floorNumber: string) => IBed[];
}

export type { NetworkInfo, Hospital, NetworkData, Department };