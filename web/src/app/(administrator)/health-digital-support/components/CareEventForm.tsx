import React, { useState, useEffect } from 'react';
import { IPatient, IResponsibleStaff } from '@/types/hospital-network-types';

interface CareEventData {
  patientId: string;
  type: string;
  description: string;
  department: string;
  staffId: string;
  details: Record<string, string>;
}

interface CareEventFormProps {
  patient: IPatient | null;
  departments: string[];
  staffList: IResponsibleStaff[];
  onSubmit: (data: CareEventData) => Promise<void>;
  isLoading: boolean;
}

interface DetailField {
  key: string;
  value: string;
}

const eventTypes = [
  { value: 'admission', label: 'Admissão' },
  { value: 'transfer', label: 'Transferência' },
  { value: 'procedure', label: 'Procedimento' },
  { value: 'medication', label: 'Medicação' },
  { value: 'exam', label: 'Exame' },
  { value: 'discharge', label: 'Alta' },
  { value: 'consultation', label: 'Consulta' },
  { value: 'note', label: 'Anotação' }
];

export const CareEventForm: React.FC<CareEventFormProps> = ({
  patient,
  departments,
  staffList,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState<CareEventData>({
    patientId: '',
    type: '',
    description: '',
    department: '',
    staffId: '',
    details: {}
  });
  
  const [detailsFields, setDetailsFields] = useState<DetailField[]>([
    { key: '', value: '' }
  ]);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Atualizar paciente e departamento quando o paciente muda
  useEffect(() => {
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientId: patient.id,
        department: patient.careHistory?.statusHistory[0]?.department || ''
      }));
    }
  }, [patient]);
  
  // Sugestões de detalhes baseadas no tipo de evento
  useEffect(() => {
    if (formData.type) {
      // Resetar campos de detalhes
      let suggestedFields: DetailField[] = [];
      
      // Adicionar campos específicos para cada tipo de evento
      switch (formData.type) {
        case 'admission':
          suggestedFields = [
            { key: 'origem', value: '' },
            { key: 'urgência', value: '' }
          ];
          break;
        case 'transfer':
          suggestedFields = [
            { key: 'fromDepartment', value: patient?.careHistory?.statusHistory[0]?.department || '' },
            { key: 'toDepartment', value: '' },
            { key: 'motivo', value: '' }
          ];
          break;
        case 'procedure':
          suggestedFields = [
            { key: 'procedureType', value: '' },
            { key: 'duração', value: '' },
            { key: 'observações', value: '' }
          ];
          break;
        case 'medication':
          suggestedFields = [
            { key: 'medicationName', value: '' },
            { key: 'dosagem', value: '' },
            { key: 'via', value: '' },
            { key: 'frequência', value: '' }
          ];
          break;
        case 'exam':
          suggestedFields = [
            { key: 'examType', value: '' },
            { key: 'resultado', value: '' },
            { key: 'observações', value: '' }
          ];
          break;
        case 'discharge':
          suggestedFields = [
            { key: 'destino', value: '' },
            { key: 'condição', value: '' },
            { key: 'instruções', value: '' }
          ];
          break;
        default:
          suggestedFields = [{ key: '', value: '' }];
      }
      
      setDetailsFields(suggestedFields);
      
      // Atualizar o objeto details no formData
      const newDetails: Record<string, string> = {};
      suggestedFields.forEach(field => {
        if (field.key && field.value) {
          newDetails[field.key] = field.value;
        }
      });
      
      setFormData(prev => ({
        ...prev,
        details: newDetails
      }));
    }
  }, [formData.type, patient]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) {
      newErrors.type = 'Tipo de evento é obrigatório';
    }
    
    if (!formData.description) {
      newErrors.description = 'Descrição é obrigatória';
    }
    
    if (!formData.department) {
      newErrors.department = 'Departamento é obrigatório';
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
  
  const handleDetailsChange = (index: number, field: 'key' | 'value', value: string) => {
    const newDetailsFields = [...detailsFields];
    newDetailsFields[index][field] = value;
    setDetailsFields(newDetailsFields);
    
    // Atualizar o objeto details no formData
    const newDetails: Record<string, string> = {};
    newDetailsFields.forEach(field => {
      if (field.key && field.value) {
        newDetails[field.key] = field.value;
      }
    });
    
    setFormData(prev => ({
      ...prev,
      details: newDetails
    }));
  };
  
  const addDetailsField = () => {
    setDetailsFields([...detailsFields, { key: '', value: '' }]);
  };
  
  const removeDetailsField = (index: number) => {
    if (detailsFields.length <= 1) return;
    
    const newDetailsFields = [...detailsFields];
    newDetailsFields.splice(index, 1);
    setDetailsFields(newDetailsFields);
    
    // Atualizar o objeto details no formData
    const newDetails: Record<string, string> = {};
    newDetailsFields.forEach(field => {
      if (field.key && field.value) {
        newDetails[field.key] = field.value;
      }
    });
    
    setFormData(prev => ({
      ...prev,
      details: newDetails
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patient) {
      return;
    }
    
    if (validate()) {
      // Atualizar os detalhes uma última vez antes de enviar
      const newDetails: Record<string, string> = {};
      detailsFields.forEach(field => {
        if (field.key && field.value) {
          newDetails[field.key] = field.value;
        }
      });
      
      const eventData = {
        ...formData,
        details: newDetails
      };
      
      await onSubmit(eventData);
      
      // Limpar formulário após o envio
      if (!isLoading) {
        setFormData({
          patientId: patient.id,
          type: '',
          description: '',
          department: patient.careHistory?.statusHistory[0]?.department || '',
          staffId: '',
          details: {}
        });
        
        setDetailsFields([{ key: '', value: '' }]);
      }
    }
  };
  
  if (!patient) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-600">Por favor, selecione um paciente para registrar eventos</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold text-gray-800">
          Registrar Evento de Atendimento
        </div>
        <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
          Paciente: {patient.name}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Tipo de Evento
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.type 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
          >
            <option value="">Selecione o tipo</option>
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type}</p>
          )}
        </div>
        
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
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descrição
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className={`mt-1 block w-full rounded-md shadow-sm ${
            errors.description 
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
          }`}
          placeholder="Descreva o evento de atendimento..."
        ></textarea>
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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
      
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Detalhes Adicionais
          </label>
          <button
            type="button"
            onClick={addDetailsField}
            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg className="-ml-1 mr-1 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Campo
          </button>
        </div>
        
        <div className="space-y-2">
          {detailsFields.map((field, index) => (
            <div key={index} className="flex space-x-2">
              <input
                type="text"
                value={field.key}
                onChange={(e) => handleDetailsChange(index, 'key', e.target.value)}
                placeholder="Chave (ex: medicação)"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <input
                type="text"
                value={field.value}
                onChange={(e) => handleDetailsChange(index, 'value', e.target.value)}
                placeholder="Valor (ex: Dipirona 500mg)"
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {detailsFields.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeDetailsField(index)}
                  className="inline-flex items-center p-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          ))}
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
              Registrando...
            </>
          ) : 'Registrar Evento'}
        </button>
      </div>
    </form>
  );
};