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
    typeof e.department === 'string'
  );

  if (!hasValidBasicFields) return false;

  // Validação do responsibleStaff
  if (!isValidResponsibleStaff(e.responsibleStaff)) return false;

  // Validação opcional dos details
  if (e.details !== undefined) {
    if (typeof e.details !== 'object' || e.details === null) return false;
    
    const details = e.details as Record<string, unknown>;
    return Object.entries(details).every(([key, value]) => 
      typeof key === 'string' && (value === undefined || typeof value === 'string')
    );
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
    typeof s.specialty === 'string'
  );

  if (!hasValidBasicFields) return false;

  // Validar se o status é válido para o departamento
  const department = s.department as keyof typeof validDepartmentStatuses;
  if (!validDepartmentStatuses[department]?.includes(s.status as string)) {
    return false;
  }

  // Validar updatedBy
  if (!isValidResponsibleStaff(s.updatedBy)) return false;

  return true;
};

export const isValidCareHistory = (history: unknown): history is IPatientCareHistory => {
  if (!history || typeof history !== 'object') return false;
  
  const h = history as Record<string, unknown>;
  
  // Validação básica dos campos obrigatórios
  const hasValidBasicFields = (
    typeof h.admissionId === 'string' &&
    typeof h.startDate === 'string' &&
    typeof h.primaryDiagnosis === 'string' &&
    typeof h.status === 'string' &&
    validStatusTypes.includes(h.status as TCareHistoryStatus) &&
    typeof h.totalLOS === 'number'
  );

  if (!hasValidBasicFields) return false;

  // Validação específica do array de eventos
  if (!Array.isArray(h.events)) return false;
  
  // Agora TypeScript sabe que h.events é um array
  if (!h.events.every((event): event is ICareEvent => isValidCareEvent(event))) {
    return false;
  }

  // Validação do statusHistory
  if (!Array.isArray(h.statusHistory)) return false;
  
  // Validação explícita do array de statusHistory
  if (!h.statusHistory.every((status): status is IStatusHistory => isValidStatusHistory(status))) {
    return false;
  }

  // Validação do endDate opcional
  if (h.endDate !== undefined && typeof h.endDate !== 'string') {
    return false;
  }

  return true;
};

// Função auxiliar para validar a ordem cronológica do statusHistory
export const isChronologicalStatusHistory = (statusHistory: IStatusHistory[]): boolean => {
  for (let i = 1; i < statusHistory.length; i++) {
    const previousTimestamp = new Date(statusHistory[i - 1].timestamp).getTime();
    const currentTimestamp = new Date(statusHistory[i].timestamp).getTime();
    
    if (currentTimestamp < previousTimestamp) {
      return false;
    }
  }
  return true;
};

// Função para validar a consistência entre events e statusHistory
export const isConsistentCareHistory = (history: IPatientCareHistory): boolean => {
  // Verificar se todos os eventos têm correspondência no statusHistory
  return history.events.every(event => {
    return history.statusHistory.some(status => 
      status.timestamp === event.timestamp &&
      status.department === event.department
    );
  });
};