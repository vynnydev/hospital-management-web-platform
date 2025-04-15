import { useState, useEffect, useCallback } from 'react';
import { IPatientAssignment, IUsePatientAssignment } from '@/types/patient-types';
import { assignmentService } from '@/services/general/digital-care-service/assignmentService';

export const usePatientAssignment = (): IUsePatientAssignment => {
  const [assignments, setAssignments] = useState<IPatientAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar todas as atribuições
  const loadAssignments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await assignmentService.getAllAssignments();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar atribuições');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [loadAssignments]);

  // Criar atribuição
  const createAssignment = async (
    assignmentData: Omit<IPatientAssignment, 'id' | 'assignmentDate'>
  ): Promise<IPatientAssignment> => {
    try {
      const newAssignment = await assignmentService.createAssignment(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      return newAssignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar atribuição');
      throw err;
    }
  };

  // Atualizar atribuição
  const updateAssignment = async (
    id: string, 
    assignmentData: Partial<IPatientAssignment>
  ): Promise<IPatientAssignment> => {
    try {
      const updatedAssignment = await assignmentService.updateAssignment(id, assignmentData);
      setAssignments(prev => prev.map(a => a.id === id ? updatedAssignment : a));
      return updatedAssignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar atribuição');
      throw err;
    }
  };

  // Buscar atribuições por paciente
  const getAssignmentsByPatient = useCallback((patientId: string): IPatientAssignment[] => {
    return assignments.filter(assignment => assignment.patientId === patientId);
  }, [assignments]);

  // Buscar atribuições por departamento
  const getAssignmentsByDepartment = useCallback((departmentId: string): IPatientAssignment[] => {
    return assignments.filter(assignment => assignment.departmentId === departmentId);
  }, [assignments]);

  // Buscar atribuições por médico
  const getAssignmentsByDoctor = useCallback((doctorId: string): IPatientAssignment[] => {
    return assignments.filter(assignment => assignment.assignedDoctor.id === doctorId);
  }, [assignments]);

  // Buscar atribuições por enfermeiro
  const getAssignmentsByNurse = useCallback((nurseId: string): IPatientAssignment[] => {
    return assignments.filter(assignment => 
      assignment.assignedNurse && assignment.assignedNurse.id === nurseId
    );
  }, [assignments]);

  // Cancelar atribuição
  const cancelAssignment = async (id: string, reason: string): Promise<IPatientAssignment> => {
    try {
      const cancelledAssignment = await assignmentService.cancelAssignment(id, reason);
      setAssignments(prev => prev.map(a => a.id === id ? cancelledAssignment : a));
      return cancelledAssignment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar atribuição');
      throw err;
    }
  };

  return {
    assignments,
    isLoading,
    error,
    createAssignment,
    updateAssignment,
    getAssignmentsByPatient,
    getAssignmentsByDepartment,
    getAssignmentsByDoctor,
    getAssignmentsByNurse,
    cancelAssignment
  };
};