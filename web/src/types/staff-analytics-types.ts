// Tipos existentes estendidos e novos tipos
import { IStaffTeam, IStaffTask, TTeamCapacityStatus } from '@/types/staff-types';

export type StaffGoalType = 'KPI' | 'TRAINING' | 'SHIFT' | 'TASK';
export type StaffGoalStatus = 'active' | 'completed' | 'in_progress' | 'pending';

// Interface para métricas de performance estendidas
export interface IExtendedPerformanceMetrics {
  taskCompletion: number;
  avgResponseTime: number;
  patientSatisfaction: number;
  teamCollaboration?: number;
  burnoutRisk?: number;
  capacityStatus: TTeamCapacityStatus;
}

// Interface para objetivos/metas
export interface IStaffGoal {
  id: string;
  type: StaffGoalType;
  title: string;
  date: string;
  status: StaffGoalStatus;
  progress?: number;
  description: string;
  relatedTasks?: IStaffTask[];
}

// Interface para especialidades e competências
export interface IStaffCompetency {
  name: string;
  level: 'basic' | 'intermediate' | 'advanced' | 'expert';
  certifications?: string[];
  lastUpdated: string;
}

// Interface para membro da equipe estendido
export interface IExtendedStaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  shift: string;
  team: IStaffTeam;
  skillPoints: number;
  competencies: IStaffCompetency[];
  activeGoals: IStaffGoal[];
  achievedGoals: IStaffGoal[];
  performanceMetrics: IExtendedPerformanceMetrics;
  recentActivities?: {
    date: string;
    type: 'task' | 'training' | 'achievement';
    description: string;
  }[];
}

// Funções auxiliares para transformar dados da API
export const transformTeamMemberToExtended = (
  teamMember: string,
  team: IStaffTeam
): IExtendedStaffMember => {
  // Calcular pontos de habilidade baseado nas métricas do time
  const skillPoints = Math.round(
    (team.metrics.taskCompletion + (team.metrics.patientSatisfaction * 20)) / 2
  );

  // Gerar objetivos baseados nas tasks do time
  const activeGoals: IStaffGoal[] = team.tasks
    .filter(task => task.assignedTo === teamMember && 
      ['pending', 'in_progress'].includes(task.status))
    .map(task => ({
      id: task.id,
      type: task.type === 'patient_visit' ? 'KPI' : 'TASK',
      title: task.title,
      date: task.scheduledFor,
      status: task.status as StaffGoalStatus,
      progress: task.status === 'in_progress' ? 75 : 0,
      description: task.description || task.title,
      relatedTasks: [task]
    }));

  // Gerar competências baseadas nas especialidades do time
  const competencies: IStaffCompetency[] = team.specialties.map(specialty => ({
    name: specialty,
    level: 'advanced',
    lastUpdated: new Date().toISOString(),
    certifications: [`${specialty} Professional Certification`]
  }));

  return {
    id: teamMember,
    name: `Dr. ${teamMember}`, // Idealmente viria da API
    role: team.specialties[0], // Usar primeira especialidade como role
    department: team.department,
    shift: team.shift,
    team,
    skillPoints,
    competencies,
    activeGoals,
    achievedGoals: [], // Poderia vir de um histórico na API
    performanceMetrics: {
        taskCompletion: team.metrics.taskCompletion,
        avgResponseTime: team.metrics.avgResponseTime,
        patientSatisfaction: team.metrics.patientSatisfaction,
        teamCollaboration: 90,
        burnoutRisk: team.capacityStatus === 'high_demand' ? 75 : 25,
        capacityStatus: team.capacityStatus as TTeamCapacityStatus // Usando type assertion aqui
    },
    recentActivities: team.tasks
      .filter(task => task.assignedTo === teamMember)
      .map(task => ({
        date: task.scheduledFor,
        type: 'task',
        description: task.title
      }))
  };
};