import { useCallback } from 'react';
import { IStaffTeam } from '@/types/staff-types';

interface IDepartmentDemand {
  highDemandTeams: IStaffTeam[];
  burnoutRisk: Array<{
    teamId: string;
    teamName: string;
    burnoutScore: number;
  }>;
}

interface IStaffNeeds {
  [department: string]: {
    [shift: string]: {
      staffNeeded: number;
      currentStaff: number;
    };
  };
}

export const useStaffPredictiveAnalysis = (staffTeams: { [hospitalId: string]: IStaffTeam[] }) => {
  const calculateBurnoutRisk = useCallback((team: IStaffTeam): number => {
    const tasksCompletionRate = team.metrics.taskCompletion;
    const pendingTasks = team.tasks.filter(task => task.status === 'pending').length;
    const highPriorityTasks = team.tasks.filter(task => task.priority === 'high').length;

    return (
      (pendingTasks * 0.4) + 
      (highPriorityTasks * 0.3) + 
      (100 - tasksCompletionRate) * 0.3
    );
  }, []);

  const predictDepartmentDemand = useCallback((hospitalId: string, department: string): IDepartmentDemand => {
    if (!staffTeams || !hospitalId) {
      return {
        highDemandTeams: [],
        burnoutRisk: []
      };
    }

    const teams = staffTeams[hospitalId]?.filter(team =>
      team.department.toLowerCase() === department.toLowerCase()
    ) ?? [];

    const highDemandTeams = teams.filter(team => 
      team.capacityStatus === 'high_demand' || 
      team.tasks.filter(task => task.status === 'pending').length > 5
    );

    const burnoutRisk = teams.map(team => ({
      teamId: team.id,
      teamName: team.name,
      burnoutScore: calculateBurnoutRisk(team)
    })).sort((a, b) => b.burnoutScore - a.burnoutScore);

    return {
      highDemandTeams,
      burnoutRisk
    };
  }, [staffTeams, calculateBurnoutRisk]);

  const predictStaffingNeeds = useCallback((hospitalId: string): IStaffNeeds => {
    const hospitalTeams = staffTeams[hospitalId] || [];
    
    // Inicializa a estrutura com valores padrão
    const initialAcc: IStaffNeeds = {};
    
    return hospitalTeams.reduce((acc, team) => {
      // Inicializa o departamento se não existir
      if (!acc[team.department]) {
        acc[team.department] = {
          morning: { staffNeeded: 0, currentStaff: 0 },
          afternoon: { staffNeeded: 0, currentStaff: 0 },
          night: { staffNeeded: 0, currentStaff: 0 }
        };
      }
      
      const shift = team.shift.toLowerCase();
      const pendingTasks = team.tasks.filter(task => task.status === 'pending').length;
      
      // Garante que o objeto existe antes de acessá-lo
      if (!acc[team.department][shift]) {
        acc[team.department][shift] = {
          staffNeeded: 0,
          currentStaff: 0
        };
      }

      // Atualiza os valores de forma segura
      acc[team.department][shift].staffNeeded = 
        (acc[team.department][shift].staffNeeded || 0) + Math.ceil(pendingTasks / 3);
      acc[team.department][shift].currentStaff = 
        (acc[team.department][shift].currentStaff || 0) + team.members.length;

      return acc;
    }, initialAcc);
  }, [staffTeams]);

  return {
    predictDepartmentDemand,
    predictStaffingNeeds
  };
};