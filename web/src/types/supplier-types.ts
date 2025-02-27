// types/supplier-types.ts
export type TSupplierRating = 1 | 2 | 3 | 4 | 5;
export type TSupplierStatus = 'active' | 'inactive' | 'pending';
export type TResourceCategory = 'equipment' | 'supplies' | 'medication';

export interface ISupplier {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  categories: TResourceCategory[];
  resourceTypes: string[];
  rating: TSupplierRating;
  deliveryTimeHours: number;
  status: TSupplierStatus;
  lastSupply?: string;
  preferredVendor: boolean;
  distance?: number; // Distância em km (calculada dinamicamente)
}

export interface ISupplierRecommendation {
  supplier: ISupplier;
  resourceType: string;
  category: TResourceCategory;
  inStock: boolean;
  estimatedDelivery: number; // Tempo em horas
  price: number;
  priorityScore: number; // Pontuação interna para ordenação
}

export interface IHospitalResourceNeeds {
  hospitalId: string;
  hospitalName: string;
  criticalResources: {
    resourceType: string;
    category: TResourceCategory;
    quantityNeeded: number;
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  }[];
}

export interface ISupplierCoordinates {
    lat: number;
    lng: number;
}
  
export interface ISupplierContactInfo {
    phone: string;
    email: string;
    website?: string;
}