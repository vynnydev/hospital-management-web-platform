/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import type { 
  IStaffData, 
  IStaffTeam, 
  IStaffTask, 
  TShiftPeriod,
  IHospitalStaffMetrics,
  IDepartmentalStaffMetrics,
  IStaffMember,
  IShift
} from '@/types/staff-types';
import { usePermissions } from '../auth/usePermissions';
import { authService } from '@/services/general/auth/AuthService';
import type { IAppUser } from '@/types/auth-types';
import { format, parseISO, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns';
import { ICalendarEvent } from '@/types/calendar-types';
import api from '@/services/api';

export const useStaffData = (selectedHospitalId?: string, selectedDate?: Date) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [staffData, setStaffData] = useState<IStaffData | null>(null);
  const [currentUser, setCurrentUser] = useState<IAppUser | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedShift, setSelectedShift] = useState<TShiftPeriod>('Manhã');
  const [staffMembers, setStaffMembers] = useState<IStaffMember[]>([]);

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

  // ----- FUNÇÕES ADICIONADAS PARA O CALENDÁRIO HOSPITALAR -----

  // Extrair todos os membros da equipe do staffTeams
  const extractStaffMembers = useCallback((): IStaffMember[] => {
    if (!staffData?.staffTeams) return [];
    
    const members: IStaffMember[] = [];
    const memberIds = new Set<string>();
    
    Object.entries(staffData.staffTeams).forEach(([hospitalId, teams]) => {
      teams.forEach(team => {
        // Adicionar líder da equipe
        if (!memberIds.has(team.leader)) {
          members.push({ 
            id: team.leader,
            department: team.department,
            role: 'Líder',
            specialties: team.specialties
          });
          memberIds.add(team.leader);
        }
        
        // Adicionar membros da equipe
        team.members.forEach(memberId => {
          if (!memberIds.has(memberId)) {
            members.push({ 
              id: memberId,
              department: team.department,
              role: memberId.startsWith('D') ? 'Médico' : 'Enfermeiro',
              specialties: team.specialties
            });
            memberIds.add(memberId);
          }
        });
      });
    });
    
    return members;
  }, [staffData]);

  // Função para obter todas as tarefas agendadas
  const getAllScheduledTasks = useCallback((): (IStaffTask & { teamId: string; hospitalId: string })[] => {
    if (!staffData?.staffTeams) return [];
    
    const tasks: (IStaffTask & { teamId: string; hospitalId: string })[] = [];
    
    Object.entries(staffData.staffTeams).forEach(([hospitalId, teams]) => {
      teams.forEach(team => {
        team.tasks.forEach(task => {
          tasks.push({
            ...task,
            teamId: team.id,
            hospitalId
          });
        });
      });
    });
    
    return tasks;
  }, [staffData]);

  // Função para converter tarefas em eventos para o calendário
  const getTasksAsEvents = useCallback((): ICalendarEvent[] => {
    const tasks = getAllScheduledTasks();
    return tasks.map(task => ({
      id: task.id,
      title: task.title,
      date: task.scheduledFor.split('T')[0],
      startTime: task.scheduledFor.split('T')[1].substring(0, 5),
      endTime: '', // Calcular com base na duração estimada
      department: task.teamId.split('-')[2], // Extrair o departamento do ID da equipe
      type: task.type === 'patient_visit' ? 'patient_visit' : 'procedure',
      location: task.hospitalId,
      status: task.status,
      priority: task.priority,
      patientId: task.patientId,
      description: task.description || task.notes,
      attendees: [task.assignedTo],
      duration: task.estimatedDuration,
      durationType: 'minute',
      isRecurring: !!task.recurrence,
      recurrencePattern: task.recurrence,
      day: 1
    }));
  }, [getAllScheduledTasks]);

  // Função para obter turnos de plantão como eventos de calendário
  const getShiftsAsEvents = useCallback((): ICalendarEvent[] => {
    if (!staffData?.staffSchedule) return [];
    
    const events: ICalendarEvent[] = [];
    const date = selectedDate || new Date();
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(date);
    
    Object.entries(staffData.staffSchedule).forEach(([hospitalId, data]) => {
      data.shifts.forEach(shift => {
        // Filtrar apenas turnos do mês selecionado
        const shiftDate = parseISO(shift.date);
        
        if (isWithinInterval(shiftDate, { start: monthStart, end: monthEnd })) {
          events.push({
            id: `shift-${shift.id}`,
            title: `Plantão ${shift.department} - ${shift.period}`,
            date: shift.date,
            startTime: shift.startTime,
            endTime: shift.endTime,
            department: shift.department.toLowerCase(),
            type: 'shift',
            location: hospitalId,
            attendees: shift.staff,
            status: shift.status,
            priority: 'medium',
            day: 1
          });
        }
      });
    });
    
    return events;
  }, [staffData, selectedDate]);

  // Função para obter plantões de um membro específico da equipe
  const getStaffMemberShifts = useCallback((staffId: string): IShift[] => {
    if (!staffData?.staffSchedule) return [];
    
    const shifts: (IShift & { hospitalId: string })[] = [];
    
    Object.entries(staffData.staffSchedule).forEach(([hospitalId, data]) => {
      data.shifts.forEach(shift => {
        if (shift.staff.includes(staffId)) {
          shifts.push({
            ...shift,
            hospitalId
          });
        }
      });
    });
    
    return shifts;
  }, [staffData]);

  // Função para verificar disponibilidade de um membro para uma data/horário
  const checkStaffAvailability = useCallback((
    staffId: string,
    date: string,
    startTime: string,
    endTime: string
  ): boolean => {
    // Obter plantões do membro
    const memberShifts = getStaffMemberShifts(staffId);
    
    // Verificar se já tem plantão no mesmo dia
    const sameDayShift = memberShifts.find(shift => shift.date === date);
    if (!sameDayShift) return true; // Disponível se não tiver plantão nesse dia
    
    // Verificar sobreposição de horários
    const requestStart = parseTime(startTime);
    const requestEnd = parseTime(endTime);
    const shiftStart = parseTime(sameDayShift.startTime);
    const shiftEnd = parseTime(sameDayShift.endTime);
    
    // Se o horário solicitado está completamente fora do plantão, está disponível
    return (requestEnd <= shiftStart || requestStart >= shiftEnd);
    
    function parseTime(timeStr: string): number {
      const [hours, minutes] = timeStr.split(':').map(Number);
      return hours * 60 + minutes;
    }
  }, [getStaffMemberShifts]);

  // Função para obter equipes por turno
  const getTeamsByShift = useCallback((
    hospitalId: string,
    department: string,
    shift: TShiftPeriod
  ): IStaffTeam[] => {
    if (!staffData?.staffTeams[hospitalId]) return [];
    
    return staffData.staffTeams[hospitalId].filter(
      team => team.department.toLowerCase() === department.toLowerCase() && 
              team.shift === shift
    );
  }, [staffData]);

  // Função para obter todas as equipes
  const getAllTeams = useCallback((): IStaffTeam[] => {
    if (!staffData?.staffTeams) return [];
    
    const allTeams: IStaffTeam[] = [];
    
    Object.values(staffData.staffTeams).forEach(teams => {
      allTeams.push(...teams);
    });
    
    return allTeams;
  }, [staffData]);

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
          staffSchedule: scheduleResponse.data,
          loading: false
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

  // Efeito para extrair e atualizar membros da equipe
  useEffect(() => {
    if (staffData) {
      const members = extractStaffMembers();
      setStaffMembers(members);
    }
  }, [staffData, extractStaffMembers]);

  return {
    staffData,
    currentUser,
    loading,
    error,
    selectedDepartment,
    selectedShift,
    staffMembers,
    setSelectedDepartment,
    setSelectedShift,
    getTeamsByDepartment,
    getDepartmentMetrics,
    getTeamTasks,
    getStaffMemberTasks,
    getHospitalStaffMetrics,
    calculateTeamOccupationRate,
    updateTask,
    addTask,
    // Funções adicionadas para o calendário
    getAllScheduledTasks,
    getTasksAsEvents,
    getShiftsAsEvents,
    getStaffMemberShifts,
    checkStaffAvailability,
    getTeamsByShift,
    getAllTeams,
    extractStaffMembers
  };
};