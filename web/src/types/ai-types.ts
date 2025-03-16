import type { LucideIcon } from "lucide-react";
import type { IStaffTeam, TTeamCapacityStatus } from "./staff-types";

// Interfaces existentes que não precisam mudar
export interface IGeneratedData {
  recommendation?: string;
  treatmentImage?: string | null;
  carePlanImage?: string | null;
  monitoringImage?: string;
}

export interface IGeneratedImages { 
  [key: string]: {
    treatment: string;
    carePlan: string;
  };
}

// Menus
export interface IAIFeature {
  label: string;
  description: string;
  icon: LucideIcon;
}

// Staff
export interface AIGeneratedContent {
  recommendation?: string;
  image?: string;
}

// Tipo para props do modal de geração de IA
export interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: IStaffTeam;
  content: AIGeneratedContent | null;
}

export interface IAIRecommendation {
    staffing: string;
    workload: string;
    priority: string;
  }
  
export type TAIRecommendationsMap = {
    [K in TTeamCapacityStatus]: IAIRecommendation;
};
