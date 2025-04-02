/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo } from 'react';
import { IAmbulanceData } from '@/types/ambulance-types';
import { IAppUser } from '@/types/auth-types';
import { IBed, INetworkData, IPatient, IPatientCareHistory, IStatusHistory } from '@/types/hospital-network-types';
import { IStaffData } from '@/types/staff-types';

// Componentes da interface
import { DashboardHeader } from '@/components/ui/templates/patient-monitoring-dashboard/dashboard/DashboardHeader';
import { StatisticsCards } from '@/components/ui/templates/patient-monitoring-dashboard/dashboard/StatisticsCards';
import { PatientListSection } from '@/components/ui/templates/patient-monitoring-dashboard/dashboard/PatientListSection';
import { PatientDetailsSection } from '@/components/ui/templates/patient-monitoring-dashboard/dashboard/PatientDetailsSection';
import { TransferSection } from '@/components/ui/templates/patient-monitoring-dashboard/dashboard/TransferSection';

// Utilitários e hooks
import { calculateStats } from '@/utils/patient-monitoring-dashboard/calculateStats';
import { DashboardConfigProvider } from '../context/patient-monitoring-dashboard/DashboardConfigContext';
import { NotificationProvider } from '../context/patient-monitoring-dashboard/NotificationContext';
import { authService } from '@/services/auth/AuthService';
import { useNetworkData } from '@/services/hooks/network-hospital/useNetworkData';

interface PatientMonitoringDashboardProps {
  selectedHospitalId: string;
  setSelectedHospitalId: (hospitalId: string) => void;
  networkData: INetworkData;
  staffData: IStaffData | null;
  ambulanceData: IAmbulanceData | null;
}

