import { IPatientRegistration, IPatientAdmission } from '@/types/patient-types';
import api from '@/services/api';

export const patientService = {
  // Pacientes
  async getAllPatients(): Promise<IPatientRegistration[]> {
    const response = await api.get('/patients');
    return response.data;
  },

  async getPatientById(id: string): Promise<IPatientRegistration> {
    const response = await api.get(`/patients/${id}`);
    return response.data;
  },

  async createPatient(patient: Omit<IPatientRegistration, 'id' | 'registrationDate' | 'lastUpdate'>): Promise<IPatientRegistration> {
    const newPatient = {
      ...patient,
      registrationDate: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    };
    
    const response = await api.post('/patients', newPatient);
    return response.data;
  },

  async updatePatient(id: string, patient: Partial<IPatientRegistration>): Promise<IPatientRegistration> {
    const updatedPatient = {
      ...patient,
      lastUpdate: new Date().toISOString()
    };
    
    const response = await api.patch(`/patients/${id}`, updatedPatient);
    return response.data;
  },

  async deletePatient(id: string): Promise<void> {
    await api.delete(`/patients/${id}`);
  },

  async searchPatients(query: string): Promise<IPatientRegistration[]> {
    const response = await api.get(`/patients?q=${query}`);
    return response.data;
  },

  // Admissões
  async getAllAdmissions(): Promise<IPatientAdmission[]> {
    const response = await api.get('/admissions');
    return response.data;
  },

  async getAdmissionById(id: string): Promise<IPatientAdmission> {
    const response = await api.get(`/admissions/${id}`);
    return response.data;
  },

  async getPatientAdmissions(patientId: string): Promise<IPatientAdmission[]> {
    const response = await api.get(`/admissions?patientId=${patientId}`);
    return response.data;
  },

  async createAdmission(admission: Omit<IPatientAdmission, 'id' | 'statusHistory'>): Promise<IPatientAdmission> {
    const newAdmission = {
      ...admission,
      statusHistory: [
        {
          status: admission.status,
          timestamp: new Date().toISOString(),
          updatedBy: admission.responsibleStaff
        }
      ]
    };
    
    const response = await api.post('/admissions', newAdmission);
    return response.data;
  },

  async updateAdmission(id: string, admission: Partial<IPatientAdmission>): Promise<IPatientAdmission> {
    const response = await api.patch(`/admissions/${id}`, admission);
    return response.data;
  },

  async updateAdmissionStatus(
    id: string, 
    status: IPatientAdmission['status'], 
    updatedBy: IPatientAdmission['responsibleStaff']
  ): Promise<IPatientAdmission> {
    // Primeiro, buscamos a admissão atual
    const currentAdmission = await this.getAdmissionById(id);
    
    // Atualizamos o status e o histórico de status
    const updatedAdmission = {
      ...currentAdmission,
      status,
      statusHistory: [
        ...currentAdmission.statusHistory,
        {
          status,
          timestamp: new Date().toISOString(),
          updatedBy
        }
      ]
    };
    
    // Salvamos a admissão atualizada
    const response = await api.put(`/admissions/${id}`, updatedAdmission);
    return response.data;
  }
};