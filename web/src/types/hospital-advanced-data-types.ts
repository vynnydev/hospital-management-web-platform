export interface IEquipmentStatus {
    total: number;
    available: number;
    maintenance: number;
}
  
export interface IBedStatus {
    total: number;
    available: number;
}
  
export interface ISupplyStatus {
    criticalLow: number;
    lowStock: number;
    normal: number;
}
  
export interface ITransferRequest {
    patientId: string;
    severity: string;
    requiredSpecialty: string;
    requestTime: string;
}
  
export interface IHospitalResources {
    equipmentStatus: {
      respirators: IEquipmentStatus;
      monitors: IEquipmentStatus;
      defibrillators: IEquipmentStatus;
      imagingDevices: IEquipmentStatus;
    };
    bedStatus: {
      icu: IBedStatus;
      emergency: IBedStatus;
      general: IBedStatus;
      surgery: IBedStatus;
      pediatric: IBedStatus;
    };
    suppliesStatus: {
      medications: ISupplyStatus;
      bloodBank: ISupplyStatus;
      ppe: ISupplyStatus;
    };
    transferRequests: ITransferRequest[];
}
  
export interface IResourcesData {
    resources: {
      [hospitalId: string]: IHospitalResources;
    };
}
  
export interface IEmergencyAlert {
    id: string;
    type: string;
    severity: string;
    location: {
      lat: number;
      lng: number;
      address: string;
    };
    estimatedVictims: number;
    timestamp: string;
    status: string;
    respondingUnits: string[];
}
  
export interface IResourceDeployment {
    availableAmbulances: number;
    availableHelicopters: number;
    responderTeams: number;
    estimatedResponseTimes: {
      [hospitalId: string]: number;
    };
}
  
export interface IEmergencyData {
    alerts: IEmergencyAlert[];
    resourceDeployment: IResourceDeployment;
}
  
export interface IResourceNeed {
    current: number;
    predicted: number;
    trend: 'increasing' | 'decreasing' | 'stable';
}
  
export interface ISeasonalFactor {
    factor: string;
    impact: 'high' | 'medium' | 'low';
    probability: number;
}
  
export interface IResourceReallocation {
    from: string;
    to: string;
    specialty?: string;
    equipment?: string;
    count: number;
}
  
export interface IBottleneck {
    hospital: string;
    department: string;
    issue: string;
    severity: string;
}
  
export interface IHospitalPrediction {
    expectedPatientInflow: {
      next24h: number;
      next48h: number;
      next7d: number;
    };
    resourceNeeds: {
      icu: IResourceNeed;
      emergency: IResourceNeed;
      general: IResourceNeed;
    };
    seasonalFactors: ISeasonalFactor[];
}
  
export interface IPredictiveData {
    predictions: {
      [hospitalId: string]: IHospitalPrediction;
    };
    networkAnalysis: {
      optimalResourceDistribution: {
        staffReallocation: IResourceReallocation[];
        equipmentReallocation: IResourceReallocation[];
      };
      bottlenecks: IBottleneck[];
    };
}