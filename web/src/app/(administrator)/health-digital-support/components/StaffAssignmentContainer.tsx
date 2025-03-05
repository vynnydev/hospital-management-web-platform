import React, { useState } from 'react';

import { StaffAssignmentForm } from './StaffAssignmentForm';
import { PatientSelector } from './PatientSelector';

import { IHospital, IPatient } from '@/types/hospital-network-types';
import { AlertMessage } from '@/components/ui/templates/common/AlertMessage';

interface StaffAssignmentContainerProps {
  hospital: IHospital | null;
  patients: IPatient[];
  setSystemMessage: (message: { type: 'success' | 'error' | 'warning' | 'info'; text: string; } | null) => void;
}

interface AssignStaffData {
  patientId: string;
  doctorId: string;
  nurseId: string;
  department: string;
}

export const StaffAssignmentContainer: React.FC<StaffAssignmentContainerProps> = ({
  hospital,
  patients,
  setSystemMessage
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);
  
  // Extrair médicos, enfermeiros e departamentos do hospital
  const doctors = hospital?.staff?.doctors || [];
  const nurses = hospital?.staff?.nurses || [];
  const departments = hospital?.departments.map(dept => dept.name) || [];
  
  const handlePatientSelect = (patient: IPatient) => {
    setSelectedPatient(patient);
  };
  
  const handleAssignStaff = async (data: AssignStaffData) => {
    if (!hospital) {
      setError('Nenhum hospital selecionado');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Em um cenário real, enviaríamos para a API
      // Aqui estamos simulando
      console.log('Atribuindo equipe:', data);
      
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Buscar nomes dos profissionais para a mensagem de sucesso
      const doctor = doctors.find(d => d.id === data.doctorId);
      const nurse = nurses.find(n => n.id === data.nurseId);
      
      if (!doctor || !nurse) {
        throw new Error('Profissional não encontrado');
      }
      
      const successText = `Equipe atribuída com sucesso: Dr(a). ${doctor.name} e Enf. ${nurse.name}`;
      
      setSuccessMessage(successText);
      setSystemMessage({
        type: 'success',
        text: successText
      });
      
      // Limpar mensagem depois de 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err) {
      console.error('Erro ao atribuir equipe:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atribuir equipe');
      setSystemMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Erro ao atribuir equipe'
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (!hospital) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Por favor, selecione um hospital para atribuir equipes</p>
      </div>
    );
  }
  
  if (patients.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Não há pacientes registrados para atribuir equipes</p>
      </div>
    );
  }
  
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
        />
      </div>
      
      {selectedPatient ? (
        <StaffAssignmentForm
          patient={selectedPatient}
          doctors={doctors}
          nurses={nurses}
          departments={departments}
          onSubmit={handleAssignStaff}
          isLoading={loading}
        />
      ) : (
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">Selecione um paciente para atribuir uma equipe</p>
        </div>
      )}
    </div>
  );
};