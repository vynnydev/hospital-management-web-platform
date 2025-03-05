/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { CareEventForm } from './CareEventForm';

import { PatientSelector } from './PatientSelector';
import { PatientStatusUpdate } from './PatientStatusUpdate';
import { PatientCareHistory } from './PatientCareHistory';

import { AlertMessage } from '@/components/ui/templates/common/AlertMessage';
import { TabContainer } from '@/components/ui/templates/common/Tabs';

import { ICareEvent, IHospital, IPatient, IResponsibleStaff } from '@/types/hospital-network-types';
import { useDigitalCareAppContext } from '@/services/contexts/DigitalCareAppContexts';

interface CareEventsContainerProps {
  hospital: IHospital | null;
  patients: IPatient[];
  setSystemMessage: (message: { type: 'success' | 'error' | 'warning' | 'info'; text: string; } | null) => void;
}

interface CareEventData {
  patientId: string;
  type: string;
  description: string;
  department: string;
  staffId: string;
  details: Record<string, string>;
}

export const CareEventsContainer: React.FC<CareEventsContainerProps> = ({
  hospital,
  patients,
  setSystemMessage
}) => {
  const { getPatientCareHistory } = useDigitalCareAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  
  // Extrair departamentos e equipe médica do hospital
  const departments = hospital?.departments.map(dept => dept.name) || [];
  
  // Criar lista de profissionais responsáveis
  const staffList = React.useMemo(() => {
    const list: IResponsibleStaff[] = [];
    
    // Adicionar médicos
    hospital?.staff?.doctors.forEach(doctor => {
      list.push({
        id: doctor.id,
        name: doctor.name,
        role: doctor.specialty
      });
    });
    
    // Adicionar enfermeiros
    hospital?.staff?.nurses.forEach(nurse => {
      list.push({
        id: nurse.id,
        name: nurse.name,
        role: 'Enfermeiro'
      });
    });
    
    return list;
  }, [hospital]);
  
  const handlePatientSelect = (patient: IPatient) => {
    setSelectedPatient(patient);
  };
  
  const handleEventSubmit = async (data: CareEventData) => {
    if (!hospital || !selectedPatient) {
      setError('Paciente não selecionado');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Gerar ID para o novo evento
      const eventId = `EVT-${Date.now().toString().substring(7)}`;
      
      // Encontrar o membro da equipe selecionado
      const staff = staffList.find(s => s.id === data.staffId);
      
      if (!staff) {
        throw new Error('Profissional não encontrado');
      }
      
      // Criar objeto com dados do evento
      const newEvent: ICareEvent = {
        id: eventId,
        timestamp: new Date().toISOString(),
        type: data.type as any,
        description: data.description,
        department: data.department,
        responsibleStaff: staff,
        details: data.details as any
      };
      
      // Em um cenário real, enviaríamos para a API
      // Aqui estamos simulando
      console.log('Registrando evento:', newEvent);
      
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage(`Evento de atendimento registrado com sucesso!`);
      setSystemMessage({
        type: 'success',
        text: `Evento de atendimento registrado com sucesso!`
      });
      
      // Limpar mensagem depois de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err) {
      console.error('Erro ao registrar evento:', err);
      setError(err instanceof Error ? err.message : 'Erro ao registrar evento');
      setSystemMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao registrar evento'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Se não houver hospital selecionado
  if (!hospital) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Por favor, selecione um hospital para gerenciar eventos de atendimento</p>
      </div>
    );
  }
  
  // Se não houver pacientes
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Não há pacientes registrados para gerenciar eventos de atendimento</p>
      </div>
    );
  }
  
  // Tabs para diferentes funcionalidades
  const tabs = [
    {
      id: 'register-event',
      label: 'Registrar Evento',
      content: (
        <CareEventForm
          patient={selectedPatient}
          departments={departments}
          staffList={staffList}
          onSubmit={handleEventSubmit}
          isLoading={loading}
        />
      )
    },
    {
      id: 'update-status',
      label: 'Atualizar Status',
      content: (
        <PatientStatusUpdate
          patient={selectedPatient}
          departments={departments}
          staffList={staffList}
          hospital={hospital}
          setSystemMessage={setSystemMessage}
        />
      )
    },
    {
      id: 'care-history',
      label: 'Histórico de Atendimento',
      content: (
        <PatientCareHistory 
          patient={selectedPatient}
          getPatientCareHistory={getPatientCareHistory}
        />
      )
    }
  ];
  
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      {successMessage && (
        <AlertMessage type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
      
      {error && (
        <AlertMessage type="error" message={error} onClose={() => setError(null)} />
      )}
      
      <div className="mb-6">
        <PatientSelector 
          patients={patients} 
          onSelect={handlePatientSelect}
          selectedPatientId={selectedPatient?.id}
        />
      </div>
      
      {selectedPatient ? (
        <TabContainer tabs={tabs} defaultTab="register-event" />
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Selecione um paciente para gerenciar eventos de atendimento</p>
        </div>
      )}
    </div>
  );
};