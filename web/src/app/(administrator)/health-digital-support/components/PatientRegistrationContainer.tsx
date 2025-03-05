import React, { useState } from 'react';
import { PatientForm } from './PatientForm';
import { IBed, IHospital } from '@/types/hospital-network-types';

import { AlertMessage } from '@/components/ui/templates/common/AlertMessage';

interface PatientRegistrationContainerProps {
  hospital: IHospital | null;
  setSystemMessage: (message: { type: 'success' | 'error' | 'warning' | 'info'; text: string; } | null) => void;
}

interface NewPatientData {
  name: string;
  age: number;
  gender: string;
  bloodType: string;
  contactInfo: {
    phone: string;
    emergency: string;
    address: string;
  };
  diagnosis: string;
  expectedDischargeDate: string;
  department: string;
  specialty: string;
}

export const PatientRegistrationContainer: React.FC<PatientRegistrationContainerProps> = ({
  hospital,
  setSystemMessage
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Extrair departamentos e especialidades do hospital
  const departments = hospital?.departments.map(dept => dept.name) || [];
  const specialties = hospital?.specialties || [];
  
  const handleSubmit = async (data: NewPatientData) => {
    if (!hospital) {
      setError('Nenhum hospital selecionado');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Gerar um ID temporário para o novo paciente
      const patientId = `P${Date.now().toString().substring(7)}`;
      
      // Criar objeto com dados do paciente
      const newPatient = {
        id: patientId,
        name: data.name,
        age: data.age,
        gender: data.gender,
        bloodType: data.bloodType,
        contactInfo: data.contactInfo,
        admissionDate: new Date().toISOString(),
        diagnosis: data.diagnosis,
        expectedDischarge: data.expectedDischargeDate,
        photo: "",
        careHistory: {
          admissionId: `ADM-${patientId.substring(1)}`,
          startDate: new Date().toISOString().split('T')[0],
          primaryDiagnosis: data.diagnosis,
          status: 'active',
          totalLOS: 0,
          statusHistory: [
            {
              department: data.department,
              status: 'Aguardando Atendimento',
              timestamp: new Date().toISOString(),
              specialty: data.specialty,
              updatedBy: {
                id: 'SYS001',
                name: 'Sistema',
                role: 'Atendimento Digital'
              }
            }
          ],
          events: [
            {
              id: `EVT-${Date.now().toString().substring(7)}`,
              timestamp: new Date().toISOString(),
              type: 'admission',
              description: `Admissão no departamento ${data.department}`,
              department: data.department,
              responsibleStaff: {
                id: 'SYS001',
                name: 'Sistema',
                role: 'Atendimento Digital'
              },
              details: {
                toDepartment: data.department
              }
            }
          ]
        }
      };
      
      // Encontrar uma cama disponível
      const availableBed = findAvailableBed(hospital, data.department);
      
      if (!availableBed) {
        throw new Error(`Não há leitos disponíveis no departamento ${data.department}. Por favor, selecione outro departamento.`);
      }
      
      // Em produção, iríamos adicionar o paciente à cama com uma chamada de API
      // Aqui simulamos o processo
      console.log(`Registrando paciente ${newPatient.name} no leito ${availableBed.number} do departamento ${data.department}`);
      
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Aqui seria feita a chamada real para a API
      /*
      const response = await axios.post(`/api/hospitals/${hospital.id}/beds/${availableBed.id}/patient`, newPatient);
      if (!response.data.success) {
        throw new Error(response.data.message || 'Falha ao registrar paciente');
      }
      */
      
      const successText = `Paciente ${data.name} registrado com sucesso e atribuído ao leito ${availableBed.number} (${data.department})`;
      
      setSuccessMessage(successText);
      setSystemMessage({
        type: 'success',
        text: successText
      });
      
      // Limpar a mensagem de sucesso após 5 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      
    } catch (err) {
      console.error('Erro ao registrar paciente:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao registrar paciente';
      setError(errorMessage);
      setSystemMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Função para encontrar uma cama disponível no departamento especificado
  const findAvailableBed = (hospital: IHospital, departmentName: string): IBed | null => {
    const department = hospital.departments.find(dept => dept.name === departmentName);
    if (!department) return null;
    
    for (const room of department.rooms) {
      for (const bed of room.beds) {
        if (bed.status === 'available') {
          return bed;
        }
      }
    }
    
    return null;
  };
  
  // Verificar se existem camas disponíveis em cada departamento
  const availabilityByDepartment = React.useMemo(() => {
    if (!hospital) return {};
    
    const availability: Record<string, number> = {};
    
    hospital.departments.forEach(dept => {
      let availableCount = 0;
      
      dept.rooms.forEach(room => {
        room.beds.forEach(bed => {
          if (bed.status === 'available') {
            availableCount++;
          }
        });
      });
      
      availability[dept.name] = availableCount;
    });
    
    return availability;
  }, [hospital]);
  
  if (!hospital) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Por favor, selecione um hospital para registrar pacientes</p>
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
      
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Leitos disponíveis por departamento */}
        {Object.entries(availabilityByDepartment).map(([dept, count]) => (
          <div 
            key={dept}
            className={`p-3 rounded-lg border ${
              count === 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}
          >
            <p className="text-sm font-medium">{dept}</p>
            <div className="flex items-end justify-between">
              <p className={`text-xl font-bold ${count === 0 ? 'text-red-700' : 'text-green-700'}`}>{count}</p>
              <p className="text-xs text-gray-500">leitos disponíveis</p>
            </div>
          </div>
        ))}
      </div>
      
      <PatientForm
        onSubmit={handleSubmit}
        departments={departments}
        specialties={specialties}
        isLoading={loading}
        availabilityByDepartment={availabilityByDepartment}
      />
    </div>
  );
};