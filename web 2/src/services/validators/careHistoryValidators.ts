// src/lib/validators/careHistoryValidators.ts
import type { 
    ICareEvent, 
    IPatientCareHistory, 
    TCareEventType, 
    TCareHistoryStatus 
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
  
  export const isValidCareEvent = (event: unknown): event is ICareEvent => {
    if (!event || typeof event !== 'object') return false;
    
    const e = event as Record<string, unknown>;
    
    return (
      typeof e.id === 'string' &&
      typeof e.timestamp === 'string' &&
      typeof e.type === 'string' &&
      validEventTypes.includes(e.type as TCareEventType) &&
      typeof e.description === 'string' &&
      typeof e.department === 'string' &&
      typeof e.responsibleStaff === 'object' &&
      e.responsibleStaff !== null &&
      typeof (e.responsibleStaff as Record<string, unknown>).id === 'string' &&
      typeof (e.responsibleStaff as Record<string, unknown>).name === 'string' &&
      typeof (e.responsibleStaff as Record<string, unknown>).role === 'string'
    );
  };
  
  export const isValidCareHistory = (history: unknown): history is IPatientCareHistory => {
    if (!history || typeof history !== 'object') return false;
    
    const h = history as Record<string, unknown>;
    
    return (
      typeof h.admissionId === 'string' &&
      typeof h.startDate === 'string' &&
      typeof h.primaryDiagnosis === 'string' &&
      Array.isArray(h.events) &&
      h.events.every(isValidCareEvent) &&
      typeof h.status === 'string' &&
      validStatusTypes.includes(h.status as TCareHistoryStatus) &&
      typeof h.totalLOS === 'number'
    );
  };