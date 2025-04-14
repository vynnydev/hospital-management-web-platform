
// Tipos para componentes filhos
export interface IMessageTemplate {
    id: string;
    name: string;
    content: string;
    category: 'appointment' | 'reminder' | 'notification' | 'marketing' | 'other';
    variables: string[];
    isActive: boolean;
}

export interface IContactGroup {
    id: string;
    name: string;
    description: string;
    tags: string[];
    contactCount: number;
}

export interface IAutomationRule {
    id: string;
    name: string;
    description: string;
    trigger: 'message_received' | 'keyword' | 'scheduled' | 'no_response';
    condition: string;
    action: string;
    templateId?: string;
    isActive: boolean;
}
  
// Interface para os dados de configuração do WhatsApp
export interface IWhatsAppConfig {
    apiKey: string;
    phoneNumberId: string;
    businessAccountId: string;
    verificationToken: string;
    webhookUrl: string;
    messageTemplates: IMessageTemplate[];
    contactGroups: IContactGroup[];
    automationRules: IAutomationRule[];
    securitySettings: {
        endToEndEncryption: boolean;
        twoFactorAuth: boolean;
        ipWhitelist: string[];
        messageRetentionDays: number;
    };
    notificationSettings: {
        notifyNewMessages: boolean;
        notifyDeliveryStatus: boolean;
        notifyReadStatus: boolean;
        notifyErrors: boolean;
    };
    activeHours: {
        enabled: boolean;
        startTime: string;
        endTime: string;
        timezone: string;
        workingDays: number[];
        autoReplyOutsideHours: boolean;
        outsideHoursMessage: string;
    };
}