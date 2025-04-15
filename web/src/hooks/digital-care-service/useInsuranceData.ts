import { useState, useEffect, useCallback } from 'react';
import { IInsurance, IUseInsuranceData } from '@/types/patient-types';
import { insuranceService } from '@/services/general/digital-care-service/insuranceService';

export const useInsuranceData = (): IUseInsuranceData => {
  const [insurances, setInsurances] = useState<IInsurance[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar todos os convênios
  const loadInsurances = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await insuranceService.getAllInsurances();
      setInsurances(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar convênios');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInsurances();
  }, [loadInsurances]);

  // Buscar convênio por ID
  const getInsuranceById = useCallback((id: string): IInsurance | undefined => {
    return insurances.find(insurance => insurance.id === id);
  }, [insurances]);

  // Buscar convênios por nome
  const getInsurancesByName = useCallback((name: string): IInsurance[] => {
    if (!name.trim()) return insurances;
    
    const lowerName = name.toLowerCase();
    return insurances.filter(insurance => 
      insurance.name.toLowerCase().includes(lowerName)
    );
  }, [insurances]);

  // Validar convênio para um paciente
  const validateInsurance = async (insuranceId: string, patientCPF: string): Promise<boolean> => {
    try {
      return await insuranceService.validateInsurance(insuranceId, patientCPF);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar convênio');
      return false;
    }
  };

  return {
    insurances,
    isLoading,
    error,
    getInsuranceById,
    getInsurancesByName,
    validateInsurance
  };
};