/* eslint-disable @typescript-eslint/no-explicit-any */
export type TAuthMethod = 'password' | 'mfa' | 'sso' | 'biometric';
export type TLogSeverity = 'info' | 'warning' | 'error' | 'critical';
export type TLogCategory = 'authentication' | 'data_access' | 'system_config' | 'patient_data' | 'admin_action' | 'security';
export type TComplianceRegulation = 'LGPD' | 'HIPAA' | 'GDPR' | 'ISO27001' | 'CFR21Part11';
export type TPermissionScope = 'hospital' | 'department' | 'staff' | 'patient' | 'system';
export type TPermissionAction = 'view' | 'create' | 'edit' | 'delete' | 'approve' | 'export';

// Estrutura para políticas de senha
export interface IPasswordPolicy {
  id: string;
  name: string;
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  prohibitCommonWords: boolean;
  prohibitSequential: boolean;
  prohibitContextual: boolean; // proíbe usar nomes de usuário, hospital, etc
  passwordExpiration: number; // dias até expirar (0 = sem expiração)
  historyCount: number; // número de senhas anteriores proibidas
  maxLoginAttempts: number;
  lockoutDuration: number; // minutos de bloqueio após falhas
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  roleApplicability: string[]; // ids dos papéis aos quais se aplica
}

// Estrutura para configurações de MFA
export interface IMFAConfig {
  id: string;
  enabled: boolean;
  requiredForRoles: string[]; // ids dos papéis que exigem MFA
  allowedMethods: ('app' | 'sms' | 'email' | 'hardware')[];
  graceLogins: number; // número de logins permitidos sem MFA após configuração
  rememberDeviceDays: number; // dias para lembrar dispositivos confiáveis (0 = nunca)
  createdAt: string;
  updatedAt: string;
}

// Configurações de sessão
export interface ISessionConfig {
  id: string;
  sessionTimeout: number; // minutos (0 = sem timeout)
  extendOnActivity: boolean;
  singleSession: boolean; // permitir apenas uma sessão ativa por usuário
  enforceSingleDevice: boolean; // forçar logout em outros dispositivos ao fazer login
  forceReauthForSensitive: boolean; // exigir nova autenticação para ações sensíveis
  createdAt: string;
  updatedAt: string;
}

// Log de auditoria
export interface IAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  resource: string;
  resourceId?: string;
  resourceType: string;
  details: string;
  ipAddress: string;
  userAgent: string;
  sessionId: string;
  result: 'success' | 'failure' | 'denied';
  severity: TLogSeverity;
  category: TLogCategory;
  hospitalId?: string;
  departmentId?: string;
  relatedEntityId?: string; // ID opcional de outra entidade relacionada (paciente, etc)
  relatedEntityType?: string;
  metadata?: Record<string, any>;
}

// Configurações de retenção de logs
export interface ILogRetentionPolicy {
  id: string;
  retentionPeriod: number; // dias de retenção
  archiveAfter: number; // dias até arquivamento
  logCategories: TLogCategory[];
  createdAt: string;
  updatedAt: string;
}

// Configurações de exportação de logs
export interface ILogExportConfig {
  id: string;
  enabled: boolean;
  format: 'json' | 'csv' | 'syslog';
  destination: 'email' | 'sftp' | 'api' | 's3';
  destinationConfig: Record<string, any>; // detalhes específicos do destino
  frequency: 'daily' | 'weekly' | 'monthly' | 'realtime';
  includeCategories: TLogCategory[];
  createdAt: string;
  updatedAt: string;
}

