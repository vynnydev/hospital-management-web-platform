/* eslint-disable @typescript-eslint/no-explicit-any */

import { LucideIcon } from "lucide-react";

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