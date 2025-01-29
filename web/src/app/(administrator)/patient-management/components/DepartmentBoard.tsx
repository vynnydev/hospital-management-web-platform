import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';
import { IGeneratedData, IHospitalMetrics } from '../types/types';
import { PatientCard } from './PatientCard';
import { IPatient } from '@/types/hospital-network-types';


interface DepartmentBoardProps {
  data: IHospitalMetrics;
  selectedArea: string;
  patients: IPatient[];
  setSelectedPatient: (patient: IPatient | null) => void;
  generateData: (patient: IPatient) => Promise<void>;
  generatedData: IGeneratedData;
  isLoading: boolean;
  loadingMessage?: string;
  loadingProgress?: number;
}

export const DepartmentBoard: React.FC<DepartmentBoardProps> = ({ 
  data,
  selectedArea,
  patients,
  setSelectedPatient,
  generateData,
  generatedData,
  isLoading,
  loadingMessage,
  loadingProgress,
}) => {
  // Inicializa com a primeira chave do objeto departmental
  const departmentKeys = Object.keys(data.departmental);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departmentKeys[0] || '');
  console.log("Departamento chave:", departmentKeys)

  console.log("Recomendações de AI no card do Board:", generateData)

  // Debug logs
  // console.log('Selected Department:', selectedDepartment);
  // console.log('Available Departments:', departmentKeys);
  console.log('Department Data:', data.departmental[selectedDepartment]);

  const getDepartmentPatients = (department: string, status: string) => {
    return patients.filter(patient => {
      if (!patient.careHistory?.statusHistory?.length) return false;
      
      const latestStatus = patient.careHistory.statusHistory[0];
      return (
        latestStatus.department.toLowerCase() === department.toLowerCase() &&
        latestStatus.status === status
      );
    });
  };

  console.log("Area selecionada para o board:", selectedArea)

  const renderDepartmentColumns = (department: string) => {
    const depMetrics = data.departmental?.[department.toLowerCase()];
    if (!depMetrics?.validStatuses) return null;

    console.log("Métricas do departamento:", depMetrics)

    return (
      <div className="grid grid-cols-4 gap-2 w-full h-full">
        {depMetrics.validStatuses.map((status) => (
          <div key={status} className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full h-full">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500 dark:bg-gradient-to-r dark:from-blue-700 dark:to-teal-700">
              <h4 className="text-xl font-semibold text-white">{status}</h4>
              <p className="text-sm text-white/90">
                {getDepartmentPatients(department, status).length} pacientes
              </p>
            </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {getDepartmentPatients(department, status).map((patient) => (
                <div key={patient.id} onClick={() => {
                  setSelectedPatient(patient);
                  generateData(patient);
                }}>
                  <PatientCard
                    patient={patient}
                    status={status}
                    generatedData={generatedData}
                    isLoading={isLoading}
                    loadingMessage={loadingMessage}
                    loadingProgress={loadingProgress}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-full h-screen bg-gray-100 dark:bg-gray-800 flex flex-col px-2 py-2 box-border overflow-hidden">
      {selectedArea && renderDepartmentColumns(selectedArea)}
    </div>
  );
};