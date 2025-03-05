import React, { useState } from 'react';

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

interface PatientFormProps {
  onSubmit: (data: NewPatientData) => Promise<void>;
  departments: string[];
  specialties: string[];
  isLoading: boolean;
  availabilityByDepartment: Record<string, number>;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const genders = ['M', 'F'];

export const PatientForm: React.FC<PatientFormProps> = ({
  onSubmit,
  departments,
  specialties,
  isLoading,
  availabilityByDepartment
}) => {
  const [formData, setFormData] = useState<NewPatientData>({
    name: '',
    age: 0,
    gender: '',
    bloodType: '',
    contactInfo: {
      phone: '',
      emergency: '',
      address: ''
    },
    diagnosis: '',
    expectedDischargeDate: '',
    department: '',
    specialty: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.age || formData.age <= 0) {
      newErrors.age = 'Idade deve ser maior que zero';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gênero é obrigatório';
    }
    
    if (!formData.bloodType) {
      newErrors.bloodType = 'Tipo sanguíneo é obrigatório';
    }
    
    if (!formData.contactInfo.phone.trim()) {
      newErrors['contactInfo.phone'] = 'Telefone é obrigatório';
    }
    
    if (!formData.contactInfo.emergency.trim()) {
      newErrors['contactInfo.emergency'] = 'Contato de emergência é obrigatório';
    }
    
    if (!formData.contactInfo.address.trim()) {
      newErrors['contactInfo.address'] = 'Endereço é obrigatório';
    }
    
    if (!formData.diagnosis.trim()) {
      newErrors.diagnosis = 'Diagnóstico é obrigatório';
    }
    
    if (!formData.expectedDischargeDate) {
      newErrors.expectedDischargeDate = 'Data prevista de alta é obrigatória';
    }
    
    if (!formData.department) {
      newErrors.department = 'Departamento é obrigatório';
    } else if (availabilityByDepartment[formData.department] === 0) {
      newErrors.department = 'Este departamento não possui leitos disponíveis';
    }
    
    if (!formData.specialty) {
      newErrors.specialty = 'Especialidade é obrigatória';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Lidar com campos aninhados (contactInfo)
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof NewPatientData],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'age' ? parseInt(value) || 0 : value
      }));
    }
    
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
    
    if (validate()) {
      await onSubmit(formData);
      
      // Resetar formulário após envio bem-sucedido
      if (!isLoading) {
        setFormData({
          name: '',
          age: 0,
          gender: '',
          bloodType: '',
          contactInfo: {
            phone: '',
            emergency: '',
            address: ''
          },
          diagnosis: '',
          expectedDischargeDate: '',
          department: '',
          specialty: ''
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow-md p-6">
      <div className="text-xl font-semibold text-gray-800 mb-4">Registro de Novo Paciente</div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Básicas */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Informações Básicas</h3>
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.name 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Idade
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age || ''}
              onChange={handleChange}
              min={0}
              max={120}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.age 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.age && (
              <p className="mt-1 text-sm text-red-600">{errors.age}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
              Gênero
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.gender 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">Selecione</option>
              {genders.map(gender => (
                <option key={gender} value={gender}>
                  {gender}
                </option>
              ))}
            </select>
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="bloodType" className="block text-sm font-medium text-gray-700">
              Tipo Sanguíneo
            </label>
            <select
              id="bloodType"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.bloodType 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            >
              <option value="">Selecione</option>
              {bloodTypes.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.bloodType && (
              <p className="mt-1 text-sm text-red-600">{errors.bloodType}</p>
            )}
          </div>
        </div>
        
        {/* Informações de Contato */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-700">Informações de Contato</h3>
          
          <div>
            <label htmlFor="contactInfo.phone" className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="tel"
              id="contactInfo.phone"
              name="contactInfo.phone"
              value={formData.contactInfo.phone}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors['contactInfo.phone'] 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors['contactInfo.phone'] && (
              <p className="mt-1 text-sm text-red-600">{errors['contactInfo.phone']}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="contactInfo.emergency" className="block text-sm font-medium text-gray-700">
              Contato de Emergência
            </label>
            <input
              type="tel"
              id="contactInfo.emergency"
              name="contactInfo.emergency"
              value={formData.contactInfo.emergency}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors['contactInfo.emergency'] 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors['contactInfo.emergency'] && (
              <p className="mt-1 text-sm text-red-600">{errors['contactInfo.emergency']}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="contactInfo.address" className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              id="contactInfo.address"
              name="contactInfo.address"
              value={formData.contactInfo.address}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors['contactInfo.address'] 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors['contactInfo.address'] && (
              <p className="mt-1 text-sm text-red-600">{errors['contactInfo.address']}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Informações Médicas */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-medium text-gray-700">Informações Médicas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
              Diagnóstico
            </label>
            <textarea
              id="diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              rows={3}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.diagnosis 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.diagnosis && (
              <p className="mt-1 text-sm text-red-600">{errors.diagnosis}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="expectedDischargeDate" className="block text-sm font-medium text-gray-700">
              Data Prevista de Alta
            </label>
            <input
              type="date"
              id="expectedDischargeDate"
              name="expectedDischargeDate"
              value={formData.expectedDischargeDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.expectedDischargeDate 
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
              }`}
            />
            {errors.expectedDischargeDate && (
              <p className="mt-1 text-sm text-red-600">{errors.expectedDischargeDate}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <option value="">Selecione</option>
              {departments.map(dept => (
                <option 
                  key={dept} 
                  value={dept}
                  disabled={availabilityByDepartment[dept] === 0}
                >
                  {dept} {availabilityByDepartment[dept] === 0 ? '(Sem leitos disponíveis)' : `(${availabilityByDepartment[dept]} leitos)`}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
            )}
          </div>
          
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
              <option value="">Selecione</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
            {errors.specialty && (
              <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>
            )}
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
              Registrando...
            </>
          ) : 'Registrar Paciente'}
        </button>
      </div>
    </form>
  );
};