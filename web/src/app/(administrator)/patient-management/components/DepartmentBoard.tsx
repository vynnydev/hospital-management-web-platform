/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useMemo } from 'react';
import { IGeneratedData, IHospitalMetrics } from '../types/types';
import { PatientCard } from './PatientCard';
import { IPatient } from '@/types/hospital-network-types';

interface DepartmentBoardProps {
  data: IHospitalMetrics;
  selectedArea: string;
  patients: IPatient[];
  searchQuery?: string;
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
  searchQuery = '',
  setSelectedPatient,
  generateData,
  generatedData,
  isLoading,
  loadingMessage,
  loadingProgress,
}) => {
  const departmentKeys = Object.keys(data.departmental);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departmentKeys[0] || '');

  // Filtra pacientes baseado no termo de busca
  const filteredPatients = useMemo(() => {
    if (!searchQuery) return patients;

    const query = searchQuery.toLowerCase();
    return patients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.id.toString().toLowerCase().includes(query) ||
      patient.diagnosis.toLowerCase().includes(query) ||
      patient.careHistory?.statusHistory?.[0]?.department.toLowerCase().includes(query) ||
      patient.careHistory?.statusHistory?.[0]?.status.toLowerCase().includes(query)
    );
  }, [patients, searchQuery]);

  const getDepartmentPatients = (department: string, status: string) => {
    return filteredPatients.filter(patient => {
      if (!patient.careHistory?.statusHistory?.length) return false;
      
      const latestStatus = patient.careHistory.statusHistory[0];
      return (
        latestStatus.department.toLowerCase() === department.toLowerCase() &&
        latestStatus.status === status
      );
    });
  };

  const handleCardClick = (patient: IPatient) => {
    setSelectedPatient(patient);
  };

  const handleGenerateRecommendation = async (patient: IPatient) => {
    await generateData(patient);
  };

  const renderDepartmentColumns = (department: string) => {
    const depMetrics = data.departmental?.[department.toLowerCase()];
    if (!depMetrics?.validStatuses) return null;

    return (
      <div className="grid grid-cols-4 gap-2 w-full h-full">
        {depMetrics.validStatuses.map((status) => {
          const departmentPatients = getDepartmentPatients(department, status);
          return (
            <div key={status} className="flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full h-full">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-teal-500 dark:bg-gradient-to-r dark:from-blue-700 dark:to-teal-700">
                <h4 className="text-xl font-semibold text-white">{status}</h4>
                <p className="text-sm text-white/90">
                  {departmentPatients.length} pacientes
                  {searchQuery && departmentPatients.length === 0 && (
                    <span className="text-xs text-white/70"> (nenhum resultado)</span>
                  )}
                </p>
              </div>

              <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {departmentPatients.length > 0 ? (
                  departmentPatients.map((patient) => (
                    <div key={patient.id}>
                      <PatientCard
                        patient={patient}
                        status={status}
                        generatedData={generatedData}
                        isLoading={isLoading}
                        loadingMessage={loadingMessage}
                        loadingProgress={loadingProgress}
                        onCardClick={handleCardClick}
                        onGenerateRecommendation={handleGenerateRecommendation}
                      />
                    </div>
                  ))
                ) : searchQuery ? (
                  <div className="flex items-center justify-center h-32 text-gray-500 dark:text-gray-400">
                    Nenhum paciente encontrado
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-full h-screen bg-gray-100 dark:bg-gray-800 flex flex-col px-2 py-2 box-border overflow-hidden">
      {selectedArea && renderDepartmentColumns(selectedArea)}
    </div>
  );
};