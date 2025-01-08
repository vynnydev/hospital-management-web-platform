/* eslint-disable @typescript-eslint/no-explicit-any */

export interface GeneratedData {
  recommendation?: string;
  treatmentImage?: string;
  carePlanImage?: string;
  imageBlobUrl?: string;
}

export interface GeneratedImages {
  [key: string]: {
    treatment: string;
    carePlan: string;
  };
}

export type Department = 'uti' | 'enfermaria' | 'pediatria' | 'cardiologia' | 'oncologia' | 'neurologia';

export type FontSize = 'small' | 'normal' | 'large' | 'extra-large';

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

interface DepartmentMetrics {
    occupancy: number;
    beds: number;
    patients: number;
    validStatuses: string[];
}

export interface Metrics {
    capacity: {
      total: {
        maxBeds: number;
        maxOccupancy: number;
      };
      departmental: Record<Department,{
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
      }>;
    };
    overall: {
      occupancyRate: number;
      totalPatients: number;
      availableBeds: number;
      avgStayDuration: number;
      turnoverRate: number;
      lastUpdate: string;
      periodComparison: {
        occupancy: {
          value: number;
          trend: string;
        };
        patients: Patient
        beds: {
          value: number;
          trend: string;
        };
      };
    };
    departmental: Record<string, DepartmentMetrics>;
}