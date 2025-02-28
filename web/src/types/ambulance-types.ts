export type TAmbulanceStatus = 'available' | 'dispatched' | 'returning' | 'maintenance';
export type TAmbulanceType = 'basic' | 'advanced' | 'intensive' | 'neonatal';
export type TEmergengyLevel = 'low' | 'medium' | 'high' | 'critical';
export type TRouteStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled';

export interface IAmbulanceCoordinates {
  lat: number;
  lng: number;
}

export interface IAmbulanceCrew {
  driverId: string;
  paramedicId: string;
  nurseId?: string;
  doctorId?: string;
}

export interface IAmbulanceRoute {
  id: string;
  ambulanceId: string;
  origin: {
    name: string;
    address: string;
    coordinates: IAmbulanceCoordinates;
    hospitalId?: string;
  };
  destination: {
    name: string;
    address: string;
    coordinates: IAmbulanceCoordinates;
    hospitalId?: string;
  };
  patient?: {
    id: string;
    name: string;
    age: number;
    condition: string;
    emergencyLevel: TEmergengyLevel;
  };
  status: TRouteStatus;
  dispatchTime: string;
  estimatedArrivalTime: string;
  actualArrivalTime?: string;
  distance: number; // em km
  duration: number; // em minutos
  routeGeometry?: GeoJSON.LineString; // Dados GeoJSON para a rota
  notes?: string;
  callOperatorId: string;
}

export interface IAmbulance {
  id: string;
  vehicleId: string;
  plateNumber: string;
  type: TAmbulanceType;
  status: TAmbulanceStatus;
  capacity: number;
  equipment: string[];
  currentLocation: IAmbulanceCoordinates;
  hospitalId: string; // Hospital base
  crew?: IAmbulanceCrew;
  lastMaintenance: string;
  nextMaintenanceDue: string;
  currentRoute?: string; // ID da rota atual, se em serviço
}

export interface IAmbulanceRequest {
  id: string;
  timestamp: string;
  callerName: string;
  callerPhone: string;
  location: {
    address: string;
    coordinates?: IAmbulanceCoordinates;
  };
  patientInfo: {
    name?: string;
    age?: number;
    gender?: string;
    symptoms: string[];
    condition: string;
    emergencyLevel: TEmergengyLevel;
  };
  assignedAmbulanceId?: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  hospitalId?: string; // Hospital destinado
  notes?: string;
  routeId?: string;
}

export interface IAmbulanceStats {
  totalDispatches: number;
  averageResponseTime: number; // em minutos
  hospitalId: string;
  byEmergencyLevel: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  byTime: {
    morning: number;
    afternoon: number;
    night: number;
  };
}

export interface IAmbulanceCardData {
    total: number;
    available: number;
    activeRoutes: number;
    pendingRequests: number;
}

export interface IAmbulanceData {
  ambulances: {
    [hospitalId: string]: IAmbulance[];
  };
  routes: {
    [hospitalId: string]: IAmbulanceRoute[];
  };
  requests: {
    [hospitalId: string]: IAmbulanceRequest[];
  };
  stats: {
    [hospitalId: string]: IAmbulanceStats;
  };
}