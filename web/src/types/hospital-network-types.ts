import { IAppUser } from "./auth-types";

// Network Interfaces
export type TOccupancy = number;
export type TCareEventType = 'admission' | 'transfer' | 'procedure' | 'medication' | 'exam' | 'discharge';
export type TCareHistoryStatus = 'active' | 'discharged' | 'transferred';

export interface IStatusHistory {
  department: string;
  status: string;
  timestamp: string;
  specialty: string;
  updatedBy: IResponsibleStaff;
}

interface INetworkInfo {
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

export interface IContactInfo {
  phone: string;
  emergency: string;
  address: string;
}

export interface IPatient {
  id: string;
  name: string;
  admissionDate: string;
  diagnosis: string;
  expectedDischarge: string;
  age: number;
  gender: 'M' | 'F';  // Union type para garantir apenas valores válidos
  bloodType: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  photo: string;
  contactInfo: IContactInfo;
  careHistory?: IPatientCareHistory;
}

export interface IBed {
  id: string;
  number: string;
  floor: string;
  status: 'occupied' | 'available' | 'maintenance';
  patient?: IPatient;
  department: string;
  specialty: string;
  hospital: string;
}

interface IDepartment {
  name: string;
  beds: IBed[];
  capacity: IDepartmentalCapacity;
}

interface ICoordinates {
  lat: number;
  lng: number;
}

interface IUnit {
  longitude: number;
  latitude: number;
  address: string;
  city: string;
  state: string;
  coordinates: ICoordinates;
}

export interface IDepartmentalCapacity {
  maxBeds: number;
  maxOccupancy: number;
  recommendedMaxOccupancy: number;
}

interface IHospital {
  id: string;
  name: string;
  unit: IUnit;
  type: string;
  specialties: string[];
  metrics: IHospitalMetrics;
  networkRank?: {
    occupancy: number;
    efficiency: number;
    quality: number;
  };
  departments: IDepartment[];
}

interface INetworkData {
  networkInfo: INetworkInfo;
  hospitals: IHospital[];
  users: IAppUser[];
}

export interface IUseNetworkDataReturn {
  networkData: INetworkData | null;
  currentUser: IAppUser | null;
  floors: string[];
  beds: IBed[];
  loading: boolean;
  error: string | null;
  getBedsForFloor: (floorNumber: string) => IBed[];
}

export type { INetworkInfo, IHospital, INetworkData, IDepartment };

export interface ICareEventDetails {
  fromDepartment?: string;
  toDepartment?: string;
  procedureType?: string;
  medicationName?: string;
  examType?: string;
  result?: string;
  [key: string]: string | undefined;
}

export interface IResponsibleStaff {
  id: string;
  name: string;
  role: string;
}

export interface ICareEvent {
  id: string;
  timestamp: string;
  type: TCareEventType;
  description: string;
  department: string;
  responsibleStaff: IResponsibleStaff;
  details?: ICareEventDetails;
}

export interface IPatientCareHistory {
  admissionId: string;
  startDate: string;
  endDate?: string;
  primaryDiagnosis: string;
  events: ICareEvent[];
  statusHistory: IStatusHistory[];
  status: TCareHistoryStatus;
  totalLOS: number;
}

export interface IUseNetworkDataReturn {
  networkData: INetworkData | null;
  currentUser: IAppUser | null;
  floors: string[];
  beds: IBed[];
  loading: boolean;
  error: string | null;
  getBedsForFloor: (floorNumber: string) => IBed[];
  getPatientCareHistory: (patientId: string) => IPatientCareHistory | null;
  getPatientStatusHistory: (patientId: string) => IStatusHistory[] | null;
  getCurrentPatientStatus: (patientId: string) => IStatusHistory | null;
}

export type TDepartment = 'uti' | 'enfermaria' | 'pediatria' | 'cardiologia' | 'oncologia' | 'neurologia';

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