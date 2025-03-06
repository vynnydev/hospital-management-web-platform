import { IPatientAssignment } from '@/types/patient-types';
import api from '@/services/api';

export const assignmentService = {
  async getAllAssignments(): Promise<IPatientAssignment[]> {
    const response = await api.get('/patient-assignments');
    return response.data;
  },

  async getAssignmentById(id: string): Promise<IPatientAssignment> {
    const response = await api.get(`/patient-assignments/${id}`);
    return response.data;
  },

  async getAssignmentsByPatient(patientId: string): Promise<IPatientAssignment[]> {
    const response = await api.get(`/patient-assignments?patientId=${patientId}`);
    return response.data;
  },

  async getAssignmentsByDepartment(departmentId: string): Promise<IPatientAssignment[]> {
    const response = await api.get(`/patient-assignments?departmentId=${departmentId}`);
    return response.data;
  },

  async getAssignmentsByDoctor(doctorId: string): Promise<IPatientAssignment[]> {
    const response = await api.get(`/patient-assignments?assignedDoctor.id=${doctorId}`);
    return response.data;
  },

  async getAssignmentsByNurse(nurseId: string): Promise<IPatientAssignment[]> {
    const response = await api.get(`/patient-assignments?assignedNurse.id=${nurseId}`);
    return response.data;
  },

  async createAssignment(assignment: Omit<IPatientAssignment, 'id' | 'assignmentDate'>): Promise<IPatientAssignment> {
    const newAssignment = {
      ...assignment,
      assignmentDate: new Date().toISOString()
    };
    
    const response = await api.post('/patient-assignments', newAssignment);
    return response.data;
  },

  async updateAssignment(id: string, assignment: Partial<IPatientAssignment>): Promise<IPatientAssignment> {
    const response = await api.patch(`/patient-assignments/${id}`, assignment);
    return response.data;
  },

  async cancelAssignment(id: string, reason: string): Promise<IPatientAssignment> {
    const response = await api.patch(`/patient-assignments/${id}`, {
      status: 'Cancelled',
      notes: reason
    });
    return response.data;
  }
};