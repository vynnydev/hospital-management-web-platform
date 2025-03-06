import { useState, useEffect } from 'react';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { usePatientManagement } from '@/services/hooks/digital-care-service/usePatientManagement';
import { usePatientAssignment } from '@/services/hooks/digital-care-service/usePatientAssignment';
import { IPatientRegistration, IPatientAdmission, IPatientAssignment, TPatientPriority } from '@/types/patient-types';
import DepartmentSelector from './DepartmentSelector';
import DoctorSelector from './DoctorSelector';
import NurseSelector from './NurseSelector';
import BedAssignment from './BedAssignment';
import { toast } from '@/components/ui/molecules/Toast';

interface PatientAssignmentFormProps {
  patientId?: string;
  admissionId?: string;
  onSuccess?: () => void;
}

export default function PatientAssignmentForm({ 
  patientId, 
  admissionId, 
  onSuccess 
}: PatientAssignmentFormProps) {
  const { networkData, loading: networkLoading } = useNetworkData();
  const { getPatientById, getPatientAdmissions } = usePatientManagement();
  const { createAssignment, isLoading } = usePatientAssignment();
  
  const [patient, setPatient] = useState<IPatientRegistration | undefined>(undefined);
  const [admission, setAdmission] = useState<IPatientAdmission | undefined>(undefined);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [selectedDoctorName, setSelectedDoctorName] = useState<string>('');
  const [selectedNurseId, setSelectedNurseId] = useState<string>('');
  const [selectedNurseName, setSelectedNurseName] = useState<string>('');
  const [selectedBedId, setSelectedBedId] = useState<string>('');
  const [priority, setPriority] = useState<TPatientPriority>('Média');
  const [notes, setNotes] = useState<string>('');
  
  useEffect(() => {
    if (patientId) {
      const foundPatient = getPatientById(patientId);
      setPatient(foundPatient);
      
      if (foundPatient) {
        const admissions = getPatientAdmissions(patientId);
        
        if (admissionId) {
          const foundAdmission = admissions.find(a => a.id === admissionId);
          setAdmission(foundAdmission);
        } else if (admissions.length > 0) {
          // Se não for especificado um ID de admissão, usar a mais recente
          const sortedAdmissions = [...admissions].sort(
            (a, b) => new Date(b.admissionDate).getTime() - new Date(a.admissionDate).getTime()
          );
          setAdmission(sortedAdmissions[0]);
        }
      }
    }
  }, [patientId, admissionId, getPatientById, getPatientAdmissions]);
  
  const handleDepartmentChange = (departmentId: string) => {
    setSelectedDepartmentId(departmentId);
    // Resetar seleção de médico, enfermeiro e leito quando o departamento muda
    setSelectedDoctorId('');
    setSelectedDoctorName('');
    setSelectedNurseId('');
    setSelectedNurseName('');
    setSelectedBedId('');
  };
  
  const handleDoctorChange = (doctorId: string, doctorName: string) => {
    setSelectedDoctorId(doctorId);
    setSelectedDoctorName(doctorName);
  };
  
  const handleNurseChange = (nurseId: string, nurseName: string) => {
    setSelectedNurseId(nurseId);
    setSelectedNurseName(nurseName);
  };
  
  const handleBedChange = (bedId: string) => {
    setSelectedBedId(bedId);
  };
  
  const handleSubmit = async () => {
    if (!patient || !admission) {
      toast.error('Paciente ou admissão não encontrados');
      return;
    }
    
    if (!selectedDepartmentId) {
      toast.error('Por favor, selecione um departamento');
      return;
    }
    
    if (!selectedDoctorId) {
      toast.error('Por favor, selecione um médico responsável');
      return;
    }

    
    try {
      const assignment: Omit<IPatientAssignment, 'id' | 'assignmentDate'> = {
        admissionId: admission.id,
        patientId: patient.id ? patient.id : '',
        departmentId: selectedDepartmentId,
        bedId: selectedBedId || undefined,
        assignedDoctor: {
          id: selectedDoctorId,
          name: selectedDoctorName,
        },
        assignedNurse: selectedNurseId ? {
          id: selectedNurseId,
          name: selectedNurseName,
        } : undefined,
        status: 'Pending',
        priority,
        notes: notes || undefined,
      };
      
      await createAssignment(assignment);
      toast.success('Paciente atribuído com sucesso!');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erro ao atribuir paciente:', error);
      toast.error('Erro ao atribuir paciente. Por favor, tente novamente.');
    }
  };
  
  if (networkLoading) {
    return <div className="flex justify-center p-8">Carregando...</div>;
  }
  
  if (!patient) {
    return <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">Paciente não encontrado</div>;
  }
  
  if (!admission) {
    return <div className="p-4 bg-yellow-50 text-yellow-700 rounded-md">
      Admissão não encontrada para o paciente
    </div>;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-primary-900">Atribuição de Paciente</h1>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-md">
        <h2 className="text-xl font-medium mb-2">Informações do Paciente</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p><span className="font-medium">Nome:</span> {patient.personalInfo.name}</p>
            <p><span className="font-medium">CPF:</span> {patient.personalInfo.cpf}</p>
            <p><span className="font-medium">Gênero:</span> {patient.personalInfo.gender === 'M' ? 'Masculino' : patient.personalInfo.gender === 'F' ? 'Feminino' : 'Outro'}</p>
          </div>
          <div>
            <p><span className="font-medium">Data de Admissão:</span> {new Date(admission.admissionDate).toLocaleDateString('pt-BR')}</p>
            <p><span className="font-medium">Diagnóstico:</span> {admission.initialDiagnosis || "Não definido"}</p>
            <p><span className="font-medium">Status Atual:</span> {admission.status}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Seleção de Departamento */}
        <DepartmentSelector
          departments={networkData?.hospitals.flatMap(h => h.departments) || []}
          selectedDepartmentId={selectedDepartmentId}
          onChange={handleDepartmentChange}
        />
        
        {/* Seleção de Médico */}
        {selectedDepartmentId && (
          <DoctorSelector
            hospitalId={networkData?.hospitals[0]?.id || ''} // Ajuste conforme necessário
            departmentId={selectedDepartmentId}
            selectedDoctorId={selectedDoctorId}
            onChange={handleDoctorChange}
          />
        )}
        
        {/* Seleção de Enfermeiro (opcional) */}
        {selectedDepartmentId && (
          <NurseSelector
            hospitalId={networkData?.hospitals[0]?.id || ''} // Ajuste conforme necessário
            departmentId={selectedDepartmentId}
            selectedNurseId={selectedNurseId}
            onChange={handleNurseChange}
          />
        )}
        
        {/* Atribuição de Leito (opcional) */}
        {selectedDepartmentId && (
          <BedAssignment
            hospitalId={networkData?.hospitals[0]?.id || ''} // Ajuste conforme necessário
            departmentId={selectedDepartmentId}
            selectedBedId={selectedBedId}
            onChange={handleBedChange}
          />
        )}
        
        {/* Prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prioridade
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as TPatientPriority)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
            <option value="Emergência">Emergência</option>
          </select>
        </div>
        
        {/* Observações */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Observações
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md min-h-[100px]"
            placeholder="Observações adicionais sobre a atribuição"
          />
        </div>
        
        {/* Botão de Envio */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || !selectedDepartmentId || !selectedDoctorId}
            className={`px-6 py-2 rounded-md ${
              isLoading || !selectedDepartmentId || !selectedDoctorId
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isLoading ? 'Processando...' : 'Confirmar Atribuição'}
          </button>
        </div>
      </div>
    </div>
  );
}