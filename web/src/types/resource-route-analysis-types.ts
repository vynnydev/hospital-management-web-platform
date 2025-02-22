import { IHospitalResources } from "./resources-types";


// Tipos de equipamentos
export type TEquipmentType = 'respirators' | 'monitors' | 'defibrillators' | 'imagingDevices';
export type TSupplyType = 'medications' | 'bloodBank' | 'ppe';
export type TSeverity = 'critical' | 'warning';
export type TTrafficLevel = 'high' | 'medium' | 'low';
export type TPriority = 'high' | 'medium' | 'low';
export type TAvailability = 'immediate' | '24h' | '48h' | '72h';

export interface IResourceRouteRecommendation {
    sourceHospitalId: string;
    targetHospitalId: string;
    resourceType: TEquipmentType;
    quantity: number;
    priority: TPriority;
    distance: number;
    estimatedTime: number;
    routeDetails: IRouteDetails;
}

export interface IRouteDetails {
    coordinates: [number, number][];
    trafficLevel: TTrafficLevel;
    alternativeRoutes: {
      hospitalId: string;
      distance: number;
      estimatedTime: number;
      coordinates: [number, number][];
    }[];
}

export interface ISupplierRecommendation {
    id: string;
    name: string;
    coordinates: [number, number];
    resourceType: TEquipmentType;
    estimatedPrice: number;
    availability: TAvailability;
    distance?: number;
}

export interface ICriticalShortage {
    hospitalId: string;
    type: TEquipmentType | TSupplyType;
    category: 'equipment' | 'supplies';
    severity: TSeverity;
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

// Interface para rotas alternativas
export interface IAlternativeRoute {
    hospitalId: string;
    distance: number;
    estimatedTime: number;
    coordinates: [number, number][];
}

export interface IMinimumLevels {
    equipment: Record<TEquipmentType, number>;
    supplies: Record<TSupplyType, number>;
}

export interface IResourceRouteAnalysis {
  transferRecommendations: IResourceRouteRecommendation[];
  supplierRecommendations: ISupplierRecommendation[];
  criticalShortages: ICriticalShortage[];
  getPriorityLevel: (hospitalId: string) => 'critical' | 'warning' | 'normal';
  getRecommendedTransfers: (hospitalId: string) => IResourceRouteRecommendation[];
  getHospitalShortages: (hospitalId: string) => ICriticalShortage[];
  getHospitalResources: (hospitalId: string) => IHospitalResources | null;
  getSupplierRecommendations: (hospitalId: string) => ISupplierRecommendation[];
}