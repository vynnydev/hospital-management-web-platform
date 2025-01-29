/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { PatientTaskManagement } from './PatientTaskManagement';
import { DepartmentAreaCards } from './DepartmentAreaCards';
import { useNetworkData } from '@/services/hooks/useNetworkData';
import { HospitalNetworkComponent } from './HospitalNetworkComponent';
import { initialMetrics, type IHospitalMetrics } from '../types/types';
import { IPatient } from '@/types/hospital-network-types';

export const MainPatientManagementComponent: React.FC = () => {
  const { networkData, currentUser, loading, error: networkError } = useNetworkData();
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [fontSize, setFontSize] = useState<'small' | 'normal' | 'large' | 'extra-large'>('normal');
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<IPatient | null>(null);

  const [selectedDepartment, setSelectedDepartment] = useState<string>('');

  const [metrics, setMetrics] = useState<IHospitalMetrics>(initialMetrics);

  // Função auxiliar para validar e converter métricas
  const convertHospitalMetrics = (metrics: any): IHospitalMetrics => {
    // Garante que a estrutura básica existe
    const safeMetrics = {
      ...initialMetrics,
      ...metrics,
      departmental: {
        ...initialMetrics.departmental
      }
    };

    // Converte e valida os dados departamentais
    if (metrics?.departmental) {
      Object.keys(metrics.departmental).forEach(key => {
        const deptMetrics = metrics.departmental[key];
        safeMetrics.departmental[key] = {
          occupancy: Number(deptMetrics.occupancy) || 0,
          beds: Number(deptMetrics.beds) || 0,
          patients: Number(deptMetrics.patients) || 0,
          validStatuses: Array.isArray(deptMetrics.validStatuses) 
            ? deptMetrics.validStatuses 
            : []
        };
      });
    }

    return safeMetrics;
  };

  // Atualiza as métricas quando o hospital muda
  useEffect(() => {
    if (selectedHospital && networkData) {
      const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
      if (hospital?.metrics) {
        // Converte e valida as métricas antes de atualizar o estado
        const validatedMetrics = convertHospitalMetrics(hospital.metrics);
        setMetrics(validatedMetrics);
      }
    }
  }, [selectedHospital, networkData]);

  // Log dos estados importantes
  useEffect(() => {
    console.log('🔄 Dados da rede atualizados:', {
      hospitais: networkData?.hospitals?.length || 0,
      usuário: currentUser?.id,
      loading,
      erro: networkError
    });
  }, [networkData, currentUser, loading, networkError]);

  useEffect(() => {
    if (selectedHospital) {
      const hospital = networkData?.hospitals.find(h => h.id === selectedHospital);
      console.log('🏥 Hospital selecionado:', {
        id: selectedHospital,
        nome: hospital?.name,
        departamentos: hospital?.departments.map(d => d.name),
        totalLeitos: hospital?.departments.reduce((acc, dept) => acc + dept.beds.length, 0)
      });
    }
  }, [selectedHospital, networkData]);

  useEffect(() => {
    if (selectedArea) {
      const hospital = networkData?.hospitals.find(h => h.id === selectedHospital);
      const departamento = hospital?.departments.find(d => d.name.toLowerCase() === selectedArea.toLowerCase());
      console.log('🏥 Departamento selecionado:', {
        nome: selectedArea,
        totalLeitos: departamento?.beds.length,
        pacientesInternados: departamento?.beds.filter(b => b.status === 'occupied').length,
        leitosDisponíveis: departamento?.beds.filter(b => b.status === 'available').length
      });
    }
  }, [selectedArea, selectedHospital, networkData]);

  useEffect(() => {
    console.log('👤 Paciente selecionado:', selectedPatient ? {
      id: selectedPatient.id,
      nome: selectedPatient.name,
      dataAdmissao: selectedPatient.admissionDate,
      diagnóstico: selectedPatient.diagnosis
    } : 'Nenhum paciente selecionado');
  }, [selectedPatient]);

  const getFilteredPatients = () => {
    if (!selectedHospital || !networkData) return [];
    
    const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
    if (!hospital) return [];

    // Filtra pacientes pelo departamento selecionado
    return hospital.departments
      .filter(dept => !selectedDepartment || dept.name.toLowerCase() === selectedDepartment.toLowerCase())
      .flatMap(dept => 
        dept.beds
          .filter(bed => bed.patient)
          .map(bed => {
            const patient = bed.patient!;
            return {
              ...patient,
              department: dept.name,
              bedNumber: bed.number,
              specialty: bed.specialty
            };
          })
      );
  };

  const handleDepartmentSelect = (department: string) => {
    console.log('Departamento selecionado:', department);
    setSelectedDepartment(department.toLowerCase());
    setSelectedArea(department); // Mantém consistência com o estado existente
  };

  const handlePatientSelect = (patient: IPatient) => {
    if (!patient) return null
    console.log('👤 Selecionando paciente:', patient);
    setSelectedPatient(patient);
    setIsOpen(true);
  };

  const handleClose = () => {
    console.log('🚪 Fechando modal');
    setIsOpen(false);
    setSelectedPatient(null);
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

  // Obtém os departamentos do hospital selecionado
  const getDepartments = (): Record<string, string[]> => {
    if (!selectedHospital || !networkData) return {};
    
    const hospital = networkData.hospitals.find(h => h.id === selectedHospital);
    if (!hospital) return {};

    return hospital.departments.reduce((acc, dept) => {
      acc[dept.name.toLowerCase()] = ['occupied', 'available', 'maintenance'];
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
        error={networkError}
      />

      {selectedHospital && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="col-span-2">
              <PatientTaskManagement
                data={metrics}
                patients={getFilteredPatients()}
                selectedArea={selectedArea}
                onSelectPatient={handlePatientSelect}
                departments={getDepartments()}
                onClose={handleClose}
                fontSize={fontSize}
                setFontSize={setFontSize}
                loading={loading}
                error={error}
                onRetry={handleRetry}
              />
            </div>
          </div>
        </>
      )}

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