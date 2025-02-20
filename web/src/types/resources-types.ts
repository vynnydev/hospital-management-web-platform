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