/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/organisms/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/organisms/card';
import { useSecurityCompliance } from '@/services/hooks/security-compliance/useSecurityCompliance';
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
    securityData
  } = useSecurityCompliance();

  if (loading) {
    return (
      <div className="w-full p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/2" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-red-500">Erro ao carregar configurações de segurança</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{error}</p>
          <button className="px-4 py-2 mt-4 bg-primary text-white rounded-md">
            Tentar novamente
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Segurança e Compliance</h2>
        <p className="text-gray-500">
          Gerencie as configurações de segurança, auditoria e conformidade regulatória.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-9 mb-4">
          <TabsTrigger value="password-policies" className="flex items-center gap-2">
            <Lock size={16} />
            <span className="hidden md:inline">Senhas</span>
          </TabsTrigger>
          <TabsTrigger value="authentication" className="flex items-center gap-2">
            <Key size={16} />
            <span className="hidden md:inline">Autenticação</span>
          </TabsTrigger>
          <TabsTrigger value="audit-logs" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden md:inline">Auditoria</span>
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <FileCheck size={16} />
            <span className="hidden md:inline">Compliance</span>
          </TabsTrigger>
          <TabsTrigger value="security-alerts" className="flex items-center gap-2">
            <AlertTriangle size={16} />
            <span className="hidden md:inline">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="vulnerability-scan" className="flex items-center gap-2">
            <Activity size={16} />
            <span className="hidden md:inline">Vulnerabilidades</span>
          </TabsTrigger>
          <TabsTrigger value="access-control" className="flex items-center gap-2">
            <Users size={16} />
            <span className="hidden md:inline">Acesso</span>
          </TabsTrigger>
          <TabsTrigger value="data-protection" className="flex items-center gap-2">
            <Database size={16} />
            <span className="hidden md:inline">Dados</span>
          </TabsTrigger>
          <TabsTrigger value="api-security" className="flex items-center gap-2">
            <Shield size={16} />
            <span className="hidden md:inline">API</span>
          </TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};