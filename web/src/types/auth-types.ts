// types/auth-types.ts
export type TPermission = 
  // Permissões existentes
  | 'VIEW_ALL_HOSPITALS' 
  | 'VIEW_SINGLE_HOSPITAL'
  // Novas permissões para médicos
  | 'DOCTOR_ACCESS'
  | 'PRESCRIBE_MEDICATION'
  | 'VIEW_PATIENT_RECORDS'
  | 'USE_AI_DIAGNOSIS'
  | 'APPROVE_AI_PRESCRIPTIONS'
  // Novas permissões para pacientes
  | 'PATIENT_ACCESS'
  | 'SCHEDULE_APPOINTMENTS'
  | 'VIEW_OWN_RECORDS'
  | 'REQUEST_TELEMEDICINE';

export type TRole = 
  // Funções existentes
  | 'administrador' 
  | 'enfermeiro' 
  | 'atendente' 
  | 'system'
  | 'ai'
  // Novas funções
  | 'médico'
  | 'paciente';

export interface IAppUser {
  id: string;
  name: string;
  email?: string;
  password?: string;
  role: TRole;
  profileImage?: string;
  permissions: TPermission[];
  hospitalId?: string;
  // Novas propriedades
  specialization?: string;     // Para médicos (ex: cardiologia, dermatologia)
  medicalLicense?: string;     // Para médicos (CRM)
  patientId?: string;          // Para pacientes
  healthInsurance?: string;    // Para pacientes
  dateOfBirth?: string;        // Para pacientes
}

export interface IAuthResponse {
  user: IAppUser | null;
  token: string;
  isLoading: boolean;
  error: string | null;
}

export interface IPermissionCheck {
  hasPermission: boolean;
  requiredHospitalId?: string;
}

export interface ILoginCredentials {
  email: string;
  password: string;
}

export interface ICreateUserData {
  name: string;
  email: string;
  password: string;
  role?: TRole;
  permissions?: TPermission[];
  hospitalId?: string;
  specialization?: string;
  medicalLicense?: string;
  patientId?: string;
  healthInsurance?: string;
  dateOfBirth?: string;
}

// Novos tipos para telemedicina
export interface IMedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  diagnosis: string;
  aiSuggestions?: {
    diagnosisProbability: number;
    suggestedDiagnosis: string;
    confidence: number;
  };
  notes: string;
  prescriptions?: IPrescription[];
  attachments?: IAttachment[];
}

export interface IPrescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    aiRecommended: boolean;
    aiConfidence?: number;
  }[];
  instructions: string;
  aiGenerated: boolean;
  doctorApproved: boolean;
}

export interface IAttachment {
  id: string;
  type: 'IMAGE' | 'DOCUMENT' | 'VIDEO' | 'OTHER';
  url: string;
  description: string;
  uploadDate: string;
  aiAnalysisResult?: {
    detectedCondition?: string;
    confidence: number;
    recommendations?: string;
  };
}

export interface ITelemedicineConsultation {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledDate: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  meetingUrl?: string;
  preConsultationNotes?: string;
  aiPreDiagnosis?: {
    suggestedConditions: string[];
    confidence: number[];
    recommendedTests?: string[];
  };
}