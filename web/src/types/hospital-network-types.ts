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

export interface IMetrics {
  capacity: {
    total: {
      maxBeds: number;
      maxOccupancy: number;
    };
    departmental: {
      uti: IDepartmentalCapacity;
      enfermaria: IDepartmentalCapacity;
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
      occupancy: TOccupancy;
      beds: number;
      patients: number;
      validStatuses: string[];
    };
    enfermaria: {
      occupancy: TOccupancy;
      beds: number;
      patients: number;
      validStatuses: string[];
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
  metrics: IMetrics;
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