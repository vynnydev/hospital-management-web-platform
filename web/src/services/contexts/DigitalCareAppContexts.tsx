/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { IAppUser } from '@/types/auth-types';
import { IBed, ICareEvent, IHospital, INetworkData, IPatientCareHistory, IStatusHistory } from '@/types/hospital-network-types';

import { useNetworkData } from '../hooks/network-hospital/useNetworkData';
import { usePermissions } from '../hooks/auth/usePermissions';

// Interface para pacientes que incluem informações adicionais
interface IPatient {
  id: string;
  name: string;
  admissionDate: string;
  diagnosis: string;
  expectedDischarge: string;
  age?: number;
  gender?: string;
  bloodType?: string;
  photo?: string;
  contactInfo?: {
    phone: string;
    emergency: string;
    address: string;
  };
  careHistory?: IPatientCareHistory;
  department?: string;
  bedId?: string;
  roomNumber?: string;
  floor?: string;
}

interface DigitalCareAppContextData {
  // Dados do hook useNetworkData
  networkData: INetworkData | null;
  currentUser: IAppUser | null;
  loading: boolean;
  error: string | null;
  
  // Hospital selecionado
  selectedHospital: IHospital | null;
  setSelectedHospital: (hospital: IHospital | null) => void;
  
  // Funções para histórico do paciente
  getPatientCareHistory: (patientId: string) => IPatientCareHistory | null;
  getPatientStatusHistory: (patientId: string) => IStatusHistory[] | null;
  getCurrentPatientStatus: (patientId: string) => IStatusHistory | null;
  
  // Permissões
  permissions: {
    isAdmin: boolean;
    isHospitalManager: boolean;
    canAccessHospital: (hospitalId: string) => boolean;
    hasAnyPermission: (permissions: string[]) => boolean;
  };
  
  // Funções de busca e filtros
  searchPatientsByTerm: (term: string) => IPatient[];
  getStaffById: (staffId: string) => { id: string; name: string; role: string } | null;
  getAvailableBeds: (departmentName?: string) => IBed[];
  getDepartmentMetrics: (departmentName: string) => any | null;
  registerCareEvent: (patientId: string, event: Omit<ICareEvent, 'id'>) => Promise<boolean>;
  updatePatientStatus: (
    patientId: string, 
    status: string, 
    department: string, 
    updatedBy: { id: string; name: string; role: string }
  ) => Promise<boolean>;
}

const DigitalCareAppContext = createContext<DigitalCareAppContextData>({
  networkData: null,
  currentUser: null,
  loading: false,
  error: null,
  selectedHospital: null,
  setSelectedHospital: () => {},
  getPatientCareHistory: () => null,
  getPatientStatusHistory: () => null,
  getCurrentPatientStatus: () => null,
  permissions: {
    isAdmin: false,
    isHospitalManager: false,
    canAccessHospital: () => false,
    hasAnyPermission: () => false
  },
  searchPatientsByTerm: () => [],
  getStaffById: () => null,
  getAvailableBeds: () => [],
  getDepartmentMetrics: () => null,
  registerCareEvent: async () => false,
  updatePatientStatus: async () => false
});

