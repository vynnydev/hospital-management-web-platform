import { IHospitalResources } from "./resources-types";

export interface IResourceRouteRecommendation {
  sourceHospitalId: string;
  targetHospitalId: string;
  resourceRouteType: TEquipmentType; 
  quantity: number;
  priority: 'high' | 'medium' | 'low';
  distance: number;
  estimatedTime: number;
}

export interface ISupplierRecommendation {
    id: string;
    name: string;
    coordinates: [number, number];
    availability: 'immediate' | '24h' | '48h' | '72h';
    resourceType: TEquipmentType;
    estimatedPrice: number;
    distance: number;
}

export interface IResourceRouteAnalysisState {
    transferRecommendations: IResourceRouteRecommendation[];
    supplierRecommendations: ISupplierRecommendation[];
    criticalShortages: ICriticalShortage[];
}

export interface IResourceRouteAnalysis {
    transferRecommendations: IResourceRouteRecommendation[];
    supplierRecommendations: ISupplierRecommendation[];
    criticalShortages: ICriticalShortage[];
    getPriorityLevel: (hospitalId: string) => 'critical' | 'warning' | 'normal';
    getRecommendedTransfers: (hospitalId: string) => IResourceRouteRecommendation[];
    getHospitalShortages: (hospitalId: string) => ICriticalShortage[];
    getSupplierRecommendations: (hospitalId: string) => ISupplierRecommendation[];
    getHospitalResources: (hospitalId: string) => IHospitalResources | null;
}

// Tipos de equipamentos
export type TEquipmentType = 'respirators' | 'monitors' | 'defibrillators' | 'imagingDevices';
export type TSupplyType = 'medications' | 'bloodBank' | 'ppe';

// Atualização da interface IResourceRouteRecommendation incluindo routeDetails
export interface IResourceRouteRecommendation {
    sourceHospitalId: string;
    targetHospitalId: string;
    resourceRouteType: TEquipmentType;
    quantity: number;
    priority: 'high' | 'medium' | 'low';
    distance: number;
    estimatedTime: number;
    routeDetails: IRouteDetails;
}

export interface ICriticalShortage {
    hospitalId: string;
    resourceRouteType: TEquipmentType;  // Garantir que é TEquipmentType
    severity: 'critical' | 'warning';
}

// Interface para rotas alternativas
export interface IAlternativeRoute {
    hospitalId: string;
    distance: number;
    estimatedTime: number;
    coordinates: [number, number][];
}
  
// Interface para detalhes da rota
export interface IRouteDetails {
    coordinates: [number, number][];
    trafficLevel: 'high' | 'medium' | 'low';
    alternativeRoutes: {
      hospitalId: string;
      distance: number;
      estimatedTime: number;
      coordinates: [number, number][];
    }[];
}

export interface IMinimumLevels {
    equipment: Record<TEquipmentType, number>;
    supplies: Record<TSupplyType, number>;
}