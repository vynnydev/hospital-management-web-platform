import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/organisms/select';
import { GeneratedData, Metrics, Patient } from '../types/types';
import { PatientCard } from './PatientCard';

interface DepartmentBoardProps {
  data: Metrics;
  selectedArea: string;
  patients: Patient[];
  setSelectedPatient: (patient: Patient | null) => void;  // Alterado para aceitar null
  generateData: (patient: Patient) => Promise<void>;      // Alterado para Promise<void>
  generatedData: GeneratedData // Recomendações geradas por inteligencia artificial
}

export const DepartmentBoard: React.FC<DepartmentBoardProps> = ({ 
  data, 
  selectedArea, 
  patients, 
  setSelectedPatient, 
  generateData,
  generatedData // Recomendações geradas por inteligencia artificial
}) => {
  // Inicializa com a primeira chave do objeto departmental
  const departmentKeys = Object.keys(data.departmental);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departmentKeys[0] || '');

  console.log("Recomendações de AI no card do Board:", generateData)

  // Debug logs
  // console.log('Selected Department:', selectedDepartment);
  // console.log('Available Departments:', departmentKeys);
  console.log('Department Data:', data.departmental[selectedDepartment]);

  const renderDepartmentColumns = (department: string) => {
    const depMetrics = data.departmental[department.toLowerCase()];
    if (!depMetrics) {
      console.error('No metrics found for department:', department);
      return null;
    }
    
    const departmentStatuses = depMetrics.validStatuses;
    // console.log("Area selecionada:", selectedArea)
    // console.log("Departamentos no Board:", data.departmental)

    return (
      <div>
        <div 
          className="grid grid-cols-4 gap-6 w-full h-full"
          style={{ minHeight: '600px' }}
        >
          {departmentStatuses.map((status) => (
            <div 
              key={status} 
              className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full h-full"
            >
              {/* Status Header */}
              <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500 dark:bg-gradient-to-r dark:from-blue-700 dark:to-teal-700">
                <h4 className="text-xl font-semibold">{status}</h4>
                <p className="text-sm">
                  {patients.filter((p) => {
                    const latestStatus = p.admission.statusHistory[0];
                    return (
                      latestStatus.department.toLowerCase() === department.toLowerCase() &&
                      latestStatus.status.toLowerCase() === status.toLowerCase()
                    );
                  }).length}{' '}
                  pacientes
                </p>
              </div>
      
              {/* Patients List */}
              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {patients
                  .filter((p) => {
                    const latestStatus = p.admission.statusHistory[0];
                    return (
                      latestStatus.department.toLowerCase() === department.toLowerCase() &&
                      latestStatus.status === status
                    );
                  })
                  .map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => {
                        setSelectedPatient(patient);
                        generateData(patient);
                      }}
                      className="w-full group"
                    >
                      <PatientCard 
                        patient={patient} 
                        status={status}   
                        generatedData={generatedData}                 
                      />
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-full h-screen bg-gray-100 dark:bg-gray-900 flex flex-col px-4 py-4 box-border overflow-hidden">
      {selectedArea === 'Todos' ? (
        <>
          <div className="mb-4 w-full">
            <Select
              defaultValue={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um departamento">
                  {selectedDepartment}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {departmentKeys.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {selectedDepartment && (
            <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex-1">
              {renderDepartmentColumns(selectedDepartment)}
            </div>
          )}
        </>
      ) : (
        <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex-1">
          {renderDepartmentColumns(selectedArea)}
        </div>
      )}
    </div>
  );
};