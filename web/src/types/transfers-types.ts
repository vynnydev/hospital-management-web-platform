export type TTransferRequestStatus = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected' | 'cancelled';
export type TTransferPriority = 'low' | 'medium' | 'high' | 'critical';

export interface ITransferRequest {
  id: string;
  patientId: string;
  sourceHospitalId: string;
  targetHospitalId?: string;
  requiredSpecialty: string;
  severity: TTransferPriority;
  status: TTransferRequestStatus;
  requestTime: string;
  approvedTime?: string;
  transferStartTime?: string;
  transferCompleteTime?: string;
  rejectedTime?: string;
  cancelledTime?: string;
  ambulanceId?: string;
  requestedBy: string;
  approvedBy?: string;
  rejectedBy?: string;
  cancelledBy?: string;
  notes?: string;
  medicalReason: string;
  patientCondition: string;
}

export interface ICreateTransferRequest {
  patientId: string;
  sourceHospitalId: string;
  targetHospitalId?: string;
  requiredSpecialty: string;
  severity: TTransferPriority;
  medicalReason: string;
  patientCondition: string;
  notes?: string;
}

export interface IUseTransferRequestsReturn {
  transferRequests: ITransferRequest[];
  loading: boolean;
  error: string | null;
  
  // Métodos para gerenciar transferências
  getHospitalTransferRequests: (hospitalId: string) => ITransferRequest[];
  getActiveTransferRequests: (hospitalId?: string) => ITransferRequest[];
  createTransferRequest: (request: ICreateTransferRequest) => Promise<ITransferRequest>;
  approveTransferRequest: (
    requestId: string, 
    targetHospitalId: string, 
    notes?: string
  ) => Promise<ITransferRequest>;
  rejectTransferRequest: (requestId: string, reason: string) => Promise<ITransferRequest>;
  cancelTransferRequest: (requestId: string, reason: string) => Promise<ITransferRequest>;
  startTransfer: (requestId: string, ambulanceId: string) => Promise<ITransferRequest>;
  completeTransfer: (requestId: string, notes?: string) => Promise<ITransferRequest>;
  addTransferNote: (requestId: string, note: string) => Promise<ITransferRequest>;
  getEligibleHospitalsForTransfer: (
    requiredSpecialty: string, 
    severity: TTransferPriority
  ) => Promise<string[]>;
}