import { TAlertPriority, TAlertType } from "./alert-types";

// Tipos para as sugestões de métricas (em um arquivo de tipos separado)
export interface IMetricSuggestion {
    id: string;
    title: string;
    description: string;
    type: 'main' | 'additional';
    cardType: string;
    priority: TAlertPriority;
    category: string;
    icon: string;
    aiGenerated: boolean;
    alertType?: TAlertType;
    createdAt: Date;
    trend?: number;
    value?: number | string;
    unit?: string;
    status: 'suggested' | 'approved' | 'rejected' | 'implemented';
}