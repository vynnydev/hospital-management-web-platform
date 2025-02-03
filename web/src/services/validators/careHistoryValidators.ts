/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/validators/careHistoryValidators.ts
import type { 
  ICareEvent, 
  IPatientCareHistory, 
  TCareEventType, 
  TCareHistoryStatus,
  IStatusHistory,
  IResponsibleStaff 
} from '@/types/hospital-network-types';

const validEventTypes: TCareEventType[] = [
  'admission',
  'transfer', 
  'procedure',
  'medication',
  'exam',
  'discharge'
];

const validStatusTypes: TCareHistoryStatus[] = [
  'active',
  'discharged',
  'transferred'
];

const validDepartmentStatuses = {
  'UTI': [
    'Aguardando Atendimento',
    'Em Procedimento',
    'Em Recuperação',
    'Alta'
  ],
  'Enfermaria': [
    'Aguardando Atendimento',
    'Em Observação',
    'Em Recuperação',
    'Alta'
  ]
};

export const isValidResponsibleStaff = (staff: unknown): staff is IResponsibleStaff => {
  if (!staff || typeof staff !== 'object') return false;
  
  const s = staff as Record<string, unknown>;
  
  return (
    typeof s.id === 'string' &&
    typeof s.name === 'string' &&
    typeof s.role === 'string'
  );
};

export const isValidCareEvent = (event: unknown): event is ICareEvent => {
  if (!event || typeof event !== 'object') return false;
  
  const e = event as Record<string, unknown>;
  
  const hasValidBasicFields = (
    typeof e.id === 'string' &&
    typeof e.timestamp === 'string' &&
    typeof e.type === 'string' &&
    validEventTypes.includes(e.type as TCareEventType) &&
    typeof e.description === 'string' &&
    typeof e.department === 'string' &&
    e.responsibleStaff && typeof e.responsibleStaff === 'object'
  );

  if (!hasValidBasicFields) return false;

  // Validação mais flexível dos details
  if (e.details !== undefined) {
    if (typeof e.details !== 'object' || e.details === null) return false;
  }

  return true;
};

export const isValidStatusHistory = (status: unknown): status is IStatusHistory => {
  if (!status || typeof status !== 'object') return false;
  
  const s = status as Record<string, unknown>;
  
  const hasValidBasicFields = (
    typeof s.department === 'string' &&
    typeof s.status === 'string' &&
    typeof s.timestamp === 'string' &&
    typeof s.specialty === 'string' &&
    s.updatedBy && typeof s.updatedBy === 'object'
  );

  if (!hasValidBasicFields) return false;

  // Removida validação estrita dos status por departamento
  return true;
};

export const isValidCareHistory = (history: unknown): history is IPatientCareHistory => {
  if (!history || typeof history !== 'object') return false;
  
  const h = history as Record<string, unknown>;
  
  const hasValidBasicFields = (
    typeof h.admissionId === 'string' &&
    typeof h.startDate === 'string' &&
    typeof h.primaryDiagnosis === 'string' &&
    typeof h.status === 'string' &&
    Array.isArray(h.events) &&
    Array.isArray(h.statusHistory) &&
    typeof h.totalLOS === 'number'
  );

  if (!hasValidBasicFields) return false;

  // Validação simplificada dos arrays
  if (!Array.isArray(h.events) || !h.events.every(event => event && typeof event === 'object')) return false;
  if (!Array.isArray(h.statusHistory) || !h.statusHistory.every(status => status && typeof status === 'object')) return false;

  return true;
};