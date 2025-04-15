/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useCallback, useEffect } from 'react';

// Hooks
import { useNetworkData } from '@/hooks/network-hospital/useNetworkData';
import { useStaffData } from '@/hooks/staffs/useStaffData';

// Segundo componente principal
import { MainPredictiveAnalysisContent } from './MainPredictiveAnalysisContent';

// Componente principal que repassa as propriedades aos outros componentes filhos
export const MainStaffPredictiveAnalysis: React.FC = () => {
    // Hooks para dados da rede e equipes
    const { 
      networkData, 
      currentUser, 
      loading: networkLoading, 
      error: networkError 
    } = useNetworkData();
  
    const { 
      staffData, 
      loading: staffLoading, 
      error: staffError,
      selectedDepartment,
      setSelectedDepartment,
      getTeamsByDepartment,
      getDepartmentMetrics 
    } = useStaffData();
  
    const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
    const [selectedArea, setSelectedArea] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    // Combinação de loading dos hooks
    useEffect(() => {
      setLoading(networkLoading || staffLoading);
    }, [networkLoading, staffLoading]);
  
    // Combinação de erros
    useEffect(() => {
      if (networkError) setError(networkError);
      else if (staffError) setError(staffError);
      else setError(null);
    }, [networkError, staffError]);
  
    // Seleção automática do primeiro hospital
    useEffect(() => {
      if (networkData?.hospitals?.length && !selectedHospital) {
        setSelectedHospital(networkData.hospitals[0].id);
      }
    }, [networkData, selectedHospital]);
  
    // Seleção automática do primeiro departamento
    useEffect(() => {
      if (selectedHospital && networkData) {
        const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
        if (hospital?.departments?.length) {
          setSelectedDepartment(hospital.departments[0].name.toLowerCase());
        }
      }
    }, [selectedHospital, networkData, setSelectedDepartment]);
  
    // Tratamento de erros
    const handleRetry = () => {
      setError(null);
      window.location.reload();
    };

    const handleDepartmentSelect = (department: string) => {
        console.log('Departamento selecionado:', department);
        setSelectedDepartment(department.toLowerCase());
        setSelectedArea(department); // Mantém consistência com o estado existente
    };
  
    // Renderização com tratamento de estados
    if (loading) {
      return (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 dark:text-gray-300">Carregando dados...</span>
          </div>
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 dark:bg-red-950 p-4">
          <h2 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">
            Erro ao carregar dados
          </h2>
          <p className="text-red-500 dark:text-red-300 mb-6">{error}</p>
          <button 
            onClick={handleRetry}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      );
    }
  
    return (
      <MainPredictiveAnalysisContent 
        networkData={networkData}
        currentUser={currentUser}
        staffData={staffData}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        getTeamsByDepartment={getTeamsByDepartment}
        onDepartmentSelect={handleDepartmentSelect}
        loading={loading}
        error={error}
      />
    );
};