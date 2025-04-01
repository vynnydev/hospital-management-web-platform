// services/hospitals/HospitalsService.ts

import { authService } from '@/services/auth/AuthService';

/**
 * Interface para hospital
 */
export interface IHospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  email?: string;
  type: 'geral' | 'especializado' | 'universitário' | 'clínica';
  specialty?: string; // Para hospitais especializados
  beds: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

class HospitalsService {
  private baseUrl = 'http://localhost:3001';

  /**
   * Obtém cabeçalhos de autenticação para requisições
   */
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    const token = authService.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }

  /**
   * Lista todos os hospitais disponíveis
   */
  async listHospitals(): Promise<IHospital[]> {
    const response = await fetch(`${this.baseUrl}/hospitals-informations`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar hospitais');
    }
    
    return response.json();
  }

  /**
   * Obtém um hospital pelo ID
   */
  async getHospitalById(hospitalId: string): Promise<IHospital | null> {
    const response = await fetch(`${this.baseUrl}/hospitals-informations/${hospitalId}`, {
      headers: this.getHeaders()
    });
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error('Falha ao buscar hospital');
    }
    
    return response.json();
  }

  /**
   * Lista hospitais em formato simplificado para seleção em formulários
   */
  async getHospitalsForSelect(): Promise<{ value: string; label: string }[]> {
    const hospitals = await this.listHospitals();
    
    return hospitals
      .filter(hospital => hospital.active)
      .map(hospital => ({
        value: hospital.id,
        label: hospital.name
      }));
  }

  /**
   * Lista apenas os hospitais aos quais o usuário atual tem acesso
   */
  async getAccessibleHospitals(): Promise<IHospital[]> {
    const user = authService.getCurrentUser();
    const hospitals = await this.listHospitals();
    
    if (!user) return [];
    
    // Administradores com permissão VIEW_ALL_HOSPITALS podem ver todos
    if (user.permissions.includes('VIEW_ALL_HOSPITALS')) {
      return hospitals;
    }
    
    // Usuários com permissão VIEW_SINGLE_HOSPITAL podem ver apenas o seu hospital
    if (user.permissions.includes('VIEW_SINGLE_HOSPITAL') && user.hospitalId) {
      return hospitals.filter(hospital => hospital.id === user.hospitalId);
    }
    
    // Usuários sem hospitalId específico mas com outras funções
    if (['médico', 'enfermeiro', 'atendente'].includes(user.role) && user.hospitalId) {
      return hospitals.filter(hospital => hospital.id === user.hospitalId);
    }
    
    return [];
  }
}

export const hospitalsService = new HospitalsService();