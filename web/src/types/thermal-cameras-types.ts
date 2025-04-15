export interface IThermalCamera {
    id: string;
    roomId: string;
    bedId?: string;
    hospitalId: string;
    name: string;
    model: string;
    status: 'active' | 'inactive' | 'maintenance';
    resolution: string;
    ipAddress: string;
    lastMaintenance: string;
    nextMaintenance: string;
    thermalSettings: {
      temperatureRange: {
        min: number;
        max: number;
      };
      alertThreshold: number;
      captureInterval: number; // em segundos
      sensitivity: number; // 1-10
    };
    privacySettings: {
      dataRetentionDays: number;
      maskingEnabled: boolean;
      gdprCompliant: boolean;
      recordingEnabled: boolean;
      authorizedAccessRoles: string[];
    };
    lastReading?: {
      timestamp: string;
      averageTemperature: number;
      hotspots: Array<{
        x: number;
        y: number;
        temperature: number;
      }>;
      occupancyDetected: boolean;
      alertsTriggered: boolean;
    };
}
  
export interface IThermalCameraReading {
    id: string;
    cameraId: string;
    bedId?: string;
    timestamp: string;
    thermalData: {
      averageTemperature: number;
      maxTemperature: number;
      minTemperature: number;
      temperatureMatrix: number[][]; // Matriz de temperatura (tamanho depende da resolução da câmera)
    };
    occupancyData: {
      occupied: boolean;
      movementDetected: boolean;
      estimatedHeartRate?: number;
      estimatedRespirationRate?: number;
    };
    alerts: {
      highTemperature: boolean;
      lowTemperature: boolean;
      noMovement: boolean;
      abnormalVitalSigns: boolean;
    };
}
  
export interface IThermalCameraConfiguration {
    id: string;
    hospitalId: string;
    defaultSettings: {
      captureInterval: number;
      temperatureThresholds: {
        low: number;
        normal: number;
        elevated: number;
        fever: number;
      };
      privacyDefaults: {
        dataRetentionDays: number;
        maskingEnabled: boolean;
        recordingEnabled: boolean;
      };
    };
    alertNotifications: {
      enabledChannels: {
        email: boolean;
        sms: boolean;
        appNotification: boolean;
        systemAlert: boolean;
      };
      alertRecipients: string[]; // IDs dos usuários ou funções
      escalationTime: number; // minutos antes de escalar o alerta
    };
}

export interface IThermalAlert {
    id: string;
    cameraId: string;
    bedId: string;
    hospitalId: string;
    timestamp: string;
    alertType: 'highTemperature' | 'lowTemperature' | 'noMovement' | 'abnormalVitalSigns';
    severity: 'low' | 'medium' | 'high';
    value: number;
    threshold: number;
    status: 'open' | 'resolved';
    notified: Array<{
      channel: 'email' | 'sms' | 'appNotification' | 'systemAlert';
      timestamp: string;
      recipients: string[];
    }>;
    acknowledgedBy: string | null;
    acknowledgedAt: string | null;
    resolution: {
      timestamp: string;
      resolvedBy: string;
      notes: string;
    } | null;
}

export interface IThermalMaintenance {
    id: string;
    cameraId: string;
    hospitalId: string;
    technician: string;
    type: 'preventive' | 'corrective' | 'installation' | 'scheduled';
    status: 'scheduled' | 'in_progress' | 'completed' | 'canceled';
    startDate: string;
    endDate: string | null;
    nextScheduledDate: string | null;
    issues: Array<{
      category: string;
      description: string;
      resolution: string | null;
    }>;
    notes: string;
    parts: Array<{
      name: string;
      quantity: number;
      cost: number;
    }>;
    totalCost: number;
}

// Tipo para padronizar nomes de endpoints
export type ThermalEndpointNames = 
  'thermal-cameras' | 
  'thermal-readings' | 
  'thermal-config' | 
  'thermal-alerts' | 
  'thermal-maintenance' |
  'thermal-configs';