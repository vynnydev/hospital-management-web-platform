/* eslint-disable @typescript-eslint/no-explicit-any */

import { IMessage } from "./app-types";
import { IAppUser } from "./auth-types";

// Tipos para o sistema de alertas
export type TAlertPriority = 'high' | 'medium' | 'low';
export type TAlertType = 'ambulance' | 'patient-arrival' | 'resource' | 'emergency';
export type TAlertStatus = 'pending' | 'acknowledged' | 'resolved' | 'dismissed';
export type TUserRole = 'doctor' | 'nurse' | 'attendant' | 'admin' | 'system' | 'ai';

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
  hospitalId: string;
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