export const PatientMonitoringDashboard: React.FC<PatientMonitoringDashboardProps> = ({
  selectedHospitalId,
  setSelectedHospitalId,
  networkData,
  staffData,
  ambulanceData,
}) => {
  // Estados para filtros e seleção
  const { currentUser } = useNetworkData()
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [advancedFilters, setAdvancedFilters] = useState<Record<string, any>>({});

  // Tipo de usuário e autenticação
  const [userType, setUserType] = useState<'admin' | 'doctor' | 'patient' | 'nurse' | 'attendant' | null>(null)
  const user = authService.getCurrentUser()

  useEffect(() => {
    // Determinar o tipo de usuário logado
    if (user) {
        if (authService.isDoctor()) {
            setUserType('doctor')
        } else if (authService.isNurse()) {
            setUserType('nurse')
        } else {
            setUserType('admin')
        }
    }
  }, [user])
  
  // Seleciona o hospital atual (se aplicável)
  const selectedHospital = networkData?.hospitals?.find(h => h.id === currentUser?.hospitalId)

  // Estados para configuração da visualização
  const [isRealTimeMode, setIsRealTimeMode] = useState<boolean>(true);
  const [refreshInterval, setRefreshInterval] = useState<number>(30);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'full' | 'compact'>('full');
  
  // Extrair as rotas ativas das ambulâncias
  const activeRoutes = useMemo(() => {
    if (!ambulanceData || !selectedHospitalId) return [];
    
    return ambulanceData.routes[selectedHospitalId]?.filter(
      route => route.status === 'in_progress' || route.status === 'planned'
    ) || [];
  }, [ambulanceData, selectedHospitalId]);
  
  // Funções auxiliares para acessar dados do paciente
  const getPatientCareHistory = (patientId: string): IPatientCareHistory | null => {
    if (!networkData) return null;
  
    for (const hospital of networkData.hospitals) {
      for (const department of hospital.departments) {
        for (const room of department.rooms) {
          for (const bed of room.beds) {
            if (bed.patient?.id === patientId && bed.patient.careHistory) {
              return bed.patient.careHistory;
            }
          }
        }
      }
    }
    return null;
  };

  const getPatientStatusHistory = (patientId: string): IStatusHistory[] | null => {
    const careHistory = getPatientCareHistory(patientId);
    if (!careHistory?.statusHistory) return null;
    return careHistory.statusHistory;
  };

  const getCurrentPatientStatus = (patientId: string): IStatusHistory | null => {
    const statusHistory = getPatientStatusHistory(patientId);
    if (!statusHistory?.length) return null;
    return statusHistory[statusHistory.length - 1];
  };

  // Efeito para atualização em tempo real
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isRealTimeMode) {
      intervalId = setInterval(() => {
        setIsRefreshing(true);
        
        // Simular um pequeno atraso para mostrar o indicador de atualização
        setTimeout(() => {
          setLastUpdated(new Date());
          setIsRefreshing(false);
        }, 800);
      }, refreshInterval * 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isRealTimeMode, refreshInterval]);

  // Memoizar a lista de hospitais
  const hospitals = useMemo(() => {
    return networkData?.hospitals || [];
  }, [networkData]);

  // Memoizar a lista de departamentos do hospital selecionado
  const departments = useMemo(() => {
    if (!selectedHospitalId || !networkData) return [];
    const hospital = networkData.hospitals.find(h => h.id === selectedHospitalId);
    return hospital?.departments || [];
  }, [selectedHospitalId, networkData]);

  // Memoizar o nome do hospital selecionado
  const selectedHospitalName = useMemo(() => {
    if (!selectedHospitalId || !networkData) return '';
    const hospital = networkData.hospitals.find(h => h.id === selectedHospitalId);
    return hospital?.name || '';
  }, [selectedHospitalId, networkData]);

  // Memoizar a lista de pacientes no departamento selecionado
  const patientsInDepartment = useMemo(() => {
    if (!selectedHospitalId || !networkData) return [];
    
    const hospital = networkData.hospitals.find(h => h.id === selectedHospitalId);
    if (!hospital) return [];
    
    const patients: {
      patient: IPatient;
      bed: IBed;
      department: string;
      lastStatus: IStatusHistory | null;
    }[] = [];
    
    hospital.departments.forEach(dept => {
      // Filtrar por departamento se necessário
      if (departmentFilter !== 'all' && dept.name !== departmentFilter) {
        return;
      }
      
      dept.rooms.forEach(room => {
        room.beds.forEach(bed => {
          if (bed.patient) {
            // Filtrar por termo de busca se existir
            if (searchTerm && !bed.patient.name.toLowerCase().includes(searchTerm.toLowerCase())) {
              return;
            }
            
            // Aplicar filtros avançados se existirem
            if (advancedFilters.departments?.length && !advancedFilters.departments.includes(dept.name)) {
              return;
            }
            
            const lastStatus = bed.patient.careHistory ? 
              bed.patient.careHistory.statusHistory[bed.patient.careHistory.statusHistory.length - 1] : 
              null;
              
            if (advancedFilters.status?.length && lastStatus && 
                !advancedFilters.status.includes(lastStatus.status)) {
              return;
            }
            
            patients.push({
              patient: bed.patient,
              bed: {
                ...bed,
                hospital: hospital.name,
                department: dept.name
              },
              department: dept.name,
              lastStatus
            });
          }
        });
      });
    });
    
    return patients;
  }, [selectedHospitalId, networkData, searchTerm, departmentFilter, advancedFilters]);

  // Memoizar os dados do paciente selecionado
  const selectedPatientData = useMemo(() => {
    if (!selectedPatientId || !networkData) return null;
    
    const patientInfo = patientsInDepartment.find(p => p.patient.id === selectedPatientId);
    if (!patientInfo) return null;
    
    const careHistory = getPatientCareHistory(selectedPatientId);
    const statusHistory = getPatientStatusHistory(selectedPatientId);
    const currentStatus = getCurrentPatientStatus(selectedPatientId);
    
    // Encontrar transferências relacionadas ao paciente
    const incomingTransfer = activeRoutes.find(
      route => route.patient?.id === selectedPatientId && 
      route.destination.hospitalId === selectedHospitalId
    );
    
    const outgoingTransfer = activeRoutes.find(
      route => route.patient?.id === selectedPatientId && 
      route.origin.hospitalId === selectedHospitalId
    );
    
    // Encontrar equipes responsáveis pelo paciente
    const assignedTeams = staffData?.staffTeams[selectedHospitalId]?.filter(team => 
      team.tasks.some(task => task.patientId === selectedPatientId)
    ) || [];
    
    return {
      patientInfo,
      careHistory,
      statusHistory,
      currentStatus,
      incomingTransfer,
      outgoingTransfer,
      assignedTeams
    };
  }, [
    selectedPatientId, 
    networkData, 
    patientsInDepartment, 
    getPatientCareHistory, 
    getPatientStatusHistory, 
    getCurrentPatientStatus,
    activeRoutes,
    selectedHospitalId,
    staffData
  ]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    return calculateStats(networkData, selectedHospitalId, activeRoutes);
  }, [networkData, selectedHospitalId, activeRoutes]);

  // Função para atualizar manualmente
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 800);
  };

  const dashboardConfig = {
    isRealTimeMode,
    setIsRealTimeMode,
    refreshInterval,
    setRefreshInterval,
    viewMode,
    setViewMode,
    isRefreshing,
    lastUpdated,
    handleRefresh
  };

  const getDespartmentByUserType = () => {
    switch (userType) {
        case 'doctor':
            return user?.specialization 
                ? `${user.specialization}`
                : 'Médico'
        case 'nurse':
            return user?.department 
                ? `${user?.department}`
                : 'Enfermagem'
        case 'admin':
          return selectedHospital 
              ? `${selectedHospital.name || 'Hospital'}`
              : 'Visão Geral da Rede'
    }
  }

  return (
    <DashboardConfigProvider value={dashboardConfig}>
      <NotificationProvider>
        <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md text-gray-800 dark:text-gray-100">
          <p className='text-2xl py-4 px-6'>Gerenciamento de Pacientes - {getDespartmentByUserType()}</p>
          <DashboardHeader 
            hospitals={hospitals}
            departments={departments}
            selectedHospitalId={selectedHospitalId}
            setSelectedHospitalId={setSelectedHospitalId}
            selectedHospitalName={selectedHospitalName}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            setAdvancedFilters={setAdvancedFilters}
            stats={stats}
          />

          <StatisticsCards stats={stats} ambulanceData={ambulanceData} selectedHospitalId={selectedHospitalId} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PatientListSection 
              patientsInDepartment={patientsInDepartment}
              selectedPatientId={selectedPatientId}
              setSelectedPatientId={setSelectedPatientId}
              departmentFilter={departmentFilter}
            />

            <PatientDetailsSection 
              selectedPatientData={selectedPatientData}
              hospitals={hospitals}
              selectedHospitalId={selectedHospitalId}
            />
          </div>

          <TransferSection 
            activeRoutes={activeRoutes}
            setSelectedPatientId={setSelectedPatientId}
          />
        </div>
      </NotificationProvider>
    </DashboardConfigProvider>
  );
};