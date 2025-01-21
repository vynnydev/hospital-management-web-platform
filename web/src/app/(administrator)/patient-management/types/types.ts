/* eslint-disable @typescript-eslint/no-explicit-any */

// Interfaces existentes que não precisam mudar
export interface GeneratedData {
  recommendation?: string;
  treatmentImage?: string;
  carePlanImage?: string;
  monitoringImage?: string;
}

export interface GeneratedImages {
  [key: string]: {
    treatment: string;
    carePlan: string;
  };
}

export type Department = 'uti' | 'enfermaria' | 'pediatria' | 'cardiologia' | 'oncologia' | 'neurologia';
export type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

// Interface para métricas da rede
export interface NetworkMetrics {
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
export interface NetworkInfo {
  id: string;
  name: string;
  logo: string;
  totalHospitals: number;
  networkMetrics: NetworkMetrics;
}

// Interface para capacidade departamental
export interface DepartmentCapacity {
  maxBeds: number;
  maxOccupancy: number;
  recommendedMaxOccupancy: number;
}

// Interface para métricas de capacidade
export interface CapacityMetrics {
  total: {
    maxBeds: number;
    maxOccupancy: number;
  };
  departmental: {
    [key in Department]?: DepartmentCapacity;
  };
}

// Interface para comparação de período
export interface PeriodComparison {
  value: number;
  trend: 'up' | 'down';
}

// Interface para métricas gerais
export interface OverallMetrics {
  occupancyRate: number;
  totalPatients: number;
  availableBeds: number;
  avgStayDuration: number;
  turnoverRate: number;
  totalBeds: number;
  lastUpdate: string;
  periodComparison: {
    occupancy: PeriodComparison;
    patients: PeriodComparison;
    beds: PeriodComparison;
  };
}

// Interface para métricas departamentais
export interface DepartmentMetrics {
  occupancy: number;
  beds: number;
  patients: number;
  validStatuses: string[];
}

// Interface principal de métricas do hospital
export interface HospitalMetrics {
  capacity: CapacityMetrics;
  overall: OverallMetrics;
  departmental: {
    [key: string]: DepartmentMetrics;
  };
}

// Interface para localização do hospital
export interface HospitalUnit {
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

// Interface para classificação na rede
export interface NetworkRank {
  occupancy: number;
  efficiency: number;
  quality: number;
}

// Interface para hospital
export interface Hospital {
  id: string;
  name: string;
  unit: HospitalUnit;
  type: string;
  specialties: string[];
  metrics: HospitalMetrics;
  patients?: Patient[];
  networkRank?: NetworkRank;
}

// Interface para usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  password: string;
  profileImage: string;
  permissions: string[];
  hospitalId?: string;
}

export interface VitalSign {
  timestamp: string;
  temperature: number;
  bloodPressure: string;
  heartRate: number;
  oxygenSaturation: number;
  consciousness: string;
  painScale: number;
  respiratoryRate: number;
  mobility: string;}
  
export interface Patient {
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
      vitals: VitalSign[];
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