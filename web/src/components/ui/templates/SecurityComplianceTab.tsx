import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { useSecurityCompliance } from '@/hooks/security-compliance/useSecurityCompliance';
import { Shield, Lock, FileText, AlertTriangle, Activity, FileCheck, Key, Database, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/organisms/skeleton';

import { PasswordPoliciesTab } from './security-compliance/PasswordPoliciesTab';
import { AuthenticationTab } from './security-compliance/AuthenticationTab';
import { AuditLogsTab } from './security-compliance/AuditLogsTab';
import { ComplianceTab } from './security-compliance/ComplianceTab';
import { SecurityAlertsTab } from './security-compliance/SecurityAlertsTab';
import { VulnerabilityScanTab } from './security-compliance/VulnerabilityScanTab';
import { AccessControlTab } from './security-compliance/AccessControlTab';
import { DataProtectionTab } from './security-compliance/DataProtectionTab';
import { APISecurityTab } from './security-compliance/APISecurityTab';

export const SecurityComplianceTab = () => {
  const [activeTab, setActiveTab] = useState('password-policies');
  const {
    loading,
    error,
  } = useSecurityCompliance();

  if (loading) {
    return (
      <div className="w-full p-6 space-y-4 bg-white dark:bg-gray-900">
        <Skeleton className="h-8 w-1/3 bg-gray-200 dark:bg-gray-800" />
        <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-800" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-64 bg-gray-200 dark:bg-gray-800" />
          <Skeleton className="h-64 bg-gray-200 dark:bg-gray-800" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader>
          <CardTitle className="text-red-500 dark:text-red-400">Erro ao carregar configurações de segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">{error}</p>
          <button className="px-4 py-2 mt-4 bg-primary text-white dark:bg-primary dark:text-white rounded-md hover:bg-primary/90 dark:hover:bg-primary/90 transition-colors">
            Tentar novamente
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4 mb-4">
      <div className='flex flex-col items-center justify-center text-center py-4'>
        <div className='flex flex-row'>
          <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-2 mt-1" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Segurança e Compliance</h2>
        </div>
        <p className="text-gray-500 dark:text-gray-400">
          Gerencie as configurações de segurança, auditoria e conformidade regulatória.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
            <TabsList className="grid grid-cols-3 md:grid-cols-9 bg-gray-100 dark:bg-gray-800 rounded-lg p-1 h-auto">
              <TabsTrigger value="password-policies"
                className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'password-policies' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <Lock size={16} />
                  <span className="hidden md:inline">Senhas</span>
              </TabsTrigger>
              <TabsTrigger value="authentication"            
                className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'authentication' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <Key size={16} />
                  <span className="hidden md:inline">Autenticação</span>
              </TabsTrigger>
              <TabsTrigger value="audit-logs"            
                className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'audit-logs' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <FileText size={16} />
                  <span className="hidden md:inline">Auditoria</span>
              </TabsTrigger>
              <TabsTrigger value="compliance"            
                className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'compliance' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <FileCheck size={16} />
                  <span className="hidden md:inline">Compliance</span>
              </TabsTrigger>
              <TabsTrigger value="security-alerts"            
                className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'security-alerts' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <AlertTriangle size={16} />
                  <span className="hidden md:inline">Alertas</span>
              </TabsTrigger>
              <TabsTrigger value="vulnerability-scan"            className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'vulnerability-scan' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                <Activity size={16} />
                <span className="hidden md:inline">Vulnerabilidades</span>
              </TabsTrigger>
              <TabsTrigger value="access-control"            
                className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'access-control' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <Users size={16} />
                  <span className="hidden md:inline">Acesso</span>
              </TabsTrigger>
              <TabsTrigger value="data-protection"            
                className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'data-protection' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <Database size={16} />
                  <span className="hidden md:inline">Dados</span>
              </TabsTrigger>
              <TabsTrigger value="api-security"            
                className={`py-4 px-6 rounded-none border-b-2 ${
                  activeTab === 'api-security' 
                    ? 'border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600'
                }`}>
                  <Shield size={16} />
                  <span className="hidden md:inline">API</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="px-6 py-4">
            <TabsContent value="password-policies" className="space-y-4">
              <PasswordPoliciesTab />
            </TabsContent>

            <TabsContent value="authentication" className="space-y-4">
              <AuthenticationTab />
            </TabsContent>

            <TabsContent value="audit-logs" className="space-y-4">
              <AuditLogsTab />
            </TabsContent>

            <TabsContent value="compliance" className="space-y-4">
              <ComplianceTab />
            </TabsContent>

            <TabsContent value="security-alerts" className="space-y-4">
              <SecurityAlertsTab />
            </TabsContent>

            <TabsContent value="vulnerability-scan" className="space-y-4">
              <VulnerabilityScanTab />
            </TabsContent>

            <TabsContent value="access-control" className="space-y-4">
              <AccessControlTab />
            </TabsContent>

            <TabsContent value="data-protection" className="space-y-4">
              <DataProtectionTab />
            </TabsContent>

            <TabsContent value="api-security" className="space-y-4">
              <APISecurityTab />
            </TabsContent>
          </div>

        </Tabs>
      </div>

    </div>
  );
};