/* eslint-disable @typescript-eslint/no-explicit-any */
// Canais de Notificação
export type TNotificationChannel = 'email' | 'sms' | 'dashboard' | 'app';

// Interface para canal de notificação
export interface INotificationChannel {
    id: TNotificationChannel;
    name: string;
    enabled: boolean;
    config: Record<string, any>;
}

// Interface para configurações de notificação
export interface INotificationSettings {
    emails: string[];
    phones: string[];
    repeatInterval: number; // Em minutos, 0 = não repetir
    defaultChannels: TNotificationChannel[];
    highPriorityChannels: TNotificationChannel[];
    silentHours: {
      enabled: boolean;
      start: string; // Formato "HH:MM"
      end: string; // Formato "HH:MM"
    };
}