/**
 * Tipos para configuração da integração com Jira Software
 */

export interface IJiraProject {
    id: string;
    key: string;
    name: string;
    description?: string;
    isActive: boolean;
}
  
export interface IJiraUserMapping {
    id: string;
    hospitalUserId: string;
    hospitalUserName: string;
    jiraAccountId: string;
    jiraDisplayName: string;
    role: string;
}
  
export interface IJiraCustomField {
    id: string;
    name: string;
    fieldId: string;
}
  
export interface IJiraWorkflowMapping {
    appointment: string;
    emergency: string;
    surgery: string;
    transfer: string;
    discharge: string;
    medication: string;
    [key: string]: string;
}
  
export interface IJiraConfig {
    // Configurações básicas
    baseUrl: string;
    apiToken: string;
    username: string;
    defaultProject: string;
    useOAuth: boolean;
    clientId?: string;
    clientSecret?: string;
    
    // Projetos
    projects: IJiraProject[];
    
    // Workflow
    workflowMapping: IJiraWorkflowMapping;
    customFields: IJiraCustomField[];
    
    // Sincronização
    syncInterval: number; // em minutos
    autoCreateIssues: boolean;
    autoUpdateIssues: boolean;
    syncDirection: 'one-way' | 'two-way';
    
    // Usuários
    userMapping: IJiraUserMapping[];
    
    // Configurações adicionais
    defaultPriority: 'highest' | 'high' | 'medium' | 'low' | 'lowest';
    maxAttachmentSize: number; // em MB
    includePatientData: boolean;
    includeAttachments: boolean;
}