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
    supplierId: string;
    name: string;
    resourceType: TEquipmentType;
    distance: number;
    estimatedPrice: number;
    availability: 'immediate' | '24h' | '48h' | '72h';
}

export interface IResourceRouteAnalysis {
    transferRecommendations: IResourceRouteRecommendation[];
    supplierRecommendations: ISupplierRecommendation[];
    criticalShortages: ICriticalShortage[];
}

// Tipos de equipamentos
export type TEquipmentType = 'respirators' | 'monitors' | 'defibrillators' | 'imagingDevices';

export interface IResourceRouteRecommendation {
    sourceHospitalId: string;
    targetHospitalId: string;
    resourceRouteType: TEquipmentType;  // Garantir que é TEquipmentType
    quantity: number;
    priority: 'high' | 'medium' | 'low';
    distance: number;
    estimatedTime: number;
}

export interface ICriticalShortage {
    hospitalId: string;
    resourceRouteType: TEquipmentType;  // Garantir que é TEquipmentType
    severity: 'critical' | 'warning';
}