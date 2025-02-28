/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useStaffData } from '@/services/hooks/staffs/useStaffData';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';
import { HospitalNetworkComponent } from '@/components/ui/templates/HospitalNetworkComponent';
import { type IStaffTeam, type IDepartmentalStaffMetrics, initialStaffDepartmentMetrics } from '@/types/staff-types';
import { StaffManagement } from './StaffManagement';
import { initialMetrics } from '@/types/hospital-network-types';

export const MainStaffManagement: React.FC = () => {
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
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large' | 'extra-large'>('normal');
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<IStaffTeam | null>(null);
  const [departmentMetrics, setDepartmentMetrics] = useState<IDepartmentalStaffMetrics>(initialStaffDepartmentMetrics);

  // Loading combinado dos dois hooks
  const loading = networkLoading || staffLoading;

  // Erro combinado dos dois hooks
  useEffect(() => {
    if (networkError) setError(networkError);
    else if (staffError) setError(staffError);
    else setError(null);
  }, [networkError, staffError]);

  // Atualiza métricas quando hospital ou departamento mudam
  useEffect(() => {
    if (selectedHospital && selectedDepartment) {
      const metrics = getDepartmentMetrics(selectedHospital, selectedDepartment);
      if (metrics) {
        setDepartmentMetrics(metrics);
      } else {
        setDepartmentMetrics(initialStaffDepartmentMetrics);
      }
    }
  }, [selectedHospital, selectedDepartment, getDepartmentMetrics]);

  // Log dos estados importantes
  useEffect(() => {
    console.log('🔄 Dados atualizados:', {
      hospitais: networkData?.hospitals?.length || 0,
      equipes: staffData?.staffTeams,
      usuário: currentUser?.id,
      loading,
      erro: error
    });
  }, [networkData, staffData, currentUser, loading, error]);

  useEffect(() => {
    if (selectedHospital && networkData && staffData) {
      const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
      const teams = staffData.staffTeams[selectedHospital];
      console.log('🏥 Hospital selecionado:', {
        id: selectedHospital,
        nome: hospital?.name,
        departamentos: hospital?.departments.map(d => d.name),
        equipes: teams?.length,
        totalProfissionais: teams?.reduce((acc, team) => acc + team.members.length, 0) || 0
      });
    }
  }, [selectedHospital, networkData, staffData]);

  useEffect(() => {
    if (selectedArea && selectedHospital && staffData) {
      const teams = getTeamsByDepartment(selectedHospital, selectedArea);
      console.log('🏥 Departamento selecionado:', {
        nome: selectedArea,
        totalEquipes: teams.length,
        equipesAtivas: teams.filter(t => t.status === 'active').length,
        profissionais: teams.reduce((acc, team) => acc + team.members.length, 0)
      });
    }
  }, [selectedArea, selectedHospital, staffData, getTeamsByDepartment]);

  // Obtém equipes filtradas por hospital e departamento
  const getFilteredTeams = () => {
    if (!selectedHospital || !staffData) return [];
    
    return getTeamsByDepartment(selectedHospital, selectedDepartment);
  };

  const handleDepartmentSelect = (department: string) => {
    console.log('Departamento selecionado:', department);
    setSelectedDepartment(department.toLowerCase());
    setSelectedArea(department);
  };

  const handleTeamSelect = (team: IStaffTeam | null) => {
    console.log('👥 Selecionando equipe:', team);
    setSelectedTeam(team);
    if (team) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    console.log('🚪 Fechando modal');
    setIsOpen(false);
    setSelectedTeam(null);
  };

  const handleRetry = () => {
    console.log('🔄 Recarregando dados');
    setError(null);
    window.location.reload();
  };

  const handleHospitalSelect = (hospitalId: string) => {
    console.log('🏥 Selecionando hospital:', hospitalId);
    setSelectedHospital(hospitalId);
    setSelectedArea('');
  };

  // Obtém departamentos do hospital selecionado
  const getDepartments = (): Record<string, string[]> => {
    if (!selectedHospital || !networkData) return {};
    
    const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
    if (!hospital) return {};

    return hospital.departments.reduce((acc, dept) => {
      acc[dept.name.toLowerCase()] = ['active', 'inactive', 'on_leave'];
      return acc;
    }, {} as Record<string, string[]>);
  };

  return (
    <div className="min-h-screen p-4 space-y-6">
      <HospitalNetworkComponent
        networkInfo={networkData?.networkInfo}
        hospitals={networkData?.hospitals}
        currentUser={currentUser}
        onHospitalSelect={handleHospitalSelect}
        onDepartmentSelect={handleDepartmentSelect}
        selectedHospital={selectedHospital}
        selectedDepartment={selectedDepartment}
        loading={loading}
        error={error}
      />

    {/* StaffManagement sempre visível */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="col-span-2">
            <StaffManagement
                // Dados do hospital (métricas gerais)
                data={selectedHospital && networkData 
                    ? networkData.hospitals.find(h => h.id === selectedHospital)?.metrics 
                    : initialMetrics}
                // Métricas específicas do departamento selecionado
                departmentMetrics={departmentMetrics}
                // Lista de equipes filtradas
                teams={getFilteredTeams()}
                // Área/departamento selecionado
                selectedArea={selectedArea}
                // Handler para seleção de equipe
                onSelectTeam={handleTeamSelect}
                // Departamentos disponíveis
                departments={getDepartments()}
                // Handlers e estados de UI
                onClose={handleClose}
                fontSize={fontSize}
                setFontSize={setFontSize}
                loading={loading}
                error={error}
                onRetry={handleRetry}
            />
        </div>
    </div>

      {loading && (
        <div className="fixed inset-0 bg-black/5 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700 dark:text-gray-300">Carregando dados...</span>
          </div>
        </div>
      )}
    </div>
  );
};