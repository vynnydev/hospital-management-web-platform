/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useCallback } from 'react';
import { IUseSUSIntegration } from '@/types/patient-types';
import { susService } from '@/services/general/digital-care-service/susService';

export const useSUSIntegration = (): IUseSUSIntegration => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Validar cartão SUS
  const validateSUSCard = async (cardNumber: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      return await susService.validateSUSCard(cardNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao validar cartão SUS');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Buscar informações do paciente no SUS
  const getSUSPatientInfo = async (cardNumber: string) => {
    try {
      setIsLoading(true);
      setError(null);
      return await susService.getSUSPatientInfo(cardNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar informações do paciente no SUS');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    validateSUSCard,
    getSUSPatientInfo
  };
};