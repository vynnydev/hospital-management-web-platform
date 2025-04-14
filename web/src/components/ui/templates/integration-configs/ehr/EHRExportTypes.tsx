import React from 'react';

export interface ExportTypes {
  demographics: boolean;
  allergies: boolean;
  medications: boolean;
  conditions: boolean;
  immunizations: boolean;
  labResults: boolean;
  vitals: boolean;
  procedures: boolean;
  socialHistory: boolean;
  familyHistory: boolean;
  notes: boolean;
}

interface EHRExportTypesProps {
  exportTypes: ExportTypes;
  onChange: (exportTypes: ExportTypes) => void;
}

export const EHRExportTypes: React.FC<EHRExportTypesProps> = ({
  exportTypes,
  onChange
}) => {
  // Função para alternar um tipo de exportação
  const toggleExportType = (type: keyof ExportTypes) => {
    onChange({
      ...exportTypes,
      [type]: !exportTypes[type]
    });
  };

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
        Tipos de Dados para Sincronização
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Selecione quais tipos de dados serão sincronizados com o sistema EHR.
      </p>
      
      <div className="grid grid-cols-2 gap-4">
        <ExportTypeCheckbox 
          label="Dados Demográficos" 
          checked={exportTypes.demographics}
          onChange={() => toggleExportType('demographics')}
        />
        <ExportTypeCheckbox 
          label="Alergias" 
          checked={exportTypes.allergies}
          onChange={() => toggleExportType('allergies')}
        />
        <ExportTypeCheckbox 
          label="Medicamentos" 
          checked={exportTypes.medications}
          onChange={() => toggleExportType('medications')}
        />
        <ExportTypeCheckbox 
          label="Condições Médicas" 
          checked={exportTypes.conditions}
          onChange={() => toggleExportType('conditions')}
        />
        <ExportTypeCheckbox 
          label="Imunizações" 
          checked={exportTypes.immunizations}
          onChange={() => toggleExportType('immunizations')}
        />
        <ExportTypeCheckbox 
          label="Resultados de Exames" 
          checked={exportTypes.labResults}
          onChange={() => toggleExportType('labResults')}
        />
        <ExportTypeCheckbox 
          label="Sinais Vitais" 
          checked={exportTypes.vitals}
          onChange={() => toggleExportType('vitals')}
        />
        <ExportTypeCheckbox 
          label="Procedimentos" 
          checked={exportTypes.procedures}
          onChange={() => toggleExportType('procedures')}
        />
        <ExportTypeCheckbox 
          label="Histórico Social" 
          checked={exportTypes.socialHistory}
          onChange={() => toggleExportType('socialHistory')}
        />
        <ExportTypeCheckbox 
          label="Histórico Familiar" 
          checked={exportTypes.familyHistory}
          onChange={() => toggleExportType('familyHistory')}
        />
        <ExportTypeCheckbox 
          label="Notas Clínicas" 
          checked={exportTypes.notes}
          onChange={() => toggleExportType('notes')}
        />
      </div>
    </div>
  );
};

// Componente de checkbox para tipo de exportação
const ExportTypeCheckbox: React.FC<{
  label: string;
  checked: boolean;
  onChange: () => void;
}> = ({ label, checked, onChange }) => (
  <div className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-blue-600 rounded border-gray-300"
    />
    <label className="text-sm text-gray-700 dark:text-gray-300">
      {label}
    </label>
  </div>
);