/* eslint-disable @typescript-eslint/no-explicit-any */

import { IMessage } from "./app-types";
import { IAppUser } from "./auth-types";
import { TNotificationChannel } from "./notification-settings-types";

// Tipos para o sistema de alertas
export type TAlertPriority = 'high' | 'medium' | 'low' | 'critical';

export type TAlertType = 
  'ambulance' | 
  'patient-arrival' | 
  'resource' | 
  'emergency' | 
  'occupancy' | 
  'staff' | 
  'operational' | 
  'equipment' | 
  'warning' | 
  'info' | 
  'success' | 
  'error' |
  'system';
export type TAlertStatus = 'pending' | 'acknowledged' | 'resolved' | 'dismissed';

export type TUserRole = 'doctor' | 'nurse' | 'attendant' | 'admin' | 'system' | 'ai';

// Severidade de Alertas (para códigos de cores)
export type TAlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

// Condição para disparar alertas
export type TAlertCondition = 'greater' | 'less' | 'equal' | 'between';

// Interface para alertas
export interface IAlert {
  id: string;
  type: TAlertType;
  title: string;
  message: string;
  timestamp: Date;
  priority: TAlertPriority;
  status: TAlertStatus;
  read: boolean;
  actionRequired: boolean;
  hospitalId?: string; // Opcional para permitir alertas sem hospital específico
  sourceId?: string;
  metadata?: {
    patientId?: string;
    ambulanceId?: string;
    resourceId?: string;
    bedId?: string;
    departmentId?: string;
    routeId?: string;
    staffId?: string;
    estimatedArrival?: string;
    aiGenerated?: boolean;
    confidence?: number;
    reasoning?: string;
    suggestedActions?: string[];
    vitalSigns?: {
      bloodPressure?: string;
      heartRate?: number;
      temperature?: number;
      respiratoryRate?: number;
      oxygenSaturation?: number;
      [key: string]: any;
    };
    [key: string]: any;
  };
}

// Interface estendida para mensagens que podem incluir alertas
export interface IExtendedMessage extends IMessage {
  id: string;
  content: string;
  user: IAppUser;
  timestamp: string;
  createdAt?: string;
  isAlert?: boolean;
  alertData?: IAlert;
  isEmergency?: boolean;
  attachments?: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
}

export interface IAlertCondition {
  type: TAlertCondition;
  threshold: number;
  thresholdSecondary?: number; // Para condição "between"
  persistence: number; // Tempo em minutos que a condição deve persistir
}

export interface IAlertTemplate {
  id: string;
  name: string;
  description: string;
  type: TAlertType;
  priority: TAlertPriority;
  condition: IAlertCondition;
  message: string;
  severity: TAlertSeverity;
  channels: TNotificationChannel[];
}

// Interface para filtros de alertas
export interface IAlertFilters {
  type?: TAlertType | 'all';
  priority?: TAlertPriority | 'all';
  status?: TAlertStatus | 'all';
  hospitalId?: string;
  read?: boolean;
  startDate?: Date;
  endDate?: Date;
}

// Interface para contagem de alertas não lidos
export interface IUnreadAlertCount {
  total: number;
  highPriority: number;
  byType: Record<TAlertType, number>;
}