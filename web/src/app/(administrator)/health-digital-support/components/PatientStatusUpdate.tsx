import React, { useState, useEffect } from 'react';
import { IHospital, IPatient, IResponsibleStaff } from '@/types/hospital-network-types';

import { AlertMessage } from '@/components/ui/templates/common/AlertMessage';

interface PatientStatusUpdateProps {
  patient: IPatient | null;
  departments: string[];
  staffList: IResponsibleStaff[];
  hospital: IHospital;
  setSystemMessage: (message: { type: 'success' | 'error' | 'warning' | 'info'; text: string; } | null) => void;
}

interface StatusUpdateData {
  patientId: string;
  department: string;
  status: string;
  specialty: string;
  staffId: string;
  notes: string;
}

export const PatientStatusUpdate: React.FC<PatientStatusUpdateProps> = ({
  patient,
  departments,
  staffList,
  hospital,
  setSystemMessage
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<StatusUpdateData>({
    patientId: '',
    department: '',
    status: '',
    specialty: '',
    staffId: '',
    notes: ''
  });
  
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Atualizar patientId, department e specialty quando o paciente mudar
  useEffect(() => {
    if (patient) {
      const currentDepartment = patient.careHistory?.statusHistory[0]?.department || '';
      const currentSpecialty = patient.careHistory?.statusHistory[0]?.specialty || '';
      
      setFormData({
        patientId: patient.id,
        department: currentDepartment,
        status: '',
        specialty: currentSpecialty,
        staffId: '',
        notes: ''
      });
    }
  }, [patient]);
  
  // Atualizar opções de status com base no departamento selecionado
  useEffect(() => {
    if (!formData.department || !hospital) return;
    
    // Obter status válidos para o departamento das métricas
    const deptKey = formData.department.toLowerCase();
    const validStatuses = hospital.metrics.departmental[deptKey]?.validStatuses || [];
    
    setStatusOptions(validStatuses);
  }, [formData.department, hospital]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.status) {
      newErrors.status = 'Status é obrigatório';
    }
    
    if (!formData.department) {
      newErrors.department = 'Departamento é obrigatório';
    }
    
    if (!formData.specialty) {
      newErrors.specialty = 'Especialidade é obrigatória';
    }
    
    if (!formData.staffId) {
      newErrors.staffId = 'Profissional responsável é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário digita/seleciona
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patient) {
      return;
    }
    
    if (validate()) {
      try {
        setLoading(true);
        setError(null);
        
        // Em um cenário real, enviaríamos para a API
        // Aqui estamos simulando
        console.log('Atualizando status do paciente:', formData);
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const staff = staffList.find(s => s.id === formData.staffId);
        
        if (!staff) {
          throw new Error('Profissional não encontrado');
        }
        
        const successText = `Status do paciente atualizado para: ${formData.status}`;
        
        setSuccessMessage(successText);
        setSystemMessage({
          type: 'success',
          text: successText
        });
        
        // Limpar o formulário após sucesso
        setFormData(prev => ({
          ...prev,
          status: '',
          staffId: '',
          notes: ''
        }));
        
        // Limpar mensagem depois de 5 segundos
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
        
      } catch (err) {
        console.error('Erro ao atualizar status:', err);
        setError(err instanceof Error ? err.message : 'Erro ao atualizar status');
        setSystemMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Erro ao atualizar status'
        });
      } finally {
        setLoading(false);
      }
    }
  };
  
  if (!patient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Por favor, selecione um paciente para atualizar o status</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="text-xl font-semibold text-gray-800">
          Atualizar Status do Paciente
        </div>
        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Paciente: {patient.name}
        </div>
      </div>
      
      {successMessage && (
        <AlertMessage type="success" message={successMessage} onClose={() => setSuccessMessage(null)} />
      )}
      
      {error && (
        <AlertMessage type="error" message={error} onClose={() => setError(null)} />
      )}
      
      {patient.careHistory?.statusHistory && patient.careHistory.statusHistory.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-800">Status Atual:</h3>
          <p className="text-blue-700">
            {patient.careHistory.statusHistory[0].status} - Departamento: {patient.careHistory.statusHistory[0].department}
            {patient.careHistory.statusHistory[0].specialty && ` - Especialidade: ${patient.careHistory.statusHistory[0].specialty}`}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Atualizado em: {new Date(patient.careHistory.statusHistory[0].timestamp).toLocaleString()}
          </p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Departamento
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.department 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">Selecione o departamento</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Novo Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              disabled={!formData.department}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.status 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              } ${!formData.department ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            >
              <option value="">Selecione o status</option>
              {statusOptions.map(status => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600">{errors.status}</p>
            )}
            {!formData.department && (
              <p className="mt-1 text-xs text-gray-500">Selecione um departamento primeiro</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="specialty" className="block text-sm font-medium text-gray-700">
              Especialidade
            </label>
            <select
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.specialty 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">Selecione a especialidade</option>
              {hospital.specialties.map(spec => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="staffId" className="block text-sm font-medium text-gray-700">
              Profissional Responsável
            </label>
            <select
              id="staffId"
              name="staffId"
              value={formData.staffId}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.staffId 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">Selecione o profissional</option>
              {staffList.map(staff => (
                <option key={staff.id} value={staff.id}>
                  {staff.name} - {staff.role}
                </option>
              ))}
            </select>
            {errors.staffId && (
              <p className="mt-1 text-sm text-red-600">{errors.staffId}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Observações (opcional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Adicione observações sobre a mudança de status..."
          ></textarea>
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Atualizando...
              </>
            ) : 'Atualizar Status'}
          </button>
        </div>
      </form>
    </div>
  );
};