// Configurações de conformidade
export interface IComplianceConfig {
  id: string;
  regulation: TComplianceRegulation;
  enabled: boolean;
  enforcementLevel: 'strict' | 'balanced' | 'permissive';
  lastAudit?: string;
  nextAuditDue?: string;
  requirementsStatus: {
    total: number;
    compliant: number;
    nonCompliant: number;
    inProgress: number;
  };
  dataRetentionPolicy: {
    patientData: number; // meses de retenção
    operationalData: number;
    auditLogs: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Configurações de consentimento (LGPD, GDPR)
export interface IConsentConfig {
  id: string;
  consentCategories: {
    id: string;
    name: string;
    description: string;
    required: boolean;
    defaultState: boolean;
    appliesTo: ('patient' | 'staff' | 'all')[];
  }[];
  consentFormVersion: string;
  lastUpdated: string;
  requireRenewalAfter: number; // dias (0 = sem renovação)
  notifyBeforeExpiration: number; // dias antes para notificar
  trackingMethod: 'digital_signature' | 'checkbox' | 'biometric';
  createdAt: string;
  updatedAt: string;
}

// Detalhes de certificação de segurança
export interface ISecurityCertification {
  id: string;
  name: string;
  issuedBy: string;
  issuedDate: string;
  expirationDate: string;
  status: 'active' | 'expired' | 'pending' | 'revoked';
  documentUrl?: string;
  requirements: {
    id: string;
    description: string;
    status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable';
  }[];
}

// Definição de um alerta de segurança
export interface ISecurityAlert {
  id: string;
  timestamp: string;
  type: 'authentication' | 'data_access' | 'vulnerability' | 'compliance' | 'breach';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  sourceIp?: string;
  userId?: string;
  resourceId?: string;
  resourceType?: string;
  status: 'new' | 'investigating' | 'resolved' | 'false_positive';
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  relatedAlerts?: string[]; // IDs de alertas relacionados
  metadata?: Record<string, any>;
}

// Política de acesso baseada em funções
export interface IRBAPolicy {
  id: string;
  name: string;
  description: string;
  roleId: string;
  permissions: {
    resource: string;
    scope: TPermissionScope;
    actions: TPermissionAction[];
    conditions?: Record<string, any>; // Condições adicionais (horário, localização, etc)
  }[];
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Configurações de acesso de usuário
export interface IAccessControlConfig {
  id: string;
  enforceIPRestriction: boolean;
  allowedIPs?: string[];
  allowedTimeWindows?: {
    dayOfWeek: number[]; // 0-6 (dom-sáb)
    startTime: string; // HH:MM
    endTime: string; // HH:MM
  }[];
  enforceDeviceRestriction: boolean;
  trustedDevices: boolean;
  maxDevicesPerUser: number;
  geofencing: boolean;
  allowedLocations?: {
    name: string;
    coordinates: {
      latitude: number;
      longitude: number;
      radius: number; // metros
    };
  }[];
  createdAt: string;
  updatedAt: string;
}

// Configurações de segurança da API
export interface IAPISecurityConfig {
  id: string;
  authMethod: 'jwt' | 'oauth' | 'api_key';
  tokenExpiration: number; // minutos
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    burstLimit: number;
  };
  ipWhitelisting: {
    enabled: boolean;
    allowedIPs: string[];
  };
  webhookConfig: {
    enabled: boolean;
    signingSecret: boolean;
    retryPolicy: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Vulnerability scan result
export interface IVulnerabilityScan {
  id: string;
  scanDate: string;
  scanType: 'automated' | 'manual' | 'penetration_test';
  scanTool?: string;
  conductedBy?: string;
  findings: {
    id: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    description: string;
    affectedComponent: string;
    status: 'open' | 'in_progress' | 'fixed' | 'accepted_risk';
    remediation?: string;
    fixDueDate?: string;
    assignedTo?: string;
  }[];
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    fixed: number;
  };
  reportUrl?: string;
}

// Monitoramento de ameaças
export interface IThreatMonitoring {
  id: string;
  enabled: boolean;
  monitoringServices: {
    darkWeb: boolean;
    malwareDetection: boolean;
    intrusionDetection: boolean;
    anomalyDetection: boolean;
    honeypots: boolean;
  };
  alertThresholds: {
    anomalyScore: number; // 0-100
    failedLoginCount: number;
    dataExfiltrationSize: number; // MB
  };
  responsePolicies: {
    autoBlockIPs: boolean;
    autoLockAccounts: boolean;
    notifySecurityTeam: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

// Agrupamento de todas as configurações de segurança e compliance
export interface ISecurityComplianceData {
  passwordPolicies: IPasswordPolicy[];
  mfaConfig: IMFAConfig;
  sessionConfig: ISessionConfig;
  logRetentionPolicy: ILogRetentionPolicy;
  logExportConfig: ILogExportConfig;
  complianceConfigs: IComplianceConfig[];
  consentConfig: IConsentConfig;
  securityCertifications: ISecurityCertification[];
  accessControlConfig: IAccessControlConfig;
  apiSecurityConfig: IAPISecurityConfig;
  threatMonitoring: IThreatMonitoring;
  rbaPolicy?: IRBAPolicy[];
  // Não armazenados diretamente nos dados de configuração:
  // auditLogs?: IAuditLog[];
  // securityAlerts?: ISecurityAlert[];
  // vulnerabilityScans?: IVulnerabilityScan[];
}