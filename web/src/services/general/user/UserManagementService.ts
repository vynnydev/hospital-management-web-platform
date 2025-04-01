// services/users/UserManagementService.ts

import { IAppUser, ICreateUserData, TPermission, TRole } from '@/types/auth-types';
import { authService } from '@/services/auth/AuthService';
import { IUserFilter, IUserResponse } from '@/types/user-types';

class UserManagementService {
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
   * Lista usuários com suporte à paginação e filtros
   */
  async listUsers(filters: IUserFilter = {}): Promise<IUserResponse> {
    // Construir a URL com parâmetros de consulta
    const queryParams = new URLSearchParams();
    
    if (filters.page) queryParams.append('_page', filters.page.toString());
    if (filters.limit) queryParams.append('_limit', filters.limit.toString());
    
    // Adiciona filtro de função/role
    if (filters.role) {
      if (Array.isArray(filters.role)) {
        filters.role.forEach(role => queryParams.append('role', role));
      } else {
        queryParams.append('role', filters.role);
      }
    }
    
    // Adiciona filtro de hospital
    if (filters.hospitalId) {
      queryParams.append('hospitalId', filters.hospitalId);
    }
    
    // Adiciona busca
    if (filters.search) {
      queryParams.append('q', filters.search);
    }
    
    // Executa a requisição
    const url = `${this.baseUrl}/users?${queryParams.toString()}`;
    const response = await fetch(url, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar usuários');
    }
    
    // Obtém o total de registros do cabeçalho
    const totalCount = parseInt(response.headers.get('X-Total-Count') || '0', 10);
    const users = await response.json();
    
    // Calcula totais para paginação
    const page = filters.page || 1;
    const limit = filters.limit || users.length;
    const totalPages = Math.ceil(totalCount / limit);
    
    return {
      users,
      total: totalCount,
      page,
      limit,
      totalPages
    };
  }

  /**
   * Cria um novo usuário
   */
  async createUser(userData: ICreateUserData): Promise<IAppUser> {
    // Gerar ID único
    const id = this.generateUserId(userData.role || 'administrador');
    
    // Dados completos do usuário
    const newUser: IAppUser = {
      id,
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'administrador',
      permissions: userData.permissions || [],
      profileImage: '',
      // Campos específicos por função
      ...(userData.hospitalId && { hospitalId: userData.hospitalId }),
      ...(userData.specialization && { specialization: userData.specialization }),
      ...(userData.medicalLicense && { medicalLicense: userData.medicalLicense }),
      ...(userData.nursingLicense && { nursingLicense: userData.nursingLicense }),
      ...(userData.department && { department: userData.department }),
      ...(userData.shift && { shift: userData.shift }),
      ...(userData.patientId && { patientId: userData.patientId }),
      ...(userData.healthInsurance && { healthInsurance: userData.healthInsurance }),
      ...(userData.dateOfBirth && { dateOfBirth: userData.dateOfBirth })
    };
    
    // Enviar para a API
    const response = await fetch(`${this.baseUrl}/users`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(newUser)
    });
    
    if (!response.ok) {
      throw new Error('Falha ao criar usuário');
    }
    
    return response.json();
  }

  /**
   * Atualiza um usuário existente
   */
  async updateUser(userId: string, userData: Partial<IAppUser>): Promise<IAppUser> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify(userData)
    });
    
    if (!response.ok) {
      throw new Error('Falha ao atualizar usuário');
    }
    
    return response.json();
  }

  /**
   * Exclui um usuário
   */
  async deleteUser(userId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Falha ao excluir usuário');
    }
  }

  /**
   * Busca um usuário pelo ID
   */
  async getUserById(userId: string): Promise<IAppUser | null> {
    const response = await fetch(`${this.baseUrl}/users/${userId}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Falha ao buscar usuário');
    }
    
    return response.json();
  }

  /**
   * Gera um ID baseado no tipo de usuário
   */
  private generateUserId(role: TRole): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    
    switch (role) {
      case 'médico':
        return `DR${timestamp.substring(0, 4)}${random.substring(0, 3)}`;
      case 'paciente':
        return `PAT${timestamp.substring(0, 4)}${random.substring(0, 3)}`;
      case 'enfermeiro':
        return `ENF${timestamp.substring(0, 4)}${random.substring(0, 3)}`;
      case 'atendente':
        return `ATD${timestamp.substring(0, 4)}${random.substring(0, 3)}`;
      case 'administrador':
        return `USR${timestamp.substring(0, 4)}${random.substring(0, 3)}`;
      default:
        return `USR${timestamp.substring(0, 4)}${random.substring(0, 3)}`;
    }
  }

  /**
   * Obtém permissões padrão baseadas na função do usuário
   */
  getDefaultPermissions(role: TRole): TPermission[] {
    switch (role) {
      case 'médico':
        return [
          'DOCTOR_ACCESS',
          'PRESCRIBE_MEDICATION',
          'VIEW_PATIENT_RECORDS',
          'USE_AI_DIAGNOSIS'
        ];
      case 'paciente':
        return [
          'PATIENT_ACCESS',
          'SCHEDULE_APPOINTMENTS',
          'VIEW_OWN_RECORDS',
          'REQUEST_TELEMEDICINE'
        ];
      case 'enfermeiro':
        return [
          'NURSE_ACCESS',
          'ADMINISTER_MEDICATION',
          'RECORD_VITALS',
          'VIEW_PATIENT_RECORDS_NURSE'
        ];
      case 'atendente':
        return [
          'ATTENDANT_ACCESS',
          'SCHEDULE_MANAGEMENT',
          'PATIENT_REGISTRATION',
          'VIEW_BASIC_PATIENT_INFO',
          'MANAGE_APPOINTMENTS'
        ];
      case 'administrador':
        return ['VIEW_ALL_HOSPITALS'];
      default:
        return [];
    }
  }

  /**
   * Obtém todas as permissões disponíveis agrupadas por categorias
   */
  getAllPermissionsByCategory(): Record<string, TPermission[]> {
    return {
      'Administração': [
        'VIEW_ALL_HOSPITALS',
        'VIEW_SINGLE_HOSPITAL'
      ],
      'Médicos': [
        'DOCTOR_ACCESS',
        'PRESCRIBE_MEDICATION',
        'VIEW_PATIENT_RECORDS',
        'USE_AI_DIAGNOSIS',
        'APPROVE_AI_PRESCRIPTIONS'
      ],
      'Pacientes': [
        'PATIENT_ACCESS',
        'SCHEDULE_APPOINTMENTS',
        'VIEW_OWN_RECORDS',
        'REQUEST_TELEMEDICINE'
      ],
      'Enfermagem': [
        'NURSE_ACCESS',
        'ADMINISTER_MEDICATION',
        'RECORD_VITALS',
        'MANAGE_BEDS',
        'VIEW_PATIENT_RECORDS_NURSE',
        'ASSIGN_TASKS'
      ],
      'Atendimento': [
        'ATTENDANT_ACCESS',
        'SCHEDULE_MANAGEMENT',
        'PATIENT_REGISTRATION',
        'VIEW_BASIC_PATIENT_INFO',
        'MANAGE_APPOINTMENTS',
        'VIEW_DOCTOR_SCHEDULE',
        'GENERATE_REPORTS'
      ]
    };
  }

  /**
   * Obtém a lista de hospitais disponíveis
   */
  async getHospitals(): Promise<{ id: string, name: string }[]> {
    const response = await fetch(`${this.baseUrl}/hospitals-informations`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Falha ao buscar hospitais');
    }
    
    return response.json();
  }
}

export const userManagementService = new UserManagementService();