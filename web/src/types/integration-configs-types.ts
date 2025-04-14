export interface DocSignConfig {
    apiKey: string;
    webhookURL: string;
    environment: 'sandbox' | 'production';
    autoSign: boolean;
    requirePatientAuth: boolean;
    signerTypes: string[];
    notifySigners: boolean;
    allowReminders: boolean;
    reminderFrequency: number;
    expirationTime: number;
    redirectURL: string;
}
  
export interface ExcelConfig {
    exportPath: string;
    defaultFormat: 'xlsx' | 'csv' | 'ods';
    autoExport: boolean;
    includeCharts: boolean;
    exportSchedule: 'daily' | 'weekly' | 'monthly' | 'manual';
    exportTime: string;
    exportDayOfWeek?: number;
    exportDayOfMonth?: number;
    notifyOnExport: boolean;
    recipients: string[];
    templateId: string;
    customHeaders: boolean;
    password: string;
    protectSheets: boolean;
}
  
export interface SlackConfig {
    webhookUrl: string;
    defaultChannel: string;
    botName: string;
    botIcon: string;
    notifyEmergencies: boolean;
    notifyAppointments: boolean;
    notifyExamResults: boolean;
    notifySystemAlerts: boolean;
    emergencyMentions: string[];
    useThreads: boolean;
    notificationSchedule: {
      workingHoursOnly: boolean;
      startTime: string;
      endTime: string;
      daysOfWeek: number[];
    };
    customMessageTemplate: string;
    silentMode: boolean;
}
  
export interface EmailConfig {
    smtpServer: string;
    port: number;
    encryption: 'none' | 'tls' | 'ssl';
    senderEmail: string;
    senderName: string;
    requireAuth: boolean;
    username: string;
    password: string;
    defaultTemplate: string;
    emailFooter: string;
    includeLogo: boolean;
    notificationTypes: {
      appointments: boolean;
      examResults: boolean;
      prescriptions: boolean;
      system: boolean;
    };
    throttleLimit: number;
    testRecipient: string;
    bccAddresses: string[];
    maxAttachmentSize: number;
}
  
export interface WordConfig {
    templatePath: string;
    defaultFormat: 'docx' | 'doc' | 'pdf';
    autoGenerate: boolean; 
    templateLanguage: string;
    enableMacros: boolean;
    headerFooterEnabled: boolean;
    companyLogo: boolean;
    trackChanges: boolean;
    saveOptions: {
      autosave: boolean;
      interval: number;
      backupCount: number;
    };
    customFields: Record<string, string>;
}
  
export interface JiraConfig {
    apiKey: string;
    projectKey: string;
    domain: string;
    username: string;
    assigneeDefault: string;
    defaultPriority: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
    issueTypes: string[];
    customFields: Record<string, string>;
    createSubtasks: boolean;
    webhookUrl: string;
    jqlQueries: Record<string, string>;
    syncInterval: number;
}
  
export interface WhatsAppConfig {
    accountId: string;
    apiKey: string;
    phoneNumber: string;
    businessName: string;
    messageTemplates: Record<string, string>;
    allowReplies: boolean;
    autoResponse: boolean;
    autoResponseMessage: string;
    notifyTypes: {
      appointments: boolean;
      reminders: boolean;
      results: boolean;
      prescriptions: boolean;
    };
    mediaEnabled: boolean;
    workingHours: {
      enabled: boolean;
      start: string;
      end: string;
      timezone: string;
      daysOfWeek: number[];
    };
    consentRequired: boolean;
}
  
export interface PowerBIConfig {
    clientId: string;
    clientSecret: string;
    tenantId: string;
    workspaceId: string;
    reportId: string;
    datasetId: string;
    refreshSchedule: 'hourly' | 'daily' | 'weekly';
    refreshTime: string;
    embedSettings: {
      enabled: boolean;
      filterPaneEnabled: boolean;
      navContentPaneEnabled: boolean;
    };
    permissions: {
      viewerRoles: string[];
      contributorRoles: string[];
      adminRoles: string[];
    };
    customBranding: boolean;
    logoUrl: string;
    backgroundColor: string;
}
  
export interface TeamsConfig {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    channelId: string;
    webhookUrl: string;
    botName: string;
    welcomeMessage: string;
    notificationTypes: {
      emergencies: boolean;
      appointments: boolean;
      shiftChanges: boolean;
      systemAlerts: boolean;
    };
    mentionRoles: string[];
    adaptiveCards: boolean;
    meetingConfig: {
      autoGenerateLinks: boolean;
      defaultDuration: number;
      reminderMinutes: number;
    };
    fileSharing: boolean;
}
  
export interface PDFConfig {
    templateId: string;
    pageSize: 'a4' | 'letter' | 'legal';
    orientation: 'portrait' | 'landscape';
    defaultFont: string;
    headerEnabled: boolean;
    footerEnabled: boolean;
    logoEnabled: boolean;
    watermarkEnabled: boolean;
    watermarkText: string;
    compression: boolean;
    protection: {
      enabled: boolean;
      password: string;
      allowPrinting: boolean;
      allowCopying: boolean;
      allowEditing: boolean;
    };
    autoGenerationRules: {
      patientDischarge: boolean;
      labResults: boolean;
      prescriptions: boolean;
      invoices: boolean;
    };
    digitalSignature: boolean;
    archiveSettings: {
      enabled: boolean;
      retentionDays: number;
      storagePath: string;
    };
}
  
export interface EHRConfig {
    apiEndpoint: string;
    apiKey: string;
    authMethod: 'oauth' | 'apikey' | 'jwt';
    clientId?: string;
    clientSecret?: string;
    scope?: string;
    patientIdFormat: string;
    syncOptions: {
      enabled: boolean;
      interval: number; // minutes
      lastSync: string;
      recordTypes: string[];
    };
    mappings: Record<string, string>;
    transformRules: Record<string, string>;
    errorHandling: {
      retryCount: number;
      notifyOnError: boolean;
      errorLogPath: string;
    };
    auditLogging: boolean;
    fhirCompatible: boolean;
    fhirVersion?: string;
    customResourceTypes: string[];
}
  
export interface SecurityConfig {
    scanFrequency: 'daily' | 'weekly' | 'monthly';
    scanTime: string;
    monitoredPaths: string[];
    excludedPaths: string[];
    alertThreshold: 'low' | 'medium' | 'high' | 'critical';
    notificationChannels: string[];
    autoRemediationEnabled: boolean;
    detectionRules: {
      malwareDetection: boolean;
      suspiciousAccess: boolean;
      dataExfiltration: boolean;
      unusualBehavior: boolean;
      vulnerabilityScanning: boolean;
    };
    complianceChecks: {
      hipaa: boolean;
      gdpr: boolean;
      pci: boolean;
      customChecks: string[];
    };
    encryptionVerification: boolean;
    reportGeneration: {
      enabled: boolean;
      format: 'pdf' | 'html' | 'csv';
      recipients: string[];
    };
    apiEndpoint: string;
    apiKey: string;
}