export type IntegrationType = 'teams' | 'slack' | 'gmail' | 'whatsapp' | 'more';

export interface Integration {
    id: string;
    name: string;
    description: string;
    category: 'export' | 'analytics' | 'communication' | 'security';
    isActive: boolean;
    requiredPermissions: string[];
    availableForRoles: string[];
    configFields?: IntegrationConfigField[];
    baseURL?: string;
    apiKey?: string;
    webhookURL?: string;
    lastSyncDate?: string;
  }
  
  export interface IntegrationConfigField {
    id: string;
    label: string;
    type: 'text' | 'password' | 'select' | 'toggle' | 'textarea';
    required: boolean;
    options?: { value: string; label: string }[];
    default?: string | boolean;
    placeholder?: string;
}