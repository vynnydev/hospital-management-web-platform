import React, { useState, useEffect } from 'react';
import { IPatient } from '@/types/hospital-network-types';
import { AssignStaffData, Doctor, Nurse } from '@/types/staff-assignment-types';

interface StaffAssignmentFormProps {
  patient: IPatient;
  doctors: Doctor[];
  nurses: Nurse[];
  departments: string[];
  onSubmit: (data: AssignStaffData) => Promise<void>;
  isLoading: boolean;
}

export const StaffAssignmentForm: React.FC<StaffAssignmentFormProps> = ({
  patient,
  doctors,
  nurses,
  departments,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<AssignStaffData>({
    patientId: patient.id,
    doctorId: '',
    nurseId: '',
    department: patient.careHistory?.statusHistory[0]?.department || ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Atualizar patientId quando o paciente mudar
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      department: patient.careHistory?.statusHistory[0]?.department || prev.department
    }));
  }, [patient]);
  
  // Filtrar médicos pela especialidade do paciente se disponível
  const filteredDoctors = React.useMemo(() => {
    if (!patient.careHistory?.primaryDiagnosis) return doctors;
    
    const diagnosis = patient.careHistory.primaryDiagnosis.toLowerCase();
    
    // Tentar encontrar médicos com especialidade relacionada ao diagnóstico
    // Isso é uma lógica simplificada - em um sistema real seria mais sofisticado
    return doctors.filter(doctor => {
      const specialty = doctor.specialty.toLowerCase();
      
      if (diagnosis.includes('cardíaco') || diagnosis.includes('coronária') || diagnosis.includes('coração')) {
        return specialty.includes('cardio');
      }
      
      if (diagnosis.includes('pulmão') || diagnosis.includes('respiratório') || diagnosis.includes('pneumonia')) {
        return specialty.includes('pneumo');
      }
      
      if (diagnosis.includes('ortopédico') || diagnosis.includes('fratura') || diagnosis.includes('quadril')) {
        return specialty.includes('ortop');
      }
      
      if (diagnosis.includes('neuro') || diagnosis.includes('cérebro') || diagnosis.includes('avc')) {
        return specialty.includes('neuro');
      }
      
      if (diagnosis.includes('câncer') || diagnosis.includes('quimio') || diagnosis.includes('metastático')) {
        return specialty.includes('onco');
      }
      
      return true;
    });
  }, [doctors, patient]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.doctorId) {
      newErrors.doctorId = 'Por favor, selecione um médico';
    }
    
    if (!formData.nurseId) {
      newErrors.nurseId = 'Por favor, selecione um enfermeiro';
    }
    
    if (!formData.department) {
      newErrors.department = 'Por favor, selecione um departamento';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro do campo quando o usuário seleciona um valor
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate()) {
      await onSubmit(formData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-gray-800">
          Atribuir Equipe Médica
        </div>
        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Paciente: {patient.name}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
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
              <option value="">Selecione um departamento</option>
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
            <label htmlFor="doctorId" className="block text-sm font-medium text-gray-700">
              Médico Responsável
            </label>
            <select
              id="doctorId"
              name="doctorId"
              value={formData.doctorId}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.doctorId 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">Selecione um médico</option>
              {filteredDoctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialty}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <p className="mt-1 text-sm text-red-600">{errors.doctorId}</p>
            )}
            
            {filteredDoctors.length < doctors.length && (
              <p className="mt-1 text-xs text-blue-600">
                * Médicos filtrados por especialidade relacionada ao diagnóstico
              </p>
            )}
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="nurseId" className="block text-sm font-medium text-gray-700">
              Enfermeiro Responsável
            </label>
            <select
              id="nurseId"
              name="nurseId"
              value={formData.nurseId}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.nurseId 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">Selecione um enfermeiro</option>
              {nurses.map(nurse => (
                <option key={nurse.id} value={nurse.id}>
                  {nurse.name} - Turno: {nurse.shift}
                </option>
              ))}
            </select>
            {errors.nurseId && (
              <p className="mt-1 text-sm text-red-600">{errors.nurseId}</p>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Informações do Paciente</h3>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Diagnóstico:</span> {patient.diagnosis}</p>
              {patient.careHistory?.primaryDiagnosis && (
                <p><span className="font-medium">Diagnóstico Primário:</span> {patient.careHistory.primaryDiagnosis}</p>
              )}
              {patient.expectedDischarge && (
                <p><span className="font-medium">Alta Prevista:</span> {new Date(patient.expectedDischarge).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Atribuindo...
            </>
          ) : 'Atribuir Equipe'}
        </button>
      </div>
    </form>
  );
};