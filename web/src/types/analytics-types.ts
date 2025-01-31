import { ReactNode, ComponentType } from 'react';
import { IHospital } from '@/types/hospital-network-types';
import { IAppUser } from './auth-types';

export type TOccupancy = 'critical' | 'attention' | 'normal';

export interface IColumnContent {
  title: string;
  content: string;
  extractionStart: string;
  extractionEnd: string;
}

export interface ISubCard {
  title: string;
  icon: ComponentType<{ className?: string }>
  gradient: string;
  content: string;
  extractionStart: string;
  extractionEnd: string;
}

export interface ISection {
  title: string;
  icon: ComponentType<{ className?: string }>
  gradient: string;
  tooltip: string;
  content: string;
  subCards: ISubCard[];
  lines: IColumnContent[];
  actionPlan: string;
  actionPlanStart: string;
  actionPlanEnd: string;
}

export interface IAnalyticsSectionProps {
  title: string;
  icon: ReactNode;
  gradient: string;
  tooltip: string;
  content: string;
  subCards: ISubCard[];
  lines: IColumnContent[];
  actionPlan: string;
  isExpanded: boolean;
  onToggle: () => void;
  index: number;
}

export interface IAIAnalyticsProps {
  filteredHospitals: IHospital[] | undefined;
  currentUser: IAppUser | null;
}