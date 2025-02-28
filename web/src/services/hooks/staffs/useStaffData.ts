/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from 'react';
import axios from 'axios';
import type { 
  IStaffData, 
  IStaffTeam, 
  IStaffTask, 
  TShiftPeriod,
  IHospitalStaffMetrics,
  IDepartmentalStaffMetrics
} from '@/types/staff-types';
import { usePermissions } from '../auth/usePermissions';
import { authService } from '../../auth/AuthService';
import type { IAppUser } from '@/types/auth-types';
import api from '../../api';

export const useStaffData = (selectedHospitalId?: string) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [staffData, setStaffData] = useState<IStaffData | null>(null);
  const [currentUser, setCurrentUser] = useState<IAppUser | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState<TShiftPeriod>('Manhã');

  const { permissions, loading: permissionsLoading } = usePermissions();

  const filterTeamsByPermissions = (teams: { [hospitalId: string]: IStaffTeam[] }, user: IAppUser) => {
    if (!user?.permissions) return {};

    if (user.permissions.includes('VIEW_ALL_HOSPITALS')) {
      return teams;
    }

    if (user.permissions.includes('VIEW_SINGLE_HOSPITAL') && user.hospitalId) {
      return {
        [user.hospitalId]: teams[user.hospitalId] || []
      };
    }

    return {};
  };

  const getTeamsByDepartment = (hospitalId: string, department: string): IStaffTeam[] => {
    if (!staffData?.staffTeams[hospitalId]) return [];
    
    return staffData.staffTeams[hospitalId].filter(
      team => team.department.toLowerCase() === department.toLowerCase()
    );
  };

  const getDepartmentMetrics = (
    hospitalId: string, 
    department: string
  ): IDepartmentalStaffMetrics | null => {
    if (!staffData?.staffMetrics[hospitalId]?.departmental[department.toLowerCase()]) {
      return null;
    }
    
    return staffData.staffMetrics[hospitalId].departmental[department.toLowerCase()];
  };

  const getTeamTasks = (hospitalId: string, teamId: string): IStaffTask[] => {
    const team = staffData?.staffTeams[hospitalId]?.find(t => t.id === teamId);
    return team?.tasks || [];
  };

  const getStaffMemberTasks = (hospitalId: string, staffId: string): IStaffTask[] => {
    const allTasks: IStaffTask[] = [];
    
    staffData?.staffTeams[hospitalId]?.forEach(team => {
      team.tasks.forEach(task => {
        if (task.assignedTo === staffId) {
          allTasks.push(task);
        }
      });
    });

    return allTasks;
  };

  const getHospitalStaffMetrics = (hospitalId: string): IHospitalStaffMetrics | null => {
    return staffData?.staffMetrics[hospitalId] || null;
  };

  const calculateTeamOccupationRate = (team: IStaffTeam): number => {
    const totalTasks = team.tasks.length;
    const completedTasks = team.tasks.filter(
      task => task.status === 'completed'
    ).length;

    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  // Função para atualizar task
  const updateTask = async (
    hospitalId: string,
    teamId: string,
    taskId: string,
    updatedTask: Partial<IStaffTask>
  ) => {
    try {
      const response = await api.patch(
        `/staffTeams/${hospitalId}/${teamId}/tasks/${taskId}`,
        updatedTask
      );
      
      // Atualiza o estado local após confirmação do servidor
      if (response.status === 200 && staffData) {
        const newStaffData = { ...staffData };
        const team = newStaffData.staffTeams[hospitalId]?.find(t => t.id === teamId);
        
        if (team) {
          const taskIndex = team.tasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            team.tasks[taskIndex] = { ...team.tasks[taskIndex], ...updatedTask };
            setStaffData(newStaffData);
          }
        }
      }
      
      return response.data;
    } catch (err) {
      throw new Error('Erro ao atualizar tarefa');
    }
  };

  // Função para adicionar nova task
  const addTask = async (
    hospitalId: string,
    teamId: string,
    newTask: Omit<IStaffTask, 'id'>
  ) => {
    try {
      const response = await api.post(
        `/staffTeams/${hospitalId}/${teamId}/tasks`,
        newTask
      );
      
      // Atualiza o estado local após confirmação do servidor
      if (response.status === 201 && staffData) {
        const newStaffData = { ...staffData };
        const team = newStaffData.staffTeams[hospitalId]?.find(t => t.id === teamId);
        
        if (team) {
          team.tasks.push(response.data);
          setStaffData(newStaffData);
        }
      }
      
      return response.data;
    } catch (err) {
      throw new Error('Erro ao adicionar tarefa');
    }
  };

  // Efeito para carregar os dados
  useEffect(() => {
    let mounted = true;

    const fetchStaffData = async () => {
      if (permissionsLoading) return;

      try {
        setLoading(true);
        const user = authService.getCurrentUser();
        if (!user) throw new Error('Usuário não autenticado');
        
        if (mounted) setCurrentUser(user);

        // Faz múltiplas chamadas em paralelo
        const [teamsResponse, metricsResponse, scheduleResponse] = await Promise.all([
          api.get('/staffTeams'),
          api.get('/staffMetrics'),
          api.get('/staffSchedule')
        ]);

        if (!mounted) return;

        const data: IStaffData = {
          staffTeams: teamsResponse.data,
          staffMetrics: metricsResponse.data,
          staffSchedule: scheduleResponse.data
        };

        const filteredData = {
          ...data,
          staffTeams: filterTeamsByPermissions(data.staffTeams, user)
        };

        setStaffData(filteredData);
        setError(null);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar dados das equipes');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchStaffData();

    return () => {
      mounted = false;
    };
  }, [permissionsLoading]);

  // Efeito para atualizar departamento selecionado quando hospital mudar
  useEffect(() => {
    if (selectedHospitalId && staffData?.staffTeams[selectedHospitalId]) {
      const firstTeam = staffData.staffTeams[selectedHospitalId][0];
      if (firstTeam) {
        setSelectedDepartment(firstTeam.department);
      }
    }
  }, [selectedHospitalId, staffData]);

  return {
    staffData,
    currentUser,
    loading,
    error,
    selectedDepartment,
    selectedShift,
    setSelectedDepartment,
    setSelectedShift,
    getTeamsByDepartment,
    getDepartmentMetrics,
    getTeamTasks,
    getStaffMemberTasks,
    getHospitalStaffMetrics,
    calculateTeamOccupationRate,
    updateTask,
    addTask
  };
};