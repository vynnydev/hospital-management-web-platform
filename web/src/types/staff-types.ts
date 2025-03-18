// Tipos e interfaces para gestão de equipes
export type TShiftPeriod = 'Manhã' | 'Tarde' | 'Noite';
export type TTaskStatus = 'pending' | 'in_progress' | 'completed' | 'delayed' | 'scheduled';
export type TTaskPriority = 'low' | 'medium' | 'high';
export type TTaskType = 'patient_visit' | 'procedure' | 'administrative' | 'meeting';
export type TTeamCapacityStatus = 'optimal' | 'high_demand' | 'low_demand';
export type TTeamStatus = 'active' | 'inactive' | 'on_leave';

export interface IStaffTask {
  id: string;
  title: string;
  assignedTo: string;
  patientId?: string;
  status: TTaskStatus;
  priority: TTaskPriority;
  scheduledFor: string;
  estimatedDuration: number;
  type: TTaskType;
  description?: string;
  notes?: string;
  recurrence?: 'daily' | 'weekly' | 'monthly';
  requiresPreparation?: boolean;
}

export interface ITeamMetrics {
  taskCompletion: number;
  avgResponseTime: number;
  patientSatisfaction: number;
}

export interface IStaffTeam {
  id: string;
  name: string;
  department: string;
  shift: TShiftPeriod;
  leader: string;
  members: string[];
  specialties: string[];
  status: TTeamStatus;
  capacityStatus: TTeamCapacityStatus;
  metrics: ITeamMetrics;
  tasks: IStaffTask[];
}

export interface IStaffDistribution {
  doctors: number;
  nurses: number;
  technicians: number;
}

export interface IShiftCoverage {
  morning: number;
  afternoon: number;
  night: number;
}

export interface IDepartmentalStaffMetrics {
  totalStaff: number;
  onDuty: number;
  taskCompletion: number;
  averageTaskTime: number;
  staffDistribution: IStaffDistribution;
  shiftCoverage: IShiftCoverage;
}

export interface IHospitalStaffMetrics {
  departmental: {
    [key: string]: IDepartmentalStaffMetrics;
  };
}

export interface IShift {
  id: string;
  department: string;
  date: string;
  period: TShiftPeriod;
  startTime: string;
  endTime: string;
  staff: string[];
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface IStaffSchedule {
  shifts: IShift[];
}

// Interface principal que agrupa todos os dados de equipe
export interface IStaffData {
  loading: boolean;
  staffTeams: {
    [hospitalId: string]: IStaffTeam[];
  };
  staffMetrics: {
    [hospitalId: string]: IHospitalStaffMetrics;
  };
  staffSchedule: {
    [hospitalId: string]: IStaffSchedule;
  };
}

// Métricas iniciais para departamentos
export const initialStaffDepartmentMetrics: IDepartmentalStaffMetrics = {
  totalStaff: 0,
  onDuty: 0,
  taskCompletion: 0,
  averageTaskTime: 0,
  staffDistribution: {
    doctors: 0,
    nurses: 0,
    technicians: 0
  },
  shiftCoverage: {
    morning: 0,
    afternoon: 0,
    night: 0
  }
};