import { useMemo } from 'react';
import { parseISO, format } from 'date-fns';
import { IPatient } from '@/types/hospital-network-types';
import { IPatientCalendarEvent } from '@/types/patient-calendar';

export const usePatientEvents = (selectedPatient: IPatient | null): IPatientCalendarEvent[] => {
  return useMemo(() => {
    if (!selectedPatient) return [];
    
    const events: IPatientCalendarEvent[] = [];
    
    // Adiciona evento de admissão
    if (selectedPatient.admissionDate) {
      events.push({
        id: 'admission',
        title: 'Admissão Hospitalar',
        date: parseISO(selectedPatient.admissionDate),
        type: 'admission',
        time: format(parseISO(selectedPatient.admissionDate), 'HH:mm'),
        participants: [selectedPatient.name],
        description: `Admissão do paciente ${selectedPatient.name} para ${selectedPatient.diagnosis}`,
        status: 'done'
      });
    }

    // Adiciona evento de alta prevista
    if (selectedPatient.expectedDischarge) {
      events.push({
        id: 'discharge',
        title: 'Alta Prevista',
        date: parseISO(selectedPatient.expectedDischarge),
        type: 'discharge',
        time: format(parseISO(selectedPatient.expectedDischarge), 'HH:mm'),
        participants: [selectedPatient.name],
        description: 'Alta hospitalar prevista',
        status: 'pending'
      });
    }

    // Adiciona eventos do histórico de cuidados
    selectedPatient.careHistory?.events?.forEach(event => {
      events.push({
        id: event.id,
        title: event.description,
        date: parseISO(event.timestamp),
        type: event.type,
        time: format(parseISO(event.timestamp), 'HH:mm'),
        participants: [selectedPatient.name, event.responsibleStaff.name],
        description: event.description,
        status: event.type === 'procedure' ? 'pending' : 'done'
      });
    });

    return events;
  }, [selectedPatient]);
};