export const useDigitalCareAppContext = () => useContext(DigitalCareAppContext);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const { 
    networkData, 
    currentUser, 
    loading, 
    error,
    getPatientCareHistory,
    getPatientStatusHistory,
    getCurrentPatientStatus
  } = useNetworkData();
  
  const { 
    isAdmin, 
    isHospitalManager, 
    canAccessHospital,
    hasAnyPermission 
  } = usePermissions();
  
  const [selectedHospital, setSelectedHospital] = useState<IHospital | null>(null);

  // Quando os dados da rede são carregados, selecione o primeiro hospital por padrão
  useEffect(() => {
    if (networkData?.hospitals?.length && !selectedHospital) {
      setSelectedHospital(networkData.hospitals[0]);
    }
  }, [networkData, selectedHospital]);

  // Função para buscar pacientes por termo
  const searchPatientsByTerm = (term: string): IPatient[] => {
    if (!selectedHospital || !term.trim()) return [];
    
    const lowercasedTerm = term.toLowerCase().trim();
    const patients: IPatient[] = [];
    
    // Percorrer todos os departamentos, quartos e camas para encontrar pacientes
    selectedHospital.departments.forEach(dept => {
      dept.rooms.forEach(room => {
        room.beds.forEach(bed => {
          if (bed.patient) {
            const patient = {
              ...bed.patient,
              department: dept.name,
              bedId: bed.id,
              roomNumber: room.roomNumber,
              floor: bed.floor
            };
            
            // Verificar se o paciente corresponde ao termo de busca
            if (
              patient.name.toLowerCase().includes(lowercasedTerm) ||
              patient.id.toLowerCase().includes(lowercasedTerm) ||
              patient.diagnosis.toLowerCase().includes(lowercasedTerm) ||
              (patient.careHistory?.primaryDiagnosis || '').toLowerCase().includes(lowercasedTerm)
            ) {
              patients.push(patient);
            }
          }
        });
      });
    });
    
    return patients;
  };
  
  // Função para obter informações de um profissional pelo ID
  const getStaffById = (staffId: string) => {
    if (!selectedHospital) return null;
    
    // Verificar entre os médicos
    const doctor = selectedHospital.staff?.doctors.find(d => d.id === staffId);
    if (doctor) {
      return {
        id: doctor.id,
        name: doctor.name,
        role: doctor.specialty
      };
    }
    
    // Verificar entre os enfermeiros
    const nurse = selectedHospital.staff?.nurses.find(n => n.id === staffId);
    if (nurse) {
      return {
        id: nurse.id,
        name: nurse.name,
        role: 'Enfermeiro'
      };
    }
    
    return null;
  };
  
  // Função para obter camas disponíveis
  const getAvailableBeds = (departmentName?: string): IBed[] => {
    if (!selectedHospital) return [];
    
    const availableBeds: IBed[] = [];
    
    selectedHospital.departments.forEach(dept => {
      // Se um departamento específico foi solicitado, ignore os outros
      if (departmentName && dept.name !== departmentName) return;
      
      dept.rooms.forEach(room => {
        room.beds.forEach(bed => {
          if (bed.status === 'available') {
            availableBeds.push({
              ...bed,
              hospital: selectedHospital.name,
              department: dept.name
            });
          }
        });
      });
    });
    
    return availableBeds;
  };
  
  // Função para obter métricas de um departamento
  const getDepartmentMetrics = (departmentName: string) => {
    if (!selectedHospital) return null;
    
    const departmentKey = departmentName.toLowerCase();
    return selectedHospital.metrics.departmental[departmentKey] || null;
  };
  
  // Função para registrar um evento de atendimento
  const registerCareEvent = async (patientId: string, event: Omit<ICareEvent, 'id'>): Promise<boolean> => {
    try {
      // Em um ambiente real, aqui seria feita uma chamada à API
      console.log('Registrando evento para o paciente', patientId, event);
      
      // Simular o processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Erro ao registrar evento:', error);
      return false;
    }
  };
  
  // Função para atualizar o status de um paciente
  const updatePatientStatus = async (
    patientId: string,
    status: string,
    department: string,
    updatedBy: { id: string; name: string; role: string }
  ): Promise<boolean> => {
    try {
      // Em um ambiente real, aqui seria feita uma chamada à API
      console.log('Atualizando status do paciente', patientId, status, department, updatedBy);
      
      // Simular o processamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      return false;
    }
  };

  const value = {
    networkData,
    currentUser,
    loading,
    error,
    selectedHospital,
    setSelectedHospital,
    getPatientCareHistory,
    getPatientStatusHistory,
    getCurrentPatientStatus,
    permissions: {
      isAdmin,
      isHospitalManager,
      canAccessHospital,
      hasAnyPermission
    },
    searchPatientsByTerm,
    getStaffById,
    getAvailableBeds,
    getDepartmentMetrics,
    registerCareEvent,
    updatePatientStatus
  };

  return (
    <DigitalCareAppContext.Provider value={value}>
      {children}
    </DigitalCareAppContext.Provider>
  );
};