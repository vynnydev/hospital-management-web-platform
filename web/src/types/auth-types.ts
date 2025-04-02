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
  | 'REQUEST_TELEMEDICINE'
  // Novas permissões para enfermeiros
  | 'NURSE_ACCESS'
  | 'ADMINISTER_MEDICATION'
  | 'RECORD_VITALS'
  | 'MANAGE_BEDS'
  | 'VIEW_PATIENT_RECORDS_NURSE'
  | 'ASSIGN_TASKS'
  // Permissões para atendentes
  | 'ATTENDANT_ACCESS'
  | 'SCHEDULE_MANAGEMENT'
  | 'PATIENT_REGISTRATION'
  | 'VIEW_BASIC_PATIENT_INFO'
  | 'MANAGE_APPOINTMENTS'
  | 'VIEW_DOCTOR_SCHEDULE'
  | 'GENERATE_REPORTS'
  // Permissões para financiamento
  | 'MANAGE_FINANCIAL_SETTINGS'
  | 'MANAGE_NETWORK_SETTINGS'

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
  // Propriedades para médicos
  specialization?: string;     // Especialização médica
  medicalLicense?: string;     // CRM
  // Propriedades para pacientes
  patientId?: string;          
  healthInsurance?: string;    
  dateOfBirth?: string;        
  // Propriedades para enfermeiros
  nursingLicense?: string;     // COREN
  department?: string;         // Departamento/setor
  shift?: 'manhã' | 'tarde' | 'noite';  // Turno
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
  // Campos específicos por função
  specialization?: string;     // Para médicos
  medicalLicense?: string;     // Para médicos
  nursingLicense?: string;     // Para enfermeiros
  department?: string;         // Para enfermeiros
  shift?: 'manhã' | 'tarde' | 'noite';  // Para enfermeiros
  patientId?: string;          // Para pacientes
  healthInsurance?: string;    // Para pacientes
  dateOfBirth?: string;        // Para pacientes
}

// Tipos específicos para enfermagem
export interface INursingTask {
  id: string;
  patientId: string;
  nurseId: string;
  description: string;
  priority: 'baixa' | 'média' | 'alta' | 'urgente';
  status: 'pendente' | 'em andamento' | 'concluída' | 'cancelada';
  createdAt: string;
  dueDate: string;
  completedAt?: string;
  notes?: string;
}

export interface IVitalSign {
  id: string;
  patientId: string;
  nurseId: string;
  timestamp: string;
  temperature?: number;        // em °C
  heartRate?: number;          // em BPM
  bloodPressureSystolic?: number;  // em mmHg
  bloodPressureDiastolic?: number; // em mmHg
  respiratoryRate?: number;    // em ciclos por minuto
  oxygenSaturation?: number;   // em %
  painLevel?: number;          // escala de 0 a 10
  notes?: string;
}

export interface IMedicationAdministration {
  id: string;
  prescriptionId: string;
  medicationId: string;
  patientId: string;
  nurseId: string;
  administeredAt: string;
  scheduledTime: string;
  status: 'pendente' | 'administrado' | 'adiado' | 'recusado';
  dose: string;
  route: string;
  notes?: string;
}

export interface IBedAssignment {
  id: string;
  bedId: string;
  patientId: string;
  assignedAt: string;
  assignedByNurseId: string;
  dischargedAt?: string;
  transferredToId?: string;
  status: 'ocupado' | 'reservado' | 'liberado' | 'em manutenção';
  notes?: string;
}