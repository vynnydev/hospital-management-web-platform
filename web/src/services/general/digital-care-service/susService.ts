/* eslint-disable @typescript-eslint/no-explicit-any */
import api from '@/services/api';

export const susService = {
  async validateSUSCard(cardNumber: string): Promise<boolean> {
    try {
      const response = await api.post(`/sus/validate`, { cardNumber });
      return response.data.valid;
    } catch (error) {
      console.error('Erro ao validar cartão SUS:', error);
      return false;
    }
  },

  async getSUSPatientInfo(cardNumber: string): Promise<any> {
    try {
      const response = await api.get(`/sus/patients/${cardNumber}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar informações do paciente no SUS:', error);
      return null;
    }
  }
};