/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback } from 'react';
import { 
  IPatientRegistration, 
  IPatientAdmission, 
  TPatientStatus,
  IUsePatientManagement
} from '@/types/patient-types';
import { patientService } from '@/services/general/digital-care-service/patientService';

export const usePatientManagement = (): IUsePatientManagement => {
  const [patients, setPatients] = useState<IPatientRegistration[]>([]);
  const [admissions, setAdmissions] = useState<IPatientAdmission[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os pacientes e admissões
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [patientsData, admissionsData] = await Promise.all([
        patientService.getAllPatients(),
        patientService.getAllAdmissions()
      ]);
      setPatients(patientsData);
      setAdmissions(admissionsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Adicionar paciente
  const addPatient = async (patientData: Omit<IPatientRegistration, 'id' | 'registrationDate' | 'lastUpdate'>): Promise<IPatientRegistration> => {
    try {
      const newPatient = await patientService.createPatient(patientData);
      setPatients(prev => [...prev, newPatient]);
      return newPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao adicionar paciente');
      throw err;
    }
  };

  // Atualizar paciente
  const updatePatient = async (id: string, patientData: Partial<IPatientRegistration>): Promise<IPatientRegistration> => {
    try {
      const updatedPatient = await patientService.updatePatient(id, patientData);
      setPatients(prev => prev.map(p => p.id === id ? updatedPatient : p));
      return updatedPatient;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar paciente');
      throw err;
    }
  };

  // Buscar paciente por ID
  const getPatientById = useCallback((id: string): IPatientRegistration | undefined => {
    return patients.find(patient => patient.id === id);
  }, [patients]);

  // Buscar admissões de um paciente
  const getPatientAdmissions = useCallback((patientId: string): IPatientAdmission[] => {
    return admissions.filter(admission => admission.patientId === patientId);
  }, [admissions]);

  // Criar admissão
  const createAdmission = async (admissionData: Omit<IPatientAdmission, 'id' | 'statusHistory'>): Promise<IPatientAdmission> => {
    try {
      const newAdmission = await patientService.createAdmission(admissionData);
      setAdmissions(prev => [...prev, newAdmission]);
      return newAdmission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar admissão');
      throw err;
    }
  };

  // Atualizar admissão
  const updateAdmission = async (id: string, admissionData: Partial<IPatientAdmission>): Promise<IPatientAdmission> => {
    try {
      const updatedAdmission = await patientService.updateAdmission(id, admissionData);
      setAdmissions(prev => prev.map(a => a.id === id ? updatedAdmission : a));
      return updatedAdmission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar admissão');
      throw err;
    }
  };

  // Atualizar status da admissão
  const updateAdmissionStatus = async (
    id: string, 
    status: TPatientStatus, 
    updatedBy: { id: string; name: string; role: string }
  ): Promise<IPatientAdmission> => {
    try {
      const updatedAdmission = await patientService.updateAdmissionStatus(id, status, updatedBy);
      setAdmissions(prev => prev.map(a => a.id === id ? updatedAdmission : a));
      return updatedAdmission;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar status da admissão');
      throw err;
    }
  };

  // Buscar pacientes por termo de pesquisa
  const searchPatients = useCallback((query: string): IPatientRegistration[] => {
    if (!query.trim()) return patients;
    
    const lowerQuery = query.toLowerCase();
    return patients.filter(patient => 
      patient.personalInfo.name.toLowerCase().includes(lowerQuery) ||
      patient.personalInfo.cpf.includes(lowerQuery) ||
      (patient.personalInfo.rg && patient.personalInfo.rg.includes(lowerQuery))
    );
  }, [patients]);

  // Filtrar pacientes por critérios
  const filterPatients = useCallback((filters: Record<string, any>): IPatientRegistration[] => {
    return patients.filter(patient => {
      // Implementar os critérios de filtro conforme necessário
      let passesFilter = true;
      
      if (filters.gender && patient.personalInfo.gender !== filters.gender) {
        passesFilter = false;
      }
      
      if (filters.bloodType && patient.personalInfo.bloodType !== filters.bloodType) {
        passesFilter = false;
      }
      
      if (filters.insuranceType && patient.insuranceInfo.type !== filters.insuranceType) {
        passesFilter = false;
      }
      
      // Adicione mais critérios conforme necessário
      
      return passesFilter;
    });
  }, [patients]);

  return {
    patients,
    admissions,
    isLoading,
    error,
    addPatient,
    updatePatient,
    getPatientById,
    getPatientAdmissions,
    createAdmission,
    updateAdmission,
    updateAdmissionStatus,
    searchPatients,
    filterPatients
  };
};