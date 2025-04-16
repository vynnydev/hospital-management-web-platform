/* eslint-disable @typescript-eslint/no-explicit-any */
export type IntegrationType = 'teams' | 'slack' | 'gmail' | 'whatsapp' | 'more';

// GET /api/integrations
export interface IntegrationsResponse {
  data: Integration[];
  meta: {
    total: number;
    active: number;
  };
}

// GET /api/integrations/:id
export interface IntegrationResponse {
  data: Integration;
}

// POST /api/integrations/:id/toggle
export interface ToggleIntegrationRequest {
  isActive: boolean;
}

export interface ToggleIntegrationResponse {
  success: boolean;
  data: {
    id: string;
    isActive: boolean;
    updatedAt: string;
  };
}

// PUT /api/integrations/:id/config
export interface UpdateIntegrationConfigResponse {
  success: boolean;
  data: {
    id: string;
    config: Record<string, any>;
    updatedAt: string;
  };
}

// Tipos de Integração
export interface Integration {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  category: 'export' | 'analytics' | 'communication' | 'security' | 'interoperability';
  isNew?: boolean;
  isPopular?: boolean;
  availableForRoles: string[];
  requiredPermissions: string[];
  createdAt: string;
  updatedAt: string;
  config?: Record<string, any>;
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