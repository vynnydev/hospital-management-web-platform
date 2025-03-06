import { IInsurance } from '@/types/patient-types';
import api from '@/services/api';

export const insuranceService = {
  async getAllInsurances(): Promise<IInsurance[]> {
    const response = await api.get('/insurances');
    return response.data;
  },

  async getInsuranceById(id: string): Promise<IInsurance> {
    const response = await api.get(`/insurances/${id}`);
    return response.data;
  },

  async getInsurancesByName(name: string): Promise<IInsurance[]> {
    const response = await api.get(`/insurances?name=${name}`);
    return response.data;
  },

  async validateInsurance(insuranceId: string, patientCPF: string): Promise<boolean> {
    try {
      const response = await api.post('/insurances/validate', {
        insuranceId,
        patientCPF
      });
      return response.data.valid;
    } catch (error) {
      console.error('Erro ao validar convênio:', error);
      return false;
    }
  }
};