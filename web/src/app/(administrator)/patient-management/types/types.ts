/* eslint-disable @typescript-eslint/no-explicit-any */

import { TOccupancy } from "@/types/hospital-network-types";

// Interfaces existentes que não precisam mudar
export interface IGeneratedData {
  recommendation?: string;
  treatmentImage?: string | null;
  carePlanImage?: string | null;
  monitoringImage?: string;
}

export interface IGeneratedImages {
  [key: string]: {
    treatment: string;
    carePlan: string;
  };
}

export type TDepartment = 'uti' | 'enfermaria' | 'pediatria' | 'cardiologia' | 'oncologia' | 'neurologia';
export type TFontSize = 'small' | 'normal' | 'large' | 'extra-large';

// Interface para métricas da rede
export interface INetworkMetrics {
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
}

// Interface para a rede hospitalar
export interface INetworkInfo {
  id: string;
  name: string;
  logo: string;
  totalHospitals: number;
  networkMetrics: INetworkMetrics;
}

// Interface para capacidade departamental
export interface IDepartmentCapacity {
  maxBeds: number;
  maxOccupancy: number;
  recommendedMaxOccupancy: number;
}

// Interface para métricas de capacidade
export interface ICapacityMetrics {
  total: {
    maxBeds: number;
    maxOccupancy: number;
  };
  departmental: {
    [key in TDepartment]?: IDepartmentCapacity;
  };
}

// Interface para comparação de período
export interface IPeriodComparison {
  value: number;
  trend: 'up' | 'down';
}

// Interface para métricas gerais
export interface IOverallMetrics {
  occupancyRate: number;
  totalPatients: number;
  availableBeds: number;
  avgStayDuration: number;
  turnoverRate: number;
  totalBeds: number;
  lastUpdate: string;
  periodComparison: {
    occupancy: IPeriodComparison;
    patients: IPeriodComparison;
    beds: IPeriodComparison;
  };
}

// Interface para métricas departamentais
export interface IDepartmentMetrics {
  occupancy: TOccupancy;
  beds: number;
  patients: number;
  validStatuses: string[];
}

// Interface principal de métricas do hospital
export interface IHospitalMetrics {
  capacity: {
    total: {
      maxBeds: number;
      maxOccupancy: number;
    };
    departmental: {
      uti: {
        maxBeds: number;
        maxOccupancy: number;
        recommendedMaxOccupancy: number;
      };
      enfermaria: {
        maxBeds: number;
        maxOccupancy: number;
        recommendedMaxOccupancy: number;
      };
    };
  };
  overall: {
    occupancyRate: number;
    totalPatients: number;
    availableBeds: number;
    avgStayDuration: number;
    turnoverRate: number;
    totalBeds: number;
    lastUpdate: string;
    periodComparison: {
      occupancy: { value: number; trend: "up" | "down" };
      patients: { value: number; trend: "up" | "down" };
      beds: { value: number; trend: "up" | "down" };
    };
  };
  departmental: Record<string, IDepartmentMetrics>;
}

// Estado inicial das métricas com a estrutura correta
export const initialMetrics: IHospitalMetrics = {
  capacity: {
    total: {
      maxBeds: 0,
      maxOccupancy: 0
    },
    departmental: {
      uti: {
        maxBeds: 0,
        maxOccupancy: 0,
        recommendedMaxOccupancy: 0
      },
      enfermaria: {
        maxBeds: 0,
        maxOccupancy: 0,
        recommendedMaxOccupancy: 0
      }
    }
  },
  overall: {
    occupancyRate: 0,
    totalPatients: 0,
    availableBeds: 0,
    avgStayDuration: 0,
    turnoverRate: 0,
    totalBeds: 0,
    lastUpdate: new Date().toISOString(),
    periodComparison: {
      occupancy: { value: 0, trend: "up" },
      patients: { value: 0, trend: "up" },
      beds: { value: 0, trend: "up" }
    }
  },
  departmental: {
    uti: {
      occupancy: 0,
      beds: 0,
      patients: 0,
      validStatuses: []
    },
    enfermaria: {
      occupancy: 0,
      beds: 0,
      patients: 0,
      validStatuses: []
    }
  }
};

// Interface para localização do hospital
export interface IHospitalUnit {
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Interface para classificação na rede
export interface INetworkRank {
  occupancy: number;
  efficiency: number;
  quality: number;
}

// Interface para hospital
export interface IHospital {
  id: string;
  name: string;
  unit: IHospitalUnit;
  type: string;
  specialties: string[];
  metrics: IHospitalMetrics;
  patients?: IPatient[];
  networkRank?: INetworkRank;
}

// Interface para usuário
export interface IUser {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  profileImage: string;
  permissions: string[];
  hospitalId?: string;
}

export interface IVitalSign {
  timestamp: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
  consciousness: string;
  painScale: number;
  respiratoryRate: number;
  mobility: string;}
  
export interface IPatient {
    id: string;
    qrCode: string;
    personalInfo: {
      name: string;
      age: number;
      gender: string;
      bloodType: string;
      photo: string;
      contactInfo: {
        phone: string;
        emergency: string;
        address: string;
      };
    };
    admission: {
      date: string;
      reason: string;
      type: string;
      status: string;
      statusHistory: Array<{
        department: string;
        status: string;
        timestamp: string;
      }>;
      predictedDischarge: string;
      bed: {
        id: string;
        number: string;
        wing: string;
        type: string;
      };
    };
    treatment: {
      diagnosis: string[];
      medications: Array<{
        name: string;
        dosage: string;
        frequency: string;
        duration: string;
        startDate: string;
      }>;
      vitals: IVitalSign[];
      procedures: Array<{
        type: string;
        date: string;
        result: string;
        notes: string;
      }>;
    };
    aiAnalysis: {
      riskScore: number;
      predictedLOS: number;
      complications: {
        risk: string;
        factors: string[];
      };
      recommendations: string[];
    };
    generatedImage?: string;
}