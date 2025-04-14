/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

export interface DataMapping {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  insurance: string;
}

interface EHRFieldMappingProps {
  mapping: DataMapping;
  onChange: (mapping: DataMapping) => void;
}

export const EHRFieldMapping: React.FC<EHRFieldMappingProps> = ({
  mapping,
  onChange
}) => {
  // Função para atualizar um campo específico
  const updateField = (field: keyof DataMapping, value: string) => {
    onChange({
      ...mapping,
      [field]: value
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
        Mapeamento de Campos
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Especifique como os campos do sistema devem ser mapeados no EHR.
      </p>
      
      <div className="space-y-1">
        {/* Mapeamento dos campos */}
        <FieldMappingRow 
          label="ID do Paciente" 
          field="patientId"
          value={mapping.patientId} 
          onChange={value => updateField('patientId', value)} 
        />
        <FieldMappingRow 
          label="Nome" 
          field="firstName"
          value={mapping.firstName} 
          onChange={value => updateField('firstName', value)} 
        />
        <FieldMappingRow 
          label="Sobrenome" 
          field="lastName"
          value={mapping.lastName} 
          onChange={value => updateField('lastName', value)} 
        />
        <FieldMappingRow 
          label="Data de Nascimento" 
          field="dateOfBirth"
          value={mapping.dateOfBirth} 
          onChange={value => updateField('dateOfBirth', value)} 
        />
        <FieldMappingRow 
          label="Gênero" 
          field="gender"
          value={mapping.gender} 
          onChange={value => updateField('gender', value)} 
        />
        <FieldMappingRow 
          label="Endereço" 
          field="address"
          value={mapping.address} 
          onChange={value => updateField('address', value)} 
        />
        <FieldMappingRow 
          label="Telefone" 
          field="phone"
          value={mapping.phone} 
          onChange={value => updateField('phone', value)} 
        />
        <FieldMappingRow 
          label="Email" 
          field="email"
          value={mapping.email} 
          onChange={value => updateField('email', value)} 
        />
        <FieldMappingRow 
          label="Plano de Saúde" 
          field="insurance"
          value={mapping.insurance} 
          onChange={value => updateField('insurance', value)} 
        />
      </div>
    </div>
  );
};

// Componente de linha para mapeamento de campo
const FieldMappingRow: React.FC<{
  label: string;
  field: string;
  value: string;
  onChange: (value: string) => void;
}> = ({ label, field, value, onChange }) => (
  <div className="grid grid-cols-2 gap-4 items-center py-2 border-b border-gray-100 dark:border-gray-800">
    <div className="text-sm text-gray-700 dark:text-gray-300">{label}</div>
    <div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-md text-sm"
        placeholder={`Campo do EHR para ${label}`}
        autoComplete="off"
      />
    </div>
  </div>
);